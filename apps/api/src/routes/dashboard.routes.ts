import { Router } from "express";
import { dashboardSummary } from "../controllers/dashboard.controller.js";

export const dashboardRouter = Router();

dashboardRouter.get("/summary", dashboardSummary);
