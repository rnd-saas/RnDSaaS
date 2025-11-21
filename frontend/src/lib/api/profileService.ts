import apiClient from './client';
import type { ProfileResponse } from './types';

/**
 * Fetch aggregated profile data for the current user.
 */
export async function getProfile(): Promise<ProfileResponse> {
    return apiClient.get<ProfileResponse>('/api/profile');
}

