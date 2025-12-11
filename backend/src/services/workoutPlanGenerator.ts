import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { supabase } from '../db/supabase';

export const EXERCISE_NAMES = [
    'Bench Press (Barbell)',
    'Chest Press (Machine)',
    'Dumbbell Bench Press',
    'Dumbbell Shoulder Press',
    'Incline Bench Press (Barbell)',
    'Lat Pulldown',
    'Overhead Triceps Extension (Cable)',
    'Standing Overhead Triceps Extension (DB)',
    'Treadmill Run/Walk',
    'Single-Arm Dumbbell Row',
    'Seated Cable Row',
    'Bicep Curl',
    'Concentration Curl',
    'Chest Dips',
    'Leg Press (Machine)',
    'Seated Cable Row (Wide Grip)'
] as const;

export const EXERCISE_LIBRARY: ExerciseDefinition[] = [
    {
        name: 'Bench Press (Barbell)',
        slug: 'bench-press',
        description: 'Flat barbell press for chest/shoulders/triceps.',
        logMode: 'reps_weight',
        difficulty: 3
    },
    {
        name: 'Chest Press (Machine)',
        slug: 'chest-press-machine',
        description: 'Guided machine press; easier setup and stability than barbell.',
        logMode: 'reps_weight',
        difficulty: 2
    },
    {
        name: 'Dumbbell Bench Press',
        slug: 'dumbbell-bench-press',
        description: 'Flat bench press with dumbbells; greater range of motion and stability.',
        logMode: 'reps_weight',
        difficulty: 2
    },
    {
        name: 'Dumbbell Shoulder Press',
        slug: 'dumbbell-shoulder-press',
        description: 'Overhead press with dumbbells; trains delts and triceps.',
        logMode: 'reps_weight',
        difficulty: 3
    },
    {
        name: 'Incline Bench Press (Barbell)',
        slug: 'incline-bench-press',
        description: 'Press on 15–30° bench; upper-chest emphasis.',
        logMode: 'reps_weight',
        difficulty: 3
    },
    {
        name: 'Lat Pulldown',
        slug: 'lat-pulldown',
        description: 'Vertical pull on cable machine; lats and upper back.',
        logMode: 'reps_weight',
        difficulty: 2
    },
    {
        name: 'Overhead Triceps Extension (Cable)',
        slug: 'overhead-triceps-extension-cable',
        description: 'Cable rope extension from overhead position; long head emphasis.',
        logMode: 'reps_weight',
        difficulty: 2
    },
    {
        name: 'Standing Overhead Triceps Extension (DB)',
        slug: 'standing-overhead-triceps-extension-db',
        description: 'Single or double dumbbell overhead triceps extension.',
        logMode: 'reps_weight',
        difficulty: 3
    },
    {
        name: 'Treadmill Run/Walk',
        slug: 'treadmill',
        description: 'Cardio performed on treadmill at chosen pace or incline.',
        logMode: 'time',
        difficulty: 1
    },
    {
        name: 'Single-Arm Dumbbell Row',
        slug: 'single-arm-dumbbell-row',
        description: 'Horizontal pull for lats and upper back using one dumbbell and bench support.',
        logMode: 'reps_weight',
        difficulty: 2
    },
    {
        name: 'Seated Cable Row',
        slug: 'seated-cable-row',
        description: 'Horizontal pull on cable row machine; mid-back focus.',
        logMode: 'reps_weight',
        difficulty: 2
    },
    {
        name: 'Bicep Curl',
        slug: 'bicep-curl',
        description: 'Classic dumbbell curl for biceps development.',
        logMode: 'reps_weight',
        difficulty: 1
    },
    {
        name: 'Concentration Curl',
        slug: 'concentration-curl',
        description: 'Seated single-arm curl focusing on biceps isolation.',
        logMode: 'reps_weight',
        difficulty: 2
    },
    {
        name: 'Chest Dips',
        slug: 'chest-dips',
        description: 'Bodyweight dip leaning forward to target lower chest and triceps.',
        logMode: 'reps',
        difficulty: 3
    },
    {
        name: 'Leg Press (Machine)',
        slug: 'leg-press',
        description: 'Compound lower-body push on sled or plate-loaded machine.',
        logMode: 'reps_weight',
        difficulty: 2
    },
    {
        name: 'Seated Cable Row (Wide Grip)',
        slug: 'seated-cable-row-wide',
        description: 'Horizontal pull on cable with wide bar to emphasize upper back.',
        logMode: 'reps_weight',
        difficulty: 2
    }
];

