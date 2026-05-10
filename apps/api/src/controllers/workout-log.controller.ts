import { idParamSchema, workoutLogCreateSchema } from "@fitplanner/shared";
import { WorkoutLogService } from "../services/workout-log.service.js";
import { asyncHandler } from "../utils/async-handler.js";

const workoutLogs = new WorkoutLogService();

export const listWorkoutLogs = asyncHandler(async (request, response) => {
  response.json(await workoutLogs.list(request.user!.id));
});

export const createWorkoutLog = asyncHandler(async (request, response) => {
  const result = await workoutLogs.create(request.user!.id, workoutLogCreateSchema.parse(request.body));
  response.status(201).json(result);
});

export const getWorkoutLog = asyncHandler(async (request, response) => {
  const { id } = idParamSchema.parse(request.params);
  response.json(await workoutLogs.get(id, request.user!.id));
});

export const deleteWorkoutLog = asyncHandler(async (request, response) => {
  const { id } = idParamSchema.parse(request.params);
  await workoutLogs.delete(id, request.user!.id);
  response.status(204).send();
});
