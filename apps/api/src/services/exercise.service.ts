import type { ExerciseCreateInput, ExerciseUpdateInput } from "@fitplanner/shared";
import { ExerciseRepository } from "../repositories/exercise.repository.js";
import { AppError } from "../utils/app-error.js";

export class ExerciseService {
  constructor(private readonly exercises = new ExerciseRepository()) {}

  list(userId: string) {
    return this.exercises.findVisible(userId);
  }

  async get(id: string, userId: string) {
    const exercise = await this.exercises.findVisibleById(id, userId);
    if (!exercise) {
      throw new AppError("Exercise not found.", 404, "EXERCISE_NOT_FOUND");
    }
    return exercise;
  }

  create(userId: string, input: ExerciseCreateInput) {
    return this.exercises.create(userId, input);
  }

  async update(id: string, userId: string, input: ExerciseUpdateInput) {
    await this.get(id, userId);
    const result = await this.exercises.updateUserExercise(id, userId, input);
    if (result.count === 0) {
      throw new AppError("Only custom exercises can be updated.", 403, "GLOBAL_EXERCISE_READONLY");
    }
    return this.get(id, userId);
  }

  async delete(id: string, userId: string) {
    await this.get(id, userId);
    const result = await this.exercises.deleteUserExercise(id, userId);
    if (result.count === 0) {
      throw new AppError("Only custom exercises can be deleted.", 403, "GLOBAL_EXERCISE_READONLY");
    }
  }
}