const metricEnum = z.enum(['reps', 'weight', 'distance', 'duration_s', 'height']);
const exerciseNameEnum = z.enum(EXERCISE_NAMES);

const workoutProgramSchema = z.object({
    program_name: z.string().min(1),
    program_description: z.string().min(1),
    weeks_count: z.literal(1),
    workout_plans: z
        .array(
            z.object({
                week_number: z.number().int().min(1).max(1),
                day_number: z.number().int().min(0).max(6),
                plan_name: z.string().min(1),
                plan_description: z.string().min(1),
                plan_duration_estimate: z.number().int().min(10).max(180),
                plan_exercises: z
                    .array(
                        z.object({
                            exercise_name: exerciseNameEnum,
                            sequence_no: z.number().int().min(1).max(20),
                            target_sets: z.number().int().min(1).max(10),
                            metric: metricEnum,
                            target_value: z.number().positive(),
                            rest_seconds: z.number().int().min(0).max(600),
                            metric2: metricEnum.optional().nullable(),
                            target_value2: z.number().positive().optional().nullable()
                        })
                    )
                    .min(1)
            })
        )
        .min(1)
});

type WorkoutProgram = z.infer<typeof workoutProgramSchema>;

type ExerciseName = (typeof EXERCISE_NAMES)[number];

export interface ExerciseDefinition {
    name: ExerciseName;
    slug: string;
    description: string;
    logMode: 'reps_weight' | 'reps' | 'distance' | 'distance_weight' | 'time' | 'time_weight';
    difficulty: number;
}

interface RawUserProfile {
    preferred_name: string | null;
    gender: string | null;
    height_cm: number | null;
    weight_kg: number | null;
    primary_goal: string[] | null;
    training_days_per_week: number | null;
    available_days: number[] | null;
    session_duration: number | null;
    problem_areas: string[] | null;
    preferred_split: string[] | null;
    gym_comfort_level: string[] | null;
    experience_level: number | null;
}

type RequiredUserProfile = RawUserProfile & {
    training_days_per_week: number;
    available_days: number[];
    session_duration: number;
};

export interface GenerationResult {
    programId: string;
    planCount: number;
    exerciseCount: number;
}

const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';
const geminiApiKey = process.env.GEMINI_API_KEY;
const preferredModel = process.env.GEMINI_WORKOUT_MODEL || process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
const { model: geminiModelName, normalized: geminiModelNormalized } = normalizeGeminiModel(preferredModel);
if (geminiModelNormalized) {
    console.warn(
        `[planner] GEMINI model "${preferredModel}" ends with "-latest" and was normalized to "${geminiModelName}".`
    );
}
const geminiClient = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

export async function generateWorkoutPlanForUser(userId: string): Promise<GenerationResult | null> {
    try {
        if (!geminiClient) {
            console.warn('[planner] GEMINI_API_KEY missing; skipping workout plan generation.');
            return null;
        }

        const profile = await fetchUserProfile(userId);
        if (!profile) {
            console.warn('[planner] Missing or incomplete onboarding data; cannot generate program.');
            return null;
        }

        const workoutProgram = await requestPlanFromAi(profile);
        const normalizedPlan = normalizePlanSchedule(workoutProgram, profile);
        const planWithLoads = applyLoadFallbacks(normalizedPlan, profile);
        validatePlanAgainstUser(planWithLoads, profile);
        return await persistProgram(userId, planWithLoads);
    } catch (error: any) {
        console.error('[planner] Failed to generate workout program:', error?.message || error);
        throw error;
    }
}

async function fetchUserProfile(userId: string): Promise<RequiredUserProfile | null> {
    const { data, error } = await supabase
        .from('user_info')
        .select(
            [
                'preferred_name',
                'gender',
                'height_cm',
                'weight_kg',
                'primary_goal',
                'training_days_per_week',
                'available_days',
                'session_duration',
                'problem_areas',
                'preferred_split',
                'gym_comfort_level',
                'experience_level'
            ].join(', ')
        )
        .eq('user_id', userId)
        .maybeSingle();

    if (error) {
        console.error('[planner] Failed to load onboarding profile:', error.message);
        return null;
    }
    if (!data) {
        return null;
    }

    const profile = sanitizeUserProfile(data as unknown as RawUserProfile);
    if (!profile.training_days_per_week || !profile.available_days || !profile.session_duration) {
        return null;
    }

    return profile as RequiredUserProfile;
}

