export interface UserStatsView {
  workout_count: number;
  mood_log_count: number;
  exercise_complete_count: number;
  friend_count: number;
  max_weight_lifted: number;
  current_workout_streak: number;
}

export type AchievementType = 
  | 'workout_count'
  | 'mood_log_count'
  | 'exercise_complete_count'
  | 'streak_days'
  | 'mood_log'
  | 'workout_started_with_mood'
  | 'app_open_count'
  | 'onboarding_complete';

export type AchievementCriteria = 
  | { type: 'workout_count'; count: number }
  | { type: 'mood_log_count'; count: number }
  | { type: 'exercise_complete_count'; count: number }
  | { type: 'streak_days'; days: number }
  | { type: 'mood_log'; mood: string }
  | { type: 'workout_started_with_mood'; mood: string }
  | { type: 'app_open_count'; count: number }
  | { type: 'onboarding_complete' };

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  criteria: AchievementCriteria;
  secret: boolean;
  created_at: string;
  updated_at: string;
}

export interface AchievementEvent {
  type: string;
  payload?: any;
}
