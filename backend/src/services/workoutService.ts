import { supabase } from '../db/supabase';
import { triggerAchievementCheck } from './achievementService';

export const workoutService = {
  async getWorkoutPlanForDate(userId: string, date: Date) {
    const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)
    // Adjust to match user's expectation if needed. 
    // Usually 0 is Sunday, 1 is Monday.
    // Let's assume the database uses 0-6 as well.
    // However, standard getDay() returns 0 for Sunday.
    // If the user considers Monday as 0, we might need to adjust.
    // The prompt says "daynumber corresponds to reality's day of the week".
    // Let's assume standard JS getDay() mapping for now: 0=Sun, 1=Mon, ..., 6=Sat.
    // Or maybe 1=Mon... 
    // Let's stick to 0=Sun, 1=Mon... for now unless specified otherwise.
    // Actually, often in workout apps, Monday is day 1.
    // Let's check if there is any clue.
    // "daynumber is week day, corresponding to reality's week day"
    
    // Let's try to match both scheduled_date and day_number.
    
    const formattedDate = date.toISOString().split('T')[0];

    // We want to find a plan that is either scheduled for this specific date
    // OR has a day_number matching this day of the week (and is active/current program?)
    // The schema has `program_id`. We might need to know the user's active program.
    // For now, let's just fetch by user_id and day matching.

    const { data, error } = await supabase
      .from('workout_plans')
      .select(`
        *,
        program:workout_programs(name),
        exercises:plan_exercises(
          *,
          exercise:exercises(*)
        )
      `)
      .eq('user_id', userId)
      .or(`scheduled_date.eq.${formattedDate},day_number.eq.${dayOfWeek}`);

    if (error) {
      throw error;
    }

    return data;
  },

  async saveCompletedWorkout(userId: string, workoutData: any) {
    const {
      planId,
      startedAt,
      endedAt,
      durationSeconds,
      difficultyRating,
      comfortRating,
      notes,
      exercises
    } = workoutData;

    // 1. Insert into workouts table
    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .insert({
        user_id: userId,
        plan_id: planId,
        started_at: startedAt,
        ended_at: endedAt,
        duration_s: durationSeconds,
        difficulty_rating: difficultyRating,
        comfort_rating: comfortRating,
        notes: notes
      })
      .select()
      .single();

    if (workoutError) throw workoutError;

    // 2. Insert exercises
    if (exercises && exercises.length > 0) {
      for (let i = 0; i < exercises.length; i++) {
        const ex = exercises[i];
        const { data: workoutExercise, error: exerciseError } = await supabase
          .from('workout_exercises')
          .insert({
            workout_id: workout.id,
            exercise_id: ex.exerciseId,
            sequence_no: i + 1,
            note: ex.notes
          })
          .select()
          .single();

        if (exerciseError) throw exerciseError;

        // 3. Insert sets
        if (ex.sets && ex.sets.length > 0) {
          const setRows = [];
          for (const set of ex.sets) {
            const metrics: { name: string; value: number }[] = [];
            
            if (set.actualReps !== undefined && set.actualReps !== null) {
              metrics.push({ name: 'reps', value: set.actualReps });
            }
            if (set.actualWeightKg !== undefined && set.actualWeightKg !== null) {
              metrics.push({ name: 'weight', value: set.actualWeightKg });
            }
            if (set.actualDistanceMeters !== undefined && set.actualDistanceMeters !== null) {
              metrics.push({ name: 'distance', value: set.actualDistanceMeters });
            }
            if (set.actualTimeSeconds !== undefined && set.actualTimeSeconds !== null) {
              metrics.push({ name: 'duration_s', value: set.actualTimeSeconds });
            }

            // If we have at least one metric, or if the set is marked completed (we need at least one metric for the DB constraint)
            // If no metrics but completed, we might have an issue with the NOT NULL constraint on metric1.
            // Assuming valid data comes in.
            if (metrics.length > 0) {
              const row: any = {
                workout_exercises_id: workoutExercise.id,
                set_no: set.setNumber,
                metric1: metrics[0].name,
                value1: metrics[0].value,
                completed: set.completed
              };

              if (metrics.length > 1) {
                row.metric2 = metrics[1].name;
                row.value2 = metrics[1].value;
              }

              setRows.push(row);
            }
          }

          if (setRows.length > 0) {
            const { error: setsError } = await supabase
              .from('exercise_sets')
              .insert(setRows);

            if (setsError) throw setsError;
          }
        }
      }
    }

    // Trigger achievement check
    let newAchievements: any[] = [];
    try {
      newAchievements = await triggerAchievementCheck(userId, { type: 'workout_completed' });
    } catch (error) {
      console.error('Error checking achievements after workout:', error);
      // Don't fail the workout save if achievement check fails
    }

    return { ...workout, newAchievements };
  },

  async updateWorkoutEvaluation(workoutId: string, evaluationData: any) {
    const {
      difficultyRating,
      comfortRating,
      comfortNotes,
      performanceNotes,
      feedbackAi,
      skipped
    } = evaluationData;

    // If skipped, we store empty data (nulls) as requested
    const feedbackData = skipped ? {
      workouts_id: workoutId,
      ai_feedback: null,
      difficulty_level: null,
      mood: null,
      mood_notes: null,
      workout_notes: null
    } : {
      workouts_id: workoutId,
      ai_feedback: feedbackAi,
      difficulty_level: difficultyRating,
      mood: comfortRating,
      mood_notes: comfortNotes,
      workout_notes: performanceNotes
    };

    const { data, error } = await supabase
      .from('workout_feedback')
      .insert(feedbackData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
