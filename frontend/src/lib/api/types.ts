/**
 * API 类型定义
 */

// 用户类型
export interface User {
    id: string;
    username: string;
    display_name: string;
    created_at: string;
    updated_at: string;
}

// 登录请求
export interface LoginRequest {
    email: string;
    password: string;
}

// 登录响应
export interface LoginResponse {
    user: User;
    token?: string;
    message?: string;
}

// 注册请求
export interface RegisterRequest {
    email: string;
    password: string;
    username?: string;
    display_name?: string;
}

// 注册响应
export interface RegisterResponse {
    user: User;
    message?: string;
}

// API 错误
export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public code?: string,
        public details?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

