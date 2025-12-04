import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { workoutService } from '../services/workoutService';
import { aiFeedbackService } from '../services/aiFeedbackService';
import { supabase } from '../db/supabase';

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

// GET /api/workouts/week - Get workout history for the current week
router.get('/week', requireAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;

    // Calculate start of week (Monday)
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - daysToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const { data: workouts, error } = await supabase
      .from('workouts')
      .select('id, started_at, ended_at, duration_s')
      .eq('user_id', userId)
      .gte('started_at', startOfWeek.toISOString())
      .lte('started_at', endOfWeek.toISOString())
      .order('started_at', { ascending: true });

    if (error) {
      console.error('Failed to fetch week workouts:', error);
      return res.status(500).json({ error: 'Failed to load workouts' });
    }

    const workoutData = (workouts || []).map((w) => {
      // Use duration_s if available, otherwise calculate from started_at and ended_at
      let duration = w.duration_s || 0;
      if (!duration && w.ended_at && w.started_at) {
        duration = Math.round((new Date(w.ended_at).getTime() - new Date(w.started_at).getTime()) / 1000 / 60);
      }

      return {
        date: w.started_at,
        length: duration
      };
    });

    res.json({ workouts: workoutData });
  } catch (error: any) {
    console.error('Error fetching week workouts:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