function sanitizeUserProfile(record: RawUserProfile): RawUserProfile {
    return {
        preferred_name: cleanString(record.preferred_name),
        gender: cleanString(record.gender),
        height_cm: toPositiveNumber(record.height_cm),
        weight_kg: toPositiveNumber(record.weight_kg),
        primary_goal: normalizeStringArray(record.primary_goal),
        training_days_per_week: clampDays(record.training_days_per_week),
        available_days: normalizeDayArray(record.available_days),
        session_duration: clampSessionDuration(record.session_duration),
        problem_areas: normalizeStringArray(record.problem_areas),
        preferred_split: normalizeStringArray(record.preferred_split),
        gym_comfort_level: normalizeStringArray(record.gym_comfort_level),
        experience_level: clampExperience(record.experience_level)
    };
}

function cleanString(value: string | null): string | null {
    if (!value) return null;
    const trimmed = value.trim();
    return trimmed.length ? trimmed : null;
}

function toPositiveNumber(value: number | null): number | null {
    if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
        return null;
    }
    return Math.round(value * 100) / 100;
}

function normalizeStringArray(values: string[] | null): string[] | null {
    if (!Array.isArray(values) || values.length === 0) {
        return null;
    }
    const cleaned = values
        .map((entry) => cleanString(entry || null))
        .filter((entry): entry is string => Boolean(entry));
    return cleaned.length ? cleaned : null;
}

function clampDays(value: number | null): number | null {
    if (typeof value !== 'number' || Number.isNaN(value)) {
        return null;
    }
    const clamped = Math.min(Math.max(Math.round(value), 1), 7);
    return clamped;
}

function normalizeDayArray(values: number[] | null): number[] | null {
    if (!Array.isArray(values) || !values.length) {
        return null;
    }
    const unique = Array.from(new Set(values.map((day) => (typeof day === 'number' ? Math.round(day) : NaN)))).filter(
        (day): day is number => Number.isInteger(day) && day >= 0 && day <= 6
    );
    return unique.length ? unique : null;
}

function clampSessionDuration(value: number | null): number | null {
    if (typeof value !== 'number' || Number.isNaN(value)) {
        return null;
    }
    const clamped = Math.min(Math.max(Math.round(value), 20), 180);
    return clamped;
}

function clampExperience(value: number | null): number | null {
    if (typeof value !== 'number' || Number.isNaN(value)) {
        return null;
    }
    const clamped = Math.min(Math.max(Math.round(value), 1), 5);
    return clamped;
}

function sanitizePlanExercises(plan: any): any {
    if (!plan || !plan.workout_plans) return plan;
    
    return {
        ...plan,
        workout_plans: plan.workout_plans.map((wp: any) => ({
            ...wp,
            plan_exercises: wp.plan_exercises?.map((ex: any) => {
                const logMode = getLogModeForExercise(ex.exercise_name);
                // If exercise doesn't use weight, strip metric2/target_value2
                if (logMode && !logMode.includes('weight')) {
                    const { metric2, target_value2, ...rest } = ex;
                    return rest;
                }
                // If metric2/target_value2 are 0 or invalid, remove them
                if (ex.target_value2 === 0 || ex.target_value2 === null) {
                    const { metric2, target_value2, ...rest } = ex;
                    return rest;
                }
                return ex;
            }) || []
        }))
    };
}

async function requestPlanFromAi(profile: RequiredUserProfile): Promise<WorkoutProgram> {
    if (!geminiClient) {
        throw new Error('Gemini client unavailable');
    }
    const model = geminiClient.getGenerativeModel({ model: geminiModelName });
    const prompt = buildPlannerPrompt(profile);
    console.log('[planner] Sending Gemini prompt:', prompt);
    const response = await model.generateContent(prompt);
    const content = response.response.text();
    if (!content) {
        throw new Error('Gemini returned an empty response');
    }
    console.log('[planner] Raw Gemini response:', content);
    const jsonPayload = extractJsonPayload(content);
    const parsed = JSON.parse(jsonPayload);
    // Sanitize: remove metric2/target_value2 from non-weight exercises
    const sanitized = sanitizePlanExercises(parsed);
    return workoutProgramSchema.parse(sanitized);
}

