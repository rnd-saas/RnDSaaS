/**
 * Workout that is planned (only by AI for now) for a specific date
 */
export interface PlannedWorkout {
  workout_id: string;
  date: Date; //date of the planned workout
  exercises: PlannedExercise[];
  muscle_groups: string[]; //muscle groups targeted in the workout
}

// later expansion to create exercises manually. now only via DB!
/**
 * Planned exercise within a workout
 */
export interface PlannedExercise {
  exercise_id: string;
  sets: TargetSet[]; //array of sets for the exercise
  rest_time_seconds: number; //rest time between sets in seconds
  image_url?: string; //optional image URL for the exercise
  exercise_info: ExerciseInformation;
}

export interface LoggedWorkout {
  workout_id: string;
  date: Date; //date of the logged workout
  exercises: LoggedExercise[];
  start_datetime: Date; //start date and time of the workout
  end_datetime: Date; //end date and time of the workout
  notes?: string; //optional notes for the workout
}

/**
 * Exercise logged within a workout session
 */
export interface LoggedExercise {
  exercise_id: string;
  sets: LoggedSet[]; //array of logged sets for the exercise
  rest_time_seconds: number; //rest time between sets in seconds
  notes?: string; //optional notes for the exercise
}

/**
 * information stored in the database
  // adjust later for user generated content
 */
export interface ExerciseInformation {
  name: string;
  description: string;
  slug: string; //URL friendly name
  tutorial_url?: string; //optional tutorial video URL for the exercise
  difficulty_level: "Beginner" | "Intermediate" | "Advanced";
  log_mode:
    | "reps_weight"
    | "reps"
    | "time"
    | "time_weight"
    | "distance"
    | "distance_weight";
  muscle_groups: MuscleGroup[]; //muscle groups targeted
  equipment?: string[]; //equipment needed for the exercise
  created_at: Date;
  updated_at: Date;

  // is_public and created_by for future expansion with user generated content
}

/**
 * Set target within an exercise in a planned workout
 */
export interface TargetSet {
  set_number: number;
  target_reps?: number; //optional target reps for the set
  target_weight_kg?: number; //optional target weight for the set
  target_time_seconds?: number; //optional target time for the set
  target_distance_meters?: number; //optional target distance for the set
}

/**
 * Set logged within an exercise during a workout session
 */
export interface LoggedSet {
  set_number: number;
  actual_reps?: number; //optional actual reps performed
  actual_weight_kg?: number; //optional actual weight used
  actual_time_seconds?: number; //optional actual time taken
  actual_distance_meters?: number; //optional actual distance covered
  completed: boolean; //whether the set was completed
}

/**
 * Evaluation at end of workout session
 */
export interface WorkoutEvaluation {
  workout_id: string; // same as in LoggedWorkout
  feedback_ai: string; //AI generated feedback on the workout
  comfort_rating: number; //between 1 and 5.
  difficulty_rating: number; //between 1 and 5.
}

export type MuscleGroup =
  | "Chest"
  | "Upper Chest"
  | "Middle Chest"
  | "Lower Chest"
  | "Back"
  | "Upper Back"
  | "Middle Back"
  | "Lower Back"
  | "Lats"
  | "Traps"
  | "Rhomboids"
  | "Shoulders"
  | "Front Delts"
  | "Side Delts"
  | "Rear Delts"
  | "Biceps"
  | "Triceps"
  | "Forearms"
  | "Quadriceps"
  | "Hamstrings"
  | "Calves"
  | "Glutes"
  | "Abdominals"
  | "Upper Abs"
  | "Lower Abs"
  | "Obliques"
  | "Trapezius"
  | "Latissimus Dorsi"
  | "Pectoralis Major"
  | "Deltoids";
