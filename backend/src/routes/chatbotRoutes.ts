import { Router } from 'express';
import type { Request } from 'express';
import type { User } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { requireAuth } from '../middleware/requireAuth';
import { supabase } from '../db/supabase';

const router = Router();

interface AuthedRequest extends Request {
    user?: User;
}

type ChatRole = 'user' | 'assistant';

interface ChatResponseMessage {
    role: 'assistant';
    content: string;
    trainerId: number;
}

interface TrainerPersona {
    id: number;
    name: string;
    specialties: string[];
    tone: string;
    voice: string;
    avatarKey: 'tom' | 'sarah';
}

const TRAINER_PERSONAS: Record<string, TrainerPersona> = {
    '0': {
        id: 0,
        name: 'Tom',
        specialties: ['strength training', 'progressive overload'],
        tone: 'direct yet friendly',
        voice: 'Explains the why behind each drill and keeps motivation high.',
        avatarKey: 'tom'
    },
    '1': {
        id: 1,
        name: 'Sarah',
        specialties: ['mobility', 'injury-free progression'],
        tone: 'empathetic and energizing',
        voice: 'Focuses on sustainable pace and celebrates every win.',
        avatarKey: 'sarah'
    }
};

const requestSchema = z.object({
    trainerId: z.number().int().min(0).optional(),
    messages: z
        .array(
            z.object({
                role: z.enum(['user', 'assistant']),
                content: z.string().min(1, 'message content is required')
            })
        )
        .min(1, 'messages array cannot be empty'),
    metadata: z
        .object({
            language: z.string().optional(),
            onboardingSummary: z.string().optional()
        })
        .optional()
});

const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';
const geminiApiKey = process.env.GEMINI_API_KEY;
const { model: geminiModelName, normalized: geminiModelNormalized } = normalizeGeminiModel(
    process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL
);
if (geminiModelNormalized) {
    console.warn(
        `[chatbot] GEMINI_MODEL ending in "-latest" is not supported by the current SDK. Using "${geminiModelName}" instead.`
    );
}
const geminiClient = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

router.get('/profile', requireAuth, async (req: AuthedRequest, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                error: { message: 'Unauthenticated' }
            });
        }

        console.log('[chatbot] Loading trainer profile for user', userId);
        const trainerId = await determineTrainerId(userId);
        const persona = resolvePersona(trainerId);
        console.log('[chatbot] Resolved trainer profile', {
            userId,
            trainerId: persona.id,
            avatarKey: persona.avatarKey
        });

        return res.json({
            trainerId: persona.id,
            name: persona.name,
            avatarKey: persona.avatarKey,
            specialties: persona.specialties,
            tone: persona.tone,
            voice: persona.voice
        });
    } catch (error: any) {
        console.error('Failed to fetch chatbot profile:', error?.message || error);
        return res.status(500).json({
            error: { message: 'Failed to load chatbot profile' }
        });
    }
});

