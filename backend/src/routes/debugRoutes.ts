/**
 * Debug routes
 * Used for debugging and viewing Supabase status
 */

import { Router } from 'express';

const router = Router();

// Lazy load supabase to avoid initialization errors
let supabase: any = null;
function getSupabase() {
    if (!supabase) {
        try {
            supabase = require('../db/supabase').supabase;
        } catch (error: any) {
            console.error('Failed to load Supabase:', error.message);
            throw error;
        }
    }
    return supabase;
}

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
        const supabaseClient = getSupabase();
        const { data, error, count } = await supabaseClient
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
        res.status(500).json({ 
            error: { 
                message: 'Internal server error',
                details: error.message
            } 
        });
    }
});

/**
 * GET /api/debug/test-connection
 * Test Supabase connection
 */
router.get('/test-connection', async (_req, res) => {
    try {
        const supabaseClient = getSupabase();
        // Test basic connection
        const { data, error } = await supabaseClient
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
        console.error('test-connection error:', error);
        res.status(500).json({
            connected: false,
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

/**
 * GET /api/debug/env-check
 * Check environment variables (without exposing sensitive data)
 * This endpoint doesn't require Supabase to work
 */
router.get('/env-check', async (_req, res) => {
    try {
        const envCheck = {
            SUPABASE_URL: process.env.SUPABASE_URL ? '✓ Set' : '✗ Missing',
            SUPABASE_KEY: process.env.SUPABASE_KEY ? '✓ Set' : '✗ Missing',
            SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing',
            NODE_ENV: process.env.NODE_ENV || 'not set',
            VERCEL: process.env.VERCEL ? '✓ Running on Vercel' : '✗ Not Vercel',
            // Show partial URL for debugging (first 30 chars)
            SUPABASE_URL_PREVIEW: process.env.SUPABASE_URL 
                ? process.env.SUPABASE_URL.substring(0, 30) + '...' 
                : 'N/A'
        };

        const allSet = envCheck.SUPABASE_URL.includes('✓') && 
                      (envCheck.SUPABASE_KEY.includes('✓') || envCheck.SUPABASE_ANON_KEY.includes('✓'));

        res.json({
            status: allSet ? 'ok' : 'error',
            environment: envCheck,
            message: allSet 
                ? 'All required environment variables are set' 
                : 'Missing required environment variables',
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('env-check error:', error);
        res.status(500).json({
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

/**
 * GET /api/debug/test-register
 * Test registration endpoint with mock data
 */
router.post('/test-register', async (req, res) => {
    try {
        const supabaseClient = getSupabase();
        const testEmail = `test-${Date.now()}@example.com`;
        const testPassword = 'Test123456!';
        
        console.log('🧪 Testing registration with:', { email: testEmail });
        
        // Test Supabase Auth signup
        const { data: authData, error: authError } = await supabaseClient.auth.signUp({
            email: testEmail,
            password: testPassword
        });

        if (authError) {
            return res.status(400).json({
                success: false,
                step: 'auth_signup',
                error: {
                    message: authError.message,
                    status: authError.status,
                    name: authError.name
                }
            });
        }

        if (!authData.user) {
            return res.status(400).json({
                success: false,
                step: 'auth_signup',
                error: { message: 'No user data returned' }
            });
        }

        // Test inserting into users table
        const { data: userData, error: userError } = await supabaseClient
            .from('users')
            .insert([{
                id: authData.user.id,
                username: testEmail.split('@')[0],
                display_name: testEmail.split('@')[0]
            }])
            .select()
            .single();

        if (userError) {
            return res.status(400).json({
                success: false,
                step: 'user_insert',
                error: {
                    message: userError.message,
                    code: userError.code,
                    details: userError.details,
                    hint: userError.hint
                },
                authUserCreated: true,
                userId: authData.user.id
            });
        }

        res.json({
            success: true,
            message: 'Registration test successful',
            user: userData
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: {
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            }
        });
    }
});

export default router;