function getLogModeForExercise(name: ExerciseName): ExerciseDefinition['logMode'] | undefined {
    const found = EXERCISE_LIBRARY.find((ex) => ex.name === name);
    return found?.logMode;
}

function buildPlannerPrompt(profile: RequiredUserProfile): string {
    const exerciseList = EXERCISE_NAMES.map((name) => `- ${name}`).join('\n');
    const template = `{
  "program_name": "string",
  "program_description": "string",
  "weeks_count": 1,
  "workout_plans": [
    {
      "week_number": 1,
      "day_number": 0,
      "plan_name": "string",
      "plan_description": "string",
      "plan_duration_estimate": 45,
      "plan_exercises": [
        {
          "exercise_name": "${EXERCISE_NAMES[0]}",
          "sequence_no": 1,
          "target_sets": 3,
          "metric": "reps",
          "target_value": 12,
                    "rest_seconds": 60,
                                        "metric2": "weight",
                                        "target_value2": 40
        }
      ]
    }
  ]
}`;

    const userProfile = buildUserProfilePayload(profile);

    return [
        'Please strictly act as an experienced professional fitness coach and programmatic planner.',
        'Design a 1-week personalized workout program that adheres to every constraint below.',
        '',
        'Program Constraints:',
        `- Number of sessions must equal training_days_per_week (${profile.training_days_per_week}).`,
        `- Only schedule sessions on these day_numbers: ${profile.available_days.join(', ')} (0=Sun ... 6=Sat).`,
        `- Each session duration (plan_duration_estimate) must be <= ${profile.session_duration} minutes.`,
        '- Use only the allowed exercise list and never invent new names.',
        '- Match exercise choices to the user goal, experience level, and gym comfort guidance.',
        '- If experience_level <= 2 or comfort is low, emphasize machine or dumbbell options and avoid complex bodyweight moves.',
        '- Metric must be one of reps, weight, distance, duration_s, or height.',
        '- For any exercise that involves load (log_mode contains "weight"), you MUST include both metric2:"weight" AND target_value2 (load in kg). Missing target_value2 is invalid.',
        '- For exercises without weight (e.g., Treadmill Run/Walk with log_mode "time"), do NOT include metric2 or target_value2. Only use metric and target_value.',
        '- For duration-based cardio like Treadmill Run/Walk, express time in MINUTES, but output target_value as total seconds (minutes × 60) with metric:"duration_s".',
        '- target_value and rest_seconds must be numeric and realistic.',
        '',
        'Allowed exercises:',
        exerciseList,
        '',
        'User profile JSON:',
        userProfile,
        '',
        'Output requirements:',
        '- Produce exactly one JSON object matching the schema shown below.',
        '- weeks_count must equal 1 and week_number must always be 1.',
        '- workout_plans array length must exactly match training_days_per_week and each day_number must be unique.',
        '- Respond with ONLY raw JSON (no markdown, no comments).',
        '',
        'JSON schema template:',
        template
    ]
        .filter(Boolean)
        .join('\n');
}

function estimateLoadKg(profile: RequiredUserProfile): number {
    const bodyWeight = profile.weight_kg ?? 60;
    let factor = 0.3; // ~30% bodyweight default
    if (profile.experience_level !== null && profile.experience_level !== undefined) {
        if (profile.experience_level >= 4) factor = 0.4;
        else if (profile.experience_level <= 1) factor = 0.2;
    }
    const estimated = bodyWeight * factor;
    return Math.max(5, Math.min(60, Math.round(estimated))); // clamp to reasonable gym loads
}

