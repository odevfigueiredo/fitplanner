import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { authRouter } from "./auth.routes.js";
import { bodyProgressRouter } from "./body-progress.routes.js";
import { dashboardRouter } from "./dashboard.routes.js";
import { exerciseRouter } from "./exercise.routes.js";
import { workoutLogRouter } from "./workout-log.routes.js";
import { workoutRouter } from "./workout.routes.js";

export const routes = Router();

routes.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

routes.use("/auth", authRouter);
routes.use("/exercises", requireAuth, exerciseRouter);
routes.use("/workouts", requireAuth, workoutRouter);
routes.use("/workout-logs", requireAuth, workoutLogRouter);
routes.use("/body-progress", requireAuth, bodyProgressRouter);
routes.use("/dashboard", requireAuth, dashboardRouter);
