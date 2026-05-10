import { DashboardService } from "../services/dashboard.service.js";
import { asyncHandler } from "../utils/async-handler.js";

const dashboard = new DashboardService();

export const dashboardSummary = asyncHandler(async (request, response) => {
  response.json(await dashboard.summary(request.user!.id));
});
