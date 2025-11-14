import { Router } from 'express';
import type { Request } from 'express';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../db/supabase';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

type AuthedRequest = Request & { user?: User };

type DashboardStat = {
    current: number;
    target: number;
};

type DashboardResponse = {
    firstName: string | null;
    trainer: boolean | null;
    goal: {
        workoutsCompleted: DashboardStat;
        exercisesDiscovered: DashboardStat;
        longestStreak: DashboardStat;
    };
    level: {
        label: string;
        currentXp: number;
        nextLevelXp: number;
    };
    achievements: Array<{ id: string; title: string; sub: string; emoji: string }>;
    mood: string;
    nextWorkout: string;
    streakDays: number;
    advice: string;
};

const DEFAULT_RESPONSE: DashboardResponse = {
    firstName: null,
    trainer: null,
    goal: {
        workoutsCompleted: { current: 70, target: 100 },
        exercisesDiscovered: { current: 30, target: 40 },
        longestStreak: { current: 30, target: 60 }
    },
    level: { label: 'Novice', currentXp: 500, nextLevelXp: 1200 },
    achievements: [
        { id: 'workouts-100', title: '100 Workouts', sub: 'Completed', emoji: '💪' },
        { id: 'streak-7', title: '7 Days', sub: 'Streak', emoji: '📆' },
        { id: 'consecutive-12', title: 'Consecutive', sub: 'Workout 12', emoji: '🔥' }
    ],
    mood: '😣',
    nextWorkout: '🏋️‍♂️',
    streakDays: 20,
    advice: 'Fill half your plate with colorful vegetables!'
};

router.get('/', requireAuth, async (req: AuthedRequest, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                error: { message: 'Unauthenticated' }
            });
        }

        console.log('[dashboard] Fetching profile data for user', userId);
        const queryStart = Date.now();
        const { data: userInfo, error } = await supabase
            .from('user_info')
            .select('preferred_name, trainer')
            .eq('user_id', userId)
            .maybeSingle();
        console.log('[dashboard] Supabase query completed in', Date.now() - queryStart, 'ms');

        if (error) {
            console.warn('[dashboard] Failed to fetch profile data', error);
        }

        const response: DashboardResponse = {
            ...DEFAULT_RESPONSE,
            firstName: userInfo?.preferred_name ?? DEFAULT_RESPONSE.firstName,
            trainer: typeof userInfo?.trainer === 'boolean' ? userInfo.trainer : DEFAULT_RESPONSE.trainer
        };

        console.log('[dashboard] Responding with data for user', userId);
        return res.json(response);
    } catch (err: any) {
        console.error('Unexpected error fetching dashboard data:', err);
        return res.status(500).json({
            error: { message: 'Failed to load dashboard data' }
        });
    }
});

export default router;