function applyLoadFallbacks(plan: WorkoutProgram, profile: RequiredUserProfile): WorkoutProgram {
    const fallbackLoad = estimateLoadKg(profile);

    const updatedPlans = plan.workout_plans.map((dayPlan) => ({
        ...dayPlan,
        plan_exercises: dayPlan.plan_exercises.map((exercise) => {
            const logMode = getLogModeForExercise(exercise.exercise_name);
            const needsWeight = exercise.metric2 === 'weight' || (logMode && logMode.includes('weight'));

            let metric2 = exercise.metric2 ?? null;
            let target_value2 = exercise.target_value2 ?? null;

            if (needsWeight && !metric2) {
                metric2 = 'weight';
            }

            if (needsWeight && (!target_value2 || target_value2 <= 0)) {
                target_value2 = fallbackLoad;
            }

            return {
                ...exercise,
                metric2,
                target_value2
            };
        })
    }));

    return {
        ...plan,
        workout_plans: updatedPlans
    };
}

function buildUserProfilePayload(profile: RequiredUserProfile): string {
    const payload = {
        preferred_name: profile.preferred_name ?? 'Athlete',
        gender: profile.gender ?? 'prefer_not_to_say',
        experience_level: profile.experience_level ?? 2,
        primary_goal: firstValue(profile.primary_goal) ?? 'general_fitness',
        training_days_per_week: profile.training_days_per_week,
        available_days: profile.available_days,
        session_duration: profile.session_duration,
        preferred_split: firstValue(profile.preferred_split) ?? 'dont_know',
        problem_areas: profile.problem_areas ?? [],
        gym_comfort_level: firstValue(profile.gym_comfort_level) ?? 'mostly_fine',
        height_cm: profile.height_cm,
        weight_kg: profile.weight_kg
    };
    return JSON.stringify(payload, null, 2);
}

function firstValue(value: string[] | null): string | null {
    if (!value || !value.length) {
        return null;
    }
    return value[0];
}

function extractJsonPayload(content: string): string {
    const withoutFences = content.replace(/```json|```/gi, '').trim();
    if (withoutFences.startsWith('{') && withoutFences.endsWith('}')) {
        return withoutFences;
    }
    const start = withoutFences.indexOf('{');
    const end = withoutFences.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) {
        throw new Error('Unable to locate JSON object in Gemini response');
    }
    return withoutFences.slice(start, end + 1);
}

function normalizePlanSchedule(plan: WorkoutProgram, profile: RequiredUserProfile): WorkoutProgram {
    const allowedDays = Array.from(new Set(profile.available_days));
    if (!allowedDays.length) {
        throw new Error('User profile has no available_days defined.');
    }
    if (allowedDays.length < profile.training_days_per_week) {
        throw new Error(
            `User provided only ${allowedDays.length} unique available_days but requested ${profile.training_days_per_week} training days.`
        );
    }

    const allowedSet = new Set(allowedDays);
    const usedDays = new Set<number>();

    const pickNextAvailableDay = (): number | undefined => {
        return allowedDays.find((day) => !usedDays.has(day));
    };

    const normalizedPlans = plan.workout_plans.map((dayPlan) => {
        let normalizedDay = dayPlan.day_number;
        if (!allowedSet.has(normalizedDay) || usedDays.has(normalizedDay)) {
            const replacement = pickNextAvailableDay();
            if (typeof replacement === 'number') {
                normalizedDay = replacement;
            } else {
                throw new Error(
                    `Unable to map AI-provided day_number ${dayPlan.day_number} into available_days [${allowedDays.join(', ')}].`
                );
            }
        }

        usedDays.add(normalizedDay);

        return {
            ...dayPlan,
            week_number: 1,
            day_number: normalizedDay,
            plan_duration_estimate: Math.min(dayPlan.plan_duration_estimate, profile.session_duration),
            plan_exercises: dayPlan.plan_exercises.map((exercise) => ({
                ...exercise,
                rest_seconds: clampNumber(exercise.rest_seconds, 15, 600)
            }))
        };
    });

    return {
        ...plan,
        weeks_count: 1,
        workout_plans: normalizedPlans
    };
}

function clampNumber(value: number, min: number, max: number): number {
    if (typeof value !== 'number' || Number.isNaN(value)) {
        return min;
    }
    return Math.min(Math.max(value, min), max);
}

