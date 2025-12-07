/**
 * Authentication routes
 * Handles user authentication operations (login, register, logout)
 */

import { Router } from 'express';
import { supabase, supabaseAuth } from '../db/supabase';
import { requireAuth } from '../middleware/requireAuth';
import withTimeout from '../utils/withTimeout';

const router = Router();

async function generateUniqueReferralCode() {
    for (let i = 0; i < 5; i++) {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const { data } = await supabase
            .from('users')
            .select('id')
            .eq('referral_code', code)
            .single();
        
        if (!data) return code;
    }
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/**
 * POST /api/auth/login
 * User login
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                error: { message: 'Email and password are required' } 
            });
        }

        let authData: any = null;
        let authError: any = null;
        try {
            const result = await withTimeout(
                new Promise<any>(async (resolve, reject) => {
                    try {
                        const r = await supabaseAuth.auth.signInWithPassword({ email, password });
                        resolve(r);
                    } catch (e) {
                        reject(e);
                    }
                }),
                8000
            );
            authData = result.data;
            authError = result.error;
        } catch (err: any) {
            console.error('[auth:login] signInWithPassword error or timeout', err?.message || err);
            return res.status(502).json({ error: { message: 'Authentication upstream failed or timed out' } });
        }

        if (authError) {
            console.error('Login auth error:', authError);
            // Check if email is not confirmed
            if (authError.message?.includes('Email not confirmed') || authError.message?.includes('email_not_confirmed')) {
                return res.status(401).json({ 
                    error: { 
                        message: 'Please verify your email before logging in. Check your inbox for a confirmation email.',
                        code: 'EMAIL_NOT_CONFIRMED'
                    } 
                });
            }
            return res.status(401).json({ 
                error: { 
                    message: authError.message || 'Invalid credentials',
                    code: authError.status?.toString()
                } 
            });
        }

        if (!authData.user) {
            return res.status(401).json({ 
                error: { message: 'Authentication failed' } 
            });
        }

        const session = authData.session;

        // Check if user email is verified
        if (!authData.user.email_confirmed_at && authData.user.email_confirmed_at === null) {
            return res.status(401).json({ 
                error: { 
                    message: 'Please verify your email before logging in. Check your inbox for a confirmation email.',
                    code: 'EMAIL_NOT_CONFIRMED'
                } 
            });
        }

        // Get user details from users table
        let userData: any = null;
        let userError: any = null;
        try {
            const result = await withTimeout(
                new Promise<any>(async (resolve, reject) => {
                    try {
                        const r = await supabase.from('users').select('*').eq('id', authData.user.id).single();
                        resolve(r);
                    } catch (e) {
                        reject(e);
                    }
                }),
                6000
            );
            userData = result.data;
            userError = result.error;
        } catch (err: any) {
            console.error('[auth:login] users table query error or timeout', err?.message || err);
            // fallback to creating a user record below if needed
            userData = null;
            userError = { message: 'users query failed or timed out' };
        }

        // Double check: Ensure user has a referral code
        if (userData && !userData.referral_code) {
            try {
                const referralCode = await generateUniqueReferralCode();
                const { data: updatedUser, error: updateError } = await supabase
                    .from('users')
                    .update({ referral_code: referralCode })
                    .eq('id', userData.id)
                    .select()
                    .single();
                
                if (!updateError && updatedUser) {
                    console.log(`[auth:login] Generated missing referral code for user ${userData.id}`);
                    userData = updatedUser;
                } else {
                    console.error('[auth:login] Failed to generate missing referral code', updateError);
                }
            } catch (err) {
                console.error('[auth:login] Error generating missing referral code', err);
            }
        }

        if (userError || !userData) {
            // Create a record in users table if it doesn't exist
            let newUser: any = null;
            let createError: any = null;
            try {
                const result = await withTimeout(
                    new Promise<any>(async (resolve, reject) => {
                        try {
                            const referralCode = await generateUniqueReferralCode();
                            const r = await supabase.from('users').insert([{
                                id: authData.user.id,
                                username: authData.user.email?.split('@')[0] || 'user',
                                display_name: authData.user.user_metadata?.display_name || authData.user.email || 'User',
                                referral_code: referralCode
                            }]).select().single();
                            resolve(r);
                        } catch (e) {
                            reject(e);
                        }
                    }),
                    6000
                );
                newUser = result.data;
                createError = result.error;
            } catch (err: any) {
                console.error('[auth:login] create users record error or timeout', err?.message || err);
                createError = { message: 'create users failed or timed out' };
            }

            if (createError || !newUser) {
                console.error('[auth:login] failed to create fallback user record', createError);
                return res.status(500).json({ 
                    error: { message: 'Failed to create user profile' } 
                });
            }

            return res.json({
                user: newUser,
                token: session?.access_token,
                refreshToken: session?.refresh_token,
                expiresAt: session?.expires_at ?? null,
                message: 'Login successful'
            });
        }

        res.json({
            user: userData,
            token: session?.access_token,
            refreshToken: session?.refresh_token,
            expiresAt: session?.expires_at ?? null,
            message: 'Login successful'
        });

    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({ 
            error: { message: 'Internal server error' } 
        });
    }
});

/**
 * POST /api/auth/register
 * User registration
 */
router.post('/register', async (req, res) => {
    try {
        const { email, password, username, display_name } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                error: { message: 'Email and password are required' } 
            });
        }

        // Create user using Supabase Auth
        // Note: If email confirmation is enabled in Supabase, users need to verify their email before logging in
        const { data: authData, error: authError } = await supabaseAuth.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username || email.split('@')[0],
                    display_name: display_name || email.split('@')[0]
                },
                // Set emailRedirectTo if email verification is not required
                // emailRedirectTo: 'http://localhost:5173/login'
            }
        });

        if (authError) {
            console.error('❌ Supabase Auth error:', {
                message: authError.message,
                status: authError.status,
                name: authError.name
            });
            return res.status(400).json({ 
                error: { 
                    message: authError.message || 'Registration failed',
                    code: authError.status?.toString()
                } 
            });
        }

        if (!authData.user) {
            console.error('❌ No user data returned from Supabase Auth');
            return res.status(400).json({ 
                error: { message: 'Failed to create user' } 
            });
        }

        const session = authData.session;

        // Update user record in users table (created by trigger)
        const referralCode = await generateUniqueReferralCode();
        const { data: userData, error: userError } = await supabase
            .from('users')
            .update({
                username: username || authData.user.email?.split('@')[0] || 'user',
                display_name: display_name || authData.user.email?.split('@')[0] || 'User',
                referral_code: referralCode
            })
            .eq('id', authData.user.id)
            .select()
            .single();

        if (userError) {
            console.error('❌ Error creating user profile:', {
                message: userError.message,
                code: userError.code,
                details: userError.details,
                hint: userError.hint
            });
            // User is already created in auth.users even if profile creation fails
            return res.status(201).json({
                user: {
                    id: authData.user.id,
                    username: username || authData.user.email?.split('@')[0] || 'user',
                    display_name: display_name || authData.user.email?.split('@')[0] || 'User',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                token: session?.access_token,
                refreshToken: session?.refresh_token,
                expiresAt: session?.expires_at ?? null,
                message: 'Registration successful (profile creation pending)'
            });
        }

        // Check if email confirmation is needed
        const needsEmailConfirmation = !authData.session && authData.user && !authData.user.email_confirmed_at;
        
        res.status(201).json({
            user: userData,
            token: session?.access_token,
            refreshToken: session?.refresh_token,
            expiresAt: session?.expires_at ?? null,
            message: needsEmailConfirmation 
                ? 'Registration successful! Please check your email to verify your account before logging in.'
                : 'Registration successful',
            needsEmailConfirmation
        });

    } catch (error: any) {
        console.error('❌ Registration error:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        res.status(500).json({ 
            error: { 
                message: 'Internal server error',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            } 
        });
    }
});

