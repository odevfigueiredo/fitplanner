import type { PrismaClient, Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

const workoutLogInclude = {
  workout: true,
  exercises: {
    include: { exercise: true },
  },
} satisfies Prisma.WorkoutLogInclude;

export class WorkoutLogRepository {
  constructor(private readonly db: PrismaClient = prisma) {}

  findByUser(userId: string) {
    return this.db.workoutLog.findMany({
      where: { userId },
      include: workoutLogInclude,
      orderBy: { date: "desc" },
    });
  }

  findByIdForUser(id: string, userId: string) {
    return this.db.workoutLog.findFirst({
      where: { id, userId },
      include: workoutLogInclude,
    });
  }

  create(data: Prisma.WorkoutLogCreateInput) {
    return this.db.workoutLog.create({
      data,
      include: workoutLogInclude,
    });
  }

  delete(id: string, userId: string) {
    return this.db.workoutLog.delete({ where: { id, userId } });
  }
}
