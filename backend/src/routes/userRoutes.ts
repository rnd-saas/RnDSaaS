/**
 * 用户路由
 */

import { Router } from 'express';
import { supabase } from '../db/supabase';

const router = Router();

/**
 * GET /api/users
 * 获取所有用户
 */
router.get('/', async (_req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(400).json({ error: { message: error.message } });
        }

        res.json(data || []);
    } catch (error: any) {
        console.error('Get users error:', error);
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
});

/**
 * GET /api/users/:id
 * 根据 ID 获取用户
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ 
                    error: { message: 'User not found' } 
                });
            }
            return res.status(400).json({ error: { message: error.message } });
        }

        if (!data) {
            return res.status(404).json({ 
                error: { message: 'User not found' } 
            });
        }

        res.json(data);
    } catch (error: any) {
        console.error('Get user error:', error);
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
});

/**
 * POST /api/users
 * 创建新用户
 */
router.post('/', async (req, res) => {
    try {
        const { id, username, display_name } = req.body;

        if (!id || !username || !display_name) {
            return res.status(400).json({ 
                error: { message: 'id, username, and display_name are required' } 
            });
        }

        const { data, error } = await supabase
            .from('users')
            .insert([{ id, username, display_name }])
            .select()
            .single();

        if (error) {
            return res.status(400).json({ error: { message: error.message } });
        }

        res.status(201).json(data);
    } catch (error: any) {
        console.error('Create user error:', error);
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
});

export default router;

