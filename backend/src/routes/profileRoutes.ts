import { Router } from 'express';
import type { Request } from 'express';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../db/supabase';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

type AuthedRequest = Request & { user?: User };

type ProfileAchievement = {
    id: string;
    title: string;
    sub: string;
    emoji: string;
};

type WorkoutDay = {
    date: string;
    state: 'worked' | 'rest' | 'future';
    isCurrent: boolean;
};

const DEFAULT_ACHIEVEMENTS: ProfileAchievement[] = [
    { id: 'fallback-1', title: '100 Workouts', sub: 'Completed', emoji: '💪' },
    { id: 'fallback-2', title: '7 Days', sub: 'Streak', emoji: '📆' },
    { id: 'fallback-3', title: 'Consistent', sub: 'Workout 12', emoji: '🔥' }
];

const XP_PER_WORKOUT = 50;

const LEVELS = [
    { label: 'Novice', minXp: 0, maxXp: 500 },
    { label: 'Apprentice', minXp: 500, maxXp: 1500 },
    { label: 'Athlete', minXp: 1500, maxXp: 3000 },
    { label: 'Challenger', minXp: 3000, maxXp: 5000 },
    { label: 'Elite', minXp: 5000, maxXp: 8000 },
    { label: 'Legend', minXp: 8000, maxXp: 11000 }
];

function resolveLevel(totalXp: number) {
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

function buildWorkoutGrid(workouts: Array<{ id: string; started_at: string }> | null) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Build grid (last 28 days = 4 weeks)
    const grid: WorkoutDay[][] = [];
    const workoutDates = new Set(
        workouts?.map(w => new Date(w.started_at).toDateString()) ?? []
    );

    // Start from 4 weeks ago (approx)
    const endDate = new Date(today);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 27); // 28 days total

    let currentWeek: WorkoutDay[] = [];
    
    for (let i = 0; i < 28; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        
        const isToday = d.toDateString() === today.toDateString();
        const hasWorkout = workoutDates.has(d.toDateString());
        
        currentWeek.push({
            date: d.toISOString(),
            state: hasWorkout ? 'worked' : (d > today ? 'future' : 'rest'),
            isCurrent: isToday
        });

        if (currentWeek.length === 7) {
            grid.push(currentWeek);
            currentWeek = [];
        }
    }
    
    if (currentWeek.length > 0) {
        grid.push(currentWeek);
    }

    return { workoutGrid: grid };
}

router.get('/', requireAuth, async (req: AuthedRequest, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                error: { message: 'Unauthenticated' }
            });
        }

        console.log(`[Profile] Fetching profile data for user: ${userId}`);
        
        const [profileResult, usersResult, userAchievementsResult, workoutsResult] = await Promise.all([
            supabase
                .from('user_info')
                .select('preferred_name, trainer, avatar_option')
                .eq('user_id', userId)
                .maybeSingle(),
            supabase
                .from('users')
                .select('display_name')
                .eq('id', userId)
                .maybeSingle(),
            supabase
                .from('user_achievements')
                .select('id, achievement_id, unlocked_at')
                .eq('user_id', userId)
                .order('unlocked_at', { ascending: false })
                .limit(20), // Query more records to ensure we get 3 unique achievements after deduplication
            supabase
                .from('workouts')
                .select('id, started_at', { count: 'exact' })
                .eq('user_id', userId)
                .order('started_at', { ascending: false })
                // .limit(100)  // Removed limit to ensure accurate streak calculation
        ]);

        // console.log(`[Profile] Query results:`, {
        //     userAchievementsCount: userAchievementsResult.data?.length ?? 0,
        //     userAchievementsError: userAchievementsResult.error?.message,
        //     userAchievementsData: userAchievementsResult.data?.map(r => ({ id: r.id, achievement_id: r.achievement_id, unlocked_at: r.unlocked_at }))
        // });

        if (profileResult.error) {
            console.warn('Failed to read profile info:', profileResult.error.message);
        }

        if (usersResult.error) {
            console.warn('Failed to read base user info:', usersResult.error.message);
        }

        if (userAchievementsResult.error) {
            console.error('Failed to read profile achievements:', {
                error: userAchievementsResult.error.message,
                code: userAchievementsResult.error.code,
                details: userAchievementsResult.error.details,
                hint: userAchievementsResult.error.hint,
                userId: userId
            });
            // Continue with empty data rather than failing completely
        }

        if (workoutsResult.error) {
            console.warn('Failed to read workout history:', workoutsResult.error.message);
        }

        // Use data even if there was an error (data might still be available)
        // Supabase sometimes returns data even when there's an error, so prioritize data
        const achievementsData = userAchievementsResult.data ?? (userAchievementsResult.error ? null : null);
        const achievements = await buildAchievements(achievementsData);
        const { workoutGrid } = buildWorkoutGrid(workoutsResult.error ? null : workoutsResult.data);

        const workouts = workoutsResult.data ?? [];
        const totalWorkouts = workoutsResult.count ?? workouts.length;
        const workoutDates = new Set(
            workouts
                .map((row) => row.started_at)
                .filter((iso): iso is string => Boolean(iso))
                .map((iso) => iso.slice(0, 10))
        );
        const streak = calculateStreak(workoutDates);
        const totalXp = calculateExperience(totalWorkouts, streak);
        const level = resolveLevel(totalXp);

        res.json({
            user: {
                preferredName: profileResult.data?.preferred_name || usersResult.data?.display_name || 'User',
                avatarUrl: null,
                bio: null,
                trainer: profileResult.data?.trainer || false,
                streakDays: streak,
                avatarOption: profileResult.data?.avatar_option || 0
            },
            achievements,
            workoutGrid,
            level
        });
    } catch (error: any) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
});