/**
 * POST /api/auth/logout
 * User logout
 */
router.post('/logout', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.replace('Bearer ', '');

        if (token) {
            await supabaseAuth.auth.signOut();
        }

        res.json({ message: 'Logout successful' });
    } catch (error: any) {
        console.error('Logout error:', error);
        res.status(500).json({ 
            error: { message: 'Internal server error' } 
        });
    }
});

/**
 * GET /api/auth/me
 * Get current logged-in user information
 */
router.get('/me', async (req, res) => {
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

        // Get user details from users table
        let { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single();

        if (userError || !userData) {
            return res.status(404).json({ 
                error: { message: 'User not found' } 
            });
        }

        // Ensure referral code exists
        if (!userData.referral_code) {
            try {
                const referralCode = await generateUniqueReferralCode();
                const { data: updatedUser } = await supabase
                    .from('users')
                    .update({ referral_code: referralCode })
                    .eq('id', userData.id)
                    .select()
                    .single();
                
                if (updatedUser) {
                    userData = updatedUser;
                }
            } catch (err) {
                console.error('[auth:me] Error generating missing referral code', err);
            }
        }

        res.json(userData);

    } catch (error: any) {
        console.error('Get current user error:', error);
        res.status(500).json({ 
            error: { message: 'Internal server error' } 
        });
    }
});

