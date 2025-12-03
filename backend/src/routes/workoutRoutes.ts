import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { workoutService } from '../services/workoutService';
import { aiFeedbackService } from '../services/aiFeedbackService';

const router = Router();

router.get('/planned', requireAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const dateStr = req.query.date as string;
    
    if (!dateStr) {
      return res.status(400).json({ error: 'Date parameter is required' });
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const plans = await workoutService.getWorkoutPlanForDate(userId, date);
    
    // If multiple plans match, we might want to return the most relevant one.
    // For now, return the first one or null if none.
    const plan = plans && plans.length > 0 ? plans[0] : null;

    // We need to format the response to match what the frontend expects.
    // The frontend expects `PlannedWorkout` type.
    // We might need to fetch exercises for the plan as well.
    // The current service only fetches the plan.
    
    // Let's update the service to fetch exercises too if needed, 
    // or just return the plan and let the frontend handle it.
    // But the frontend expects a full object with exercises.
    
    res.json(plan);
  } catch (error: any) {
    console.error('Error fetching planned workout:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/complete', requireAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const workoutData = req.body;
    
    const result = await workoutService.saveCompletedWorkout(userId, workoutData);
    
    res.json(result);
  } catch (error: any) {
    console.error('Error saving completed workout:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/evaluation', requireAuth, async (req: any, res) => {
  try {
    const workoutId = req.params.id;
    const evaluationData = req.body;
    
    const result = await workoutService.updateWorkoutEvaluation(workoutId, evaluationData);
    
    res.json(result);
  } catch (error: any) {
    console.error('Error updating workout evaluation:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/ai-feedback', requireAuth, async (req: any, res) => {
  try {
    const workoutId = req.params.id;
    const feedback = await aiFeedbackService.generateFeedback(workoutId);
    res.json({ feedback });
  } catch (error: any) {
    console.error('Error generating AI feedback:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
