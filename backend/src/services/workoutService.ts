import { supabase } from '../db/supabase';
import { triggerAchievementCheck } from './achievementService';

export const workoutService = {
  async getWorkoutPlanForDate(userId: string, date: Date) {
    // JS getDay() returns 0 for Sunday, 1 for Monday, etc.
    // We use 0=Sunday ... 6=Saturday mapping.
    const dayOfWeek = date.getDay();
    
    const formattedDate = date.toISOString().split('T')[0];

    // Check for completed workout (with feedback)
    const startOfDay = new Date(date);
    startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23,59,59,999);

    const { data: completedWorkouts } = await supabase
        .from('workout_feedback')
        .select('id, workouts!inner(user_id, ended_at)')
        .eq('workouts.user_id', userId)
        .gte('workouts.ended_at', startOfDay.toISOString())
        .lte('workouts.ended_at', endOfDay.toISOString())
        .limit(1);
    
    const isCompleted = !!(completedWorkouts && completedWorkouts.length > 0);

    // 1. Get active program ID
    const { data: activeProgram } = await supabase
        .from('workout_programs')
        .select('id')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

    if (!activeProgram) {
        return { plan: null, isCompleted }; // No active program
    }

    // 2. Get plan for this program and day
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
      .eq('program_id', activeProgram.id)
      .or(`scheduled_date.eq.${formattedDate},day_number.eq.${dayOfWeek}`);

    if (error) {
      throw error;
    }

    return { plan: data?.[0] || null, isCompleted };
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

  async getActiveWorkoutProgram(userId: string) {
    // Fetch the active program
    const { data: program, error: programError } = await supabase
      .from('workout_programs')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (programError) {
      if (programError.code === 'PGRST116') return null; // No active program
      throw programError;
    }

    // Fetch the plans (days) for this program
    const { data: plans, error: plansError } = await supabase
      .from('workout_plans')
      .select(`
        *,
        exercises:plan_exercises(
          *,
          exercise:exercises(name, slug, description)
        )
      `)
      .eq('program_id', program.id)
      .order('week_number', { ascending: true })
      .order('day_number', { ascending: true });

    if (plansError) throw plansError;

    return {
      ...program,
      plans: plans || []
    };
  },

  async updateActiveWorkoutProgram(userId: string, newProgramData: any) {
    // 1. Deactivate current active program
    await supabase
      .from('workout_programs')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('is_active', true);

    // 2. Create new program
    // Calculate workout_days from plans
    let workoutDays: number[] = [];
    if (newProgramData.plans && Array.isArray(newProgramData.plans)) {
        const days = newProgramData.plans
            .map((p: any) => p.day_number)
            .filter((d: any) => typeof d === 'number') as number[];
        workoutDays = Array.from(new Set(days)).sort((a, b) => a - b);
    }

    const { data: newProgram, error: createError } = await supabase
      .from('workout_programs')
      .insert({
        user_id: userId,
        name: newProgramData.name || 'New AI Program',
        description: newProgramData.description || 'Generated by AI Coach',
        weeks_count: newProgramData.weeks_count || 4,
        is_active: true,
        workout_days: workoutDays
      })
      .select()
      .single();

    if (createError) throw createError;

    // 3. Create plans and exercises
    // Assuming newProgramData.plans is an array of plan objects
    if (newProgramData.plans && newProgramData.plans.length > 0) {
      for (const plan of newProgramData.plans) {
        const { data: newPlan, error: planError } = await supabase
          .from('workout_plans')
          .insert({
            user_id: userId,
            program_id: newProgram.id,
            week_number: plan.week_number,
            day_number: plan.day_number,
            name: plan.name || plan.plan_name || 'Workout Day',
            description: plan.description || plan.plan_description || '',
            // scheduled_date: calculate based on start date? For now leave null or handle logic
          })
          .select()
          .single();

        if (planError) throw planError;

        // Handle both "exercises" (generic) and "plan_exercises" (generator schema)
        const exercisesList = plan.exercises || plan.plan_exercises || [];

        if (exercisesList.length > 0) {
          const exerciseInserts = [];
          
          for (const ex of exercisesList) {
            let exerciseId = ex.exercise_id;
            let validExerciseFound = false;

            // 1. If ID is provided, verify it exists in the DB to avoid FK violations
            if (exerciseId) {
                const { data: exists } = await supabase
                    .from('exercises')
                    .select('id')
                    .eq('id', exerciseId)
                    .maybeSingle();
                
                if (exists) {
                    validExerciseFound = true;
                } else {
                    console.warn(`Invalid exercise_id ${exerciseId} provided by AI, attempting lookup by name/slug`);
                    exerciseId = null; // Reset to force lookup
                }
            }

            // 2. If no valid ID yet, try to lookup by slug or name
            // The generator/chatbot uses 'exercise_name', generic might use 'name' or 'slug'
            const lookupName = ex.name || ex.exercise_name;
            
            if (!validExerciseFound && (ex.slug || lookupName)) {
               let query = supabase.from('exercises').select('id');
               if (ex.slug) {
                 query = query.eq('slug', ex.slug);
               } else if (lookupName) {
                 query = query.ilike('name', lookupName);
               }
               
               const { data: foundEx } = await query.maybeSingle();
               if (foundEx) {
                   exerciseId = foundEx.id;
                   validExerciseFound = true;
               }
            }

            if (validExerciseFound && exerciseId) {
              // Map 'time' to 'duration_s' to match DB constraint and generator logic
              let metric = ex.metric || 'reps';
              if (metric === 'time') {
                  metric = 'duration_s';
              }

              exerciseInserts.push({
                plan_id: newPlan.id,
                exercise_id: exerciseId,
                sequence_no: ex.sequence_no || (exerciseInserts.length + 1),
                target_sets: ex.target_sets || 3,
                metric: metric,
                target_value: ex.target_value || 10,
                rest_seconds: ex.rest_seconds || 60
              });
            } else {
              console.warn(`Skipping exercise without valid ID or match: ${lookupName || ex.slug}`);
            }
          }

          if (exerciseInserts.length > 0) {
            const { error: exError } = await supabase
              .from('plan_exercises')
              .insert(exerciseInserts);
            
            if (exError) throw exError;
          }
        }
      }
    }

    return newProgram;
  }
};
