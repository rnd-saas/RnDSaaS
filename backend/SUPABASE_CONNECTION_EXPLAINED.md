# 后端 Supabase 连接详细讲解

## ✅ 是的，后端已经和 Supabase 连接！

本文档详细说明后端如何实现与 Supabase 的连接。

---

## 📁 核心文件结构

```
backend/
├── src/
│   ├── db/
│   │   └── supabase.ts      ← Supabase 客户端配置文件（核心）
│   ├── app.ts               ← Express 应用，使用 Supabase
│   └── server.ts            ← 服务器启动文件
├── package.json             ← 包含 Supabase 依赖
└── .env                     ← 环境变量配置（需要创建）
```

---

## 🔌 连接实现详解

### 1. 安装 Supabase 客户端库

在 `backend/package.json` 中，可以看到依赖：

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.78.0",  // ← Supabase JavaScript 客户端
    "dotenv": "^17.2.3"                   // ← 环境变量管理
  }
}
```

**安装命令**:
```bash
cd backend
npm install
```

---

### 2. 创建 Supabase 客户端（核心文件）

**文件位置**: `backend/src/db/supabase.ts`

让我们逐行分析这个文件：

```typescript
// 第 1 行: 导入 Supabase 客户端创建函数
import { createClient } from '@supabase/supabase-js';
```

**`createClient` 是什么？**
- 这是 Supabase 官方提供的工厂函数
- 用于创建一个配置好的 Supabase 客户端实例
- 这个客户端会处理所有与 Supabase 的 HTTP 通信

```typescript
// 第 2 行: 加载环境变量
import 'dotenv/config';
```

**`dotenv/config` 的作用**:
- 自动读取项目根目录下的 `.env` 文件
- 将环境变量注入到 `process.env` 对象中
- 在应用启动时执行，无需额外代码

```typescript
// 第 4-5 行: 从环境变量获取配置
const url = process.env.SUPABASE_URL!;
const key = process.env.SUPABASE_KEY!;
```

**环境变量说明**:
- `SUPABASE_URL`: Supabase 项目的 API URL
  - 格式: `https://xxxxx.supabase.co`
  - 从 Supabase Dashboard → Settings → API 获取
- `SUPABASE_KEY`: Supabase 的 API Key
  - 后端使用 **service_role key**（不是 anon key）
  - Service Role Key 可以绕过 Row Level Security (RLS)
  - ⚠️ **重要**: 永远不要在前端使用 service_role key

**`!` 操作符**:
- TypeScript 的非空断言操作符
- 告诉编译器："我确定这个值不是 null/undefined"
- 实际使用中应该添加验证（代码中已有）

```typescript
// 第 6-8 行: 验证环境变量
if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_KEY in .env');
}
```

**防御性编程**:
- 在应用启动时检查必需的环境变量
- 如果缺失，立即抛出错误
- 避免运行时出现难以调试的问题
- 提供清晰的错误信息

```typescript
// 第 10 行: 创建并导出 Supabase 客户端
export const supabase = createClient(url, key);
```

**这一步做了什么？**

1. **创建客户端实例**:
   ```typescript
   createClient(url, key)
   ```
   - 接收两个参数：URL 和 API Key
   - 返回一个配置好的 Supabase 客户端对象

2. **客户端对象包含的功能**:
   - `supabase.from(tableName)` - 数据库查询
   - `supabase.auth` - 用户认证
   - `supabase.storage` - 文件存储
   - `supabase.realtime` - 实时订阅
   - `supabase.rpc(functionName)` - 调用数据库函数

3. **单例模式**:
   - 整个应用只创建一个客户端实例
   - 所有路由共享同一个连接
   - 提高性能，减少资源消耗

4. **导出供其他模块使用**:
   - 使用 `export const` 导出
   - 其他文件可以 `import { supabase } from './db/supabase'` 使用

---

### 3. 在 Express 应用中使用

**文件位置**: `backend/src/app.ts`

```typescript
// 第 4 行: 导入 Supabase 客户端
import { supabase } from './db/supabase';
```