router.post('/', requireAuth, async (req: AuthedRequest, res) => {
    const parseResult = requestSchema.safeParse(req.body);

    if (!parseResult.success) {
        return res.status(400).json({
            error: {
                message: 'Invalid chatbot payload',
                details: parseResult.error.flatten()
            }
        });
    }

    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({
            error: { message: 'Unauthenticated' }
        });
    }

    console.log('[chatbot] Incoming conversation for user', userId);
    const resolvedTrainerId = await determineTrainerId(userId);
    console.log('[chatbot] Default trainer from DB', resolvedTrainerId);
    const requestedTrainerId = parseResult.data.trainerId ?? resolvedTrainerId;
    const { messages, metadata } = parseResult.data;
    const persona = resolvePersona(requestedTrainerId);
    console.log('[chatbot] Using persona', persona.name, '(', persona.id, ')');
    const normalizedMessages = normalizeMessages(messages);

    const onboardingSummary =
        metadata?.onboardingSummary ?? (await fetchOnboardingSummary(userId));

    const systemPrompt = buildSystemPrompt({
        persona,
        onboardingSummary,
        language: metadata?.language
    });

    let assistantMessage: ChatResponseMessage | null = null;
    let usage: {
        prompt_tokens?: number | null;
        completion_tokens?: number | null;
        total_tokens?: number | null;
    } | null = null;
    let fallback = false;

    if (geminiClient) {
        try {
            const model = geminiClient.getGenerativeModel({ model: geminiModelName });
            const prompt = buildGeminiPrompt(systemPrompt, normalizedMessages, persona);
            const response = await model.generateContent(prompt);
            const content = response.response.text()?.trim();

            if (content) {
                assistantMessage = {
                    role: 'assistant',
                    content,
                    trainerId: persona.id
                };
                const usageMetadata = response.response.usageMetadata;
                usage = usageMetadata
                    ? {
                          prompt_tokens: usageMetadata.promptTokenCount ?? null,
                          completion_tokens: usageMetadata.candidatesTokenCount ?? null,
                          total_tokens: usageMetadata.totalTokenCount ?? null
                      }
                    : null;
            }
        } catch (error: any) {
            console.error('Chatbot Gemini error:', error?.message || error);
        }
    }

    if (!assistantMessage) {
        fallback = true;
        const lastUserMessage = findLastUserMessage(normalizedMessages);
        assistantMessage = {
            role: 'assistant',
            trainerId: persona.id,
            content: buildFallbackResponse(
                lastUserMessage?.content,
                persona,
                metadata?.language
            )
        };
        console.warn('[chatbot] Falling back to canned response for user', userId);
    }

    return res.json({
        message: assistantMessage,
        usage,
        fallback
    });
});

function resolvePersona(trainerId: number): TrainerPersona {
    return TRAINER_PERSONAS[String(trainerId)] ?? TRAINER_PERSONAS['0'];
}

async function determineTrainerId(userId: string): Promise<number> {
    try {
        const start = Date.now();
        const { data: userInfo, error } = await supabase
            .from('user_info')
            .select('trainer')
            .eq('user_id', userId)
            .maybeSingle();
        console.log('[chatbot] user_info trainer lookup duration', Date.now() - start, 'ms');

        if (!error && userInfo && typeof userInfo.trainer === 'boolean') {
            const trainerId = userInfo.trainer ? 1 : 0;
            console.log('[chatbot] user_info trainer match', trainerId);
            return trainerId;
        }
    } catch (err) {
        console.warn('Unable to read trainer from user_info:', err);
    }

    try {
        const { data: userSettings, error: settingsError } = await supabase
            .from('user_settings')
            .select('trainer')
            .eq('user_id', userId)
            .maybeSingle();

        if (!settingsError && userSettings && typeof userSettings.trainer === 'number') {
            const trainerId = userSettings.trainer === 1 ? 1 : 0;
            console.log('[chatbot] user_settings trainer match', trainerId);
            return trainerId;
        }
    } catch (err) {
        console.warn('Unable to read trainer from user_settings:', err);
    }

    console.log('[chatbot] Falling back to default trainer');
    return 0;
}

function normalizeMessages(
    messages: Array<{ role: ChatRole; content: string }>
): Array<{ role: ChatRole; content: string }> {
    return messages
        .slice(-10)
        .map((msg) => ({ role: msg.role, content: msg.content.trim() }))
        .filter((msg) => msg.content.length > 0);
}

function findLastUserMessage(
    messages: Array<{ role: ChatRole; content: string }>
): { role: ChatRole; content: string } | undefined {
    return [...messages].reverse().find((msg) => msg.role === 'user');
}

