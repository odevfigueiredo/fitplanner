import type { PrismaClient } from "@prisma/client";
import type { ExerciseCreateInput, ExerciseUpdateInput } from "@fitplanner/shared";
import { prisma } from "../lib/prisma.js";

export class ExerciseRepository {
  constructor(private readonly db: PrismaClient = prisma) {}

  findVisible(userId: string) {
    return this.db.exercise.findMany({
      where: { OR: [{ userId: null }, { userId }] },
      orderBy: [{ userId: "asc" }, { name: "asc" }],
    });
  }

  findVisibleById(id: string, userId: string) {
    return this.db.exercise.findFirst({
      where: { id, OR: [{ userId: null }, { userId }] },
    });
  }

  findManyVisibleByIds(ids: string[], userId: string) {
    return this.db.exercise.findMany({
      where: {
        id: { in: ids },
        OR: [{ userId: null }, { userId }],
      },
    });
  }

  create(userId: string, data: ExerciseCreateInput) {
    return this.db.exercise.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  updateUserExercise(id: string, userId: string, data: ExerciseUpdateInput) {
    return this.db.exercise.updateMany({
      where: { id, userId },
      data,
    });
  }

  deleteUserExercise(id: string, userId: string) {
    return this.db.exercise.deleteMany({ where: { id, userId } });
  }
}
