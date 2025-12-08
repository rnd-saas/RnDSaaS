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
    trainerId?: number | null;
    trainer?: boolean | null;
}

export interface ProfileData {
    firstName: string | null;
    avatarOption: number | null;
    level: {
        label: string;
        currentXp: number;
        nextLevelXp: number;
    };
    onboarding: OnboardingPayload;
}

export interface DashboardStat {
    current: number;
    target: number;
}

export interface DashboardAchievement {
    id: string;
    title: string;
    sub: string;
    emoji: string;
}

export interface DashboardData {
    firstName: string | null;
    trainer: boolean | null;
    goal: {
        workoutsCompleted: DashboardStat;
        exercisesCompleted: DashboardStat;
        longestStreak: DashboardStat;
    };
    level: {
        label: string;
        currentXp: number;
        nextLevelXp: number;
    };
    achievements: DashboardAchievement[];
    mood: string;
    nextWorkout: string;
    streakDays: number;
    advice: string;
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

export type ChatRole = 'user' | 'assistant';

export interface ChatbotMessage {
    role: ChatRole;
    content: string;
}

export interface ChatbotRequest {
    trainerId?: number;
    messages: ChatbotMessage[];
    metadata?: {
        language?: string;
        onboardingSummary?: string;
        workoutPlanContext?: any;
    };
}

export interface ChatbotResponse {
    message: {
        role: 'assistant';
        content: string;
        trainerId: number;
    };
    usage?: {
        prompt_tokens?: number | null;
        completion_tokens?: number | null;
        total_tokens?: number | null;
    } | null;
    fallback: boolean;
    isMentalHealthIntervention?: boolean;
}

export interface ChatbotTrainerProfile {
    trainerId: number;
    name: string;
    avatarKey: 'tom' | 'sarah';
    specialties: string[];
    tone: string;
    voice: string;
}

export type ProfileWorkoutState = 'worked' | 'rest' | 'future';

export interface ProfileWorkoutDay {
    date: string;
    state: ProfileWorkoutState;
    isCurrent: boolean;
}

export interface ProfileAchievement {
    id: string;
    title: string;
    sub: string;
    emoji: string;
    obtained?: boolean; // Optional: true if user has unlocked this achievement
}

export interface ProfileResponse {
    user: {
        preferredName: string | null;
        avatarUrl: string | null;
        bio: string | null;
        trainer: boolean | null;
        streakDays: number;
    };
    achievements: ProfileAchievement[];
    workoutGrid: ProfileWorkoutDay[][];
    level?: {
        label: string;
        currentXp: number;
        nextLevelXp: number;
    };
}

export interface AchievementListResponse {
    achievements: ProfileAchievement[];
}

export interface WorkoutHistoryEntry {
    id: string;
    title: string;
    from: string; // ISO date string
    to: string | null; // ISO date string
}

export interface WorkoutHistoryResponse {
    workouts: WorkoutHistoryEntry[];
}

