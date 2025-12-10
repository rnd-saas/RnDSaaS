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
    
    if (response.subscriptionStatus) {
        apiClient.setSubscriptionStatus(response.subscriptionStatus);
    }
    
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
    const user = await apiClient.get<any>('/api/auth/me');
    
    if (user.subscriptionStatus) {
        apiClient.setSubscriptionStatus(user.subscriptionStatus);
    }
    
    return user;
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

/**
 * Request password reset
 * Sends a password reset email to the user
 */
export async function requestPasswordReset(email: string): Promise<{ message: string }> {
    const redirectTo = `${window.location.origin}/password-change`;
    return await apiClient.post<{ message: string }>('/api/auth/reset-password', { 
        email,
        redirectTo 
    });
}

/**
 * Update user password
 * Used after clicking the reset password link
 */
export async function updatePassword(newPassword: string): Promise<{ message: string }> {
    return await apiClient.post<{ message: string }>('/api/auth/update-password', { 
        password: newPassword 
    });
}

export const authService = {
    login,
    register,
    logout,
    getCurrentUser,
    deleteAccount,
    requestPasswordReset,
    updatePassword
};

