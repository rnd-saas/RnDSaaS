import express, { Request, Response } from 'express';
import cors from 'cors';
// Only load dotenv in local development
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
    try {
        require('dotenv/config');
    } catch (e) {
        // dotenv not available, which is fine in production
    }
}

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (_req: Request, res: Response) => {
    res.json({ 
        message: 'Backend is running!',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Simple test endpoint that doesn't require Supabase
app.get('/api/test', (_req, res) => {
    res.json({
        status: 'ok',
        message: 'API is working',
        env: {
            NODE_ENV: process.env.NODE_ENV || 'not set',
            VERCEL: process.env.VERCEL ? 'yes' : 'no'
        }
    });
});

// API routes - import synchronously since we already have lazy loading in api/index.ts
try {
    const authRoutes = require('./routes/authRoutes').default;
    const userRoutes = require('./routes/userRoutes').default;
    const debugRoutes = require('./routes/debugRoutes').default;
    const onboardingRoutes = require('./routes/onboardingRoutes').default;
    const chatbotRoutes = require('./routes/chatbotRoutes').default;
    
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/debug', debugRoutes);
    app.use('/api/onboarding', onboardingRoutes);
    app.use('/api/chatbot', chatbotRoutes);
    
    console.log('✅ API routes loaded');
} catch (error: any) {
    console.error('❌ Error loading routes:', error?.message || error);
}

// 404 handler for unmatched routes
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`,
        availableRoutes: [
            'GET /',
            'GET /api/test',
            'GET /api/ping',
            'GET /api/env-check',
            'POST /api/auth/register',
            'POST /api/auth/login',
            'GET /api/auth/me',
            'POST /api/auth/logout',
            'GET /api/onboarding',
            'POST /api/onboarding'
        ],
        timestamp: new Date().toISOString()
    });
});

export default app;