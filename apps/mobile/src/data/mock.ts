import { defaultExerciseLibrary, scienceRecommendations, type DashboardSummary } from "@fitplanner/shared";

export const fallbackUser = {
  id: "demo-user",
  name: "Usuário teste",
  email: "teste@fitplanner.app",
  createdAt: "2026-05-06T00:00:00.000Z",
};

export const fallbackDashboard: DashboardSummary = {
  weeklyWorkouts: [
    { id: "push", name: "Força de empurrar", type: "Strength", dayOfWeek: 1, exerciseCount: 5 },
    { id: "pull", name: "Costas e bíceps", type: "Hypertrophy", dayOfWeek: 3, exerciseCount: 6 },
    { id: "legs", name: "Pernas pesadas", type: "Strength", dayOfWeek: 5, exerciseCount: 5 },
    { id: "conditioning", name: "Condicionamento HIIT", type: "HIIT", dayOfWeek: 6, exerciseCount: 4 },
  ],
  lastWorkout: {
    id: "last",
    workoutName: "Força de empurrar",
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
      { muscleGroup: "Chest", sets: 7, status: "base", message: "Bom ponto de partida; suba para 10+ séries se hipertrofia for prioridade." },
      { muscleGroup: "Back", sets: 8, status: "base", message: "Distribua puxadas verticais e remadas para dorsais e upper back." },
      { muscleGroup: "Quads", sets: 4, status: "low", message: "Volume baixo para pernas; adicione agachamento, leg press ou passada." },
      { muscleGroup: "Core", sets: 8, status: "base", message: "Boa frequência; alterne anti-extensão, anti-rotação e oblíquos." },
    ],
  },
};

export const fallbackExercises = defaultExerciseLibrary.map((exercise) => ({ ...exercise, userId: null }));

const exerciseById = Object.fromEntries(fallbackExercises.map((exercise) => [exercise.id, exercise]));

export const fallbackWorkouts = [
  {
    id: "push",
    name: "Força de empurrar",
    type: "Strength",
    description: "Peito, ombros e tríceps com foco em carga.",
    dayOfWeek: 1,
    exercises: [
      { id: "we1", sets: 4, reps: 6, restSeconds: 150, targetWeight: 87.5, order: 0, exercise: exerciseById["global-bench-press"] },
      { id: "we2", sets: 3, reps: 8, restSeconds: 120, targetWeight: 45, order: 1, exercise: exerciseById["global-overhead-press"] },
    ],
  },
  {
    id: "pull",
    name: "Costas e bíceps",
    type: "Hypertrophy",
    description: "Volume para dorsais e braços.",
    dayOfWeek: 3,
    exercises: [
      { id: "we3", sets: 4, reps: 8, restSeconds: 120, targetWeight: null, order: 0, exercise: exerciseById["global-pull-up"] },
      { id: "we4", sets: 4, reps: 10, restSeconds: 105, targetWeight: 72.5, order: 1, exercise: exerciseById["global-barbell-row"] },
      { id: "we8", sets: 3, reps: 12, restSeconds: 75, targetWeight: 24, order: 2, exercise: exerciseById["global-dumbbell-curl"] },
    ],
  },
  {
    id: "conditioning",
    name: "Condicionamento HIIT",
    type: "HIIT",
    description: "Blocos curtos de alta intensidade.",
    dayOfWeek: 6,
    exercises: [
      { id: "we5", sets: 5, reps: 12, restSeconds: 45, targetWeight: null, order: 0, exercise: exerciseById["global-burpee"] },
      { id: "we6", sets: 4, reps: 45, restSeconds: 30, targetWeight: null, order: 1, exercise: exerciseById["global-plank"] },
    ],
  },
];
