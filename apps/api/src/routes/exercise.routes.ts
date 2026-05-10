import { Router } from "express";
import {
  createExercise,
  deleteExercise,
  getExercise,
  listExercises,
  updateExercise,
} from "../controllers/exercise.controller.js";

export const exerciseRouter = Router();

exerciseRouter.get("/", listExercises);
exerciseRouter.post("/", createExercise);
exerciseRouter.get("/:id", getExercise);
exerciseRouter.put("/:id", updateExercise);
exerciseRouter.delete("/:id", deleteExercise);
