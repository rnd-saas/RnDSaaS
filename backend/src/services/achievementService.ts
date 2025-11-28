import { supabase } from '../db/supabase';
import { checkAchievements } from './achievementEngine';
import { Achievement, AchievementEvent, UserStatsView } from '../types/achievements';

export async function triggerAchievementCheck(
  userId: string,
  event?: AchievementEvent
): Promise<Achievement[]> {
  try {
    // 1. Fetch Stats
    // Assuming the view has a user_id column to filter by
    const { data: statsData, error: statsError } = await supabase
      .from('view_user_stats_aggregated')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (statsError && statsError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error fetching user stats:', statsError);
    }

    const { data: streakData, error: streakError } = await supabase
      .from('view_user_streaks')
      .select('current_workout_streak')
      .eq('user_id', userId)
      .single();

    if (streakError && streakError.code !== 'PGRST116') {
      console.error('Error fetching user streaks:', streakError);
    }

    const currentStats: UserStatsView = {
      workout_count: statsData?.workout_count || 0,
      mood_log_count: statsData?.mood_log_count || 0,
      exercise_complete_count: statsData?.exercise_complete_count || 0,
      friend_count: statsData?.friend_count || 0,
      max_weight_lifted: statsData?.max_weight_lifted || 0,
      current_workout_streak: streakData?.current_workout_streak || 0,
    };

    // 2. Fetch All Achievements
    const { data: allAchievementsData, error: achievementsError } = await supabase
      .from('achievements')
      .select('*');

    if (achievementsError) {
      console.error('Error fetching achievements:', achievementsError);
      return [];
    }

    const allAchievements = (allAchievementsData || []).map((a: any) => ({
      ...a,
      criteria: typeof a.criteria === 'string' ? JSON.parse(a.criteria) : a.criteria,
    })) as Achievement[];

    // 3. Fetch User's Unlocked Achievements
    const { data: userAchievementsData, error: userAchievementsError } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);

    if (userAchievementsError) {
      console.error('Error fetching user achievements:', userAchievementsError);
      return [];
    }

    const unlockedIds = new Set<string>(
      (userAchievementsData || []).map((ua: any) => ua.achievement_id)
    );

    // 4. Run Engine
    console.log(`[Achievement] Running engine with ${allAchievements.length} achievements, ${unlockedIds.size} unlocked, stats:`, currentStats);
    const newAchievements = checkAchievements(
      allAchievements,
      unlockedIds,
      currentStats,
      event
    );

    // 5. Insert New Unlocks
    if (newAchievements.length > 0) {
      console.log(`[Achievement] New unlocks found:`, newAchievements.map(a => a.name));
      const inserts = newAchievements.map((a) => ({
        user_id: userId,
        achievement_id: a.id,
        unlocked_at: new Date().toISOString(),
      }));

      const { error: insertError } = await supabase
        .from('user_achievements')
        .insert(inserts);

      if (insertError) {
        console.error('Error inserting new achievements:', insertError);
      } else {
          console.log(`Unlocked ${newAchievements.length} achievements for user ${userId}`);
      }
    } else {
        console.log(`[Achievement] No new achievements unlocked.`);
    }

    return newAchievements;
  } catch (error) {
    console.error('Unexpected error in triggerAchievementCheck:', error);
    return [];
  }
}
