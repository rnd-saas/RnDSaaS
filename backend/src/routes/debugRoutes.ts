/**
 * Debug routes
 * Used for debugging and viewing Supabase status
 */

import { Router } from 'express';
import { supabase } from '../db/supabase';

const router = Router();

/**
 * GET /api/debug/auth-users
 * View users in Supabase Auth (for debugging only)
 */
router.get('/auth-users', async (_req, res) => {
    try {
        // Note: This requires admin permissions, usually cannot directly query auth.users
        // This is just an example, should use Supabase Dashboard in practice
        res.json({ 
            message: 'Use Supabase Dashboard to view auth.users',
            note: 'Go to Authentication > Users in Supabase Dashboard'
        });
    } catch (error: any) {
        console.error('Debug error:', error);
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
});

/**
 * GET /api/debug/public-users
 * View users in public.users table
 */
router.get('/public-users', async (_req, res) => {
    try {
        const { data, error, count } = await supabase
            .from('users')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(400).json({ 
                error: { message: error.message },
                details: error
            });
        }

        res.json({
            count: count || 0,
            users: data || [],
            message: 'These are users from the public.users table'
        });
    } catch (error: any) {
        console.error('Debug error:', error);
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
});

/**
 * GET /api/debug/test-connection
 * Test Supabase connection
 */
router.get('/test-connection', async (_req, res) => {
    try {
        // Test basic connection
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);

        if (error) {
            return res.status(400).json({
                connected: false,
                error: error.message,
                code: error.code
            });
        }

        res.json({
            connected: true,
            message: 'Supabase connection is working',
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        res.status(500).json({
            connected: false,
            error: error.message
        });
    }
});

export default router;

