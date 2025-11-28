/**
 * Authentication service
 * Handles all authentication-related API calls
 */

import apiClient from './client';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from './types';

/**
 * User login
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', credentials);
    
    // Save token if returned
    if (response.token) {
        apiClient.setToken(response.token);
    }
    if (response.refreshToken) {
        apiClient.setRefreshToken(response.refreshToken);
    }
    apiClient.setTokenExpiry(response.expiresAt);
    
    return response;
}

/**
 * User registration
 */
export async function register(userData: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/api/auth/register', userData);

    if (response.token) {
        apiClient.setToken(response.token);
    }
    if (response.refreshToken) {
        apiClient.setRefreshToken(response.refreshToken);
    }
    apiClient.setTokenExpiry(response.expiresAt);

    return response;
}

/**
 * User logout
 */
export async function logout(): Promise<void> {
    try {
        await apiClient.post('/api/auth/logout');
    } finally {
        apiClient.clearToken();
    }
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<any> {
    return apiClient.get('/api/auth/me');
}

/**
 * Delete user account
 * This will permanently delete the user account and all associated data
 */
export async function deleteAccount(): Promise<void> {
    await apiClient.delete('/api/auth/account');
    // Clear tokens after successful deletion
    apiClient.clearToken();
}

export const authService = {
    login,
    register,
    logout,
    getCurrentUser,
    deleteAccount
};

