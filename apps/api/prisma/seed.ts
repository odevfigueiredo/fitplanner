import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { muscleGroups } from "@fitplanner/shared";

const prisma = new PrismaClient();

const defaultExercises = [
  {
    name: "Bench Press",
    muscleGroup: "Chest",
    equipment: "Barbell",
    instructions: "Keep shoulder blades tight, lower the bar under control, and press explosively.",
  },
  {
    name: "Incline Dumbbell Press",
    muscleGroup: "Chest",
    equipment: "Dumbbells",
    instructions: "Use a controlled range of motion and avoid bouncing at the bottom.",
  },
  {
    name: "Pull-Up",
    muscleGroup: "Back",
    equipment: "Pull-up bar",
    instructions: "Start from a full hang, pull chest toward the bar, and control the descent.",
  },
  {
    name: "Barbell Row",
    muscleGroup: "Back",
    equipment: "Barbell",
    instructions: "Hinge at the hips, brace the core, and row the bar toward the lower ribs.",
  },
  {
    name: "Back Squat",
    muscleGroup: "Legs",
    equipment: "Barbell",
    instructions: "Brace hard, keep knees tracking over toes, and drive through the mid-foot.",
  },
  {
    name: "Romanian Deadlift",
    muscleGroup: "Legs",
    equipment: "Barbell",
    instructions: "Push hips back, keep the spine neutral, and feel the hamstrings lengthen.",
  },
  {
    name: "Overhead Press",
    muscleGroup: "Shoulders",
    equipment: "Barbell",
    instructions: "Squeeze glutes, brace the core, and press the bar overhead in a straight path.",
  },
  {
    name: "Lateral Raise",
    muscleGroup: "Shoulders",
    equipment: "Dumbbells",
    instructions: "Raise elbows to shoulder height with a slight bend and controlled tempo.",
  },
  {
    name: "Dumbbell Curl",
    muscleGroup: "Biceps",
    equipment: "Dumbbells",
    instructions: "Keep elbows pinned, curl with control, and avoid swinging.",
  },
  {
    name: "Triceps Pushdown",
    muscleGroup: "Triceps",
    equipment: "Cable",
    instructions: "Lock elbows by your sides and extend fully at the bottom.",
  },
  {
    name: "Plank",
    muscleGroup: "Core",
    equipment: "Bodyweight",
    instructions: "Keep ribs down, glutes tight, and hold a straight line.",
  },
  {
    name: "Burpee",
    muscleGroup: "Full Body",
    equipment: "Bodyweight",
    instructions: "Move smoothly from plank to jump while keeping the core braced.",
  },
] satisfies Array<{
  name: string;
  muscleGroup: (typeof muscleGroups)[number];
  equipment: string;
  instructions: string;
}>;

function globalExerciseId(name: string) {
  return `global-${name.toLowerCase().replaceAll(" ", "-")}`;
}

async function seedDefaultExercises() {
  for (const exercise of defaultExercises) {
    await prisma.exercise.upsert({
      where: { id: globalExerciseId(exercise.name) },
      update: exercise,
      create: {
        id: globalExerciseId(exercise.name),
        ...exercise,
      },
    });
  }
}

