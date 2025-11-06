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

// API routes - lazy load to improve cold start
const loadRoutes = async () => {
    try {
        console.log('Loading API routes...');
        
        // 动态导入路由，只在需要时加载
        const [authRoutes, userRoutes, debugRoutes] = await Promise.all([
            import('./routes/authRoutes').then(m => m.default),
            import('./routes/userRoutes').then(m => m.default),
            import('./routes/debugRoutes').then(m => m.default)
        ]);
        
        app.use('/api/auth', authRoutes);
        app.use('/api/users', userRoutes);
        app.use('/api/debug', debugRoutes);
        
        console.log('API routes loaded successfully');
    } catch (error: any) {
        console.error('Error loading routes:', error.message);
        
        // Add fallback error route
        app.use('/api/*', (_req, res) => {
            res.status(500).json({
                error: 'Routes failed to load',
                message: error.message
            });
        });
    }
};

// 在 Vercel 环境中延迟加载路由
if (process.env.VERCEL) {
    // 在第一次请求时加载路由
    let routesLoaded = false;
    app.use('/api/*', async (req, res, next) => {
        if (!routesLoaded) {
            await loadRoutes();
            routesLoaded = true;
        }
        next();
    });
} else {
    // 在本地开发中立即加载
    loadRoutes();
}

export default app;