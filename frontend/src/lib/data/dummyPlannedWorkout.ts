import type { PlannedWorkout } from "@/lib/types/Workout";

export const dummyPlannedWorkout: PlannedWorkout = {
  workoutId: "workout_push_001",
  date: new Date("2025-11-16"),

  muscleGroups: ["Chest", "Shoulders", "Triceps"],

  exercises: [
    // ----- EXERCISE 1 -----
    {
      exerciseId: "bench_press_001",
      restTimeSeconds: 120,
      imageUrl: "https://example.com/images/bench-press.png",

      sets: [
        { setNumber: 1, targetReps: 8, targetWeightKg: 60 },
        { setNumber: 2, targetReps: 8, targetWeightKg: 60 },
        { setNumber: 3, targetReps: 6, targetWeightKg: 60 },
      ],

      exerciseInfo: {
        name: "Barbell Bench Press",
        description:
          "A compound chest exercise targeting the pectorals, anterior delts, and triceps.",
        slug: "barbell-bench-press",
        tutorialUrl: "https://www.youtube.com/watch?v=gRVjAtPip0Y",
        difficultyLevel: "Intermediate",
        logMode: "reps_weight",
        muscleGroups: ["Chest", "Triceps", "Front Delts"],
        equipment: ["Barbell", "Bench"],
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-10-10"),
      },
    },

    // ----- EXERCISE 2 -----
    {
      exerciseId: "incline_dumbbell_press_002",
      restTimeSeconds: 90,
      imageUrl: "https://example.com/images/incline-db-press.png",

      sets: [
        { setNumber: 1, targetReps: 10, targetWeightKg: 22 },
        { setNumber: 2, targetReps: 10, targetWeightKg: 22 },
        { setNumber: 3, targetReps: 8, targetWeightKg: 22 },
      ],

      exerciseInfo: {
        name: "Incline Dumbbell Press",
        description:
          "Targets the upper chest and anterior deltoids with a deep stretch.",
        slug: "incline-dumbbell-press",
        difficultyLevel: "Intermediate",
        logMode: "reps_weight",
        muscleGroups: ["Upper Chest", "Front Delts", "Triceps"],
        equipment: ["Dumbbells", "Bench"],
        createdAt: new Date("2025-02-01"),
        updatedAt: new Date("2025-09-12"),
      },
    },

    // ----- EXERCISE 3 -----
    {
      exerciseId: "lateral_raise_003",
      restTimeSeconds: 60,

      sets: [
        { setNumber: 1, targetReps: 15, targetWeightKg: 8 },
        { setNumber: 2, targetReps: 15, targetWeightKg: 8 },
        { setNumber: 3, targetReps: 12, targetWeightKg: 8 },
      ],

      exerciseInfo: {
        name: "Dumbbell Lateral Raise",
        description: "Isolation exercise for the side delts.",
        slug: "dumbbell-lateral-raise",
        difficultyLevel: "Beginner",
        logMode: "reps_weight",
        muscleGroups: ["Side Delts"],
        equipment: ["Dumbbells"],
        createdAt: new Date("2025-03-11"),
        updatedAt: new Date("2025-09-20"),
      },
    },

    // ----- EXERCISE 4 -----
    {
      exerciseId: "tricep_pushdown_004",
      restTimeSeconds: 90,

      sets: [
        { setNumber: 1, targetReps: 12, targetWeightKg: 25 },
        { setNumber: 2, targetReps: 12, targetWeightKg: 25 },
        { setNumber: 3, targetReps: 10, targetWeightKg: 25 },
      ],

      exerciseInfo: {
        name: "Cable Tricep Pushdown",
        description: "Isolation movement focusing on the triceps long head.",
        slug: "cable-tricep-pushdown",
        difficultyLevel: "Beginner",
        logMode: "reps_weight",
        muscleGroups: ["Triceps"],
        equipment: ["Cable Machine"],
        createdAt: new Date("2025-05-01"),
        updatedAt: new Date("2025-09-29"),
      },
    },

    // ----- EXERCISE 5 -----
    {
      exerciseId: "plank_hold_005",
      restTimeSeconds: 60,

      sets: [
        { setNumber: 1, targetTimeSeconds: 60 },
        { setNumber: 2, targetTimeSeconds: 60 },
        { setNumber: 3, targetTimeSeconds: 45 },
      ],

      exerciseInfo: {
        name: "Plank Hold",
        description:
          "Isometric core exercise emphasizing stability and endurance.",
        slug: "plank-hold",
        difficultyLevel: "Beginner",
        logMode: "time",
        muscleGroups: ["Abs"],
        equipment: ["Bodyweight"],
        createdAt: new Date("2025-06-15"),
        updatedAt: new Date("2025-10-05"),
      },
    },
  ],
};