router.get('/preferences', requireAuth, async (req: AuthedRequest, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: { message: 'Unauthenticated' } });
        }

        const { data, error } = await supabase
            .from('user_info')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            console.error('Failed to fetch preferences:', error);
            return res.status(500).json({ error: { message: 'Failed to fetch preferences' } });
        }

        // Helper to map snake_case to kebab-case
        const toKebabCase = (val: string) => val ? val.replace(/_/g, '-') : val;
        const mapArrayToKebab = (arr: any[]) => Array.isArray(arr) ? arr.map(toKebabCase) : [];

        // Map DB fields to frontend expected format if necessary, or just return as is
        // The frontend component seems to expect camelCase keys in OnboardingPayload
        // Let's map them to match OnboardingPayload interface
        const preferences = {
            preferredName: data.preferred_name,
            gender: toKebabCase(data.gender),
            heightCm: data.height_cm,
            weightKg: data.weight_kg,
            primaryGoal: mapArrayToKebab(data.primary_goal),
            trainingDaysPerWeek: data.training_days_per_week,
            availableDays: data.available_days,
            sessionDuration: data.session_duration,
            problemAreas: data.problem_areas,
            preferredSplit: mapArrayToKebab(data.preferred_split),
            gymComfortLevel: data.gym_comfort_level, // These seem to match
            experienceLevel: data.experience_level,
            trainer: data.trainer
        };

        res.json(preferences);
    } catch (error: any) {
        console.error('Preferences fetch error:', error);
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
});

router.put('/preferences', requireAuth, async (req: AuthedRequest, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: { message: 'Unauthenticated' } });
        }

        const updates = req.body;

        // Helper to map kebab-case to snake_case
        const toSnakeCase = (val: string) => val ? val.replace(/-/g, '_') : val;
        const mapArrayToSnake = (arr: any[]) => Array.isArray(arr) ? arr.map(toSnakeCase) : [];

        // Map frontend camelCase to DB snake_case
        const dbUpdates: any = {};
        if (updates.preferredName !== undefined) dbUpdates.preferred_name = updates.preferredName;
        if (updates.gender !== undefined) dbUpdates.gender = toSnakeCase(updates.gender);
        if (updates.heightCm !== undefined) dbUpdates.height_cm = updates.heightCm;
        if (updates.weightKg !== undefined) dbUpdates.weight_kg = updates.weightKg;
        if (updates.primaryGoal !== undefined) dbUpdates.primary_goal = mapArrayToSnake(updates.primaryGoal);
        if (updates.trainingDaysPerWeek !== undefined) dbUpdates.training_days_per_week = updates.trainingDaysPerWeek;
        if (updates.availableDays !== undefined) dbUpdates.available_days = updates.availableDays;
        if (updates.sessionDuration !== undefined) dbUpdates.session_duration = updates.sessionDuration;
        if (updates.problemAreas !== undefined) dbUpdates.problem_areas = updates.problemAreas;
        if (updates.preferredSplit !== undefined) dbUpdates.preferred_split = mapArrayToSnake(updates.preferredSplit);
        if (updates.gymComfortLevel !== undefined) dbUpdates.gym_comfort_level = updates.gymComfortLevel;
        if (updates.experienceLevel !== undefined) dbUpdates.experience_level = updates.experienceLevel;

        dbUpdates.updated_at = new Date().toISOString();

        const { data, error } = await supabase
            .from('user_info')
            .update(dbUpdates)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            console.error('Failed to update preferences:', error);
            return res.status(500).json({ error: { message: 'Failed to update preferences' } });
        }

        res.json(data);
    } catch (error: any) {
        console.error('Preferences update error:', error);
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
});

router.put('/avatar', requireAuth, async (req: AuthedRequest, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: { message: 'Unauthenticated' } });
        }

        const updates = req.body;

        // Helper to map kebab-case to snake_case
        const toSnakeCase = (val: string) => val ? val.replace(/-/g, '_') : val;
        const mapArrayToSnake = (arr: any[]) => Array.isArray(arr) ? arr.map(toSnakeCase) : [];

        // Map frontend camelCase to DB snake_case
        const dbUpdates: any = {};
        if (updates.avatarOption !== undefined) dbUpdates.avatar_option = updates.avatarOption;

        dbUpdates.updated_at = new Date().toISOString();

        const { data, error } = await supabase
            .from('user_info')
            .update(dbUpdates)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            console.error('Failed to update preferences:', error);
            return res.status(500).json({ error: { message: 'Failed to update preferences' } });
        }

        res.json(data);
    } catch (error: any) {
        console.error('Preferences update error:', error);
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
});

export default router;

