import type { DashboardSummary } from "@fitplanner/shared";
import { DashboardRepository } from "../repositories/dashboard.repository.js";
import { startOfMonth, toDateKey } from "../utils/dates.js";

export function calculateWorkoutStreak(dates: Date[]) {
  const uniqueDateKeys = new Set(dates.map(toDateKey));
  const sorted = [...uniqueDateKeys].sort().reverse();
  if (sorted.length === 0) {
    return 0;
  }

  let streak = 1;
  let cursor = new Date(`${sorted[0]}T00:00:00.000Z`);

  for (let index = 1; index < sorted.length; index += 1) {
    const previous = new Date(cursor);
    previous.setUTCDate(previous.getUTCDate() - 1);
    const expectedKey = toDateKey(previous);
    if (sorted[index] !== expectedKey) {
      break;
    }

    streak += 1;
    cursor = previous;
  }

  return streak;
}

export class DashboardService {
  constructor(private readonly dashboard = new DashboardRepository()) {}

  async summary(userId: string): Promise<DashboardSummary> {
    const now = new Date();
    const [workouts, lastLog, monthCount, allCount, bodyProgress, exerciseLogs, logDates] =
      await Promise.all([
        this.dashboard.getWorkouts(userId),
        this.dashboard.getLastWorkoutLog(userId),
        this.dashboard.countWorkoutLogsFrom(userId, startOfMonth(now)),
        this.dashboard.countWorkoutLogs(userId),
        this.dashboard.getBodyProgress(userId),
        this.dashboard.getExerciseLogs(userId),
        this.dashboard.getWorkoutLogDates(userId),
      ]);

    const performed = new Map<string, { exerciseId: string; exerciseName: string; count: number }>();
    let effortSum = 0;
    let effortCount = 0;

    for (const log of exerciseLogs) {
      const current = performed.get(log.exerciseId) ?? {
        exerciseId: log.exerciseId,
        exerciseName: log.exercise.name,
        count: 0,
      };
      current.count += 1;
      performed.set(log.exerciseId, current);
      effortSum += log.perceivedEffort;
      effortCount += 1;
    }

    const latestWeight = bodyProgress.at(-1)?.weight ?? null;
    const previousWeight = bodyProgress.length > 1 ? bodyProgress.at(-2)?.weight ?? null : null;

    return {
      weeklyWorkouts: workouts.map((workout) => ({
        id: workout.id,
        name: workout.name,
        type: workout.type,
        dayOfWeek: workout.dayOfWeek,
        exerciseCount: workout.exercises.length,
      })),
      lastWorkout: lastLog
        ? {
            id: lastLog.id,
            workoutName: lastLog.workout.name,
            date: lastLog.date.toISOString(),
            durationMinutes: lastLog.durationMinutes,
          }
        : null,
      totalWorkoutsThisMonth: monthCount,
      workoutStreak: calculateWorkoutStreak(logDates.map((item) => item.date)),
      bodyWeightTrend: bodyProgress.map((item) => ({
        date: item.date.toISOString(),
        weight: item.weight,
      })),
      exerciseLoadTrend: exerciseLogs.map((item) => ({
        date: item.workoutLog.date.toISOString(),
        exerciseName: item.exercise.name,
        weightUsed: item.weightUsed,
      })),
      mostPerformedExercises: [...performed.values()].sort((a, b) => b.count - a.count).slice(0, 8),
      cards: {
        currentWeight: latestWeight,
        weightChange: latestWeight !== null && previousWeight !== null ? latestWeight - previousWeight : null,
        totalLoggedWorkouts: allCount,
        averageEffort: effortCount > 0 ? Number((effortSum / effortCount).toFixed(1)) : null,
      },
    };
  }
}
