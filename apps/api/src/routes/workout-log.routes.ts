import { Router } from "express";
import {
  createWorkoutLog,
  deleteWorkoutLog,
  getWorkoutLog,
  listWorkoutLogs,
} from "../controllers/workout-log.controller.js";

export const workoutLogRouter = Router();

workoutLogRouter.get("/", listWorkoutLogs);
workoutLogRouter.post("/", createWorkoutLog);
workoutLogRouter.get("/:id", getWorkoutLog);
workoutLogRouter.delete("/:id", deleteWorkoutLog);
