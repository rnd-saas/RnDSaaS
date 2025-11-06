/**
 * 认证服务
 */

import apiClient from './client';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from './types';

/**
 * 用户登录
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', credentials);
    
    // 如果返回了 token，保存它
    if (response.token) {
        apiClient.setToken(response.token);
    }
    
    return response;
}

/**
 * 用户注册
 */
export async function register(userData: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>('/api/auth/register', userData);
}

/**
 * 用户登出
 */
export async function logout(): Promise<void> {
    try {
        await apiClient.post('/api/auth/logout');
    } finally {
        apiClient.clearToken();
    }
}

/**
 * 获取当前用户
 */
export async function getCurrentUser(): Promise<any> {
    return apiClient.get('/api/auth/me');
}

