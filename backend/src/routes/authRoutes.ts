/**
 * Authentication routes
 * Handles user authentication operations (login, register, logout)
 */

import { Router } from 'express';
import { supabase } from '../db/supabase';

const router = Router();

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

        // Authenticate user using Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

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
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (userError || !userData) {
            // Create a record in users table if it doesn't exist
            const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert([{
                    id: authData.user.id,
                    username: authData.user.email?.split('@')[0] || 'user',
                    display_name: authData.user.user_metadata?.display_name || authData.user.email || 'User'
                }])
                .select()
                .single();

            if (createError || !newUser) {
                return res.status(500).json({ 
                    error: { message: 'Failed to create user profile' } 
                });
            }

            return res.json({
                user: newUser,
                token: authData.session?.access_token,
                message: 'Login successful'
            });
        }

        res.json({
            user: userData,
            token: authData.session?.access_token,
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
        console.log('📝 Registration request received');
        const { email, password, username, display_name } = req.body;

        if (!email || !password) {
            console.log('❌ Missing email or password');
            return res.status(400).json({ 
                error: { message: 'Email and password are required' } 
            });
        }

        console.log('🔐 Attempting to create user with Supabase Auth...');
        // Create user using Supabase Auth
        // Note: If email confirmation is enabled in Supabase, users need to verify their email before logging in
        const { data: authData, error: authError } = await supabase.auth.signUp({
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

        console.log('✅ User created in Supabase Auth:', authData.user.id);

        // Create user record in users table
        console.log('📊 Creating user profile in database...');
        const { data: userData, error: userError } = await supabase
            .from('users')
            .insert([{
                id: authData.user.id,
                username: username || authData.user.email?.split('@')[0] || 'user',
                display_name: display_name || authData.user.email?.split('@')[0] || 'User'
            }])
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
                message: 'Registration successful (profile creation pending)'
            });
        }

        console.log('✅ User profile created successfully');

        // Check if email confirmation is needed
        const needsEmailConfirmation = !authData.session && authData.user && !authData.user.email_confirmed_at;
        
        res.status(201).json({
            user: userData,
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
            await supabase.auth.signOut();
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
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single();

        if (userError || !userData) {
            return res.status(404).json({ 
                error: { message: 'User not found' } 
            });
        }

        res.json(userData);

    } catch (error: any) {
        console.error('Get current user error:', error);
        res.status(500).json({ 
            error: { message: 'Internal server error' } 
        });
    }
});

export default router;

