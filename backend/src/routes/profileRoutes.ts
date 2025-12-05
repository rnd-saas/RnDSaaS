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

        console.log(`[Profile] Fetching profile data for user: ${userId}`);
        
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
                .limit(20), // Query more records to ensure we get 3 unique achievements after deduplication
            supabase
                .from('workouts')
                .select('id, started_at')
                .eq('user_id', userId)
                .order('started_at', { ascending: false })
                .limit(100)  // Get last 100 workouts to ensure we cover all workouts in the displayed range
        ]);

        console.log(`[Profile] Query results:`, {
            userAchievementsCount: userAchievementsResult.data?.length ?? 0,
            userAchievementsError: userAchievementsResult.error?.message,
            userAchievementsData: userAchievementsResult.data?.map(r => ({ id: r.id, achievement_id: r.achievement_id, unlocked_at: r.unlocked_at }))
        });

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
        const { workoutGrid, streak } = buildWorkoutGrid(workoutsResult.error ? null : workoutsResult.data);

        const preferredName =
            profileResult.data?.preferred_name ??
            usersResult.data?.display_name ??
            null;

        // Ensure we return exactly 3 achievements for the profile page
        // Only use DEFAULT_ACHIEVEMENTS if we truly have no achievements (not just due to a query error)
        const displayAchievements = achievements.length > 0 
            ? achievements.slice(0, 3) 
            : (userAchievementsResult.error ? [] : DEFAULT_ACHIEVEMENTS); // Return empty array on error, not fallback

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
        console.warn('buildAchievements: No valid achievement IDs found in rows');
        return [];
    }

    const { data, error } = await supabase
        .from('achievements')
        .select('id, name, description, icon')
        .in('id', achievementIds);

    if (error) {
        console.error('Failed to load achievements metadata:', {
            error: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
            achievementIds: achievementIds
        });
        return [];
    }

    if (!data || data.length === 0) {
        console.warn('buildAchievements: No achievement metadata found for IDs:', achievementIds);
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

    // Check for missing metadata
    const missingIds = achievementIds.filter(id => !meta.has(id));
    if (missingIds.length > 0) {
        console.warn('buildAchievements: Missing metadata for achievement IDs:', missingIds);
    }

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
            console.warn(`buildAchievements: Skipping row with missing metadata for achievement_id: ${row.achievement_id}, row.id: ${row.id}`);
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

    console.log(`buildAchievements: Built ${result.length} achievements from ${rows.length} rows (${achievementIds.length} unique achievement IDs)`);
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

    // Build achievements, keeping order but removing duplicate achievement_ids
    const result: ProfileAchievement[] = [];
    const seenAchievementIds = new Set<string>();

    for (const row of rows) {
        if (!row.achievement_id || seenAchievementIds.has(row.achievement_id)) {
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

function buildWorkoutGrid(
    rows?: Array<{ started_at: string | null }> | null
): { workoutGrid: WorkoutDay[][]; streak: number } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const workoutDates = new Set<string>();
    rows?.forEach((row) => {
        if (row.started_at) {
            // Parse the ISO string and convert to local date
            // This ensures we get the correct local date regardless of UTC offset
            const date = new Date(row.started_at);
            if (!isNaN(date.getTime())) {
                // Get local date components (not UTC)
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                workoutDates.add(formattedDate);
                
                // Debug logging
                console.log(`[buildWorkoutGrid] Found workout: started_at=${row.started_at}, localDate=${formattedDate}`);
            }
        }
    });
    
    console.log(`[buildWorkoutGrid] Total workout dates: ${workoutDates.size}`, Array.from(workoutDates));

    // Find the Monday of the week that contains (today - 18 days)
    // This ensures the calendar grid starts on Monday, matching CalendarPage
    // Total: 18 days past + today + 2 days future = 21 days
    const targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() - 18); // 18 days before today
    targetDate.setHours(0, 0, 0, 0);
    
    // Get the day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = targetDate.getDay();
    // Calculate days to subtract to get to Monday (1)
    // If dayOfWeek is 0 (Sunday), we need to go back 6 days to get to Monday
    // If dayOfWeek is 1 (Monday), we need to go back 0 days
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    const start = new Date(targetDate);
    start.setDate(targetDate.getDate() - daysToMonday);
    start.setHours(0, 0, 0, 0);

    const cells: WorkoutDay[] = [];
    for (let i = 0; i < 21; i++) {
        const current = new Date(start);
        current.setDate(start.getDate() + i);
        current.setHours(0, 0, 0, 0);

        // Use local date string instead of ISO to avoid timezone issues
        const year = current.getFullYear();
        const month = String(current.getMonth() + 1).padStart(2, '0');
        const day = String(current.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        let state: WorkoutDay['state'] = 'rest';
        // Compare dates using getTime() to ensure accurate comparison
        // Both dates are normalized to midnight local time, so comparison should be accurate
        const currentTime = current.getTime();
        const todayTime = today.getTime();
        if (currentTime > todayTime) {
            state = 'future';
        } else if (workoutDates.has(dateStr)) {
            state = 'worked';
            console.log(`[buildWorkoutGrid] Matched workout date: ${dateStr}`);
        }

        cells.push({
            date: dateStr,
            state,
            isCurrent: current.getTime() === today.getTime()
        });
    }

    const grid: WorkoutDay[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
        grid.push(cells.slice(i, i + 7));
    }

    // Debug: Log the final grid
    console.log(`[buildWorkoutGrid] Final grid:`, grid.map(week => 
        week.map(day => `${day.date}:${day.state}`).join(', ')
    ).join(' | '));

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

        // Fetch all user achievements using pagination to ensure we get all records
        // Supabase has a default limit of 1000, so we need to paginate if there are more
        let userAchievementsResult: Array<{ id: string; achievement_id: string | null; unlocked_at: string | null }> = [];
        let from = 0;
        const pageSize = 1000;
        let hasMore = true;

        while (hasMore) {
            const { data, error } = await supabase
                .from('user_achievements')
                .select('id, achievement_id, unlocked_at')
                .eq('user_id', userId)
                .order('unlocked_at', { ascending: false })
                .range(from, from + pageSize - 1);

            if (error) {
                console.error('Failed to read user achievements:', {
                    error: error.message,
                    code: error.code,
                    details: error.details,
                    hint: error.hint,
                    userId: userId,
                    from: from,
                    pageSize: pageSize
                });
                return res.status(500).json({
                    error: { message: 'Failed to load achievements' }
                });
            }

            if (data && data.length > 0) {
                userAchievementsResult = userAchievementsResult.concat(data);
                // If we got fewer records than pageSize, we've reached the end
                hasMore = data.length === pageSize;
                from += pageSize;
            } else {
                hasMore = false;
            }
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

