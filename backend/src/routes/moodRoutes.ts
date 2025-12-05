import { Router } from 'express';
import type { Request } from 'express';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../db/supabase';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

type AuthedRequest = Request & { user?: User };

router.get('/today', requireAuth, async (req: AuthedRequest, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: { message: 'Unauthenticated' } });
        }

        const today = new Date().toISOString().slice(0, 10);
        const { data, error } = await supabase
            .from('daily_mood')
            .select('mood')
            .eq('user_id', userId)
            .eq('day', today)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') {
            console.error('Failed to fetch today mood:', error);
            return res.status(500).json({ error: { message: 'Failed to load mood' } });
        }

        return res.json({ mood: data?.mood ?? null });
    } catch (err: any) {
        console.error('Unexpected error reading today mood:', err);
        return res.status(500).json({ error: { message: 'Failed to load mood' } });
    }
});

router.post('/today', requireAuth, async (req: AuthedRequest, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: { message: 'Unauthenticated' } });
        }

        const mood = Number(req.body?.mood);
        if (!Number.isFinite(mood) || mood < 0 || mood > 4) {
            return res.status(400).json({ error: { message: 'Invalid mood value' } });
        }

        const today = new Date().toISOString().slice(0, 10);

        const { data: existing, error: fetchError } = await supabase
            .from('daily_mood')
            .select('id')
            .eq('user_id', userId)
            .eq('day', today)
            .maybeSingle();

        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Failed to check existing mood:', fetchError);
            return res.status(500).json({ error: { message: 'Failed to save mood' } });
        }

        let result;
        if (existing?.id) {
            result = await supabase
                .from('daily_mood')
                .update({ mood, updated_at: new Date().toISOString() })
                .eq('id', existing.id)
                .select('mood')
                .maybeSingle();
        } else {
            result = await supabase
                .from('daily_mood')
                .insert({
                    user_id: userId,
                    day: today,
                    mood,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .select('mood')
                .single();
        }

        if (result.error) {
            console.error('Failed to save today mood:', result.error);
            return res.status(500).json({ error: { message: 'Failed to save mood' } });
        }

        return res.json({ mood: result.data?.mood ?? mood });
    } catch (err: any) {
        console.error('Unexpected error saving today mood:', err);
        return res.status(500).json({ error: { message: 'Failed to save mood' } });
    }
});

// GET /api/mood/week - Get mood data for the current week
router.get('/week', requireAuth, async (req: AuthedRequest, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: { message: 'Unauthenticated' } });
        }

        // Calculate start of week (Monday)
        const today = new Date();
        const dayOfWeek = today.getDay();
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - daysToMonday);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const { data: moods, error } = await supabase
            .from('daily_mood')
            .select('day, mood')
            .eq('user_id', userId)
            .gte('day', startOfWeek.toISOString().slice(0, 10))
            .lte('day', endOfWeek.toISOString().slice(0, 10))
            .order('day', { ascending: true });

        if (error) {
            console.error('Failed to fetch week moods:', error);
            return res.status(500).json({ error: { message: 'Failed to load moods' } });
        }

        const moodData = (moods || []).map((m) => ({
            date: m.day,
            mood: m.mood
        }));

        res.json({ moods: moodData });
    } catch (err: any) {
        console.error('Unexpected error fetching week moods:', err);
        return res.status(500).json({ error: { message: 'Failed to load moods' } });
    }
});

export default router;

