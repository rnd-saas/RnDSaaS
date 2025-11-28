/**
 * Settings routes
 * Handles user settings CRUD operations
 */

import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../db/supabase';

const router = Router();

/**
 * Create a Supabase client with user's token to pass RLS policies
 */
function createUserClient(token: string) {
    const url = process.env.SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;
    
    if (!url || !anonKey) {
        throw new Error('Missing Supabase configuration');
    }
    
    // Create client with user's token - this will pass RLS policies
    return createClient(url, anonKey, {
        global: {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    });
}

/**
 * Middleware to extract and verify user token
 */
const requireAuth = async (req: any, res: any, next: any) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ 
                error: { message: 'No token provided' } 
            });
        }

        // Verify token and get user information
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !authUser) {
            return res.status(401).json({ 
                error: { message: 'Invalid token' } 
            });
        }

        req.user = authUser;
        req.token = token;
        next();
    } catch (error: any) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ 
            error: { message: 'Internal server error' } 
        });
    }
};

/**
 * GET /api/settings
 * Get current user's settings
 */
router.get('/', requireAuth, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const token = req.token;
        
        // Create client with user's token to pass RLS
        const userClient = createUserClient(token);

        const { data, error } = await userClient
            .from('user_settings')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // Settings don't exist, return default values
                return res.json({
                    user_id: userId,
                    units: 'metric',
                    notifications_enabled: true,
                    weekly_review_day: 0,
                    streak_display: true,
                    goal_display: 'big',
                    trainer: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
            }
            return res.status(400).json({ error: { message: error.message } });
        }

        res.json(data);
    } catch (error: any) {
        console.error('Get settings error:', error);
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
});

/**
 * PUT /api/settings
 * Update current user's settings
 */
router.put('/', requireAuth, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const token = req.token;
        const { 
            units, 
            notifications_enabled, 
            weekly_review_day, 
            streak_display, 
            goal_display, 
            trainer 
        } = req.body;
        
        // Create client with user's token to pass RLS
        const userClient = createUserClient(token);

        // Validate units
        if (units && !['metric', 'imperial'].includes(units)) {
            return res.status(400).json({ 
                error: { message: 'Invalid units value. Must be "metric" or "imperial"' } 
            });
        }

        // Validate goal_display
        if (goal_display && !['big', 'small', 'both', 'none'].includes(goal_display)) {
            return res.status(400).json({ 
                error: { message: 'Invalid goal_display value' } 
            });
        }

        // Validate weekly_review_day
        if (weekly_review_day !== undefined && (weekly_review_day < 0 || weekly_review_day > 6)) {
            return res.status(400).json({ 
                error: { message: 'Invalid weekly_review_day. Must be between 0 and 6' } 
            });
        }

        // Validate trainer
        if (trainer !== undefined && (trainer < 0 || trainer > 1)) {
            return res.status(400).json({ 
                error: { message: 'Invalid trainer value. Must be 0 or 1' } 
            });
        }

        // Prepare update data
        const updateData: any = {
            updated_at: new Date().toISOString()
        };

        if (units !== undefined) updateData.units = units;
        if (notifications_enabled !== undefined) updateData.notifications_enabled = notifications_enabled;
        if (weekly_review_day !== undefined) updateData.weekly_review_day = weekly_review_day;
        if (streak_display !== undefined) updateData.streak_display = streak_display;
        if (goal_display !== undefined) updateData.goal_display = goal_display;
        if (trainer !== undefined) updateData.trainer = trainer;

        // Try to update existing settings
        const { data: existingData, error: checkError } = await userClient
            .from('user_settings')
            .select('user_id')
            .eq('user_id', userId)
            .single();

        let result;
        if (checkError && checkError.code === 'PGRST116') {
            // Settings don't exist, create them
            result = await userClient
                .from('user_settings')
                .insert([{
                    user_id: userId,
                    ...updateData
                }])
                .select()
                .single();
        } else {
            // Update existing settings
            result = await userClient
                .from('user_settings')
                .update(updateData)
                .eq('user_id', userId)
                .select()
                .single();
        }

        if (result.error) {
            return res.status(400).json({ error: { message: result.error.message } });
        }

        res.json(result.data);
    } catch (error: any) {
        console.error('Update settings error:', error);
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
});

export default router;

