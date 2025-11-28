import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { triggerAchievementCheck } from '../services/achievementService';

const router = Router();

router.post('/check', requireAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { event } = req.body;

    console.log(`[Achievement] Check requested for user ${userId}, event:`, event);

    const newAchievements = await triggerAchievementCheck(userId, event);

    console.log(`[Achievement] Unlocked ${newAchievements.length} achievements`);

    res.json({ newAchievements });
  } catch (error) {
    console.error('Error checking achievements:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
