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

// API routes - lazy load to prevent blocking initialization
let routesLoaded = false;
let routesLoadPromise: Promise<void> | null = null;

const loadRoutes = async () => {
    console.log('Loading API routes...');

    // Dynamic imports to prevent blocking module initialization
    const [authRoutes, userRoutes, debugRoutes] = await Promise.all([
        import('./routes/authRoutes').then(m => m.default),
        import('./routes/userRoutes').then(m => m.default), 
        import('./routes/debugRoutes').then(m => m.default)
    ]);

    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/debug', debugRoutes);

    routesLoaded = true;
    console.log('✅ API routes loaded successfully');
};

// Middleware to ensure routes are loaded before processing API requests
app.use('/api', async (req, res, next) => {
    if (!routesLoaded) {
        if (!routesLoadPromise) {
            routesLoadPromise = loadRoutes()
                .then(() => {
                    routesLoadPromise = null;
                })
                .catch((error) => {
                    routesLoadPromise = null;
                    throw error;
                });
        }

        try {
            await routesLoadPromise;
        } catch (error: any) {
            console.error('❌ Error loading routes:', error?.message || error);
            return res.status(500).json({
                error: 'Routes failed to load',
                message: error?.message || 'Unknown error',
                timestamp: new Date().toISOString()
            });
        }
    }

    next();
});

export default app;