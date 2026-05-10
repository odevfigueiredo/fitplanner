import type { PrismaClient, Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

const workoutInclude = {
  exercises: {
    orderBy: { order: "asc" },
    include: { exercise: true },
  },
} satisfies Prisma.WorkoutInclude;

export class WorkoutRepository {
  constructor(private readonly db: PrismaClient = prisma) {}

  findByUser(userId: string) {
    return this.db.workout.findMany({
      where: { userId },
      include: workoutInclude,
      orderBy: [{ dayOfWeek: "asc" }, { createdAt: "desc" }],
    });
  }

  findByIdForUser(id: string, userId: string) {
    return this.db.workout.findFirst({
      where: { id, userId },
      include: workoutInclude,
    });
  }

  create(data: Prisma.WorkoutCreateInput) {
    return this.db.workout.create({
      data,
      include: workoutInclude,
    });
  }

  async update(id: string, userId: string, data: Prisma.WorkoutUpdateInput, exercises?: Prisma.WorkoutExerciseCreateManyWorkoutInput[]) {
    return this.db.$transaction(async (tx) => {
      if (exercises) {
        await tx.workoutExercise.deleteMany({ where: { workoutId: id } });
      }

      return tx.workout.update({
        where: { id, userId },
        data: {
          ...data,
          ...(exercises
            ? {
                exercises: {
                  createMany: { data: exercises },
                },
              }
            : {}),
        },
        include: workoutInclude,
      });
    });
  }

  delete(id: string, userId: string) {
    return this.db.workout.delete({ where: { id, userId } });
  }
}
