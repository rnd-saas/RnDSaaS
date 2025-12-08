import { Request, Response, NextFunction } from 'express';
import { supabase } from '../db/supabase';

export const requireSubscription = async (req: Request, res: Response, next: NextFunction) => {
    // Assuming requireAuth has already run and populated req.user
    const userId = (req as any).user?.id;

    if (!userId) {
        return res.status(401).json({ error: { message: 'Unauthorized' } });
    }

    try {
        const { data: subscription, error } = await supabase
            .from('user_subscription')
            .select('sub_status, current_period_end')
            .eq('user_id', userId)
            .single();

        if (error || !subscription) {
            // If no subscription record found, treat as not subscribed
            return res.status(403).json({ error: { message: 'Subscription required', code: 'SUBSCRIPTION_REQUIRED' } });
        }

        const isActive = ['active', 'trialing'].includes(subscription.sub_status);
        
        if (!isActive) {
            return res.status(403).json({ error: { message: 'Subscription required', code: 'SUBSCRIPTION_REQUIRED' } });
        }

        next();
    } catch (err) {
        console.error('Subscription check error:', err);
        return res.status(500).json({ error: { message: 'Internal server error' } });
    }
};