async function seedDemoUser() {
  const passwordHash = await bcrypt.hash("123456", 12);
  const user = await prisma.user.upsert({
    where: { email: "teste@fitplanner.app" },
    update: {
      name: "Usuário Teste",
      passwordHash,
    },
    create: {
      id: "demo-user-fitplanner",
      name: "Usuário Teste",
      email: "teste@fitplanner.app",
      passwordHash,
    },
  });

  await prisma.exerciseLog.deleteMany({ where: { workoutLog: { userId: user.id } } });
  await prisma.workoutLog.deleteMany({ where: { userId: user.id } });
  await prisma.workoutExercise.deleteMany({ where: { workout: { userId: user.id } } });
  await prisma.workout.deleteMany({ where: { userId: user.id } });
  await prisma.bodyProgress.deleteMany({ where: { userId: user.id } });

  const push = await prisma.workout.create({
    data: {
      id: "demo-workout-push",
      userId: user.id,
      name: "Força de empurrar",
      type: "Strength",
      description: "Peito, ombros e tríceps com foco em progressão de carga.",
      dayOfWeek: 1,
      exercises: {
        createMany: {
          data: [
            { exerciseId: globalExerciseId("Bench Press"), sets: 4, reps: 6, restSeconds: 150, targetWeight: 87.5, order: 0 },
            { exerciseId: globalExerciseId("Overhead Press"), sets: 3, reps: 8, restSeconds: 120, targetWeight: 45, order: 1 },
            { exerciseId: globalExerciseId("Triceps Pushdown"), sets: 3, reps: 12, restSeconds: 75, targetWeight: 35, order: 2 },
          ],
        },
      },
    },
  });

  const pull = await prisma.workout.create({
    data: {
      id: "demo-workout-pull",
      userId: user.id,
      name: "Costas e bíceps",
      type: "Hypertrophy",
      description: "Volume controlado para dorsais, remadas e braços.",
      dayOfWeek: 3,
      exercises: {
        createMany: {
          data: [
            { exerciseId: globalExerciseId("Pull-Up"), sets: 4, reps: 8, restSeconds: 120, targetWeight: null, order: 0 },
            { exerciseId: globalExerciseId("Barbell Row"), sets: 4, reps: 10, restSeconds: 105, targetWeight: 72.5, order: 1 },
            { exerciseId: globalExerciseId("Dumbbell Curl"), sets: 3, reps: 12, restSeconds: 75, targetWeight: 24, order: 2 },
          ],
        },
      },
    },
  });

  const hiit = await prisma.workout.create({
    data: {
      id: "demo-workout-hiit",
      userId: user.id,
      name: "Condicionamento HIIT",
      type: "HIIT",
      description: "Blocos curtos para condicionamento e gasto calórico.",
      dayOfWeek: 6,
      exercises: {
        createMany: {
          data: [
            { exerciseId: globalExerciseId("Burpee"), sets: 5, reps: 12, restSeconds: 45, targetWeight: null, order: 0 },
            { exerciseId: globalExerciseId("Plank"), sets: 4, reps: 45, restSeconds: 30, targetWeight: null, order: 1 },
          ],
        },
      },
    },
  });

  await prisma.bodyProgress.createMany({
    data: [
      { id: "demo-progress-1", userId: user.id, date: new Date("2026-03-10T12:00:00.000Z"), weight: 84.2, height: 178, bodyFat: 18.6, chest: 103, waist: 88, hips: 99, arms: 36, thighs: 59 },
      { id: "demo-progress-2", userId: user.id, date: new Date("2026-03-24T12:00:00.000Z"), weight: 83.5, height: 178, bodyFat: 18.1, chest: 103, waist: 87, hips: 98, arms: 36.2, thighs: 59 },
      { id: "demo-progress-3", userId: user.id, date: new Date("2026-04-07T12:00:00.000Z"), weight: 82.9, height: 178, bodyFat: 17.8, chest: 104, waist: 86, hips: 98, arms: 36.5, thighs: 59.5 },
      { id: "demo-progress-4", userId: user.id, date: new Date("2026-04-21T12:00:00.000Z"), weight: 82.4, height: 178, bodyFat: 17.3, chest: 104, waist: 85, hips: 97, arms: 36.7, thighs: 60 },
      { id: "demo-progress-5", userId: user.id, date: new Date("2026-05-05T12:00:00.000Z"), weight: 81.8, height: 178, bodyFat: 16.9, chest: 105, waist: 84, hips: 97, arms: 37, thighs: 60.5 },
    ],
  });

  const logRows = [
    { id: "demo-log-1", workoutId: push.id, date: "2026-04-21T21:00:00.000Z", durationMinutes: 55, bench: 85, effort: 8 },
    { id: "demo-log-2", workoutId: pull.id, date: "2026-04-23T21:00:00.000Z", durationMinutes: 52, bench: null, effort: 7 },
    { id: "demo-log-3", workoutId: hiit.id, date: "2026-05-01T20:20:00.000Z", durationMinutes: 38, bench: null, effort: 9 },
    { id: "demo-log-4", workoutId: push.id, date: "2026-05-03T21:00:00.000Z", durationMinutes: 58, bench: 87.5, effort: 8 },
    { id: "demo-log-5", workoutId: push.id, date: "2026-05-05T21:00:00.000Z", durationMinutes: 60, bench: 90, effort: 9 },
  ];

  for (const row of logRows) {
    await prisma.workoutLog.create({
      data: {
        id: row.id,
        userId: user.id,
        workoutId: row.workoutId,
        date: new Date(row.date),
        durationMinutes: row.durationMinutes,
        notes: "Registro demo para gráficos e histórico.",
        exercises: {
          createMany: {
            data:
              row.workoutId === push.id
                ? [
                    { exerciseId: globalExerciseId("Bench Press"), setsCompleted: 4, repsCompleted: 24, weightUsed: row.bench, perceivedEffort: row.effort },
                    { exerciseId: globalExerciseId("Overhead Press"), setsCompleted: 3, repsCompleted: 24, weightUsed: 45, perceivedEffort: row.effort },
                  ]
                : row.workoutId === pull.id
                  ? [
                      { exerciseId: globalExerciseId("Pull-Up"), setsCompleted: 4, repsCompleted: 30, weightUsed: null, perceivedEffort: row.effort },
                      { exerciseId: globalExerciseId("Barbell Row"), setsCompleted: 4, repsCompleted: 40, weightUsed: 72.5, perceivedEffort: row.effort },
                    ]
                  : [
                      { exerciseId: globalExerciseId("Burpee"), setsCompleted: 5, repsCompleted: 60, weightUsed: null, perceivedEffort: row.effort },
                      { exerciseId: globalExerciseId("Plank"), setsCompleted: 4, repsCompleted: 180, weightUsed: null, perceivedEffort: row.effort - 1 },
                    ],
          },
        },
      },
    });
  }

  console.log("Demo user: teste@fitplanner.app / 123456");
}

async function main() {
  await seedDefaultExercises();
  await seedDemoUser();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
