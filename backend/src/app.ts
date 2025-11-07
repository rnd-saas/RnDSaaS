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

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

const corsOptions = allowedOrigins.length > 0
    ? { origin: allowedOrigins, credentials: true }
    : { origin: true, credentials: true };

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
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

const loadRoutes = async () => {
    if (routesLoaded) return;
    
    try {
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
    } catch (error: any) {
        console.error('❌ Error loading routes:', error.message);
        
        // Add fallback error route
        app.use('/api/*', (_req, res) => {
            res.status(500).json({
                error: 'Routes failed to load',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        });
    }
};

// Middleware to ensure routes are loaded before processing API requests
app.use('/api/*', async (req, res, next) => {
    if (!routesLoaded) {
        await loadRoutes();
    }
    next();
});

export default app;