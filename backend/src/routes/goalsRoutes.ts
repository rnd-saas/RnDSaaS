import { Router } from 'express';
import type { Request } from 'express';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../db/supabase';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

type AuthedRequest = Request & { user?: User };

// GET /api/goals - Get all goals for the current user
router.get('/', requireAuth, async (req: AuthedRequest, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: { message: 'Unauthenticated' } });
        }

        const { data: goals, error } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Failed to fetch goals:', error);
            return res.status(500).json({ error: { message: 'Failed to load goals' } });
        }

        // Get current progress for each goal by calculating from actual data
        const goalsWithProgress = await Promise.all(
            (goals || []).map(async (goal) => {
                const currentValue = await calculateGoalProgress(userId, goal.goals || '');
                
                // Record progress in goal_progress table
                if (currentValue > 0) {
                    try {
                        const { error } = await supabase
                            .from('goal_progress')
                            .insert({
                                goal_id: goal.id,
                                current_value: currentValue,
                                recorded_at: new Date().toISOString()
                            });
                        
                        if (error) {
                            // Ignore errors (e.g., duplicate entries)
                            console.warn('Failed to record goal progress:', error);
                        }
                    } catch (err: any) {
                        // Ignore errors (e.g., duplicate entries)
                        console.warn('Failed to record goal progress:', err);
                    }
                }
                
                return {
                    id: goal.id,
                    label: goal.goals || '',
                    goalType: goal.goal_type || '',
                    value: currentValue,
                    target: goal.target_value || 0,
                    unit: goal.unit || '',
                    status: goal.status || 'active',
                    createdAt: goal.created_at
                };
            })
        );

        res.json({ goals: goalsWithProgress });
    } catch (error: any) {
        console.error('Error fetching goals:', error);
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
});

// POST /api/goals - Create a new goal
router.post('/', requireAuth, async (req: AuthedRequest, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: { message: 'Unauthenticated' } });
        }

        const { label, goalType, target, initialValue, unit } = req.body;

        if (!label || target === undefined) {
            return res.status(400).json({ error: { message: 'Missing required fields: label and target are required' } });
        }

        // goal_type is an enum in the database, but the enum values are unknown
        // Since we can't use arbitrary strings, we'll set goal_type to null
        // The goal label (in the 'goals' text field) will contain the goal type information
        const { data: newGoal, error } = await supabase
            .from('goals')
            .insert({
                user_id: userId,
                goals: label,
                goal_type: null, // Set to null since enum values are unknown and we can't use arbitrary strings
                target_value: target,
                initial_value: initialValue || 0,
                unit: unit || '',
                status: 'active'
            })
            .select()
            .single();

        if (error) {
            console.error('Failed to create goal:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            return res.status(500).json({ 
                error: { 
                    message: 'Failed to create goal',
                    details: error.message 
                } 
            });
        }

        res.status(201).json({
            id: newGoal.id,
            label: newGoal.goals || '',
            goalType: newGoal.goal_type || '',
            value: newGoal.initial_value || 0,
            target: newGoal.target_value || 0,
            unit: newGoal.unit || '',
            status: newGoal.status || 'active',
            createdAt: newGoal.created_at
        });
    } catch (error: any) {
        console.error('Error creating goal:', error);
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
});

// PUT /api/goals/:id - Update a goal (target value, etc.)
router.put('/:id', requireAuth, async (req: AuthedRequest, res) => {
    try {
        const userId = req.user?.id;
        const goalId = req.params.id;

        if (!userId) {
            return res.status(401).json({ error: { message: 'Unauthenticated' } });
        }

        const { target, status } = req.body;

        // Verify the goal belongs to the user
        const { data: goal, error: fetchError } = await supabase
            .from('goals')
            .select('id')
            .eq('id', goalId)
            .eq('user_id', userId)
            .single();

        if (fetchError || !goal) {
            return res.status(404).json({ error: { message: 'Goal not found' } });
        }

        // Build update object
        const updateData: any = {};
        if (target !== undefined) {
            updateData.target_value = target;
        }
        if (status !== undefined) {
            updateData.status = status;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: { message: 'No fields to update' } });
        }

        const { data: updatedGoal, error } = await supabase
            .from('goals')
            .update(updateData)
            .eq('id', goalId)
            .select()
            .single();

        if (error) {
            console.error('Failed to update goal:', error);
            return res.status(500).json({ error: { message: 'Failed to update goal' } });
        }

        // Calculate current progress
        const currentValue = await calculateGoalProgress(userId, updatedGoal.goals || '');

        res.json({
            id: updatedGoal.id,
            label: updatedGoal.goals || '',
            goalType: updatedGoal.goal_type || '',
            value: currentValue,
            target: updatedGoal.target_value || 0,
            unit: updatedGoal.unit || '',
            status: updatedGoal.status || 'active',
            createdAt: updatedGoal.created_at
        });
    } catch (error: any) {
        console.error('Error updating goal:', error);
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
});

