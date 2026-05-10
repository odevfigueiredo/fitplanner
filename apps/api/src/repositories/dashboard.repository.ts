import type { PrismaClient } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

export class DashboardRepository {
  constructor(private readonly db: PrismaClient = prisma) {}

  getWorkouts(userId: string) {
    return this.db.workout.findMany({
      where: { userId },
      include: { exercises: true },
      orderBy: [{ dayOfWeek: "asc" }, { createdAt: "desc" }],
    });
  }

  getLastWorkoutLog(userId: string) {
    return this.db.workoutLog.findFirst({
      where: { userId },
      include: { workout: true },
      orderBy: { date: "desc" },
    });
  }

  countWorkoutLogsFrom(userId: string, from: Date) {
    return this.db.workoutLog.count({
      where: {
        userId,
        date: { gte: from },
      },
    });
  }

  countWorkoutLogs(userId: string) {
    return this.db.workoutLog.count({ where: { userId } });
  }

  getWorkoutLogDates(userId: string) {
    return this.db.workoutLog.findMany({
      where: { userId },
      select: { date: true },
      orderBy: { date: "desc" },
    });
  }

  getBodyProgress(userId: string) {
    return this.db.bodyProgress.findMany({
      where: { userId },
      orderBy: { date: "asc" },
      take: 24,
    });
  }

  getExerciseLogs(userId: string) {
    return this.db.exerciseLog.findMany({
      where: { workoutLog: { userId } },
      include: {
        exercise: true,
        workoutLog: { select: { date: true } },
      },
      orderBy: { workoutLog: { date: "asc" } },
      take: 250,
    });
  }
}
