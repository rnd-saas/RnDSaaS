/**
 * API services unified export
 */

export { default as apiClient } from './client';
export * from './types';

// Export auth service functions
import * as authServiceFunctions from './authService';
export const authService = authServiceFunctions;

// Export user service functions
import * as userServiceFunctions from './userService';
export const userService = userServiceFunctions;

// Export onboarding service functions
import * as onboardingServiceFunctions from './onboardingService';
export const onboardingService = onboardingServiceFunctions;

// Export chatbot service functions
import * as chatbotServiceFunctions from './chatbotService';
export const chatbotService = chatbotServiceFunctions;

// Export dashboard service functions
import * as dashboardServiceFunctions from './dashboardService';
export const dashboardService = dashboardServiceFunctions;

// Export settings service functions
import * as settingsServiceFunctions from './settingsService';
export const settingsService = settingsServiceFunctions;

// Export mood service functions
import * as moodServiceFunctions from './moodService';
export const moodService = moodServiceFunctions;

// Export profile service functions
import * as profileServiceFunctions from './profileService';
export const profileService = profileServiceFunctions;

// Export social service functions
import * as socialServiceFunctions from './socialService';
export const socialService = socialServiceFunctions;

