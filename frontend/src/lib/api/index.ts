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

