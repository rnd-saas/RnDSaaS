import { Achievement, AchievementEvent, UserStatsView } from '../types/achievements';
import { getMoodInt } from '../utils/achievementUtils';


// problems: 
// 1. log in streaks, how?
// 2. app_open_count, how to track in stats?
// 3. mutiple mood formats in events and criteria for mood_log and workout_started_with_mood
// 4. onboarding_complete: just trigger on event, no stats needed

export function checkAchievements(
  allAchievements: Achievement[],
  unlockedIds: Set<string>,
  currentStats: UserStatsView,
  currentEvent?: AchievementEvent
): Achievement[] {
  const newAchievements: Achievement[] = [];

  for (const achievement of allAchievements) {
    if (unlockedIds.has(achievement.id)) {
      continue;
    }

    const criteria = achievement.criteria;
    let unlocked = false;

    switch (criteria.type) {
      case 'workout_count':
        if (currentStats.workout_count >= criteria.count) {
          unlocked = true;
        }
        break;
      case 'mood_log_count':
        if (currentStats.mood_log_count >= criteria.count) {
          unlocked = true;
        }
        break;
      case 'exercise_complete_count':
        if (currentStats.exercise_complete_count >= criteria.count) {
          unlocked = true;
        }
        break;
      case 'streak_days': // no log in streaks
        if (currentStats.current_workout_streak >= criteria.days) {
          unlocked = true;
        }
        break;
      case 'mood_log':
        if (
          currentEvent?.type === 'mood_log' &&
          currentEvent.payload?.mood !== undefined
        ) {
          const targetMoodInt = getMoodInt(criteria.mood);
          // Compare if event mood (int) matches target mood (int)
          // Or if event mood is string, compare strings
          if (typeof currentEvent.payload.mood === 'number' && targetMoodInt !== undefined) {
             if (currentEvent.payload.mood === targetMoodInt) {
               unlocked = true;
             }
          } else if (String(currentEvent.payload.mood) === criteria.mood) {
             unlocked = true;
          }
        }
        break;
      case 'workout_started_with_mood':
        if (
          currentEvent?.type === 'workout_started_with_mood' &&
          currentEvent.payload?.mood !== undefined
        ) {
           const targetMoodInt = getMoodInt(criteria.mood);
           if (typeof currentEvent.payload.mood === 'number' && targetMoodInt !== undefined) {
             if (currentEvent.payload.mood === targetMoodInt) {
               unlocked = true;
             }
           } else if (String(currentEvent.payload.mood) === criteria.mood) {
             unlocked = true;
           }
        }
        break;
      case 'app_open_count':
        // This might need a separate stat or event, assuming handled by event for now if not in stats
        // But user stats doesn't have app_open_count. 
        // If it's event based:
        if (currentEvent?.type === 'app_open_count') {
            // If criteria has count, we need a stat for it. 
            // Assuming for now we just trigger it if the event happens and we don't track count in stats view yet?
            // Or maybe we should assume the event payload has the current count?
            if (currentEvent.payload?.count >= criteria.count) {
                unlocked = true;
            }
        }
        break;
      case 'onboarding_complete':
        if (currentEvent?.type === 'onboarding_complete') {
          unlocked = true;
        }
        break;
    }

    if (unlocked) {
      newAchievements.push(achievement);
    }
  }

  return newAchievements;
}
