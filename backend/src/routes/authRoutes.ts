/**
 * 认证路由
 */

import { Router } from 'express';
import { supabase } from '../db/supabase';

const router = Router();

/**
 * POST /api/auth/login
 * 用户登录
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                error: { message: 'Email and password are required' } 
            });
        }

        // 使用 Supabase Auth 进行认证
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            console.error('Login auth error:', authError);
            // 检查是否是邮箱未验证
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

        // 检查用户邮箱是否已验证
        if (!authData.user.email_confirmed_at && authData.user.email_confirmed_at === null) {
            return res.status(401).json({ 
                error: { 
                    message: 'Please verify your email before logging in. Check your inbox for a confirmation email.',
                    code: 'EMAIL_NOT_CONFIRMED'
                } 
            });
        }

        // 从 users 表获取用户详细信息
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (userError || !userData) {
            // 如果 users 表中没有记录，创建一个
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
 * 用户注册
 */
router.post('/register', async (req, res) => {
    try {
        const { email, password, username, display_name } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                error: { message: 'Email and password are required' } 
            });
        }

        // 使用 Supabase Auth 创建用户
        // 注意：如果 Supabase 启用了邮箱验证，用户需要验证邮箱后才能登录
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username || email.split('@')[0],
                    display_name: display_name || email.split('@')[0]
                },
                // 如果不需要邮箱验证，可以设置 emailRedirectTo
                // emailRedirectTo: 'http://localhost:5173/login'
            }
        });

        if (authError) {
            return res.status(400).json({ 
                error: { 
                    message: authError.message || 'Registration failed',
                    code: authError.status?.toString()
                } 
            });
        }

        if (!authData.user) {
            return res.status(400).json({ 
                error: { message: 'Failed to create user' } 
            });
        }

        // 在 users 表中创建用户记录
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
            console.error('Error creating user profile:', userError);
            // 即使创建 profile 失败，用户已经在 auth.users 中创建了
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

        // 检查是否需要邮箱验证
        const needsEmailConfirmation = !authData.session && authData.user && !authData.user.email_confirmed_at;
        
        res.status(201).json({
            user: userData,
            message: needsEmailConfirmation 
                ? 'Registration successful! Please check your email to verify your account before logging in.'
                : 'Registration successful',
            needsEmailConfirmation
        });

    } catch (error: any) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            error: { message: 'Internal server error' } 
        });
    }
});

/**
 * POST /api/auth/logout
 * 用户登出
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
 * 获取当前登录用户信息
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

        // 验证 token 并获取用户信息
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !authUser) {
            return res.status(401).json({ 
                error: { message: 'Invalid token' } 
            });
        }

        // 从 users 表获取用户详细信息
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