/**
 * DELETE /api/auth/account
 * Delete user account and all associated data
 */
router.delete('/account', requireAuth, async (req: any, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                error: { message: 'User not authenticated' }
            });
        }

        console.log(`🗑️ Starting account deletion for user: ${userId}`);

        // Delete all user-related data from database tables
        // Note: Order matters - delete child records first, then parent records

        // 1. Delete user_achievements
        const { error: achievementsError } = await supabase
            .from('user_achievements')
            .delete()
            .eq('user_id', userId);

        if (achievementsError) {
            console.error('Error deleting user_achievements:', achievementsError);
            // Continue even if this fails
        }

        // 2. Delete workouts
        const { error: workoutsError } = await supabase
            .from('workouts')
            .delete()
            .eq('user_id', userId);

        if (workoutsError) {
            console.error('Error deleting workouts:', workoutsError);
            // Continue even if this fails
        }

        // 3. Delete user_settings
        const { error: settingsError } = await supabase
            .from('user_settings')
            .delete()
            .eq('user_id', userId);

        if (settingsError) {
            console.error('Error deleting user_settings:', settingsError);
            // Continue even if this fails
        }

        // 4. Delete user_info
        const { error: userInfoError } = await supabase
            .from('user_info')
            .delete()
            .eq('user_id', userId);

        if (userInfoError) {
            console.error('Error deleting user_info:', userInfoError);
            // Continue even if this fails
        }

        // 5. Delete users table record
        const { error: usersError } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);

        if (usersError) {
            console.error('Error deleting users record:', usersError);
            // Continue even if this fails
        }

        // 6. Delete from Supabase Auth (requires service role key)
        // This must be done with admin privileges
        const { error: authError } = await supabase.auth.admin.deleteUser(userId);

        if (authError) {
            console.error('Error deleting auth user:', authError);
            // If we can't delete from auth, still return success for database cleanup
            // The user won't be able to log in anyway if database records are deleted
            return res.status(500).json({
                error: { 
                    message: 'Account data deleted but failed to delete authentication record. Please contact support.',
                    details: process.env.NODE_ENV === 'development' ? authError.message : undefined
                }
            });
        }

        console.log(`✅ Account deletion completed for user: ${userId}`);

        res.json({ 
            message: 'Account deleted successfully' 
        });

    } catch (error: any) {
        console.error('Delete account error:', error);
        res.status(500).json({ 
            error: { message: 'Internal server error' } 
        });
    }
});

export default router;

