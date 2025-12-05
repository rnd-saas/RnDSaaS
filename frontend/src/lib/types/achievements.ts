export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  criteria: any;
  secret: boolean;
  created_at: string;
  updated_at: string;
}

export interface AchievementEvent {
  type: string;
  payload?: any;
}

export interface CheckAchievementsResponse {
  newAchievements: Achievement[];
}
