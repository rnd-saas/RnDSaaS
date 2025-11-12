/**
 * API type definitions
 */

// User type
export interface User {
    id: string;
    username: string;
    display_name: string;
    email?: string;
    created_at: string;
    updated_at: string;
}

// Login request
export interface LoginRequest {
    email: string;
    password: string;
}

// Login response
export interface LoginResponse {
    user: User;
    token?: string;
    refreshToken?: string;
    expiresAt?: number | null;
    message?: string;
}

// Register request
export interface RegisterRequest {
    email: string;
    password: string;
    username?: string;
    display_name?: string;
}

// Register response
export interface RegisterResponse {
    user: User;
    message?: string;
    needsEmailConfirmation?: boolean;
    token?: string;
    refreshToken?: string;
    expiresAt?: number | null;
}

export interface OnboardingPayload {
    preferredName?: string | null;
    gender?: string | null;
    heightCm?: number | null;
    weightKg?: number | null;
    primaryGoal?: string[] | null;
    trainingDaysPerWeek?: number | null;
    availableDays?: number[] | null;
    sessionDuration?: number | null;
    problemAreas?: string[] | null;
    preferredSplit?: string[] | null;
    gymComfortLevel?: string[] | null;
    experienceLevel?: number | null;
}

// API error
export class ApiError extends Error {
    status: number;
    code?: string;
    details?: string;

    constructor(
        message: string,
        status: number,
        code?: string,
        details?: string
    ) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

