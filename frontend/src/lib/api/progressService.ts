import apiClient from './client';

export interface Goal {
    id: number;
    label: string;
    goalType: string;
    value: number;
    target: number;
    unit: string;
    status: string;
    createdAt: string;
}

export interface GoalsResponse {
    goals: Goal[];
}

export interface MoodData {
    date: string;
    mood: number;
}

export interface MoodsResponse {
    moods: MoodData[];
}

export interface WorkoutData {
    date: string;
    length: number;
}

export interface WorkoutsResponse {
    workouts: WorkoutData[];
}

export interface PersonalDataPoint {
    label: string;
    value: number;
    date: string;
}

export interface PersonalDataResponse {
    data: PersonalDataPoint[];
}

/**
 * Get all goals for the current user
 */
export async function getGoals(): Promise<GoalsResponse> {
    return apiClient.get<GoalsResponse>('/api/goals');
}

/**
 * Create a new goal
 */
export async function createGoal(data: {
    label: string;
    goalType: string;
    target: number;
    initialValue?: number;
    unit?: string;
}): Promise<Goal> {
    return apiClient.post<Goal>('/api/goals', data);
}

/**
 * Delete a goal
 */
export async function deleteGoal(goalId: number): Promise<void> {
    return apiClient.delete(`/api/goals/${goalId}`);
}

/**
 * Get mood data for the current week
 */
export async function getWeekMoods(): Promise<MoodsResponse> {
    return apiClient.get<MoodsResponse>('/api/mood/week');
}

/**
 * Get workout history for the current week
 */
export async function getWeekWorkouts(): Promise<WorkoutsResponse> {
    return apiClient.get<WorkoutsResponse>('/api/workouts/week');
}

/**
 * Get personal data (weight or BMI)
 */
export async function getPersonalData(type: 'weight' | 'bmi'): Promise<PersonalDataResponse> {
    return apiClient.get<PersonalDataResponse>(`/api/progress/data?type=${type}`);
}

/**
 * Add a new personal data point (weight or BMI)
 */
export async function addPersonalData(type: 'weight' | 'bmi', value: number): Promise<PersonalDataPoint> {
    return apiClient.post<PersonalDataPoint>('/api/progress/data', { type, value });
}