async function fetchOnboardingSummary(userId: string): Promise<string | null> {
    try {
        const { data, error } = await supabase
            .from('user_info')
            .select(
                [
                    'preferred_name',
                    'primary_goal',
                    'experience_level',
                    'training_days_per_week',
                    'session_duration',
                    'problem_areas'
                ].join(', ')
            )
            .eq('user_id', userId)
            .maybeSingle();

        if (error || !data) {
            return null;
        }

        const record = data as Record<string, any>;
        const parts: string[] = [];
        if (record.preferred_name) {
            parts.push(`Preferred name: ${record.preferred_name}.`);
        }
        if (Array.isArray(record.primary_goal) && record.primary_goal.length > 0) {
            parts.push(`Primary goals: ${record.primary_goal.join(', ')}.`);
        }
        if (typeof record.experience_level === 'number') {
            parts.push(`Experience level (1-5): ${record.experience_level}.`);
        }
        if (typeof record.training_days_per_week === 'number') {
            parts.push(`Training days/week: ${record.training_days_per_week}.`);
        }
        if (typeof record.session_duration === 'number') {
            parts.push(`Typical session duration: ${record.session_duration} minutes.`);
        }
        if (Array.isArray(record.problem_areas) && record.problem_areas.length > 0) {
            parts.push(`Problem areas: ${record.problem_areas.join(', ')}.`);
        }

        return parts.length > 0 ? parts.join(' ') : null;
    } catch (error: any) {
        console.error('Failed to load onboarding summary:', error?.message || error);
        return null;
    }
}

function buildSystemPrompt({
    persona,
    onboardingSummary,
    language
}: {
    persona: TrainerPersona;
    onboardingSummary?: string | null;
    language?: string;
}): string {
    const lang = inferLanguage(language);
    const summary = onboardingSummary ? onboardingSummary : 'Limited user context provided.';

    return [
        `You are ${persona.name}, a fitness coach with specialties in ${persona.specialties.join(', ')}.`,
        `Tone: ${persona.tone}. Voice: ${persona.voice}.`,
        `Always respond in ${lang.description}.`,
        'Keep the reply under 200 words unless the user explicitly requests a detailed plan.',
        'Provide actionable, safe advice that references proper form, recovery, and progression cues.',
        `User context: ${summary}`
    ].join('\n');
}

function buildFallbackResponse(
    lastUserMessage: string | undefined,
    persona: TrainerPersona,
    language?: string
): string {
    const lang = inferLanguage(language);
    const intro =
        lang.code === 'zh'
            ? `抱歉，我暂时无法连接到智能教练云端，但${persona.name}仍然建议：`
            : `Sorry, I'm having trouble reaching the smart coach service, but ${persona.name} still recommends:`;

    const reflection = lastUserMessage
        ? lang.code === 'zh'
            ? ` 我已收到你提到的 “${lastUserMessage}”。`
            : ` I hear what you said: "${lastUserMessage}".`
        : '';

    const advice =
        lang.code === 'zh'
            ? ' 先专注于扎实的基础动作、控制节奏并记录训练感受，稍后我会继续为你提供更具体的建议。'
            : ' For now, dial in the fundamentals, control the tempo, and jot down how each session feels—I will follow up with more specifics once the assistant is back online.';

    return `${intro}${reflection}${advice}`.trim();
}

function buildGeminiPrompt(
    systemPrompt: string,
    messages: Array<{ role: ChatRole; content: string }>,
    persona: TrainerPersona
): string {
    const conversation = messages
        .map((msg) =>
            msg.role === 'user'
                ? `User: ${msg.content}`
                : `${persona.name}: ${msg.content}`
        )
        .join('\n');

    return [
        systemPrompt,
        'Conversation so far:',
        conversation || 'User: Hi!',
        `Respond as ${persona.name}, keeping the established tone.`
    ]
        .filter(Boolean)
        .join('\n\n');
}

function inferLanguage(language?: string): { code: 'zh' | 'en'; description: string } {
    const normalized = language?.toLowerCase();
    if (normalized?.startsWith('zh')) {
        return { code: 'zh', description: 'Chinese (简体中文)' };
    }
    return { code: 'en', description: 'English' };
}

function normalizeGeminiModel(model: string): { model: string; normalized: boolean } {
    const trimmed = model.trim();
    if (!trimmed) {
        return { model: DEFAULT_GEMINI_MODEL, normalized: false };
    }

    if (trimmed.toLowerCase().endsWith('-latest')) {
        return {
            model: trimmed.replace(/-latest$/i, ''),
            normalized: true
        };
    }

    return { model: trimmed, normalized: false };
}

export default router;
