import type { WorkoutCreateInput, WorkoutUpdateInput } from "@fitplanner/shared";
import { ExerciseRepository } from "../repositories/exercise.repository.js";
import { WorkoutRepository } from "../repositories/workout.repository.js";
import { AppError } from "../utils/app-error.js";

export class WorkoutService {
  constructor(
    private readonly workouts = new WorkoutRepository(),
    private readonly exercises = new ExerciseRepository(),
  ) {}

  list(userId: string) {
    return this.workouts.findByUser(userId);
  }

  async get(id: string, userId: string) {
    const workout = await this.workouts.findByIdForUser(id, userId);
    if (!workout) {
      throw new AppError("Workout not found.", 404, "WORKOUT_NOT_FOUND");
    }
    return workout;
  }

  async create(userId: string, input: WorkoutCreateInput) {
    await this.ensureExercisesAreVisible(input.exercises.map((item) => item.exerciseId), userId);

    return this.workouts.create({
      name: input.name,
      type: input.type,
      description: input.description,
      dayOfWeek: input.dayOfWeek,
      user: { connect: { id: userId } },
      exercises: {
        createMany: {
          data: input.exercises.map((item) => ({
            exerciseId: item.exerciseId,
            sets: item.sets,
            reps: item.reps,
            restSeconds: item.restSeconds,
            targetWeight: item.targetWeight,
            order: item.order,
          })),
        },
      },
    });
  }

  async update(id: string, userId: string, input: WorkoutUpdateInput) {
    await this.get(id, userId);

    if (input.exercises) {
      await this.ensureExercisesAreVisible(
        input.exercises.map((item) => item.exerciseId),
        userId,
      );
    }

    return this.workouts.update(
      id,
      userId,
      {
        name: input.name,
        type: input.type,
        description: input.description,
        dayOfWeek: input.dayOfWeek,
      },
      input.exercises?.map((item) => ({
        exerciseId: item.exerciseId,
        sets: item.sets,
        reps: item.reps,
        restSeconds: item.restSeconds,
        targetWeight: item.targetWeight,
        order: item.order,
      })),
    );
  }

  async delete(id: string, userId: string) {
    await this.get(id, userId);
    await this.workouts.delete(id, userId);
  }

  private async ensureExercisesAreVisible(ids: string[], userId: string) {
    const uniqueIds = [...new Set(ids)];
    const exercises = await this.exercises.findManyVisibleByIds(uniqueIds, userId);
    if (exercises.length !== uniqueIds.length) {
      throw new AppError("One or more exercises are not available.", 422, "EXERCISE_NOT_AVAILABLE");
    }
  }
}