function validatePlanAgainstUser(plan: WorkoutProgram, profile: RequiredUserProfile): void {
    if (plan.workout_plans.length !== profile.training_days_per_week) {
        throw new Error(
            `Workout plan days (${plan.workout_plans.length}) do not match required training_days_per_week (${profile.training_days_per_week}).`
        );
    }

    const allowedDays = new Set(profile.available_days);
    const seenDays = new Set<number>();

    for (const dayPlan of plan.workout_plans) {
        if (dayPlan.week_number !== 1) {
            throw new Error('week_number must be 1 for every plan.');
        }
        if (!allowedDays.has(dayPlan.day_number)) {
            throw new Error(`Day number ${dayPlan.day_number} is not in the user\'s available_days.`);
        }
        if (seenDays.has(dayPlan.day_number)) {
            throw new Error(`Duplicate day_number ${dayPlan.day_number} detected.`);
        }
        seenDays.add(dayPlan.day_number);

        if (dayPlan.plan_duration_estimate > profile.session_duration) {
            throw new Error(
                `Plan duration ${dayPlan.plan_duration_estimate} exceeds session_duration ${profile.session_duration}.`
            );
        }

        if (!dayPlan.plan_exercises.length) {
            throw new Error('Each plan must include at least one exercise.');
        }
    }
}

async function persistProgram(userId: string, plan: WorkoutProgram): Promise<GenerationResult> {
    const exerciseCatalog = await ensureExerciseCatalog();
    let programId: string | null = null;
    const planIds: string[] = [];
    
    // Extract unique workout days
    const workoutDays = Array.from(new Set(plan.workout_plans.map(p => p.day_number))).sort((a, b) => a - b);

    try {
        await supabase
            .from('workout_programs')
            .update({ is_active: false, updated_at: new Date().toISOString() })
            .eq('user_id', userId)
            .eq('is_active', true);

        const { data: insertedProgram, error: insertProgramError } = await supabase
            .from('workout_programs')
            .insert([
                {
                    user_id: userId,
                    name: plan.program_name,
                    description: plan.program_description,
                    weeks_count: plan.weeks_count,
                    is_active: true,
                    workout_days: workoutDays
                }
            ])
            .select('id')
            .single();

        if (insertProgramError || !insertedProgram) {
            console.error('[planner] workout_programs insert failed', {
                error: insertProgramError,
                userId,
                programName: plan.program_name
            });
            throw new Error(insertProgramError?.message || 'Failed to create workout program');
        }
        programId = insertedProgram.id;

        const planRows = plan.workout_plans.map((dayPlan) => ({
            user_id: userId,
            program_id: programId,
            week_number: dayPlan.week_number,
            day_number: dayPlan.day_number,
            name: dayPlan.plan_name,
            description: `${dayPlan.plan_description} | Est. ${dayPlan.plan_duration_estimate} min`,
            scheduled_date: null
        }));

        const { data: insertedPlans, error: planInsertError } = await supabase
            .from('workout_plans')
            .insert(planRows)
            .select('id, day_number');

        if (planInsertError || !insertedPlans) {
            console.error('[planner] workout_plans insert failed', {
                error: planInsertError,
                userId,
                programId,
                planRowsCount: planRows.length
            });
            throw new Error(planInsertError?.message || 'Failed to create workout plans');
        }
        if (insertedPlans.length !== plan.workout_plans.length) {
            throw new Error('Mismatch between inserted plans and requested plans.');
        }
        const planIdByDay = new Map<number, string>();
        insertedPlans.forEach((entry: { id: string; day_number: number }) => {
            planIdByDay.set(entry.day_number, entry.id);
        });
        plan.workout_plans.forEach((dayPlan) => {
            const planId = planIdByDay.get(dayPlan.day_number);
            if (!planId) {
                throw new Error(`Unable to match plan id for day ${dayPlan.day_number}`);
            }
            planIds.push(planId);
        });

        const seen = new Set<string>();
        const planExerciseRows: Array<{
            plan_id: string;
            exercise_id: string;
            sequence_no: number;
            target_sets: number;
            metric: string;
            target_value: number;
            rest_seconds: number;
            metric2?: string | null;
            target_value2?: number | null;
        }> = [];

        plan.workout_plans.forEach((dayPlan, index) => {
            const planId = planIds[index];
            dayPlan.plan_exercises.forEach((exercise) => {
                const exerciseId = exerciseCatalog[exercise.exercise_name];
                const logMode = getLogModeForExercise(exercise.exercise_name);
                if (!exerciseId) {
                    console.warn('[planner] Missing exercise id for', exercise.exercise_name);
                    return;
                }
                const comboKey = `${planId}:${exerciseId}`;
                if (seen.has(comboKey)) {
                    return;
                }
                seen.add(comboKey);
                let metric2 = exercise.metric2 ?? null;
                // Ensure load-based movements carry weight metric2 even if model omitted it
                if (!metric2 && logMode && logMode.includes('weight')) {
                    metric2 = 'weight';
                }

                planExerciseRows.push({
                    plan_id: planId,
                    exercise_id: exerciseId,
                    sequence_no: exercise.sequence_no,
                    target_sets: exercise.target_sets,
                    metric: exercise.metric,
                    target_value: exercise.target_value,
                    rest_seconds: exercise.rest_seconds,
                    metric2,
                    target_value2: exercise.target_value2 ?? null
                });
            });
        });

        if (planExerciseRows.length) {
            const { error: exerciseInsertError } = await supabase
                .from('plan_exercises')
                .insert(planExerciseRows);
            if (exerciseInsertError) {
                console.error('[planner] plan_exercises insert failed', {
                    error: exerciseInsertError,
                    userId,
                    programId,
                    planExerciseRowsCount: planExerciseRows.length
                });
                throw new Error(exerciseInsertError.message || 'Failed to insert plan exercises');
            }
        }

        if (!programId) {
            throw new Error('Program id missing after insertion.');
        }

        return {
            programId,
            planCount: plan.workout_plans.length,
            exerciseCount: planExerciseRows.length
        };
    } catch (error) {
        if (planIds.length) {
            try {
                await supabase.from('plan_exercises').delete().in('plan_id', planIds);
            } catch (cleanupError) {
                console.warn('[planner] Failed to clean up plan exercises:', cleanupError);
            }
            try {
                await supabase.from('workout_plans').delete().in('id', planIds);
            } catch (cleanupError) {
                console.warn('[planner] Failed to clean up workout plans:', cleanupError);
            }
        }
        if (programId) {
            try {
                await supabase.from('workout_programs').delete().eq('id', programId);
            } catch (cleanupError) {
                console.warn('[planner] Failed to clean up workout program:', cleanupError);
            }
        }
        throw error;
    }
}

