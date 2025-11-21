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

router.get('/', requireAuth, async (req: AuthedRequest, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                error: { message: 'Unauthenticated' }
            });
        }

        const [profileResult, usersResult, userAchievementsResult, workoutsResult] = await Promise.all([
            supabase
                .from('user_info')
                .select('preferred_name, trainer')
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
                .limit(3),
            supabase
                .from('workouts')
                .select('id, started_at')
                .eq('user_id', userId)
                .order('started_at', { ascending: false })
                .limit(100)  // Increased from 42 to 100 to ensure we cover all workouts in the last 21 days
        ]);

        if (profileResult.error) {
            console.warn('Failed to read profile info:', profileResult.error.message);
        }

        if (usersResult.error) {
            console.warn('Failed to read base user info:', usersResult.error.message);
        }

        if (userAchievementsResult.error) {
            console.warn('Failed to read profile achievements:', userAchievementsResult.error.message);
        }

        if (workoutsResult.error) {
            console.warn('Failed to read workout history:', workoutsResult.error.message);
        }

        const achievements = await buildAchievements(userAchievementsResult.data);
        const { workoutGrid, streak } = buildWorkoutGrid(workoutsResult.data);

        const preferredName =
            profileResult.data?.preferred_name ??
            usersResult.data?.display_name ??
            null;

        // Ensure we return exactly 3 achievements for the profile page
        const displayAchievements = achievements.length > 0 
            ? achievements.slice(0, 3) 
            : DEFAULT_ACHIEVEMENTS;

        return res.json({
            user: {
                preferredName,
                avatarUrl: null,
                bio: null,
                trainer: typeof profileResult.data?.trainer === 'boolean' ? profileResult.data.trainer : null,
                streakDays: streak
            },
            achievements: displayAchievements,
            workoutGrid
        });
    } catch (error: any) {
        console.error('Failed to load profile summary:', error);
        return res.status(500).json({
            error: { message: 'Failed to load profile' }
        });
    }
});

