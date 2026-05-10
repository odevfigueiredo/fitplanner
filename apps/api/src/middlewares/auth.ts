import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../utils/app-error.js";

export type AuthenticatedUser = {
  id: string;
  email: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function requireAuth(request: Request, _response: Response, next: NextFunction) {
  const authorization = request.headers.authorization;
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;

  if (!token) {
    return next(new AppError("Authentication token is required.", 401, "UNAUTHENTICATED"));
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
    if (!payload.sub || typeof payload.sub !== "string") {
      throw new AppError("Invalid authentication token.", 401, "INVALID_TOKEN");
    }

    request.user = {
      id: payload.sub,
      email: typeof payload.email === "string" ? payload.email : "",
    };

    return next();
  } catch {
    return next(new AppError("Invalid or expired authentication token.", 401, "INVALID_TOKEN"));
  }
}
