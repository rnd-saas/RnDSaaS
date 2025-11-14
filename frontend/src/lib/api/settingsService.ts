/**
 * Settings service
 * Handles user settings API calls
 */

import apiClient from './client';

export interface UserSettings {
    user_id: string;
    units: 'metric' | 'imperial';
    notifications_enabled: boolean;
    weekly_review_day: number; // 0-6 (Monday-Sunday)
    streak_display: boolean;
    goal_display: 'big' | 'small' | 'both' | 'none';
    trainer: number; // 0 or 1
    created_at: string;
    updated_at: string;
}

export interface UpdateSettingsRequest {
    units?: 'metric' | 'imperial';
    notifications_enabled?: boolean;
    weekly_review_day?: number;
    streak_display?: boolean;
    goal_display?: 'big' | 'small' | 'both' | 'none';
    trainer?: number;
}

/**
 * Get current user's settings
 */
export async function getSettings(): Promise<UserSettings> {
    return apiClient.get<UserSettings>('/api/settings');
}

/**
 * Update current user's settings
 */
export async function updateSettings(settings: UpdateSettingsRequest): Promise<UserSettings> {
    return apiClient.put<UserSettings>('/api/settings', settings);
}

