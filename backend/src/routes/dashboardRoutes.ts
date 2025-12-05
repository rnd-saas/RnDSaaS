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

const DEFAULT_ACHIEVEMENTS: Array<{ id: string; title: string; sub: string; emoji: string }> = [];

const WORKOUT_TARGET = 100;
const EXERCISE_TARGET = 40;
const STREAK_TARGET = 60;
const XP_PER_WORKOUT = 50;

const LEVELS = [
    { label: 'Novice', minXp: 0, maxXp: 500 },
    { label: 'Apprentice', minXp: 500, maxXp: 1500 },
    { label: 'Athlete', minXp: 1500, maxXp: 3000 },
    { label: 'Challenger', minXp: 3000, maxXp: 5000 },
    { label: 'Elite', minXp: 5000, maxXp: 8000 },
    { label: 'Legend', minXp: 8000, maxXp: 11000 }
];

router.get('/', requireAuth, async (req: AuthedRequest, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                error: { message: 'Unauthenticated' }
            });
        }

        const [
            userInfoResult,
            workoutsResult,
            achievementRowsResult,
            nextPlanResult
        ] = await Promise.all([
            supabase
            .from('user_info')
            .select('preferred_name, trainer')
            .eq('user_id', userId)
                .maybeSingle(),
            supabase
                .from('workouts')
                .select('id, started_at, plan_id', { count: 'exact' })
                .eq('user_id', userId)
                .order('started_at', { ascending: false })
                .limit(100),
            supabase
                .from('user_achievements')
                .select('id, achievement_id, unlocked_at')
                .eq('user_id', userId)
                .order('unlocked_at', { ascending: false })
                .limit(25),
            supabase
                .from('workout_plans')
                .select('name, scheduled_date')
                .eq('user_id', userId)
                .gte('scheduled_date', new Date().toISOString().slice(0, 10))
                .order('scheduled_date', { ascending: true })
                .limit(1)
                .maybeSingle()
        ]);

        if (userInfoResult.error) {
            console.warn('Failed to fetch dashboard profile data', userInfoResult.error);
        }
        if (workoutsResult.error) {
            console.warn('Failed to fetch workouts for dashboard', workoutsResult.error);
        }
        if (achievementRowsResult.error) {
            console.warn('Failed to fetch dashboard achievements', achievementRowsResult.error);
        }
        if (nextPlanResult.error) {
            console.warn('Failed to fetch upcoming plan for dashboard', nextPlanResult.error);
        }

        const workouts = workoutsResult.data ?? [];
        const totalWorkouts = workoutsResult.count ?? workouts.length;
        const workoutDates = new Set(
            workouts
                .map((row) => row.started_at)
                .filter((iso): iso is string => Boolean(iso))
                .map((iso) => iso.slice(0, 10))
        );
        // Count distinct workout plan types (plan_id) that the user has completed
        const uniquePlans = new Set(
            workouts
                .map((row) => row.plan_id)
                .filter((id): id is string => Boolean(id))
        );
        const exercisesDiscovered = uniquePlans.size;
        const streakDays = calculateStreak(workoutDates);
        const achievements = await buildAchievements(achievementRowsResult.data ?? null);
        const totalXp = calculateExperience(totalWorkouts, streakDays);
        const level = resolveLevel(totalXp);

        const nextPlan = nextPlanResult.data;
        const nextWorkout =
            nextPlan?.name && nextPlan?.scheduled_date
                ? formatNextWorkoutLabel(nextPlan.name, nextPlan.scheduled_date)
                : '🏋️‍♂️';

        const response: DashboardResponse = {
            firstName: userInfoResult.data?.preferred_name ?? null,
            trainer: typeof userInfoResult.data?.trainer === 'boolean' ? userInfoResult.data.trainer : null,
            goal: {
                workoutsCompleted: {
                    current: totalWorkouts,
                    target: Math.max(WORKOUT_TARGET, totalWorkouts || WORKOUT_TARGET)
                },
                exercisesDiscovered: {
                    current: exercisesDiscovered,
                    target: Math.max(EXERCISE_TARGET, exercisesDiscovered || EXERCISE_TARGET)
                },
                longestStreak: {
                    current: streakDays,
                    target: STREAK_TARGET
                }
            },
            level,
            achievements: achievements.length > 0 ? achievements : DEFAULT_ACHIEVEMENTS,
            mood: '😐', // Frontend currently uses local state for mood, keep neutral fallback
            nextWorkout,
            streakDays,
            advice: 'Stay consistent and plan your next workout today.'
        };

        return res.json(response);
    } catch (err: any) {
        console.error('Unexpected error fetching dashboard data:', err);
        return res.status(500).json({
            error: { message: 'Failed to load dashboard data' }
        });
    }
});

