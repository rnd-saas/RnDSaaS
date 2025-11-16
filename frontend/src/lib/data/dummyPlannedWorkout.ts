import type { PlannedWorkout } from "@/lib/types/Workout";

export const dummyPlannedWorkout: PlannedWorkout = {
  workout_id: "workout_push_001",
  date: new Date("2025-11-16"),

  muscle_groups: ["Chest", "Shoulders", "Triceps"],

  exercises: [
    // ----- EXERCISE 1 -----
    {
      exercise_id: "bench_press_001",
      rest_time_seconds: 120,
      image_url: "https://example.com/images/bench-press.png",

      sets: [
        { set_number: 1, target_reps: 8, target_weight_kg: 60 },
        { set_number: 2, target_reps: 8, target_weight_kg: 60 },
        { set_number: 3, target_reps: 6, target_weight_kg: 60 },
      ],

      exercise_info: {
        name: "Barbell Bench Press",
        description:
          "A compound chest exercise targeting the pectorals, anterior delts, and triceps.",
        slug: "barbell-bench-press",
        tutorial_url: "https://www.youtube.com/watch?v=gRVjAtPip0Y",
        difficulty_level: "Intermediate",
        log_mode: "reps_weight",
        muscle_groups: ["Chest", "Triceps", "Front Delts"],
        equipment: ["Barbell", "Bench"],
        created_at: new Date("2025-01-01"),
        updated_at: new Date("2025-10-10"),
      },
    },

    // ----- EXERCISE 2 -----
    {
      exercise_id: "incline_dumbbell_press_002",
      rest_time_seconds: 90,
      image_url: "https://example.com/images/incline-db-press.png",

      sets: [
        { set_number: 1, target_reps: 10, target_weight_kg: 22 },
        { set_number: 2, target_reps: 10, target_weight_kg: 22 },
        { set_number: 3, target_reps: 8, target_weight_kg: 22 },
      ],

      exercise_info: {
        name: "Incline Dumbbell Press",
        description:
          "Targets the upper chest and anterior deltoids with a deep stretch.",
        slug: "incline-dumbbell-press",
        difficulty_level: "Intermediate",
        log_mode: "reps_weight",
        muscle_groups: ["Upper Chest", "Front Delts", "Triceps"],
        equipment: ["Dumbbells", "Bench"],
        created_at: new Date("2025-02-01"),
        updated_at: new Date("2025-09-12"),
      },
    },

    // ----- EXERCISE 3 -----
    {
      exercise_id: "lateral_raise_003",
      rest_time_seconds: 60,

      sets: [
        { set_number: 1, target_reps: 15, target_weight_kg: 8 },
        { set_number: 2, target_reps: 15, target_weight_kg: 8 },
        { set_number: 3, target_reps: 12, target_weight_kg: 8 },
      ],

      exercise_info: {
        name: "Dumbbell Lateral Raise",
        description: "Isolation exercise for the side delts.",
        slug: "dumbbell-lateral-raise",
        difficulty_level: "Beginner",
        log_mode: "reps_weight",
        muscle_groups: ["Side Delts"],
        equipment: ["Dumbbells"],
        created_at: new Date("2025-03-11"),
        updated_at: new Date("2025-09-20"),
      },
    },

    // ----- EXERCISE 4 -----
    {
      exercise_id: "tricep_pushdown_004",
      rest_time_seconds: 90,

      sets: [
        { set_number: 1, target_reps: 12, target_weight_kg: 25 },
        { set_number: 2, target_reps: 12, target_weight_kg: 25 },
        { set_number: 3, target_reps: 10, target_weight_kg: 25 },
      ],

      exercise_info: {
        name: "Cable Tricep Pushdown",
        description: "Isolation movement focusing on the triceps long head.",
        slug: "cable-tricep-pushdown",
        difficulty_level: "Beginner",
        log_mode: "reps_weight",
        muscle_groups: ["Triceps"],
        equipment: ["Cable Machine"],
        created_at: new Date("2025-05-01"),
        updated_at: new Date("2025-09-29"),
      },
    },
  ],
};
