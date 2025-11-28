import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { achievementService } from '../api/achievementService';
import type { AchievementEvent, Achievement } from '../types/achievements';

export function useAchievements() {
  const [isChecking, setIsChecking] = useState(false);

  const triggerCheck = useCallback(async (event?: AchievementEvent) => {
    setIsChecking(true);
    try {
      const response = await achievementService.checkAchievements(event);
      const newAchievements = response.newAchievements;

      if (newAchievements && newAchievements.length > 0) {
        newAchievements.forEach((achievement: Achievement) => {
          toast.success(`Achievement Unlocked: ${achievement.name}`, {
            description: achievement.description,
            icon: achievement.icon, // Assuming icon is an emoji or string
            duration: 5000,
          });
        });
      }
      return newAchievements;
    } catch (error) {
      console.error('Failed to check achievements:', error);
      // Optionally handle error silently or show a toast
    } finally {
      setIsChecking(false);
    }
  }, []);

  return {
    triggerCheck,
    isChecking,
  };
}
