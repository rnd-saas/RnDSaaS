# 后端 Supabase 连接架构图

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                        客户端 (浏览器)                        │
│                     http://localhost:5173                   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ HTTP 请求
                            │ GET /user
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express 后端服务器                         │
│                    http://localhost:4000                     │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  app.ts (Express 应用)                             │    │
│  │                                                     │    │
│  │  app.get('/user', async (req, res) => {            │    │
│  │    const { data, error } =                         │    │
│  │      await supabase.from('users').select('*');     │    │
│  │    res.json(data);                                 │    │
│  │  });                                               │    │
│  └───────────────────┬───────────────────────────────┘    │
│                      │                                      │
│                      │ import { supabase }                  │
│                      ▼                                      │
│  ┌────────────────────────────────────────────────────┐    │
│  │  db/supabase.ts (Supabase 客户端)                  │    │
│  │                                                     │    │
│  │  const supabase = createClient(                    │    │
│  │    process.env.SUPABASE_URL,                       │    │
│  │    process.env.SUPABASE_KEY                        │    │
│  │  );                                                │    │
│  └───────────────────┬───────────────────────────────┘    │
│                      │                                      │
│                      │ 读取环境变量                          │
│                      ▼                                      │
│  ┌────────────────────────────────────────────────────┐    │
│  │  .env 文件                                         │    │
│  │                                                     │    │
│  │  SUPABASE_URL=https://xxx.supabase.co             │    │
│  │  SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...    │    │
│  └────────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ HTTPS 请求
                            │ GET /rest/v1/users
                            │ Headers:
                            │   apikey: <SUPABASE_KEY>
                            │   Authorization: Bearer <KEY>
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase 云服务                            │
│              https://xxx.supabase.co                        │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  REST API 服务器                                    │    │
│  │  - 验证 API Key                                     │    │
│  │  - 应用 RLS 策略                                    │    │
│  │  - 执行 SQL 查询                                    │    │
│  └───────────────────┬───────────────────────────────┘    │
│                      │                                      │
│                      │ SQL 查询                              │
│                      ▼                                      │
│  ┌────────────────────────────────────────────────────┐    │
│  │  PostgreSQL 数据库                                  │    │
│  │                                                     │    │
│  │  SELECT * FROM users;                              │    │
│  │                                                     │    │
│  │  ┌─────────┬────────────┬──────────────┐         │    │
│  │  │ id      │ username   │ display_name │         │    │
│  │  ├─────────┼────────────┼──────────────┤         │    │
│  │  │ uuid-1  │ john_doe   │ John Doe     │         │    │
│  │  │ uuid-2  │ jane_doe   │ Jane Doe     │         │    │
│  │  └─────────┴────────────┴──────────────┘         │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 数据流向详解

### 步骤 1: 客户端请求
```
浏览器 → GET http://localhost:4000/user
```

### 步骤 2: Express 路由处理
```typescript
// app.ts
app.get('/user', async (_req, res) => {
    // 调用 Supabase 客户端
    const { data, error } = await supabase
        .from('users')
        .select('*');
    
    // 返回数据
    res.json(data);
});
```

### 步骤 3: Supabase 客户端构建请求
```typescript
// supabase.ts 中的客户端
// 内部构建 HTTP 请求:
// GET https://xxx.supabase.co/rest/v1/users?select=*
// Headers:
//   apikey: <SUPABASE_KEY>
//   Authorization: Bearer <SUPABASE_KEY>
```

### 步骤 4: Supabase 服务器处理
```
Supabase REST API:
1. 验证 API Key
2. 检查权限
3. 应用 RLS 策略
4. 执行 SQL: SELECT * FROM users;
```

### 步骤 5: 返回数据
```
Supabase → Express → 客户端
JSON 数据: [{ id: "...", username: "...", ... }]
```

## 📦 文件依赖关系

```
server.ts
  └─→ app.ts
        ├─→ cors (中间件)
        ├─→ express.json() (中间件)
        └─→ db/supabase.ts
              ├─→ @supabase/supabase-js (npm 包)
              ├─→ dotenv/config (环境变量)
              └─→ .env (配置文件)
```

## 🔑 关键组件说明

### 1. Supabase 客户端 (`db/supabase.ts`)
- **作用**: 创建和管理 Supabase 连接
- **输入**: 环境变量 (URL, KEY)
- **输出**: Supabase 客户端实例
- **特点**: 单例模式，全局共享

### 2. Express 应用 (`app.ts`)
- **作用**: 处理 HTTP 请求
- **使用**: 导入并使用 Supabase 客户端
- **路由**: 定义 API 端点

### 3. 环境变量 (`.env`)
- **作用**: 存储敏感配置信息
- **内容**: Supabase URL 和 API Key
- **安全**: 不提交到 Git

### 4. Supabase 云服务
- **作用**: 提供数据库和 API 服务
- **功能**: 
  - REST API
  - PostgreSQL 数据库
  - 认证服务
  - 实时订阅

## 🎯 连接验证流程

```
1. 启动后端服务
   ↓
2. 读取 .env 文件
   ↓
3. 创建 Supabase 客户端
   ↓
4. 客户端发送测试请求到 Supabase
   ↓
5. Supabase 验证 API Key
   ↓
6. 返回连接状态
   ✅ 成功: 可以执行查询
   ❌ 失败: 抛出错误
```

## 📝 代码执行顺序

```
1. npm run dev
   ↓
2. server.ts 启动
   ↓
3. 导入 app.ts
   ↓
4. app.ts 导入 supabase.ts
   ↓
5. supabase.ts 执行:
   - import 'dotenv/config' → 加载 .env
   - 读取 SUPABASE_URL 和 SUPABASE_KEY
   - 验证环境变量
   - createClient(url, key) → 创建客户端
   ↓
6. Express 应用启动
   ↓
7. 监听端口 4000
   ↓
8. 等待 HTTP 请求
   ↓
9. 请求到达 → 调用 supabase 查询
   ↓
10. 返回数据
```

---

**这个架构确保了后端与 Supabase 的稳定连接！** 🎉

