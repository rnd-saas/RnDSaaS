import { Router } from 'express';
import type { Request } from 'express';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../db/supabase';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

type AuthedRequest = Request & { user?: User };

// GET /api/progress/data - Get personal data history (weight, BMI, etc.)
router.get('/data', requireAuth, async (req: AuthedRequest, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: { message: 'Unauthenticated' } });
        }

        const { type } = req.query; // 'weight' or 'bmi'

        if (!type || (type !== 'weight' && type !== 'bmi')) {
            return res.status(400).json({ error: { message: 'Invalid type. Must be "weight" or "bmi".' } });
        }

        // Get historical data from user_progress_history table
        const { data: historyData, error: historyError } = await supabase
            .from('user_progress_history')
            .select('value, recorded_at')
            .eq('user_id', userId)
            .eq('data_type', type)
            .order('recorded_at', { ascending: true });

        if (historyError) {
            console.error('Failed to fetch progress data:', historyError);
            return res.status(500).json({ error: { message: 'Failed to load data' } });
        }

        // Convert to expected format
        const data: Array<{ label: string; value: number; date: string }> = (historyData || []).map((item) => ({
            label: type,
            value: Number(item.value),
            date: item.recorded_at
        }));

        res.json({ data });
    } catch (error: any) {
        console.error('Error fetching progress data:', error);
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
});

// POST /api/progress/data - Add a new data point (weight or BMI)
router.post('/data', requireAuth, async (req: AuthedRequest, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: { message: 'Unauthenticated' } });
        }

        const { type, value } = req.body; // type: 'weight' or 'bmi', value: number

        if (!type || value === undefined) {
            return res.status(400).json({ error: { message: 'Missing type or value' } });
        }

        if (type === 'weight') {
            // Get current user info to calculate BMI
            const { data: currentUserInfo } = await supabase
                .from('user_info')
                .select('height_cm')
                .eq('user_id', userId)
                .maybeSingle();

            let bmi = null;
            const recordedAt = new Date().toISOString();

            // Calculate BMI if height is available
            if (currentUserInfo?.height_cm) {
                const heightInMeters = Number(currentUserInfo.height_cm) / 100;
                bmi = value / (heightInMeters * heightInMeters);
            }

            // Update user_info with new weight and calculated BMI
            const { error: updateError } = await supabase
                .from('user_info')
                .upsert({
                    user_id: userId,
                    weight_kg: value,
                    bmi: bmi,
                    updated_at: recordedAt
                }, { onConflict: 'user_id' });

            if (updateError) {
                console.error('Failed to update weight:', updateError);
                return res.status(500).json({ error: { message: 'Failed to save weight' } });
            }

            // Store weight in history table
            const { error: weightHistoryError } = await supabase
                .from('user_progress_history')
                .insert({
                    user_id: userId,
                    data_type: 'weight',
                    value: value,
                    recorded_at: recordedAt
                });

            if (weightHistoryError) {
                console.error('Failed to save weight history:', weightHistoryError);
                // Continue even if history save fails
            }

            // Store BMI in history table if calculated
            if (bmi !== null) {
                const { error: bmiHistoryError } = await supabase
                    .from('user_progress_history')
                    .insert({
                        user_id: userId,
                        data_type: 'bmi',
                        value: bmi,
                        recorded_at: recordedAt
                    });

                if (bmiHistoryError) {
                    console.error('Failed to save BMI history:', bmiHistoryError);
                    // Continue even if BMI history save fails
                }
            }

            res.json({
                label: 'weight',
                value: value,
                date: recordedAt,
                bmi: bmi // Also return calculated BMI
            });
        } else if (type === 'bmi') {
            // BMI should not be manually entered - it's calculated from weight and height
            // If user tries to enter BMI, we'll calculate what weight would give that BMI
            // But this is not recommended - BMI should be auto-calculated
            return res.status(400).json({ 
                error: { 
                    message: 'BMI cannot be manually entered. It is automatically calculated from your weight and height. Please update your weight instead.' 
                } 
            });
        } else {
            return res.status(400).json({ error: { message: 'Invalid type. Only "weight" is supported.' } });
        }
    } catch (error: any) {
        console.error('Error saving progress data:', error);
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
});

export default router;

