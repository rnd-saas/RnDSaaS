import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Simple ping endpoint
    res.status(200).json({
        message: 'pong',
        timestamp: new Date().toISOString(),
        method: req.method,
        environment: process.env.NODE_ENV || 'production',
        vercel: process.env.VERCEL ? 'yes' : 'no'
    });
}