/**
 * User service
 * Handles all user data-related API calls
 */

import apiClient from './client';
import type { User } from './types';

/**
 * Get all users
 */
export async function getAllUsers(): Promise<User[]> {
    return apiClient.get<User[]>('/api/users');
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User> {
    return apiClient.get<User>(`/api/users/${userId}`);
}

/**
 * Create user
 */
export async function createUser(userData: {
    id: string;
    username: string;
    display_name: string;
}): Promise<User> {
    return apiClient.post<User>('/api/users', userData);
}

