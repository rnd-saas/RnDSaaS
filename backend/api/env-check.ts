import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    // Environment check
    const envCheck = {
        NODE_ENV: process.env.NODE_ENV || 'not set',
        VERCEL: process.env.VERCEL ? 'yes' : 'no',
        SUPABASE_URL: process.env.SUPABASE_URL ? 
            `${process.env.SUPABASE_URL.substring(0, 30)}...` : 'missing',
        SUPABASE_KEY: process.env.SUPABASE_KEY ? 'set' : 'missing',
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'set' : 'missing',
        timestamp: new Date().toISOString()
    };

    const hasSupabaseConfig = !!(process.env.SUPABASE_URL && 
        (process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY));

    res.status(200).json({
        status: hasSupabaseConfig ? 'ok' : 'warning',
        message: hasSupabaseConfig ? 
            'Environment configuration looks good' : 
            'Missing Supabase environment variables',
        environment: envCheck,
        warnings: !hasSupabaseConfig ? [
            'SUPABASE_URL is required',
            'Either SUPABASE_KEY or SUPABASE_ANON_KEY is required'
        ] : []
    });
}