**导入路径解析**:
- `./db/supabase` 是相对路径
- 从 `app.ts` 的位置（`src/`）查找 `db/supabase.ts`
- 导入的是我们创建的 `supabase` 客户端实例

```typescript
// 第 14-18 行: 使用 Supabase 查询数据库
app.get('/user', async (_req, res) => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) return res.status(400).json({ error });
    res.json(data);
});
```

**逐行解析**:

**第 15 行**: `const { data, error } = await supabase.from('users').select('*');`

1. **`supabase.from('users')`**:
   - 选择 `users` 表
   - 返回一个查询构建器对象

2. **`.select('*')`**:
   - 选择所有列（等同于 SQL 的 `SELECT *`）
   - 也可以指定特定列：`.select('id, username, email')`

3. **`await`**:
   - 等待异步操作完成
   - Supabase 客户端使用 HTTP 请求与数据库通信

4. **解构赋值**:
   - Supabase 查询总是返回 `{ data, error }` 格式
   - `data`: 查询成功时的数据（失败时为 null）
   - `error`: 查询失败时的错误对象（成功时为 null）

**第 16 行**: `if (error) return res.status(400).json({ error });`
- 错误处理：如果查询失败，返回 400 状态码和错误信息

**第 17 行**: `res.json(data);`
- 成功时返回查询到的数据

---

## 🔄 完整的数据流向

```
1. HTTP 请求到达 Express 路由
   ↓
2. 路由处理函数调用 supabase.from('users').select('*')
   ↓
3. Supabase 客户端构建 HTTP 请求
   - URL: https://xxxxx.supabase.co/rest/v1/users
   - Headers: 
     - apikey: <SUPABASE_KEY>
     - Authorization: Bearer <SUPABASE_KEY>
     - Content-Type: application/json
   ↓
4. 发送 HTTP 请求到 Supabase REST API
   ↓
5. Supabase 服务器处理请求
   - 验证 API Key
   - 执行 SQL 查询
   - 应用 Row Level Security (RLS) 策略
   ↓
6. 返回 JSON 响应
   ↓
7. Supabase 客户端解析响应
   - 成功: { data: [...], error: null }
   - 失败: { data: null, error: {...} }
   ↓
8. Express 路由返回数据给客户端
```

---

## 📝 实际使用示例

### 基本查询

```typescript
// 查询所有用户
const { data, error } = await supabase
    .from('users')
    .select('*');
```

### 条件查询

```typescript
// 查询特定用户
const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)  // WHERE id = userId
    .single();         // 期望返回单条记录
```

### 插入数据

```typescript
// 创建新用户
const { data, error } = await supabase
    .from('users')
    .insert([
        {
            id: userId,
            username: 'john_doe',
            display_name: 'John Doe'
        }
    ])
    .select();  // 返回插入的数据
```

### 更新数据

```typescript
// 更新用户信息
const { data, error } = await supabase
    .from('users')
    .update({ display_name: 'New Name' })
    .eq('id', userId)
    .select();
```

### 删除数据

```typescript
// 删除用户
const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);
```

### 关联查询

```typescript
// 查询用户及其设置
const { data, error } = await supabase
    .from('users')
    .select(`
        *,
        user_settings (*)
    `)
    .eq('id', userId)
    .single();
```

---

## ⚙️ 环境变量配置

### 创建 `.env` 文件

在 `backend` 文件夹下创建 `.env` 文件：

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-service-role-key
PORT=4000
```

### 获取 Supabase 凭证

1. **访问 Supabase Dashboard**:
   - 网址: https://app.supabase.com
   - 登录你的账号

2. **选择或创建项目**:
   - 如果已有项目，选择它
   - 如果没有，点击 "New Project" 创建

3. **获取凭证**:
   - 点击左侧菜单的 **Settings** (设置)
   - 点击 **API** 选项卡
   - 找到以下信息：
     - **Project URL**: 这是 `SUPABASE_URL`
     - **service_role key**: 这是 `SUPABASE_KEY`
       - ⚠️ 注意：使用 **service_role** key，不是 **anon** key
       - Service Role Key 在页面底部，需要点击 "Reveal" 显示

4. **复制到 `.env` 文件**:
   ```env
   SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## 🔐 安全说明