async function ensureExerciseCatalog(): Promise<Record<ExerciseName, string>> {
    const names = EXERCISE_LIBRARY.map((exercise) => exercise.name);
    const { data: existing, error } = await supabase
        .from('exercises')
        .select('id, name')
        .in('name', names);

    if (error) {
        throw new Error(`Failed to fetch exercise catalog: ${error.message}`);
    }

    const idMap = new Map<ExerciseName, string>();
    existing?.forEach((row: { id: string; name: ExerciseName }) => {
        idMap.set(row.name, row.id);
    });

    const missing = EXERCISE_LIBRARY.filter((exercise) => !idMap.has(exercise.name));
    if (missing.length) {
        const insertRows = missing.map((exercise) => ({
            slug: exercise.slug,
            name: exercise.name,
            description: exercise.description,
            difficulty: exercise.difficulty,
            log_mode: exercise.logMode,
            cues: null,
            is_public: true
        }));

        const { data: inserted, error: insertError } = await supabase
            .from('exercises')
            .insert(insertRows)
            .select('id, name');

        if (insertError) {
            throw new Error(`Failed to seed exercise catalog: ${insertError.message}`);
        }

        inserted?.forEach((row: { id: string; name: ExerciseName }) => {
            idMap.set(row.name, row.id);
        });
    }

    const result: Record<ExerciseName, string> = {} as Record<ExerciseName, string>;
    EXERCISE_NAMES.forEach((name) => {
        const id = idMap.get(name);
        if (id) {
            result[name] = id;
        }
    });
    return result;
}

function normalizeGeminiModel(model: string): { model: string; normalized: boolean } {
    const trimmed = model.trim();
    if (!trimmed) {
        return { model: DEFAULT_GEMINI_MODEL, normalized: false };
    }
    if (trimmed.toLowerCase().endsWith('-latest')) {
        return { model: trimmed.replace(/-latest$/i, ''), normalized: true };
    }
    return { model: trimmed, normalized: false };
}
