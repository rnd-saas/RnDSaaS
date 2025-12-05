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

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;
const publicKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey || !publicKey) {
    const error = new Error(
        `Missing Supabase configuration. URL set: ${Boolean(supabaseUrl)}, service key set: ${Boolean(
            serviceKey
        )}, public key set: ${Boolean(publicKey)}`
    );
    console.error('❌ Supabase initialization error:', error.message);
    console.error('Environment check:', {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        hasUrl: !!supabaseUrl,
        hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        urlPreview: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'N/A'
    });
    throw error;
}

const resolvedUrl = supabaseUrl as string;
const resolvedServiceKey = serviceKey as string;
const resolvedPublicKey = publicKey as string;

const createSupabaseClient = (key: string, label: string): SupabaseClient => {
    console.log(`[supabase] Initializing ${label} client (key prefix ${key.slice(0, 6)}****)`);
    return createClient(resolvedUrl, key, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
        }
    });
};

let supabaseAdminClient: SupabaseClient | null = null;
let supabaseAuthClient: SupabaseClient | null = null;

function getSupabaseAdminClient(): SupabaseClient {
    if (!supabaseAdminClient) {
        supabaseAdminClient = createSupabaseClient(resolvedServiceKey, 'admin');
    }
    return supabaseAdminClient;
}

function getSupabaseAuthClient(): SupabaseClient {
    if (!supabaseAuthClient) {
        supabaseAuthClient = createSupabaseClient(resolvedPublicKey, 'auth');
    }
    return supabaseAuthClient;
}

const buildProxy = (factory: () => SupabaseClient): SupabaseClient =>
    new Proxy({} as SupabaseClient, {
        get(_target, prop) {
            const client = factory();
            const value = (client as any)[prop];
            if (typeof value === 'function') {
                return value.bind(client);
            }
            return value;
        }
    });

export const supabase: SupabaseClient = buildProxy(getSupabaseAdminClient);
export const supabaseAdmin: SupabaseClient = supabase;
export const supabaseAuth: SupabaseClient = buildProxy(getSupabaseAuthClient);
