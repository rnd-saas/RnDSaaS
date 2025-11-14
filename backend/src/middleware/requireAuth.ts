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
            console.warn('[auth] Missing access token for request', req.path);
            return res.status(401).json({
                error: { message: 'Missing access token' }
            });
        }

        const start = Date.now();
        console.log('[auth] Verifying token for request', req.path);
        const {
            data: { user },
            error
        } = await supabase.auth.getUser(token);
        console.log('[auth] Verification completed in', Date.now() - start, 'ms');

        if (error || !user) {
            console.warn('[auth] Invalid or expired token detected', error?.message);
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
