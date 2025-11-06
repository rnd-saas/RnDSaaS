# 故障排除指南

## 常见问题

### 问题 1: 'nodemon' 不是内部或外部命令

**症状**:
```
'nodemon' 不是内部或外部命令，也不是可运行的程序或批处理文件。
```

**原因**:
- 依赖没有安装
- Windows 系统无法直接找到本地安装的包

**解决方案**:

#### 方法 1: 安装依赖（推荐）
```bash
cd backend
npm install
```

#### 方法 2: 使用 npx（已更新 package.json）
```bash
npm run dev
```
现在脚本已经使用 `npx nodemon`，会自动找到本地安装的包。

#### 方法 3: 全局安装 nodemon（不推荐）
```bash
npm install -g nodemon
```

### 问题 2: 端口已被占用

**症状**:
```
Error: listen EADDRINUSE: address already in use :::4000
```

**解决方案**:
1. 更改端口（在 `.env` 中设置 `PORT=4001`）
2. 或者关闭占用 4000 端口的程序

### 问题 3: 环境变量未找到

**症状**:
```
Error: Missing SUPABASE_URL or SUPABASE_KEY in .env
```

**解决方案**:
1. 在 `backend` 文件夹下创建 `.env` 文件
2. 添加以下内容：
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-service-role-key
PORT=4000
```

### 问题 4: TypeScript 编译错误

**症状**:
```
Cannot find module '@supabase/supabase-js'
```

**解决方案**:
```bash
cd backend
npm install
```

### 问题 5: 数据库连接失败

**症状**:
```
Database connection failed: Invalid API key
```

**解决方案**:
1. 检查 `.env` 文件中的 `SUPABASE_KEY` 是否正确
2. 确保使用的是 **service_role key**，不是 anon key
3. 在 Supabase Dashboard 中重新生成 key

## 启动检查清单

在运行 `npm run dev` 之前，确认：

- [ ] 已运行 `npm install` 安装依赖
- [ ] 已创建 `.env` 文件
- [ ] `.env` 文件中包含 `SUPABASE_URL` 和 `SUPABASE_KEY`
- [ ] 端口 4000 未被占用
- [ ] Node.js 版本 >= 18

## 测试连接

运行测试脚本验证配置：

```bash
npm run test:connection
```

如果所有测试通过，说明配置正确！

