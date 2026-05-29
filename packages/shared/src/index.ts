import { z } from "zod";

export const muscleGroups = [
  "Chest",
  "Upper Chest",
  "Mid Chest",
  "Lower Chest",
  "Back",
  "Lats",
  "Upper Back",
  "Traps",
  "Lower Back",
  "Legs",
  "Quads",
  "Hamstrings",
  "Glutes",
  "Calves",
  "Adductors",
  "Abductors",
  "Shoulders",
  "Front Delts",
  "Side Delts",
  "Rear Delts",
  "Biceps",
  "Triceps",
  "Forearms",
  "Core",
  "Abs",
  "Obliques",
  "Full Body",
] as const;

export const primaryMuscleGroups = [
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
  "Endurance",
  "Power",
  "Recovery",
  "Home",
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

export const muscleGroupSchema = z.string().trim().min(2).max(60);
export const workoutTypeSchema = z.string().trim().min(2).max(40).default("Strength");

export const muscleGroupParentMap: Record<string, (typeof primaryMuscleGroups)[number]> = {
  "Upper Chest": "Chest",
  "Mid Chest": "Chest",
  "Lower Chest": "Chest",
  Lats: "Back",
  "Upper Back": "Back",
  Traps: "Back",
  "Lower Back": "Back",
  Quads: "Legs",
  Hamstrings: "Legs",
  Glutes: "Legs",
  Calves: "Legs",
  Adductors: "Legs",
  Abductors: "Legs",
  "Front Delts": "Shoulders",
  "Side Delts": "Shoulders",
  "Rear Delts": "Shoulders",
  Forearms: "Biceps",
  Abs: "Core",
  Obliques: "Core",
};

export function getPrimaryMuscleGroup(group?: string | null): (typeof primaryMuscleGroups)[number] {
  if (!group) {
    return "Full Body";
  }

  if ((primaryMuscleGroups as readonly string[]).includes(group)) {
    return group as (typeof primaryMuscleGroups)[number];
  }

  return muscleGroupParentMap[group] ?? "Full Body";
}

export const scienceSources = [
  {
    id: "acsm-2009",
    title: "ACSM Position Stand: Progression Models in Resistance Training for Healthy Adults",
    url: "https://www.acsm.org/wp-content/uploads/2025/01/Progression-Models-in-Resistance-Training-for-Healthy-Adults.pdf",
    takeaway: "Progressive overload, goal-specific loading, rest intervals and training status should guide resistance-training prescription.",
  },
  {
    id: "schoenfeld-volume-2017",
    title: "Dose-response relationship between weekly resistance training volume and increases in muscle mass",
    url: "https://pubmed.ncbi.nlm.nih.gov/27433992/",
    takeaway: "Higher weekly set volumes are associated with greater hypertrophy, with 10 or more weekly sets outperforming lower volumes.",
  },
  {
    id: "schoenfeld-load-2017",
    title: "Strength and Hypertrophy Adaptations Between Low- vs. High-Load Resistance Training",
    url: "https://europepmc.org/article/MED/28834797",
    takeaway: "Hypertrophy can occur across a broad loading range when sets are hard, while heavier loads are more specific for maximal strength.",
  },
  {
    id: "grgic-rest-2017",
    title: "Effects of Rest Interval Duration in Resistance Training on Measures of Muscular Strength",
    url: "https://europepmc.org/article/MED/28933024",
    takeaway: "Longer rest intervals tend to better support strength performance by preserving repetition quality and total volume.",
  },
  {
    id: "failure-meta-2022",
    title: "Influence of Resistance Training Proximity-to-Failure on Skeletal Muscle Hypertrophy",
    url: "https://link.springer.com/article/10.1007/s40279-022-01784-y",
    takeaway: "Training close to failure is useful, but frequent all-out failure is not required for hypertrophy and can increase fatigue cost.",
  },
  {
    id: "who-2020",
    title: "WHO Guidelines on Physical Activity and Sedentary Behaviour",
    url: "https://www.ncbi.nlm.nih.gov/books/n/who336656/",
    takeaway: "Adults benefit from 150-300 minutes of moderate aerobic activity or 75-150 vigorous minutes weekly plus muscle-strengthening on 2 or more days.",
  },
] as const;

export const scienceRecommendations = [
  {
    id: "weekly-volume",
    title: "Volume semanal por músculo",
    summary: "Use 10-20 séries diretas por músculo por semana como zona de hipertrofia para a maioria das pessoas, subindo aos poucos.",
    action: "Se um músculo estiver abaixo de 6 séries, adicione 2-4 séries semanais. Se passar de 20, monitore dor, queda de performance e sono.",
    sourceIds: ["schoenfeld-volume-2017", "acsm-2009"],
  },
  {
    id: "progressive-overload",
    title: "Progressão planejada",
    summary: "Quando completar o topo da faixa de repetições com boa técnica em todas as séries, aumente a carga de forma conservadora.",
    action: "Para exercícios principais, aumente 2,5-5%. Para isoladores, prefira 1-2 kg ou mais repetições antes de subir carga.",
    sourceIds: ["acsm-2009"],
  },
  {
    id: "rest-interval",
    title: "Descanso por objetivo",
    summary: "Descansos maiores preservam força e volume; descansos curtos funcionam melhor para condicionamento e sessões metabólicas.",
    action: "Use 120-180s em multiarticulares pesados, 60-90s em isoladores e 30-60s em circuitos/HIIT.",
    sourceIds: ["grgic-rest-2017", "acsm-2009"],
  },
  {
    id: "load-zone",
    title: "Carga e repetição",
    summary: "Força máxima responde melhor a cargas altas; hipertrofia pode ocorrer com cargas leves a pesadas se as séries forem desafiadoras.",
    action: "Combine 3-6 reps para força, 6-15 para base de hipertrofia e 15-30 para isoladores ou treino em casa.",
    sourceIds: ["schoenfeld-load-2017", "acsm-2009"],
  },
  {
    id: "failure-management",
    title: "Falha muscular com parcimônia",
    summary: "Chegar perto da falha ajuda, mas falhar em toda série não é necessário e pode atrapalhar recuperação.",
    action: "Mantenha 1-3 repetições em reserva na maior parte das séries e reserve falha para última série de isoladores seguros.",
    sourceIds: ["failure-meta-2022"],
  },
  {
    id: "aerobic-strength-base",
    title: "Base cardiorrespiratória",
    summary: "Saúde e recuperação melhoram quando força e atividade aeróbica coexistem no plano semanal.",
    action: "Some 150-300 minutos moderados ou 75-150 vigorosos por semana e mantenha força 2+ dias/semana.",
    sourceIds: ["who-2020"],
  },
] as const;

export const guideSteps = [
  {
    id: "plan",
    title: "Planeje",
    summary: "Escolha o treino da semana e confira se os principais grupos musculares aparecem no plano.",
    action: "Abra Treinos e deixe o próximo treino pronto antes da academia.",
  },
  {
    id: "train",
    title: "Treine",
    summary: "Durante a sessão, registre carga, reps e esforço percebido sem sair do fluxo.",
    action: "Use Iniciar treino e salve a sessão ao finalizar.",
  },
  {
    id: "adjust",
    title: "Ajuste",
    summary: "Depois do treino, use volume semanal, peso corporal e carga para decidir o próximo ajuste.",
    action: "Se um grupo estiver baixo, adicione poucas séries; se estiver alto, monitore fadiga.",
  },
] as const;

export const defaultExerciseLibrary = [
  { id: "global-bench-press", name: "Supino reto", muscleGroup: "Mid Chest", equipment: "Barra", instructions: "Escapulas firmes, barra descendo com controle e subida forte sem perder a ponte.", pattern: "Horizontal push" },
  { id: "global-incline-dumbbell-press", name: "Supino inclinado com halteres", muscleGroup: "Upper Chest", equipment: "Halteres", instructions: "Use amplitude controlada e mantenha o peito alto durante toda a serie.", pattern: "Incline push" },
  { id: "global-cable-fly", name: "Crucifixo no cabo", muscleGroup: "Mid Chest", equipment: "Cabo", instructions: "Abrace a linha do peito sem deixar o ombro dominar o movimento.", pattern: "Isolation" },
  { id: "global-push-up", name: "Flexão de braços", muscleGroup: "Chest", equipment: "Peso corporal", instructions: "Corpo em linha, cotovelos controlados e peito aproximando do solo.", pattern: "Horizontal push" },
  { id: "global-pull-up", name: "Barra fixa", muscleGroup: "Lats", equipment: "Barra fixa", instructions: "Comece em suspensao completa, puxe o peito para a barra e controle a descida.", pattern: "Vertical pull" },
  { id: "global-lat-pulldown", name: "Puxada alta", muscleGroup: "Lats", equipment: "Maquina/cabo", instructions: "Puxe os cotovelos para baixo sem jogar o tronco para tras.", pattern: "Vertical pull" },
  { id: "global-barbell-row", name: "Remada curvada", muscleGroup: "Upper Back", equipment: "Barra", instructions: "Tronco firme, quadril em hinge e barra indo em direcao as costelas.", pattern: "Horizontal pull" },
  { id: "global-face-pull", name: "Face pull", muscleGroup: "Rear Delts", equipment: "Cabo", instructions: "Puxe a corda para a linha dos olhos abrindo os cotovelos.", pattern: "Shoulder health" },
  { id: "global-back-squat", name: "Agachamento livre", muscleGroup: "Quads", equipment: "Barra", instructions: "Trave o core, joelhos acompanhando os pés e suba empurrando o chão.", pattern: "Squat" },
  { id: "global-leg-press", name: "Leg press", muscleGroup: "Quads", equipment: "Maquina", instructions: "Controle a descida, mantenha quadril apoiado e empurre sem travar agressivamente os joelhos.", pattern: "Squat" },
  { id: "global-romanian-deadlift", name: "Levantamento romeno", muscleGroup: "Hamstrings", equipment: "Barra", instructions: "Quadril para tras, coluna neutra e tensao nos posteriores.", pattern: "Hinge" },
  { id: "global-hip-thrust", name: "Hip thrust", muscleGroup: "Glutes", equipment: "Barra", instructions: "Queixo levemente recolhido, retroversão no topo e pausa curta contraindo glúteos.", pattern: "Hip extension" },
  { id: "global-calf-raise", name: "Elevacao de panturrilha", muscleGroup: "Calves", equipment: "Maquina/halteres", instructions: "Suba no maximo, pause e desca ate alongar a panturrilha.", pattern: "Isolation" },
  { id: "global-overhead-press", name: "Desenvolvimento militar", muscleGroup: "Front Delts", equipment: "Barra", instructions: "Glúteos e core firmes, barra subindo em linha reta acima da cabeça.", pattern: "Vertical push" },
  { id: "global-lateral-raise", name: "Elevacao lateral", muscleGroup: "Side Delts", equipment: "Halteres", instructions: "Suba ate a linha do ombro sem encolher o trapezio.", pattern: "Isolation" },
  { id: "global-rear-delt-fly", name: "Crucifixo inverso", muscleGroup: "Rear Delts", equipment: "Halteres/máquina", instructions: "Abra os braços com controle mantendo o tronco estável.", pattern: "Isolation" },
  { id: "global-dumbbell-curl", name: "Rosca direta", muscleGroup: "Biceps", equipment: "Halteres", instructions: "Cotovelos fixos, subida sem balanço e descida controlada.", pattern: "Isolation" },
  { id: "global-hammer-curl", name: "Rosca martelo", muscleGroup: "Forearms", equipment: "Halteres", instructions: "Pegada neutra, punhos firmes e amplitude completa.", pattern: "Isolation" },
  { id: "global-triceps-pushdown", name: "Tríceps na polia", muscleGroup: "Triceps", equipment: "Cabo", instructions: "Cotovelos junto ao tronco e extensão completa no fim.", pattern: "Isolation" },
  { id: "global-overhead-triceps-extension", name: "Tríceps acima da cabeça", muscleGroup: "Triceps", equipment: "Cabo/halter", instructions: "Mantenha cotovelos altos e controle o alongamento.", pattern: "Isolation" },
  { id: "global-plank", name: "Prancha", muscleGroup: "Abs", equipment: "Peso corporal", instructions: "Costelas baixas, glúteos firmes e linha reta da cabeça aos pés.", pattern: "Core anti-extension" },
  { id: "global-dead-bug", name: "Dead bug", muscleGroup: "Abs", equipment: "Peso corporal", instructions: "Lombar estavel no solo enquanto alterna braco e perna.", pattern: "Core control" },
  { id: "global-side-plank", name: "Prancha lateral", muscleGroup: "Obliques", equipment: "Peso corporal", instructions: "Quadril alto e tronco alinhado sem girar para frente.", pattern: "Core anti-lateral-flexion" },
  { id: "global-bird-dog", name: "Bird dog", muscleGroup: "Lower Back", equipment: "Peso corporal", instructions: "Estenda membros opostos sem rodar a pelve.", pattern: "Core stability" },
  { id: "global-burpee", name: "Burpee", muscleGroup: "Full Body", equipment: "Peso corporal", instructions: "Transicoes fluidas, core firme e aterrissagem suave.", pattern: "Conditioning" },
  { id: "global-kettlebell-swing", name: "Kettlebell swing", muscleGroup: "Glutes", equipment: "Kettlebell", instructions: "Movimento vem do quadril, não de agachamento; finalize com glúteos contraídos.", pattern: "Power hinge" },
  { id: "global-jump-rope", name: "Corda", muscleGroup: "Calves", equipment: "Corda", instructions: "Saltos baixos, punhos girando a corda e ritmo respiratorio constante.", pattern: "Cardio" },
  { id: "global-mountain-climber", name: "Mountain climber", muscleGroup: "Full Body", equipment: "Peso corporal", instructions: "Ombros sobre mãos e joelhos alternando rápido sem perder o core.", pattern: "Conditioning" },
] as const;

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

export type DefaultMuscleGroup = (typeof muscleGroups)[number];
export type PrimaryMuscleGroup = (typeof primaryMuscleGroups)[number];
export type MuscleGroup = DefaultMuscleGroup | (string & {});
export type DefaultWorkoutType = (typeof workoutTypes)[number];
export type WorkoutType = DefaultWorkoutType | (string & {});
export type ScienceSource = (typeof scienceSources)[number];
export type ScienceRecommendation = (typeof scienceRecommendations)[number];
export type GuideStep = (typeof guideSteps)[number];
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
  science: {
    recommendations: ScienceRecommendation[];
    weeklyMuscleSets: Array<{
      muscleGroup: string;
      sets: number;
      status: "low" | "base" | "optimal" | "high";
      message: string;
    }>;
  };
};
