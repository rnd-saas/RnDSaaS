import express from 'express';
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
app.get('/', (_req, res) => {
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

// API routes - wrapped in try-catch to prevent app crash
try {
    const authRoutes = require('./routes/authRoutes').default;
    const userRoutes = require('./routes/userRoutes').default;
    const debugRoutes = require('./routes/debugRoutes').default;
    
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/debug', debugRoutes);
} catch (error: any) {
    console.error('Error loading routes:', error.message);
    // Add error route
    app.use('/api/*', (_req, res) => {
        res.status(500).json({
            error: 'Routes failed to load',
            message: error.message
        });
    });
}

export default app;