import type { DashboardSummary } from "@fitplanner/shared";

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
};

export const fallbackExercises = [
  { id: "global-bench-press", name: "Supino reto", muscleGroup: "Chest", equipment: "Barra", instructions: "Desça com controle e empurre com força.", userId: null },
  { id: "global-pull-up", name: "Barra fixa", muscleGroup: "Back", equipment: "Barra fixa", instructions: "Faça a suspensão completa e controle a subida.", userId: null },
  { id: "global-back-squat", name: "Agachamento livre", muscleGroup: "Legs", equipment: "Barra", instructions: "Trave o core e empurre o chão com os pés.", userId: null },
  { id: "global-overhead-press", name: "Desenvolvimento militar", muscleGroup: "Shoulders", equipment: "Barra", instructions: "Trave glúteos e pressione acima da cabeça.", userId: null },
  { id: "global-dumbbell-curl", name: "Rosca direta", muscleGroup: "Biceps", equipment: "Halteres", instructions: "Controle a descida e mantenha cotovelos fixos.", userId: null },
  { id: "global-triceps-pushdown", name: "Tríceps polia", muscleGroup: "Triceps", equipment: "Cabo", instructions: "Estenda completamente sem abrir os cotovelos.", userId: null },
  { id: "global-plank", name: "Prancha", muscleGroup: "Core", equipment: "Peso corporal", instructions: "Mantenha costelas baixas e glúteos firmes.", userId: null },
  { id: "global-burpee", name: "Burpee", muscleGroup: "Full Body", equipment: "Peso corporal", instructions: "Mova rápido com controle no apoio.", userId: null },
];

export const fallbackWorkouts = [
  {
    id: "push",
    name: "Força de empurrar",
    type: "Strength",
    description: "Peito, ombros e tríceps com foco em carga.",
    dayOfWeek: 1,
    exercises: [
      { id: "we1", sets: 4, reps: 6, restSeconds: 150, targetWeight: 87.5, order: 0, exercise: fallbackExercises[0] },
      { id: "we2", sets: 3, reps: 8, restSeconds: 120, targetWeight: 45, order: 1, exercise: fallbackExercises[3] },
    ],
  },
  {
    id: "pull",
    name: "Costas e bíceps",
    type: "Hypertrophy",
    description: "Volume para dorsais e braços.",
    dayOfWeek: 3,
    exercises: [
      { id: "we3", sets: 4, reps: 8, restSeconds: 120, targetWeight: null, order: 0, exercise: fallbackExercises[1] },
      { id: "we4", sets: 3, reps: 10, restSeconds: 90, targetWeight: 24, order: 1, exercise: fallbackExercises[4] },
    ],
  },
  {
    id: "conditioning",
    name: "Condicionamento HIIT",
    type: "HIIT",
    description: "Blocos curtos de alta intensidade.",
    dayOfWeek: 6,
    exercises: [
      { id: "we5", sets: 5, reps: 12, restSeconds: 45, targetWeight: null, order: 0, exercise: fallbackExercises[7] },
      { id: "we6", sets: 4, reps: 45, restSeconds: 30, targetWeight: null, order: 1, exercise: fallbackExercises[6] },
    ],
  },
];
