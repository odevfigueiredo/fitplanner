import { bodyProgressCreateSchema, bodyProgressUpdateSchema, idParamSchema } from "@fitplanner/shared";
import { BodyProgressService } from "../services/body-progress.service.js";
import { asyncHandler } from "../utils/async-handler.js";

const bodyProgress = new BodyProgressService();

export const listBodyProgress = asyncHandler(async (request, response) => {
  response.json(await bodyProgress.list(request.user!.id));
});

export const createBodyProgress = asyncHandler(async (request, response) => {
  const result = await bodyProgress.create(request.user!.id, bodyProgressCreateSchema.parse(request.body));
  response.status(201).json(result);
});

export const updateBodyProgress = asyncHandler(async (request, response) => {
  const { id } = idParamSchema.parse(request.params);
  response.json(await bodyProgress.update(id, request.user!.id, bodyProgressUpdateSchema.parse(request.body)));
});

export const deleteBodyProgress = asyncHandler(async (request, response) => {
  const { id } = idParamSchema.parse(request.params);
  await bodyProgress.delete(id, request.user!.id);
  response.status(204).send();
});
