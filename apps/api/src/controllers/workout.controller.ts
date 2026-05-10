import { idParamSchema, workoutCreateSchema, workoutUpdateSchema } from "@fitplanner/shared";
import { WorkoutService } from "../services/workout.service.js";
import { asyncHandler } from "../utils/async-handler.js";

const workouts = new WorkoutService();

export const listWorkouts = asyncHandler(async (request, response) => {
  response.json(await workouts.list(request.user!.id));
});

export const createWorkout = asyncHandler(async (request, response) => {
  const result = await workouts.create(request.user!.id, workoutCreateSchema.parse(request.body));
  response.status(201).json(result);
});

export const getWorkout = asyncHandler(async (request, response) => {
  const { id } = idParamSchema.parse(request.params);
  response.json(await workouts.get(id, request.user!.id));
});

export const updateWorkout = asyncHandler(async (request, response) => {
  const { id } = idParamSchema.parse(request.params);
  response.json(await workouts.update(id, request.user!.id, workoutUpdateSchema.parse(request.body)));
});

export const deleteWorkout = asyncHandler(async (request, response) => {
  const { id } = idParamSchema.parse(request.params);
  await workouts.delete(id, request.user!.id);
  response.status(204).send();
});
