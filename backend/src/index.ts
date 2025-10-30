import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { supabase } from './db/supabase';


const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

app.get('/user', async (req, res) => {
    const { data, error } = await supabase.from('user').select('*');
    console.log('users select ->', { rows: data?.length, error });
    if (error) return res.status(400).json({ error });
    res.json(data);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));