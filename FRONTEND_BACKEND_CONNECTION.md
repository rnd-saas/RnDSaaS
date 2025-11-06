# 前端与后端连接实现指南

## ✅ 已完成

前端与后端的连接已经完全实现！所有代码已就绪。

---

## 📁 文件结构

### 前端 API 服务层

```
frontend/src/lib/api/
├── index.ts          # 统一导出
├── client.ts         # API 客户端（HTTP 请求管理）
├── types.ts          # TypeScript 类型定义
├── authService.ts    # 认证服务（登录、注册、登出）
└── userService.ts    # 用户服务（获取用户信息）
```

### 后端 API 路由

```
backend/src/
├── app.ts            # Express 应用主文件
└── routes/
    ├── authRoutes.ts # 认证路由
    └── userRoutes.ts # 用户路由
```

---

## 🔌 连接实现

### 1. 前端 API 客户端 (`client.ts`)

**功能**:
- 统一管理所有 HTTP 请求
- 自动添加认证 token
- 统一错误处理
- 支持 GET/POST/PUT/DELETE

**配置**:
- 默认 API URL: `http://localhost:4000`
- 可通过环境变量 `VITE_API_BASE_URL` 配置

### 2. 前端 API 服务

**认证服务** (`authService.ts`):
- `login()` - 用户登录
- `register()` - 用户注册
- `logout()` - 用户登出
- `getCurrentUser()` - 获取当前用户

**用户服务** (`userService.ts`):
- `getAllUsers()` - 获取所有用户
- `getUserById()` - 根据 ID 获取用户
- `createUser()` - 创建用户

### 3. 后端 API 路由

**认证路由** (`/api/auth/*`):
- `POST /api/auth/login` - 登录
- `POST /api/auth/register` - 注册
- `POST /api/auth/logout` - 登出
- `GET /api/auth/me` - 获取当前用户

**用户路由** (`/api/users/*`):
- `GET /api/users` - 获取所有用户
- `GET /api/users/:id` - 获取单个用户
- `POST /api/users` - 创建用户

---

## 🚀 使用方法

### 在页面组件中使用

#### 登录示例

```typescript
import { authService, ApiError } from '@/lib/api';

const onSubmit = async (data) => {
    try {
        const response = await authService.login({
            email: data.email,
            password: data.password
        });
        // 登录成功
        console.log('User:', response.user);
    } catch (err) {
        if (err instanceof ApiError) {
            setError(err.message);
        }
    }
};
```

#### 注册示例

```typescript
import { authService, ApiError } from '@/lib/api';

const onSubmit = async (data) => {
    try {
        const response = await authService.register({
            email: data.email,
            password: data.password,
            username: data.username,
            display_name: data.display_name
        });
        // 注册成功
        console.log('User:', response.user);
    } catch (err) {
        if (err instanceof ApiError) {
            setError(err.message);
        }
    }
};
```

---

## 🔄 数据流向

```
前端页面 (LoginPage/RegisterPage)
    ↓ 调用
API 服务层 (authService)
    ↓ HTTP 请求
后端路由 (authRoutes)
    ↓ 查询
Supabase 数据库
    ↓ 返回数据
前端页面显示
```

---

## ⚙️ 配置

### 前端环境变量（可选）

在 `frontend/.env` 中配置（如果不使用默认值）：

```env
VITE_API_BASE_URL=http://localhost:4000
```

### 后端环境变量（必需）

在 `backend/.env` 中配置：

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-service-role-key
PORT=4000
```

---

## 🧪 测试连接

### 1. 启动后端

```bash
cd backend
npm run dev
```

应该看到: `Server running on port 4000`

### 2. 启动前端

```bash
cd frontend
npm run dev
```

应该看到: `Local: http://localhost:5173`

### 3. 测试功能

1. **注册用户**:
   - 访问: `http://localhost:5173/register`
   - 填写表单并提交
   - 应该看到成功消息

2. **登录**:
   - 访问: `http://localhost:5173/login`
   - 使用注册的邮箱和密码登录
   - 应该看到成功消息

3. **测试 API**:
   - 访问: `http://localhost:4000/api/users`
   - 应该看到用户列表（JSON 格式）

---

## 📝 已更新的页面

### LoginPage.tsx
- ✅ 使用 `authService.login()` 进行登录
- ✅ 显示加载状态
- ✅ 错误处理

### RegisterPage.tsx
- ✅ 使用 `authService.register()` 进行注册
- ✅ 显示加载状态
- ✅ 错误和成功消息处理

---

## 🎯 关键特性

1. **关注点分离**: API 调用逻辑与 UI 组件完全分离
2. **类型安全**: 完整的 TypeScript 类型定义
3. **错误处理**: 统一的错误处理机制
4. **Token 管理**: 自动保存和管理认证 token
5. **易于扩展**: 添加新 API 只需创建新的服务文件

---

## 🔍 故障排除

### CORS 错误

**解决**: 确保后端 `app.ts` 中有 `app.use(cors());`

### 404 Not Found

**解决**: 
- 检查后端是否运行在 4000 端口
- 检查 API 路由是否正确注册

### 401 Unauthorized

**解决**:
- 检查 Supabase 环境变量
- 确认用户已注册

---

## ✅ 总结

前端与后端的连接已经完全实现：

- ✅ 前端 API 服务层已创建
- ✅ 后端 API 路由已扩展
- ✅ 前端页面已更新使用 API
- ✅ 错误处理已实现
- ✅ Token 管理已实现

**现在可以启动服务并测试连接了！** 🎉

