import { z } from "zod";

export const muscleGroups = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Core",
  "Full Body",
] as const;

export const workoutTypes = [
  "Strength",
  "Hypertrophy",
  "Cardio",
  "Mobility",
  "HIIT",
] as const;

export const dayOfWeekLabels = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const muscleGroupSchema = z.enum(muscleGroups);
export const workoutTypeSchema = z.enum(workoutTypes);

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().toLowerCase(),
  password: z.string().min(8).max(120),
});

export const loginSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(1),
});

export const exerciseCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  muscleGroup: muscleGroupSchema,
  equipment: z.string().trim().max(120).optional().nullable(),
  instructions: z.string().trim().max(3000).optional().nullable(),
});

export const exerciseUpdateSchema = exerciseCreateSchema.partial();

export const workoutExerciseInputSchema = z.object({
  exerciseId: z.string().min(1),
  sets: z.coerce.number().int().min(1).max(20),
  reps: z.coerce.number().int().min(1).max(200),
  restSeconds: z.coerce.number().int().min(0).max(1800),
  targetWeight: z.coerce.number().min(0).max(1000).optional().nullable(),
  order: z.coerce.number().int().min(0).max(200),
});

export const workoutCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  type: workoutTypeSchema.default("Strength"),
  description: z.string().trim().max(2000).optional().nullable(),
  dayOfWeek: z.coerce.number().int().min(0).max(6).optional().nullable(),
  exercises: z.array(workoutExerciseInputSchema).min(1).max(80),
});

export const workoutUpdateSchema = workoutCreateSchema.partial().extend({
  exercises: z.array(workoutExerciseInputSchema).min(1).max(80).optional(),
});

export const exerciseLogInputSchema = z.object({
  exerciseId: z.string().min(1),
  setsCompleted: z.coerce.number().int().min(0).max(50),
  repsCompleted: z.coerce.number().int().min(0).max(1000),
  weightUsed: z.coerce.number().min(0).max(1000).optional().nullable(),
  perceivedEffort: z.coerce.number().int().min(1).max(10),
});

export const workoutLogCreateSchema = z.object({
  workoutId: z.string().min(1),
  date: z.coerce.date().optional(),
  durationMinutes: z.coerce.number().int().min(1).max(1440),
  notes: z.string().trim().max(3000).optional().nullable(),
  exercises: z.array(exerciseLogInputSchema).min(1).max(120),
});

export const bodyProgressCreateSchema = z.object({
  weight: z.coerce.number().min(20).max(500),
  height: z.coerce.number().min(80).max(260).optional().nullable(),
  bodyFat: z.coerce.number().min(1).max(80).optional().nullable(),
  chest: z.coerce.number().min(20).max(250).optional().nullable(),
  waist: z.coerce.number().min(20).max(250).optional().nullable(),
  hips: z.coerce.number().min(20).max(250).optional().nullable(),
  arms: z.coerce.number().min(10).max(120).optional().nullable(),
  thighs: z.coerce.number().min(20).max(160).optional().nullable(),
  date: z.coerce.date().optional(),
});

export const bodyProgressUpdateSchema = bodyProgressCreateSchema.partial();

export const idParamSchema = z.object({
  id: z.string().min(1),
});

export type MuscleGroup = (typeof muscleGroups)[number];
export type WorkoutType = (typeof workoutTypes)[number];
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ExerciseCreateInput = z.infer<typeof exerciseCreateSchema>;
export type ExerciseUpdateInput = z.infer<typeof exerciseUpdateSchema>;
export type WorkoutCreateInput = z.infer<typeof workoutCreateSchema>;
export type WorkoutUpdateInput = z.infer<typeof workoutUpdateSchema>;
export type WorkoutLogCreateInput = z.infer<typeof workoutLogCreateSchema>;
export type BodyProgressCreateInput = z.infer<typeof bodyProgressCreateSchema>;
export type BodyProgressUpdateInput = z.infer<typeof bodyProgressUpdateSchema>;

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type AuthResponse = {
  token: string;
  user: ApiUser;
};

export type DashboardSummary = {
  weeklyWorkouts: Array<{
    id: string;
    name: string;
    type: WorkoutType | string;
    dayOfWeek: number | null;
    exerciseCount: number;
  }>;
  lastWorkout: {
    id: string;
    workoutName: string;
    date: string;
    durationMinutes: number;
  } | null;
  totalWorkoutsThisMonth: number;
  workoutStreak: number;
  bodyWeightTrend: Array<{ date: string; weight: number }>;
  exerciseLoadTrend: Array<{
    date: string;
    exerciseName: string;
    weightUsed: number | null;
  }>;
  mostPerformedExercises: Array<{
    exerciseId: string;
    exerciseName: string;
    count: number;
  }>;
  cards: {
    currentWeight: number | null;
    weightChange: number | null;
    totalLoggedWorkouts: number;
    averageEffort: number | null;
  };
};
