import { exerciseCreateSchema, exerciseUpdateSchema, idParamSchema } from "@fitplanner/shared";
import { ExerciseService } from "../services/exercise.service.js";
import { asyncHandler } from "../utils/async-handler.js";

const exercises = new ExerciseService();

export const listExercises = asyncHandler(async (request, response) => {
  response.json(await exercises.list(request.user!.id));
});

export const createExercise = asyncHandler(async (request, response) => {
  const result = await exercises.create(request.user!.id, exerciseCreateSchema.parse(request.body));
  response.status(201).json(result);
});

export const getExercise = asyncHandler(async (request, response) => {
  const { id } = idParamSchema.parse(request.params);
  response.json(await exercises.get(id, request.user!.id));
});

export const updateExercise = asyncHandler(async (request, response) => {
  const { id } = idParamSchema.parse(request.params);
  response.json(await exercises.update(id, request.user!.id, exerciseUpdateSchema.parse(request.body)));
});

export const deleteExercise = asyncHandler(async (request, response) => {
  const { id } = idParamSchema.parse(request.params);
  await exercises.delete(id, request.user!.id);
  response.status(204).send();
});
