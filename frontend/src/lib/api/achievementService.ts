import { apiClient } from './client';
import type { AchievementEvent, CheckAchievementsResponse } from '../types/achievements';

export const achievementService = {
  checkAchievements: async (event?: AchievementEvent): Promise<CheckAchievementsResponse> => {
    return apiClient.post<CheckAchievementsResponse>('/api/achievements/check', { event });
  },
};
