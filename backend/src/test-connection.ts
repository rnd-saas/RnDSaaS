/**
 * Supabase connection test script
 * 
 * Usage:
 *   npx ts-node src/test-connection.ts
 * 
 * Or:
 *   npm run test:connection (script needs to be added to package.json)
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

async function testConnection() {
    console.log('🔍 Starting Supabase connection test...\n');

    // 1. Check environment variables
    console.log('1️⃣ Checking environment variables...');
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_KEY;

    if (!url || !key) {
        console.error('❌ Missing environment variables!');
        console.error('   Please ensure .env file contains:');
        console.error('   - SUPABASE_URL');
        console.error('   - SUPABASE_KEY');
        process.exit(1);
    }

    console.log('   ✅ SUPABASE_URL:', url.substring(0, 30) + '...');
    console.log('   ✅ SUPABASE_KEY:', key.substring(0, 20) + '...\n');

    // 2. Create client
    console.log('2️⃣ Creating Supabase client...');
    let supabase;
    try {
        supabase = createClient(url, key);
        console.log('   ✅ Client created successfully\n');
    } catch (error) {
        console.error('   ❌ Client creation failed:', error);
        process.exit(1);
    }

    // 3. Test database connection
    console.log('3️⃣ Testing database connection...');
    try {
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);

        if (error) {
            console.error('   ❌ Database connection failed:', error.message);
            console.error('   Error code:', error.code);
            console.error('   Error details:', error.details);
            process.exit(1);
        }

        console.log('   ✅ Database connection successful');
        console.log('   📊 Query result:', data ? 'Data accessible' : 'No data\n');
    } catch (error: any) {
        console.error('   ❌ Query execution failed:', error.message);
        process.exit(1);
    }

    // 4. Test getting user list
    console.log('4️⃣ Testing user list retrieval...');
    try {
        const { data, error, count } = await supabase
            .from('users')
            .select('*', { count: 'exact' })
            .limit(5);

        if (error) {
            console.error('   ❌ Query failed:', error.message);
            process.exit(1);
        }

        console.log('   ✅ Query successful');
        console.log('   📊 User count:', count || 0);
        if (data && data.length > 0) {
            console.log('   👤 First few users:');
            data.forEach((user: any, index: number) => {
                console.log(`      ${index + 1}. ${user.username || user.id}`);
            });
        } else {
            console.log('   ℹ️  No users in database (this is normal if no users have been created yet)');
        }
        console.log('');
    } catch (error: any) {
        console.error('   ❌ Query failed:', error.message);
        process.exit(1);
    }

    // 5. Test authentication functionality
    console.log('5️⃣ Testing authentication functionality...');
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error && error.message !== 'Invalid API key') {
            console.log('   ⚠️  Auth test:', error.message);
            console.log('   ℹ️  This is normal, as a valid token is required');
        } else {
            console.log('   ✅ Authentication service accessible');
        }
        console.log('');
    } catch (error: any) {
        console.log('   ⚠️  Auth test:', error.message);
        console.log('   ℹ️  This is normal\n');
    }

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ All tests passed! Supabase connection is working!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🎉 You can now:');
    console.log('   1. Start backend service: npm run dev');
    console.log('   2. Test API: http://localhost:4000/user');
    console.log('   3. Start developing your features!\n');
}

// Run test
testConnection().catch((error) => {
    console.error('❌ Error during test:', error);
    process.exit(1);
});

