export const GenderValues = {
    Male: "male",
    Female: "female",
    NonBinary: "non-binary",
    Other: "other",
    PreferNotToSay: "prefer-not-to-say"
} as const;
export type Gender = typeof GenderValues[keyof typeof GenderValues];

export const PrimaryGoalValues = {
    FatLoss: "fat-loss",
    MuscleGain: "muscle-gain",
    Strength: "strength",
    Endurance: "endurance",
    Mobility: "mobility",
    GeneralFitness: "general-fitness"
} as const;
export type PrimaryGoal = typeof PrimaryGoalValues[keyof typeof PrimaryGoalValues];

export const PreferredSplitValues = {
    FullBody: "full-body",
    UpperLower: "upper-lower",
    PushPullLegs: "push-pull-legs",
    Other: "other",
    DontKnow: "dont-know"
} as const;
export type PreferredSplit = typeof PreferredSplitValues[keyof typeof PreferredSplitValues];

export const GymComfortLevelValues = {
    Anxious: "anxious",
    Nervous: "nervous",
    Fine: "fine",
    Comfortable: "comfortable",
    NeverBeen: "never-been"
} as const;
export type GymComfortLevel = typeof GymComfortLevelValues[keyof typeof GymComfortLevelValues];