import type { WorkoutLogCreateInput } from "@fitplanner/shared";
import { ExerciseRepository } from "../repositories/exercise.repository.js";
import { WorkoutLogRepository } from "../repositories/workout-log.repository.js";
import { WorkoutRepository } from "../repositories/workout.repository.js";
import { AppError } from "../utils/app-error.js";

export class WorkoutLogService {
  constructor(
    private readonly logs = new WorkoutLogRepository(),
    private readonly workouts = new WorkoutRepository(),
    private readonly exercises = new ExerciseRepository(),
  ) {}

  list(userId: string) {
    return this.logs.findByUser(userId);
  }

  async get(id: string, userId: string) {
    const log = await this.logs.findByIdForUser(id, userId);
    if (!log) {
      throw new AppError("Workout log not found.", 404, "WORKOUT_LOG_NOT_FOUND");
    }
    return log;
  }

  async create(userId: string, input: WorkoutLogCreateInput) {
    const workout = await this.workouts.findByIdForUser(input.workoutId, userId);
    if (!workout) {
      throw new AppError("Workout not found.", 404, "WORKOUT_NOT_FOUND");
    }

    const exerciseIds = input.exercises.map((item) => item.exerciseId);
    const visibleExercises = await this.exercises.findManyVisibleByIds([...new Set(exerciseIds)], userId);
    if (visibleExercises.length !== new Set(exerciseIds).size) {
      throw new AppError("One or more exercises are not available.", 422, "EXERCISE_NOT_AVAILABLE");
    }

    return this.logs.create({
      workout: { connect: { id: input.workoutId } },
      user: { connect: { id: userId } },
      date: input.date ?? new Date(),
      durationMinutes: input.durationMinutes,
      notes: input.notes,
      exercises: {
        createMany: {
          data: input.exercises.map((item) => ({
            exerciseId: item.exerciseId,
            setsCompleted: item.setsCompleted,
            repsCompleted: item.repsCompleted,
            weightUsed: item.weightUsed,
            perceivedEffort: item.perceivedEffort,
          })),
        },
      },
    });
  }

  async delete(id: string, userId: string) {
    await this.get(id, userId);
    await this.logs.delete(id, userId);
  }
}
