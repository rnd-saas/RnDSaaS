/**
 * API type definitions
 */

// User type
export interface User {
    id: string;
    username: string;
    display_name: string;
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
}

// API error
export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public code?: string,
        public details?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

