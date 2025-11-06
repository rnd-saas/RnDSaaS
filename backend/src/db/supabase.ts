import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Only load dotenv in local development
// In Vercel, environment variables are automatically available
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
    try {
        require('dotenv/config');
    } catch (e) {
        // dotenv not available, which is fine in production
    }
}

// Lazy initialization to avoid errors during module load in Vercel
let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
    if (supabaseClient) {
        return supabaseClient;
    }

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!url || !key) {
        const error = new Error(
            `Missing Supabase configuration. SUPABASE_URL: ${url ? 'set' : 'missing'}, SUPABASE_KEY: ${key ? 'set' : 'missing'}`
        );
        console.error('❌ Supabase initialization error:', error.message);
        console.error('Environment check:', {
            NODE_ENV: process.env.NODE_ENV,
            VERCEL: process.env.VERCEL,
            hasUrl: !!url,
            hasKey: !!key,
            urlPreview: url ? url.substring(0, 30) + '...' : 'N/A'
        });
        throw error;
    }

    console.log('✅ Initializing Supabase client...');
    supabaseClient = createClient(url, key);
    return supabaseClient;
}

// Export a proxy that lazily initializes the client
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        const client = getSupabaseClient();
        const value = (client as any)[prop];
        if (typeof value === 'function') {
            return value.bind(client);
        }
        return value;
    }
});
