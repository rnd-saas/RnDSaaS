import { Router } from 'express';
import type { Request } from 'express';
import type { User } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { requireAuth } from '../middleware/requireAuth';
import { supabase } from '../db/supabase';
import { EXERCISE_NAMES, EXERCISE_LIBRARY, generateWorkoutPlanForUser } from '../services/workoutPlanGenerator';

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
            onboardingSummary: z.string().optional(),
            workoutPlanContext: z.any().optional()
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

    // Safety Check: Crisis Intervention
    const lastUserMessage = findLastUserMessage(messages);
    if (lastUserMessage) {
        const safetyResponse = checkCrisisKeywords(lastUserMessage.content);
        if (safetyResponse) {
            return res.json({
                message: {
                    role: 'assistant',
                    content: safetyResponse,
                    trainerId: requestedTrainerId
                },
                usage: null,
                fallback: true
            });
        }

        const mentalHealthResponse = checkMentalHealthKeywords(lastUserMessage.content);
        if (mentalHealthResponse) {
            return res.json({
                message: {
                    role: 'assistant',
                    content: mentalHealthResponse,
                    trainerId: requestedTrainerId
                },
                usage: null,
                fallback: true,
                isMentalHealthIntervention: true
            });
        }
    }

    const persona = resolvePersona(requestedTrainerId);
    console.log('[chatbot] Using persona', persona.name, '(', persona.id, ')');
    const normalizedMessages = normalizeMessages(messages);

    const onboardingSummary =
        metadata?.onboardingSummary ?? (await fetchOnboardingSummary(userId));

    const availableDays = await fetchUserAvailableDays(userId);

    const systemPrompt = buildSystemPrompt({
        persona,
        onboardingSummary,
        language: metadata?.language,
        workoutPlanContext: metadata?.workoutPlanContext,
        availableDays
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

router.post('/generate-plan', requireAuth, async (req: AuthedRequest, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const { messages } = req.body;
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages' });
        }

        // 1. Extract profile updates
        const updates = await extractProfileFromChat(messages);
        console.log('[chatbot] Extracted profile updates:', updates);

        // 2. Update user_info if there are updates
        if (Object.keys(updates).length > 0) {
            const { error } = await supabase
                .from('user_info')
                .update(updates)
                .eq('user_id', userId);
            
            if (error) {
                console.error('[chatbot] Failed to update user profile', error);
            }
        }

        // 3. Generate plan
        const result = await generateWorkoutPlanForUser(userId);
        
        res.json({ success: true, plan: result });

    } catch (error: any) {
        console.error('[chatbot] Generate plan error:', error);
        res.status(500).json({ error: error.message });
    }
});

async function extractProfileFromChat(messages: any[]): Promise<any> {
    if (!geminiClient) return {};
    
    const conversation = messages
        .map((m: any) => `${m.role}: ${m.content}`)
        .join('\n');

    const prompt = `
    Analyze the conversation history and extract the user's latest workout preferences to update their profile.
    Output ONLY a valid JSON object with the following fields (only if mentioned or implied):
    - primary_goal: string[] (e.g. ["weight_loss", "muscle_gain", "endurance", "flexibility"])
    - training_days_per_week: number (1-7)
    - session_duration: number (minutes, 20-180)
    - problem_areas: string[] (e.g. ["knees", "lower_back", "shoulders"])
    - experience_level: number (1=beginner, 5=advanced)

    If a field is not mentioned or cannot be inferred, do not include it.
    
    Conversation:
    ${conversation}
    `;

    try {
        const model = geminiClient.getGenerativeModel({ model: geminiModelName });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
    } catch (e) {
        console.error('Failed to extract profile from chat', e);
    }
    return {};
}

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

async function fetchUserAvailableDays(userId: string): Promise<number[]> {
    try {
        const { data, error } = await supabase
            .from('user_info')
            .select('available_days')
            .eq('user_id', userId)
            .maybeSingle();
        
        if (error || !data || !Array.isArray(data.available_days)) {
            return [];
        }
        return data.available_days;
    } catch (err) {
        console.warn('Failed to fetch available days:', err);
        return [];
    }
}