### Service Role Key vs Anon Key

**Service Role Key** (后端使用):
- ✅ 可以绕过 Row Level Security (RLS)
- ✅ 具有完全数据库访问权限
- ⚠️ **永远不要**在前端代码中使用
- ⚠️ **永远不要**提交到 Git
- ✅ 只在服务器端使用（后端）

**Anon Key** (前端使用):
- ✅ 受 RLS 策略限制
- ✅ 可以安全地在前端使用
- ✅ 通过 RLS 控制访问权限

### 最佳实践

1. **环境变量管理**:
   - `.env` 文件已添加到 `.gitignore`
   - 不要将 `.env` 提交到版本控制
   - 使用 `.env.example` 作为模板

2. **密钥安全**:
   - 定期轮换密钥
   - 使用不同的密钥用于开发和生产环境
   - 不要在日志中输出密钥

---

## 🧪 测试连接

### 方法 1: 测试后端 API

启动后端服务：

```bash
cd backend
npm run dev
```

访问: `http://localhost:4000/user`

如果连接成功，应该返回用户列表（可能是空数组 `[]`）

### 方法 2: 检查后端日志

启动后端时，如果没有错误，说明 Supabase 客户端创建成功。

如果环境变量缺失，会看到：
```
Error: Missing SUPABASE_URL or SUPABASE_KEY in .env
```

### 方法 3: 添加测试端点

在 `app.ts` 中添加：

```typescript
app.get('/test-db', async (_req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);
        
        if (error) {
            return res.status(500).json({ 
                connected: false, 
                error: error.message 
            });
        }
        
        res.json({ 
            connected: true, 
            message: 'Database connection successful',
            data 
        });
    } catch (err) {
        res.status(500).json({ 
            connected: false, 
            error: err instanceof Error ? err.message : 'Unknown error'
        });
    }
});
```

然后访问: `http://localhost:4000/test-db`

---

## 📊 Supabase 客户端的工作原理

### 底层实现

Supabase JavaScript 客户端实际上是一个 HTTP 客户端，它：

1. **构建 REST API 请求**:
   - 使用 `fetch` 或 `XMLHttpRequest` 发送 HTTP 请求
   - 自动添加必要的请求头

2. **处理响应**:
   - 解析 JSON 响应
   - 统一错误格式
   - 返回 `{ data, error }` 格式

3. **类型安全**:
   - 提供 TypeScript 类型定义
   - 编译时类型检查

### 实际 HTTP 请求示例

当你调用：
```typescript
supabase.from('users').select('*')
```

实际发送的 HTTP 请求：
```http
GET https://xxxxx.supabase.co/rest/v1/users?select=*
Headers:
  apikey: <SUPABASE_KEY>
  Authorization: Bearer <SUPABASE_KEY>
  Content-Type: application/json
```

---

## 🎯 总结

### 连接实现的关键步骤

1. ✅ **安装依赖**: `@supabase/supabase-js`
2. ✅ **创建客户端**: 使用 `createClient(url, key)`
3. ✅ **配置环境变量**: `SUPABASE_URL` 和 `SUPABASE_KEY`
4. ✅ **在代码中使用**: `import { supabase } from './db/supabase'`
5. ✅ **执行查询**: `supabase.from('table').select('*')`

### 当前实现状态

- ✅ Supabase 客户端已创建 (`src/db/supabase.ts`)
- ✅ 在 Express 应用中已使用 (`src/app.ts`)
- ✅ 已有示例查询 (`/user` 路由)
- ⚠️ 需要配置 `.env` 文件才能运行

### 下一步

1. **创建 `.env` 文件**并配置 Supabase 凭证
2. **启动后端服务**: `npm run dev`
3. **测试连接**: 访问 `http://localhost:4000/user`
4. **开始开发**: 添加更多 API 路由和数据库操作

---

**后端与 Supabase 的连接已经完全实现！只需要配置环境变量即可使用。** 🎉