async function buildAchievements(
    rows?: Array<{ id: string; achievement_id: string | null; unlocked_at: string | null }> | null
): Promise<ProfileAchievement[]> {
    if (!rows || rows.length === 0) {
        return [];
    }

    // Get unique achievement IDs
    const achievementIds = Array.from(
        new Set(
            rows
                .map((row) => row.achievement_id)
                .filter((id): id is string => Boolean(id))
        )
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

    // Build achievements, keeping the order from rows (most recent first)
    // Use a Set to track which achievement_ids we've already added (to avoid duplicates)
    const seenAchievementIds = new Set<string>();
    const result: ProfileAchievement[] = [];

    for (const row of rows) {
        if (!row.achievement_id) {
            continue;
        }

        // Skip if we've already added this achievement_id
        if (seenAchievementIds.has(row.achievement_id)) {
            continue;
        }

        const record = meta.get(row.achievement_id);
        if (!record) {
            continue;
        }

        seenAchievementIds.add(row.achievement_id);
        result.push({
            id: row.id,
            title: record.name ?? 'Achievement',
            sub: record.description ?? '',
            emoji: record.icon ?? '🏆'
        });
    }

    return result;
}

// Build all achievements without deduplication (for "See More" page)
async function buildAllAchievements(
    rows?: Array<{ id: string; achievement_id: string | null; unlocked_at: string | null }> | null
): Promise<ProfileAchievement[]> {
    if (!rows || rows.length === 0) {
        return [];
    }

    // Get all unique achievement IDs (for metadata lookup)
    const achievementIds = Array.from(
        new Set(
            rows
                .map((row) => row.achievement_id)
                .filter((id): id is string => Boolean(id))
        )
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

    // Build achievements, keeping ALL records (no deduplication)
    const result: ProfileAchievement[] = [];

    for (const row of rows) {
        if (!row.achievement_id) {
            continue;
        }

        const record = meta.get(row.achievement_id);
        if (!record) {
            continue;
        }

        result.push({
            id: row.id,
            title: record.name ?? 'Achievement',
            sub: record.description ?? '',
            emoji: record.icon ?? '🏆'
        });
    }

    return result;
}

function buildWorkoutGrid(
    rows?: Array<{ started_at: string | null }> | null
): { workoutGrid: WorkoutDay[][]; streak: number } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const workoutDates = new Set<string>();
    rows?.forEach((row) => {
        if (row.started_at) {
            const date = new Date(row.started_at);
            if (!isNaN(date.getTime())) {
                // Normalize to midnight (same as CalendarPage) to ensure consistent date comparison
                date.setHours(0, 0, 0, 0);
                workoutDates.add(date.toISOString().slice(0, 10));
            }
        }
    });

    const start = new Date(today);
    start.setDate(start.getDate() - 20);

    const cells: WorkoutDay[] = [];
    for (let i = 0; i < 21; i++) {
        const current = new Date(start);
        current.setDate(start.getDate() + i);
        current.setHours(0, 0, 0, 0);

        const iso = current.toISOString().slice(0, 10);
        let state: WorkoutDay['state'] = 'rest';
        if (current > today) {
            state = 'future';
        } else if (workoutDates.has(iso)) {
            state = 'worked';
        }

        cells.push({
            date: iso,
            state,
            isCurrent: current.getTime() === today.getTime()
        });
    }

    const grid: WorkoutDay[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
        grid.push(cells.slice(i, i + 7));
    }

    const streak = calculateStreak(workoutDates);

    return { workoutGrid: grid, streak };
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

// GET /api/profile/achievements - Get all obtained achievements for the current user
router.get('/achievements', requireAuth, async (req: AuthedRequest, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                error: { message: 'Unauthenticated' }
            });
        }

        const { data: userAchievementsResult, error } = await supabase
            .from('user_achievements')
            .select('id, achievement_id, unlocked_at')
            .eq('user_id', userId)
            .order('unlocked_at', { ascending: false })
            .limit(1000); // Explicitly set a high limit to ensure we get all achievements

        if (error) {
            console.warn('Failed to read user achievements:', error.message);
            return res.status(500).json({
                error: { message: 'Failed to load achievements' }
            });
        }

        // Use buildAllAchievements to show all achievements without deduplication
        const achievements = await buildAllAchievements(userAchievementsResult);

        return res.json({
            achievements: achievements
        });
    } catch (error: any) {
        console.error('Failed to load achievements:', error);
        return res.status(500).json({
            error: { message: 'Failed to load achievements' }
        });
    }
});

// GET /api/profile/workouts - Get all workout history for the current user
router.get('/workouts', requireAuth, async (req: AuthedRequest, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                error: { message: 'Unauthenticated' }
            });
        }

        const { data: workoutsResult, error } = await supabase
            .from('workouts')
            .select('id, started_at, ended_at, plan_id, workout_plans(name)')
            .eq('user_id', userId)
            .order('started_at', { ascending: false })
            .limit(1000);

        if (error) {
            console.warn('Failed to read workout history:', error.message);
            return res.status(500).json({
                error: { message: 'Failed to load workout history' }
            });
        }

        const workouts = (workoutsResult || []).map((workout: any) => {
            // Handle both array and object formats from Supabase join
            let planName = 'Workout';
            if (workout.workout_plans) {
                if (Array.isArray(workout.workout_plans) && workout.workout_plans.length > 0) {
                    planName = workout.workout_plans[0].name || 'Workout';
                } else if (workout.workout_plans.name) {
                    planName = workout.workout_plans.name;
                }
            }
            
            return {
                id: workout.id,
                title: planName,
                from: workout.started_at,
                to: workout.ended_at || null
            };
        });

        return res.json({
            workouts: workouts
        });
    } catch (error: any) {
        console.error('Failed to load workout history:', error);
        return res.status(500).json({
            error: { message: 'Failed to load workout history' }
        });
    }
});

export default router;

