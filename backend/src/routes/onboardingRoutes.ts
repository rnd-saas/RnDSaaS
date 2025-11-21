import { Router } from 'express';
import type { Request } from 'express';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../db/supabase';
import { requireAuth } from '../middleware/requireAuth';
import { generateWorkoutPlanForUser } from '../services/workoutPlanGenerator';

const router = Router();

type AuthedRequest = Request & { user?: User };

interface OnboardingPayload {
    preferredName?: string | null;
    gender?: string | null;
    heightCm?: number | null;
    weightKg?: number | null;
    primaryGoal?: string[] | null;
    trainingDaysPerWeek?: number | null;
    availableDays?: number[] | null;
    sessionDuration?: number | null;
    problemAreas?: string[] | null;
    preferredSplit?: string[] | null;
    gymComfortLevel?: string[] | null;
    experienceLevel?: number | null;
    trainerId?: number | null;
    trainer?: boolean | null;
}

const sanitizeRecord = (record: Record<string, unknown>): Record<string, unknown> => {
    return Object.entries(record).reduce<Record<string, unknown>>((acc, [key, value]) => {
        acc[key] = value === undefined ? null : value;
        return acc;
    }, {});
};

router.get('/', requireAuth, async (req: AuthedRequest, res) => {
    try {
    const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                error: { message: 'Unauthenticated' }
            });
        }

        const { data, error } = await supabase
            .from('user_info')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

        if (error) {
            console.error('Failed to fetch onboarding answers:', error);
            return res.status(400).json({
                error: { message: error.message }
            });
        }

        return res.json(data ?? null);
    } catch (err: any) {
        console.error('Unexpected error fetching onboarding answers:', err);
        return res.status(500).json({
            error: { message: 'Internal server error' }
        });
    }
});

type PlanGenerationStatus = 'success' | 'queued' | 'skipped' | 'failed';

router.post('/', requireAuth, async (req: AuthedRequest, res) => {
    try {
    const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                error: { message: 'Unauthenticated' }
            });
        }

        const payload = req.body as OnboardingPayload;
        const trainerId = sanitizeTrainerId(payload.trainerId);

        const record = sanitizeRecord({
            user_id: userId,
            preferred_name: payload.preferredName,
            gender: payload.gender,
            height_cm: payload.heightCm,
            weight_kg: payload.weightKg,
            primary_goal: payload.primaryGoal,
            training_days_per_week: payload.trainingDaysPerWeek,
            available_days: payload.availableDays,
            session_duration: payload.sessionDuration,
            problem_areas: payload.problemAreas,
            preferred_split: payload.preferredSplit,
            gym_comfort_level: payload.gymComfortLevel,
            experience_level: payload.experienceLevel,
            trainer: payload.trainer,
            updated_at: new Date().toISOString()
        });

        const { error } = await supabase
            .from('user_info')
            .upsert(record, { onConflict: 'user_id' });

        if (error) {
            console.error('Failed to save onboarding answers:', error);
            return res.status(400).json({
                error: { message: error.message }
            });
        }

        if (trainerId !== null) {
            try {
                await upsertTrainerPreference(userId, trainerId);
            } catch (trainerError: any) {
                console.error('Failed to save trainer preference:', trainerError.message || trainerError);
            }
        }

        let planGeneration: PlanGenerationStatus = 'skipped';
        try {
            const result = await generateWorkoutPlanForUser(userId);
            planGeneration = result ? 'success' : 'skipped';
        } catch (planError: any) {
            console.error('Failed to generate workout program:', planError?.message || planError);
            planGeneration = 'failed';
        }

        return res.status(200).json({ success: true, planGeneration });
    } catch (err: any) {
        console.error('Unexpected error saving onboarding answers:', err);
        return res.status(500).json({
            error: { message: 'Internal server error' }
        });
    }
});

function sanitizeTrainerId(value: unknown): 0 | 1 | null {
    if (value === 1 || value === '1') return 1;
    if (value === 0 || value === '0') return 0;
    return null;
}

async function upsertTrainerPreference(userId: string, trainerId: 0 | 1): Promise<void> {
    const { error } = await supabase
        .from('user_settings')
        .upsert(
            {
                user_id: userId,
                trainer: trainerId,
                updated_at: new Date().toISOString()
            },
            { onConflict: 'user_id' }
        );

    if (error) {
        throw error;
    }
}

export default router;
