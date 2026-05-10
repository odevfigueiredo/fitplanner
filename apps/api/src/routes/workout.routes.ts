import { Router } from "express";
import {
  createWorkout,
  deleteWorkout,
  getWorkout,
  listWorkouts,
  updateWorkout,
} from "../controllers/workout.controller.js";

export const workoutRouter = Router();

workoutRouter.get("/", listWorkouts);
workoutRouter.post("/", createWorkout);
workoutRouter.get("/:id", getWorkout);
workoutRouter.put("/:id", updateWorkout);
workoutRouter.delete("/:id", deleteWorkout);
