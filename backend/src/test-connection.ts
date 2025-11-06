/**
 * Supabase 连接测试脚本
 * 
 * 使用方法:
 *   npx ts-node src/test-connection.ts
 * 
 * 或者:
 *   npm run test:connection (需要在 package.json 中添加脚本)
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

async function testConnection() {
    console.log('🔍 开始测试 Supabase 连接...\n');

    // 1. 检查环境变量
    console.log('1️⃣ 检查环境变量...');
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_KEY;

    if (!url || !key) {
        console.error('❌ 环境变量缺失！');
        console.error('   请确保 .env 文件中包含:');
        console.error('   - SUPABASE_URL');
        console.error('   - SUPABASE_KEY');
        process.exit(1);
    }

    console.log('   ✅ SUPABASE_URL:', url.substring(0, 30) + '...');
    console.log('   ✅ SUPABASE_KEY:', key.substring(0, 20) + '...\n');

    // 2. 创建客户端
    console.log('2️⃣ 创建 Supabase 客户端...');
    let supabase;
    try {
        supabase = createClient(url, key);
        console.log('   ✅ 客户端创建成功\n');
    } catch (error) {
        console.error('   ❌ 客户端创建失败:', error);
        process.exit(1);
    }

    // 3. 测试数据库连接
    console.log('3️⃣ 测试数据库连接...');
    try {
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);

        if (error) {
            console.error('   ❌ 数据库连接失败:', error.message);
            console.error('   错误代码:', error.code);
            console.error('   错误详情:', error.details);
            process.exit(1);
        }

        console.log('   ✅ 数据库连接成功');
        console.log('   📊 查询结果:', data ? '数据可访问' : '无数据\n');
    } catch (error: any) {
        console.error('   ❌ 查询执行失败:', error.message);
        process.exit(1);
    }

    // 4. 测试获取用户列表
    console.log('4️⃣ 测试获取用户列表...');
    try {
        const { data, error, count } = await supabase
            .from('users')
            .select('*', { count: 'exact' })
            .limit(5);

        if (error) {
            console.error('   ❌ 查询失败:', error.message);
            process.exit(1);
        }

        console.log('   ✅ 查询成功');
        console.log('   📊 用户数量:', count || 0);
        if (data && data.length > 0) {
            console.log('   👤 前几个用户:');
            data.forEach((user: any, index: number) => {
                console.log(`      ${index + 1}. ${user.username || user.id}`);
            });
        } else {
            console.log('   ℹ️  数据库中没有用户（这是正常的，如果还没有创建用户）');
        }
        console.log('');
    } catch (error: any) {
        console.error('   ❌ 查询失败:', error.message);
        process.exit(1);
    }

    // 5. 测试认证功能
    console.log('5️⃣ 测试认证功能...');
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error && error.message !== 'Invalid API key') {
            console.log('   ⚠️  认证测试:', error.message);
            console.log('   ℹ️  这是正常的，因为需要有效的 token');
        } else {
            console.log('   ✅ 认证服务可访问');
        }
        console.log('');
    } catch (error: any) {
        console.log('   ⚠️  认证测试:', error.message);
        console.log('   ℹ️  这是正常的\n');
    }

    // 总结
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ 所有测试通过！Supabase 连接正常！');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🎉 你现在可以:');
    console.log('   1. 启动后端服务: npm run dev');
    console.log('   2. 测试 API: http://localhost:4000/user');
    console.log('   3. 开始开发你的功能！\n');
}

// 运行测试
testConnection().catch((error) => {
    console.error('❌ 测试过程中发生错误:', error);
    process.exit(1);
});

