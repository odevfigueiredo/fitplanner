import { defaultExerciseLibrary, scienceRecommendations, type DashboardSummary } from "@fitplanner/shared";

export const fallbackUser = {
  id: "demo-user",
  name: "Usuario teste",
  email: "teste@fitplanner.app",
  createdAt: "2026-05-06T00:00:00.000Z",
};

export const fallbackDashboard: DashboardSummary = {
  weeklyWorkouts: [
    { id: "push", name: "Forca de empurrar", type: "Strength", dayOfWeek: 1, exerciseCount: 5 },
    { id: "pull", name: "Costas e biceps", type: "Hypertrophy", dayOfWeek: 3, exerciseCount: 6 },
    { id: "legs", name: "Pernas pesadas", type: "Strength", dayOfWeek: 5, exerciseCount: 5 },
    { id: "conditioning", name: "Condicionamento HIIT", type: "HIIT", dayOfWeek: 6, exerciseCount: 4 },
  ],
  lastWorkout: {
    id: "log-1",
    workoutName: "Forca de empurrar",
    date: "2026-05-05T21:00:00.000Z",
    durationMinutes: 58,
  },
  totalWorkoutsThisMonth: 12,
  workoutStreak: 5,
  bodyWeightTrend: [
    { date: "2026-03-10", weight: 84.2 },
    { date: "2026-03-24", weight: 83.5 },
    { date: "2026-04-07", weight: 82.9 },
    { date: "2026-04-21", weight: 82.4 },
    { date: "2026-05-05", weight: 81.8 },
  ],
  exerciseLoadTrend: [
    { date: "2026-03-10", exerciseName: "Supino reto", weightUsed: 78 },
    { date: "2026-03-24", exerciseName: "Supino reto", weightUsed: 80 },
    { date: "2026-04-07", exerciseName: "Supino reto", weightUsed: 82.5 },
    { date: "2026-04-21", exerciseName: "Supino reto", weightUsed: 85 },
    { date: "2026-05-05", exerciseName: "Supino reto", weightUsed: 87.5 },
  ],
  mostPerformedExercises: [
    { exerciseId: "bench", exerciseName: "Supino reto", count: 10 },
    { exerciseId: "squat", exerciseName: "Agachamento livre", count: 8 },
    { exerciseId: "row", exerciseName: "Remada curvada", count: 7 },
    { exerciseId: "plank", exerciseName: "Prancha", count: 6 },
  ],
  cards: {
    currentWeight: 81.8,
    weightChange: -0.6,
    totalLoggedWorkouts: 42,
    averageEffort: 8.3,
  },
  science: {
    recommendations: [...scienceRecommendations],
    weeklyMuscleSets: [
      { muscleGroup: "Chest", sets: 7, status: "base", message: "Bom ponto de partida; suba para 10+ series se hipertrofia for prioridade." },
      { muscleGroup: "Back", sets: 8, status: "base", message: "Distribua puxadas verticais e remadas para dorsais e upper back." },
      { muscleGroup: "Quads", sets: 4, status: "low", message: "Volume baixo para pernas; adicione agachamento, leg press ou passada." },
      { muscleGroup: "Core", sets: 8, status: "base", message: "Boa frequencia; alterne anti-extensao, anti-rotacao e obliquos." },
    ],
  },
};

export const fallbackExercises = defaultExerciseLibrary.map((exercise) => ({ ...exercise, userId: null }));

const exerciseById = Object.fromEntries(fallbackExercises.map((exercise) => [exercise.id, exercise]));

export const fallbackWorkouts = [
  {
    id: "push",
    name: "Forca de empurrar",
    type: "Strength",
    description: "Peito, ombros e triceps com foco em progressao de carga.",
    dayOfWeek: 1,
    exercises: [
      { id: "we1", sets: 4, reps: 6, restSeconds: 150, targetWeight: 87.5, order: 0, exercise: exerciseById["global-bench-press"] },
      { id: "we2", sets: 3, reps: 8, restSeconds: 120, targetWeight: 45, order: 1, exercise: exerciseById["global-overhead-press"] },
      { id: "we3", sets: 3, reps: 12, restSeconds: 75, targetWeight: 35, order: 2, exercise: exerciseById["global-triceps-pushdown"] },
    ],
  },
  {
    id: "pull",
    name: "Costas e biceps",
    type: "Hypertrophy",
    description: "Volume para dorsais, remadas e bracos.",
    dayOfWeek: 3,
    exercises: [
      { id: "we4", sets: 4, reps: 8, restSeconds: 120, targetWeight: null, order: 0, exercise: exerciseById["global-pull-up"] },
      { id: "we5", sets: 4, reps: 10, restSeconds: 105, targetWeight: 72.5, order: 1, exercise: exerciseById["global-barbell-row"] },
      { id: "we8", sets: 3, reps: 12, restSeconds: 75, targetWeight: 24, order: 2, exercise: exerciseById["global-dumbbell-curl"] },
    ],
  },
  {
    id: "conditioning",
    name: "Condicionamento HIIT",
    type: "HIIT",
    description: "Blocos curtos de alta intensidade para fechar a semana.",
    dayOfWeek: 6,
    exercises: [
      { id: "we6", sets: 5, reps: 12, restSeconds: 45, targetWeight: null, order: 0, exercise: exerciseById["global-burpee"] },
      { id: "we7", sets: 4, reps: 45, restSeconds: 30, targetWeight: null, order: 1, exercise: exerciseById["global-plank"] },
    ],
  },
];

export const fallbackWorkoutLogs = [
  {
    id: "log-1",
    date: "2026-05-05T21:00:00.000Z",
    durationMinutes: 58,
    notes: "Boa execucao e carga subindo.",
    workout: { name: "Forca de empurrar" },
    exercises: [
      { id: "log-ex-1", exercise: { name: "Supino reto" }, weightUsed: 87.5, perceivedEffort: 8 },
      { id: "log-ex-2", exercise: { name: "Desenvolvimento militar" }, weightUsed: 45, perceivedEffort: 8 },
    ],
  },
  {
    id: "log-2",
    date: "2026-05-03T20:15:00.000Z",
    durationMinutes: 46,
    notes: "Sessao metabolica rapida.",
    workout: { name: "Condicionamento HIIT" },
    exercises: [
      { id: "log-ex-3", exercise: { name: "Burpee" }, weightUsed: null, perceivedEffort: 9 },
      { id: "log-ex-4", exercise: { name: "Prancha" }, weightUsed: null, perceivedEffort: 7 },
    ],
  },
];

export const fallbackBodyProgress = [
  { id: "bp-1", date: "2026-03-10T12:00:00.000Z", weight: 84.2, bodyFat: 18.6, waist: 88, chest: 103, arms: 36 },
  { id: "bp-2", date: "2026-03-24T12:00:00.000Z", weight: 83.5, bodyFat: 18.1, waist: 87, chest: 103, arms: 36.2 },
  { id: "bp-3", date: "2026-04-07T12:00:00.000Z", weight: 82.9, bodyFat: 17.8, waist: 86, chest: 104, arms: 36.5 },
  { id: "bp-4", date: "2026-04-21T12:00:00.000Z", weight: 82.4, bodyFat: 17.3, waist: 85, chest: 104, arms: 36.7 },
  { id: "bp-5", date: "2026-05-05T12:00:00.000Z", weight: 81.8, bodyFat: 16.9, waist: 84, chest: 105, arms: 37 },
];
