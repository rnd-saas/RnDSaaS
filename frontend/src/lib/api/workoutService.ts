import apiClient from './client';
import type { PlannedWorkout, PlannedExercise, TargetSet, ExerciseInformation } from '../types/Workout';

export const workoutService = {
    async getPlannedWorkout(date: Date): Promise<PlannedWorkout | null> {
        try {
            const dateStr = date.toISOString();
            const response = await apiClient.get<any>('/api/workouts/planned', { date: dateStr });
            
            if (!response) return null;

            const exercises: PlannedExercise[] = response.exercises?.map((item: any) => {
                const sets: TargetSet[] = [];
                for (let i = 1; i <= item.target_sets; i++) {
                    const set: TargetSet = { setNumber: i };
                    if (item.metric === 'reps') set.targetReps = Number(item.target_value);
                    else if (item.metric === 'weight') set.targetWeightKg = Number(item.target_value);
                    else if (item.metric === 'duration_s') set.targetTimeSeconds = Number(item.target_value);
                    else if (item.metric === 'distance') set.targetDistanceMeters = Number(item.target_value);
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
                date: new Date(response.scheduled_date || date),
                exercises,
                muscleGroups: [] // TODO: Aggregate from exercises
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
    }
};
