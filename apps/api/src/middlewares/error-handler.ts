import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { AppError } from "../utils/app-error.js";

export function notFoundHandler(request: Request, _response: Response, next: NextFunction) {
  next(new AppError(`Route ${request.method} ${request.path} not found`, 404, "ROUTE_NOT_FOUND"));
}

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  if (error instanceof ZodError) {
    return response.status(422).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request payload.",
        issues: error.issues,
      },
    });
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
      },
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return response.status(400).json({
      error: {
        code: error.code,
        message: "Database constraint error.",
      },
    });
  }

  console.error(error);

  return response.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Unexpected server error.",
    },
  });
}
