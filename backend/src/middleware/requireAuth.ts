import type { Request, Response, NextFunction } from 'express';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../db/supabase';

interface AuthenticatedRequest extends Request {
    user?: User;
}

export async function requireAuth(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                error: { message: 'Missing access token' }
            });
        }

        const {
            data: { user },
            error
        } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({
                error: { message: 'Invalid or expired token' }
            });
        }

        req.user = user;
        return next();
    } catch (err: any) {
        console.error('Authentication middleware error:', err);
        return res.status(500).json({
            error: { message: 'Failed to verify authentication' }
        });
    }
}