// DELETE /api/goals/:id - Delete a goal
router.delete('/:id', requireAuth, async (req: AuthedRequest, res) => {
    try {
        const userId = req.user?.id;
        const goalId = req.params.id;

        if (!userId) {
            return res.status(401).json({ error: { message: 'Unauthenticated' } });
        }

        // Verify the goal belongs to the user
        const { data: goal, error: fetchError } = await supabase
            .from('goals')
            .select('id')
            .eq('id', goalId)
            .eq('user_id', userId)
            .single();

        if (fetchError || !goal) {
            return res.status(404).json({ error: { message: 'Goal not found' } });
        }

        // Delete goal progress first (due to foreign key constraint)
        await supabase
            .from('goal_progress')
            .delete()
            .eq('goal_id', goalId);

        // Delete the goal
        const { error } = await supabase
            .from('goals')
            .delete()
            .eq('id', goalId);

        if (error) {
            console.error('Failed to delete goal:', error);
            return res.status(500).json({ error: { message: 'Failed to delete goal' } });
        }

        res.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting goal:', error);
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
});

// Calculate current progress for a goal based on its type
async function calculateGoalProgress(userId: string, goalLabel: string): Promise<number> {
    try {
        // Normalize goal label for comparison
        const normalizedLabel = goalLabel.toLowerCase().trim();

        if (normalizedLabel.includes('workouts completed')) {
            // Count total workouts
            const { count, error } = await supabase
                .from('workouts')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId);
            
            if (error) {
                console.error('Error counting workouts:', error);
                return 0;
            }
            return count || 0;
        }

        if (normalizedLabel.includes('exercises discovered')) {
            // Count distinct workout plan types (plan_id) that the user has completed
            const { data: workouts, error: workoutsError } = await supabase
                .from('workouts')
                .select('plan_id')
                .eq('user_id', userId);
            
            if (workoutsError || !workouts) {
                console.error('Error fetching workouts:', workoutsError);
                return 0;
            }

            // Count distinct plan_id values (excluding null)
            const uniquePlans = new Set(workouts?.map(w => w.plan_id).filter(Boolean) || []);
            return uniquePlans.size;
        }

        if (normalizedLabel.includes('longest streak') || normalizedLabel.includes('streak')) {
            // Calculate streak from workouts
            const { data: workouts, error } = await supabase
                .from('workouts')
                .select('started_at')
                .eq('user_id', userId)
                .order('started_at', { ascending: false })
                .limit(100);

            if (error || !workouts) {
                console.error('Error fetching workouts for streak:', error);
                return 0;
            }

            const workoutDates = new Set<string>();
            workouts.forEach((workout) => {
                if (workout.started_at) {
                    const date = new Date(workout.started_at);
                    date.setHours(0, 0, 0, 0);
                    workoutDates.add(date.toISOString().slice(0, 10));
                }
            });

            return calculateStreak(workoutDates);
        }

        if (normalizedLabel.includes('moods logged')) {
            // Count total mood entries
            const { count, error } = await supabase
                .from('daily_mood')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId);
            
            if (error) {
                console.error('Error counting moods:', error);
                return 0;
            }
            return count || 0;
        }

        // Default: return 0 if goal type is not recognized
        return 0;
    } catch (error) {
        console.error('Error calculating goal progress:', error);
        return 0;
    }
}

// Calculate streak from workout dates (same logic as profileRoutes)
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

export default router;

