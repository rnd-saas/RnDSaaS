import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { supabase } from './db/supabase';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
    res.send('Backend is running!');
});

app.get('/user', async (_req, res) => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) return res.status(400).json({ error });
    res.json(data);
});

export default app;