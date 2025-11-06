/**
 * 用户服务
 */

import apiClient from './client';
import type { User } from './types';

/**
 * 获取所有用户
 */
export async function getAllUsers(): Promise<User[]> {
    return apiClient.get<User[]>('/api/users');
}

/**
 * 根据 ID 获取用户
 */
export async function getUserById(userId: string): Promise<User> {
    return apiClient.get<User>(`/api/users/${userId}`);
}

/**
 * 创建用户
 */
export async function createUser(userData: {
    id: string;
    username: string;
    display_name: string;
}): Promise<User> {
    return apiClient.post<User>('/api/users', userData);
}

