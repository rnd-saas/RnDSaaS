import apiClient from './client';
import type { PlannedWorkout, PlannedExercise, TargetSet, ExerciseInformation } from '../types/Workout';

export const workoutService = {
    async getPlannedWorkout(date: Date): Promise<PlannedWorkout | null> {
        try {
            const dateStr = date.toLocaleDateString('en-CA'); // YYYY-MM-DD in the user's local timezone
            const tzOffset = date.getTimezoneOffset(); // minutes to add to local time to get UTC
            const response = await apiClient.get<any>('/api/workouts/planned', { date: dateStr, tzOffset });
            
            if (!response) return null;

            // If response has no ID but has isCompleted, it means no plan but maybe completed
            if (!response.id && response.isCompleted !== undefined) {
                return {
                    workoutId: '',
                    name: '',
                    description: '',
                    date: date,
                    exercises: [],
                    muscleGroups: [],
                    isCompleted: response.isCompleted
                };
            }

            const exercises: PlannedExercise[] = response.exercises?.map((item: any) => {
                const applyMetric = (metric: string | null | undefined, value: any, set: TargetSet) => {
                    if (metric === 'reps') set.targetReps = Number(value ?? 0);
                    else if (metric === 'weight') set.targetWeightKg = Number(value ?? 0);
                    else if (metric === 'duration_s') set.targetTimeSeconds = Number(value ?? 0);
                    else if (metric === 'distance') set.targetDistanceMeters = Number(value ?? 0);
                    else if (metric === 'height') set.targetHeightCm = Number(value ?? 0);
                };

                const sets: TargetSet[] = [];
                const requiresWeight = typeof item.exercise?.log_mode === 'string' && item.exercise.log_mode.includes('weight');

                for (let i = 1; i <= item.target_sets; i++) {
                    const set: TargetSet = { setNumber: i };
                    applyMetric(item.metric, item.target_value, set);
                    if (item.metric2) {
                        applyMetric(item.metric2, item.target_value2, set);
                    } else if (requiresWeight && item.metric !== 'weight') {
                        // Fallback to ensure weight column is populated for weight-based log modes
                        applyMetric('weight', item.target_value2 ?? null, set);
                    }
                    sets.push(set);
                }

                const exerciseInfo: ExerciseInformation = {
                    exerciseId: item.exercise.id,
                    name: item.exercise.name,
                    description: item.exercise.description,
                    slug: item.exercise.slug,
                    difficultyLevel: item.exercise.difficulty,
                    logMode: item.exercise.log_mode,
                    muscleGroups: [], // TODO: Map from backend if available
                    createdAt: new Date(item.exercise.created_at),
                    updatedAt: new Date(item.exercise.updated_at)
                };

                return {
                    exerciseId: item.exercise.id,
                    sets,
                    restTimeSeconds: Number(item.rest_seconds),
                    exerciseInfo
                };
            }) || [];

            return {
                workoutId: response.id,
                name: response.name,
                description: response.description,
                date: new Date(response.scheduled_date || date),
                exercises,
                muscleGroups: [], // TODO: Aggregate from exercises
                isCompleted: response.isCompleted
            };
        } catch (error) {
            console.error('Error fetching planned workout:', error);
            return null;
        }
    },

    async saveCompletedWorkout(data: any): Promise<any> {
        return await apiClient.post('/api/workouts/complete', data);
    },

    async updateWorkoutEvaluation(workoutId: string, data: any): Promise<any> {
        return await apiClient.put(`/api/workouts/${workoutId}/evaluation`, data);
    },

    async getAiFeedback(workoutId: string): Promise<{ feedback: string }> {
        return await apiClient.get(`/api/workouts/${workoutId}/ai-feedback`);
    },

    async getActiveWorkoutProgram(): Promise<any> {
        return await apiClient.get('/api/workouts/program/active');
    },

    async updateActiveWorkoutProgram(newProgramData: any): Promise<any> {
        return await apiClient.post('/api/workouts/program/update', newProgramData);
    },

    async getExerciseBySlug(slug: string): Promise<ExerciseInformation | null> {
        try {
            const response = await apiClient.get<any>(`/api/workouts/exercise/${slug}`);
            if (!response) return null;

            return {
                exerciseId: response.id,
                name: response.name,
                description: response.description,
                slug: response.slug,
                difficultyLevel: response.difficulty,
                logMode: response.log_mode,
                muscleGroups: [], // TODO: Add muscle groups to DB schema if needed
                createdAt: new Date(response.created_at),
                updatedAt: new Date(response.updated_at),
                tutorialUrl: response.youtube_url,
                instructions: response.cues
            };
        } catch (error) {
            console.error('Error fetching exercise:', error);
            return null;
        }
    }
};
