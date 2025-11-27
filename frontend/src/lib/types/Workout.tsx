/**
 * Workout that is planned (only by AI for now) for a specific date
 */
export interface PlannedWorkout {
  workoutId: string;
  date: Date; //date of the planned workout
  exercises: PlannedExercise[];
  muscleGroups: string[]; //muscle groups targeted in the workout
}

// later expansion to create exercises manually. now only via DB!
/**
 * Planned exercise within a workout
 */
export interface PlannedExercise {
  exerciseId: string;
  sets: TargetSet[]; //array of sets for the exercise
  restTimeSeconds: number; //rest time between sets in seconds
  exerciseInfo: ExerciseInformation;
}

export interface LoggedWorkout {
  workoutId: string;
  date: string; //date of the logged workout
  exercises?: LoggedExercise[];
  startDatetime: Date; //start date and time of the workout
  endDatetime?: Date; //end date and time of the workout
}

/**
 * Exercise logged within a workout session
 */
export interface LoggedExercise {
  exerciseId: string;
  sets: LoggedSet[]; //array of logged sets for the exercise
  restTimeSeconds: number; //rest time between sets in seconds
  notes?: string; //optional notes for the exercise
  exerciseInfo: ExerciseInformation;
}

/**
 * information stored in the database
  // adjust later for user generated content
 */
export interface ExerciseInformation {
  exerciseId: string; // same for logged and planned exercise...! so using this for fetching of the workouts.
  name: string;
  description: string;
  slug: string; //URL friendly name
  tutorialUrl?: string; //optional tutorial video URL for the exercise
  imageUrl?: string; //optional image URL for the exercise
  difficultyLevel: 1 | 2 | 3 | 4 | 5; //1 to 5 scale
  logMode:
    | "reps_weight"
    | "reps"
    | "time"
    | "time_weight"
    | "distance"
    | "distance_weight";
  muscleGroups: MuscleGroup[]; //muscle groups targeted
  instructions?: string[]; //optional instructions for the exercise
  equipment?: string[]; //equipment needed for the exercise
  createdAt: Date;
  updatedAt: Date;

  // is_public and created_by for future expansion with user generated content
}

/**
 * Set target within an exercise in a planned workout
 */
export interface TargetSet {
  setNumber: number;
  targetReps?: number; //optional target reps for the set
  targetWeightKg?: number; //optional target weight for the set
  targetTimeSeconds?: number; //optional target time for the set
  targetDistanceMeters?: number; //optional target distance for the set
}

/**
 * Set logged within an exercise during a workout session
 */
export interface LoggedSet {
  setNumber: number;
  actualReps?: number; //optional actual reps performed
  actualWeightKg?: number; //optional actual weight used
  actualTimeSeconds?: number; //optional actual time taken
  actualDistanceMeters?: number; //optional actual distance covered
  completed: boolean; //whether the set was completed
}

/**
 * Evaluation at end of workout session
 */
export interface WorkoutEvaluation {
  workoutId: string; // link to logged workout
  feedbackAi: string; // AI generated text
  difficultyRating: 1 | 2 | 3 | 4 | 5; // 1 to 5 stars
  comfortRating: 1 | 2 | 3 | 4 | 5; // 1 to 5 emoji scale
  comfortNotes?: string; // optional note for feelings
  performanceNotes?: string; // optional note for workout performance
  // property if filled in or skipped
  createdAt: Date;
  skipped: boolean; // property if user skipped evaluation
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
  | "Abs"
  | "Upper Abs"
  | "Lower Abs"
  | "Obliques"
  | "Trapezius"
  | "Latissimus Dorsi"
  | "Pectoralis Major"
  | "Deltoids";
