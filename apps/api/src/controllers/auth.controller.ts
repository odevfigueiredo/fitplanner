import { loginSchema, registerSchema } from "@fitplanner/shared";
import { AuthService } from "../services/auth.service.js";
import { asyncHandler } from "../utils/async-handler.js";

const auth = new AuthService();

export const register = asyncHandler(async (request, response) => {
  const result = await auth.register(registerSchema.parse(request.body));
  response.status(201).json(result);
});

export const login = asyncHandler(async (request, response) => {
  const result = await auth.login(loginSchema.parse(request.body));
  response.json(result);
});

export const me = asyncHandler(async (request, response) => {
  const result = await auth.me(request.user!.id);
  response.json(result);
});