function buildSystemPrompt({
    persona,
    onboardingSummary,
    language,
    workoutPlanContext,
    availableDays
}: {
    persona: TrainerPersona;
    onboardingSummary?: string | null;
    language?: string;
    workoutPlanContext?: any;
    availableDays?: number[];
}): string {
    const lang = inferLanguage(language);
    const summary = onboardingSummary ? onboardingSummary : 'Limited user context provided.';
    
    let planContext = '';
    if (workoutPlanContext) {
        const exerciseList = EXERCISE_LIBRARY.map((ex) => `- ${ex.name} (Log Mode: ${ex.logMode})`).join('\n');
        const daysConstraint = availableDays && availableDays.length > 0 
            ? `\nCRITICAL: Only schedule sessions on these day_numbers: ${availableDays.join(', ')} (0=Sun ... 6=Sat).`
            : '';

        const template = `{
  "program_name": "Modified Program Name",
  "program_description": "Brief description of the changes made",
  "proposed_plan": [
    {
      "day_number": 0,
      "plan_name": "Example Plan Name",
      "plan_description": "Brief description",
      "plan_duration_estimate": 45,
      "plan_exercises": [
        {
          "exercise_name": "${EXERCISE_NAMES[0]}",
          "sequence_no": 1,
          "target_sets": 3,
          "metric": "reps",
          "target_value": 12,
          "rest_seconds": 60
        }
      ]
    }
  ]
}`;

        planContext = `\nCURRENT WORKOUT PLAN CONTEXT:\n${JSON.stringify(workoutPlanContext, null, 2)}\n\nIf the user asks to modify the plan, you MUST output the NEW plan in a JSON block with the key "proposed_plan".\n\nSTRICT CONSTRAINTS FOR MODIFICATIONS:\n1. Use ONLY the allowed exercise list below. Do NOT invent new names.\n2. ${daysConstraint}\n3. Ensure exercise_ids are valid UUIDs if reusing, or use slugs/names from the allowed list if new.\n4. Metric MUST be one of: 'reps', 'weight', 'distance', 'duration_s', 'height'. (Use 'duration_s' for time-based exercises).\n\nAllowed exercises:\n${exerciseList}\n\nJSON Structure Template for "proposed_plan":\n${template}`;
    }

    return [
        `You are ${persona.name}, a supportive, non-judgmental fitness partner.`,
        `You are NOT a doctor, therapist, or dietitian. Do NOT diagnose mental health issues or prescribe medical treatments.`,
        `Specialties: ${persona.specialties.join(', ')}.`,
        `Tone: ${persona.tone}. Voice: ${persona.voice}.`,
        `Language: Always respond in ${lang.description}.`,
        
        `CRITICAL GUIDELINES FOR SOCIAL ANXIETY & FITNESS:`,
        `1. Tone: Gentle, inclusive, low-pressure. Use validating statements (e.g., "It's normal to feel nervous").`,
        `2. NO Toxic Positivity: Avoid phrases like "Just do it" or "Don't worry". Acknowledge the difficulty.`,
        `3. Gymtimidation: If user fears judgment, validate them. Suggest home workouts or off-peak times. Start small (e.g., 5 min stretch).`,
        `4. Body Image/Eating: If user mentions extreme fasting or self-hate, do NOT encourage weight loss. Pivot to health/feeling good. If extreme, suggest professional help.`,
        
        `Keep the reply concise (under 100 words) unless the user explicitly requests a detailed plan.`,
        `User context: ${summary}`,
        planContext
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

function checkCrisisKeywords(content: string): string | null {
    const lower = content.toLowerCase();
    const crisisKeywords = [
        'suicide', 'kill myself', 'want to die', 'end it all', 'self-harm',
        '自杀', '不想活了', '去死', '结束生命', '割腕'
    ];
    
    if (crisisKeywords.some(kw => lower.includes(kw))) {
        // Check if Chinese
        if (/[\u4e00-\u9fa5]/.test(content)) {
            return "我只是一个AI健身助手，无法处理严重的心理危机。如果你感到绝望或想要伤害自己，请立即寻求专业医生的帮助，或拨打心理援助热线。\n\n中国心理危机干预热线：400-161-9995";
        } else {
            return "I am an AI fitness assistant and cannot provide the crisis support you need. If you are feeling overwhelmed or thinking of harming yourself, please contact a professional or a crisis hotline immediately.\n\nInternational Suicide Hotlines: https://blog.opencounseling.com/suicide-hotlines/";
        }
    }
    return null;
}

function checkMentalHealthKeywords(content: string): string | null {
    const lower = content.toLowerCase();
    const mentalHealthKeywords = [
        'depression', 'anxiety', 'depressed', 'anxious', 'panic attack', 
        'mental health', 'therapy', 'counseling', 'psychologist', 'psychiatrist',
        'bipolar', 'schizophrenia', 'ptsd', 'trauma',
        '抑郁', '焦虑', '心理健康', '心理咨询', '心理医生', '精神科', 
        '双相', '创伤', '恐慌'
    ];
    
    if (mentalHealthKeywords.some(kw => lower.includes(kw))) {
        if (/[\u4e00-\u9fa5]/.test(content)) {
            return "我不是心理健康领域的专家。如果您正受到心理困扰，建议您咨询专业的心理医生或治疗师。\n\n以下是一些可能有帮助的一般建议：\n1. 规律运动有助于改善情绪。\n2. 尝试冥想或深呼吸练习。\n3. 保持充足的睡眠。\n4. 与信任的朋友或家人倾诉。";
        } else {
            return "I am not a mental health professional. If you are struggling with your mental health, I strongly recommend consulting with a qualified therapist or doctor.\n\nHere are some general suggestions that may help:\n1. Regular exercise can help improve mood.\n2. Try mindfulness or deep breathing exercises.\n3. Ensure you get enough sleep.\n4. Talk to a trusted friend or family member.";
        }
    }
    return null;
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