// Removed countUniqueExercises function - now using plan_id count directly

async function buildAchievements(
    rows?: Array<{ id: string; achievement_id: string | null; unlocked_at: string | null }> | null
) {
    if (!rows || rows.length === 0) {
        return [];
    }

    const achievementIds = Array.from(
        new Set(rows.map((row) => row.achievement_id).filter((id): id is string => Boolean(id)))
    );

    if (achievementIds.length === 0) {
        return [];
    }

    const { data, error } = await supabase
        .from('achievements')
        .select('id, name, description, icon')
        .in('id', achievementIds);

    if (error || !data) {
        console.warn('Failed to load achievements metadata:', error?.message || error);
        return [];
    }

    const meta = new Map<string, { name: string; description: string; icon: string | null }>();
    data.forEach((record) => {
        meta.set(record.id, {
            name: record.name,
            description: record.description,
            icon: record.icon ?? '🏆'
        });
    });

    const seen = new Set<string>();
    const result: Array<{ id: string; title: string; sub: string; emoji: string }> = [];

    for (const row of rows) {
        if (!row.achievement_id || seen.has(row.achievement_id)) {
            continue;
        }

        const record = meta.get(row.achievement_id);
        if (!record) {
            continue;
        }

        seen.add(row.achievement_id);
        result.push({
            id: row.id,
            title: record.name ?? 'Achievement',
            sub: record.description ?? '',
            emoji: record.icon ?? '🏆'
        });
    }

    return result;
}

function resolveLevel(totalXp: number): DashboardResponse['level'] {
    let currentLevel = LEVELS[0];
    for (const level of LEVELS) {
        if (totalXp >= level.minXp) {
            currentLevel = level;
        } else {
            break;
        }
    }

    const span = (currentLevel.maxXp ?? currentLevel.minXp + 1000) - currentLevel.minXp;
    const progressWithinLevel = Math.max(0, Math.min(totalXp - currentLevel.minXp, span));

    return {
        label: currentLevel.label,
        currentXp: progressWithinLevel,
        nextLevelXp: span
    };
}

function calculateExperience(totalWorkouts: number, streakDays: number): number {
    const baseXp = totalWorkouts * XP_PER_WORKOUT;
    if (baseXp === 0 || streakDays <= 0) {
        return baseXp;
    }

    const cappedStreak = Math.min(streakDays, 45); // prevent runaway multipliers
    const streakMultiplier = 1 + cappedStreak * 0.02; // +2% XP per streak day, up to +90%

    return Math.round(baseXp * streakMultiplier);
}

function calculateStreak(workoutDates: Set<string>): number {
    const sorted = Array.from(workoutDates).sort((a, b) => (a > b ? -1 : 1));

    let streak = 0;
    let previousDate: Date | null = null;

    for (const iso of sorted) {
        const currentDate = parseIsoDate(iso);

        if (!previousDate) {
            streak = 1;
            previousDate = currentDate;
            continue;
        }

        const diffDays = Math.round(
            (previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
            streak += 1;
            previousDate = currentDate;
        } else {
            break;
        }
    }

    return streak;
}

function parseIsoDate(iso: string): Date {
    return new Date(`${iso}T00:00:00Z`);
}

function formatNextWorkoutLabel(name: string, date: string) {
    return `📅 ${name.trim()} • ${date}`;
}

export default router;
