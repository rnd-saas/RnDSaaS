/**
 * 调试路由
 * 用于调试和查看 Supabase 状态
 */

import { Router } from 'express';
import { supabase } from '../db/supabase';

const router = Router();

/**
 * GET /api/debug/auth-users
 * 查看 Supabase Auth 中的用户（仅用于调试）
 */
router.get('/auth-users', async (_req, res) => {
    try {
        // 注意：这需要管理员权限，通常不能直接查询 auth.users
        // 这里只是示例，实际应该通过 Supabase Dashboard 查看
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
 * 查看 public.users 表中的用户
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
 * 测试 Supabase 连接
 */
router.get('/test-connection', async (_req, res) => {
    try {
        // 测试基本连接
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

