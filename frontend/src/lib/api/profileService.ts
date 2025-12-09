import apiClient from './client';
import type { ProfileResponse, AchievementListResponse, WorkoutHistoryResponse, OnboardingPayload } from './types';

/**
 * Fetch aggregated profile data for the current user.
 */
export async function getProfile(): Promise<ProfileResponse> {
    return apiClient.get<ProfileResponse>('/api/profile');
}

/**
 * Fetch all obtained achievements for the current user.
 */
export async function getAllAchievements(): Promise<AchievementListResponse> {
    return apiClient.get<AchievementListResponse>('/api/profile/achievements');
}

/**
 * Fetch all workout history for the current user.
 */
export async function getWorkoutHistory(): Promise<WorkoutHistoryResponse> {
    return apiClient.get<WorkoutHistoryResponse>('/api/profile/workouts');
}

/**
 * Fetch user workout preferences.
 */
export async function getPreferences(): Promise<OnboardingPayload> {
    return apiClient.get<OnboardingPayload>('/api/profile/preferences');
}

/**
 * Update user workout preferences.
 */
export async function updatePreferences(data: OnboardingPayload): Promise<OnboardingPayload> {
    return apiClient.put<OnboardingPayload>('/api/profile/preferences', data);
}

