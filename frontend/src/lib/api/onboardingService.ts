import apiClient from './client';
import type { OnboardingPayload } from './types';

const BASE_PATH = '/api/onboarding';

export async function saveResponses(payload: OnboardingPayload): Promise<void> {
    await apiClient.post(BASE_PATH, payload);
}

export async function fetchResponses(): Promise<OnboardingPayload | null> {
    return apiClient.get(BASE_PATH);
}
