import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import debugRoutes from './routes/debugRoutes';

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (_req: Request, res: Response) => {
    res.json({ 
        message: 'Backend is running!',
        version: '1.0.0'
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/debug', debugRoutes); // Debug routes

export default app;