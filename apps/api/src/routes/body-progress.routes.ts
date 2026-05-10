import { Router } from "express";
import {
  createBodyProgress,
  deleteBodyProgress,
  listBodyProgress,
  updateBodyProgress,
} from "../controllers/body-progress.controller.js";

export const bodyProgressRouter = Router();

bodyProgressRouter.get("/", listBodyProgress);
bodyProgressRouter.post("/", createBodyProgress);
bodyProgressRouter.put("/:id", updateBodyProgress);
bodyProgressRouter.delete("/:id", deleteBodyProgress);
