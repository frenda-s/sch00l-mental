import { Hono } from "hono";
import { createDbClient, type ServerEnv } from "../db/client.js";
import { AnalyticsService } from "../services/analytics.service.ts";
import { ScreeningService } from "../services/screening.service.ts";
import { requireRole } from "../middleware/auth.js";

const dashboardRoutes = new Hono<{ Bindings: ServerEnv }>();

// Bảo vệ toàn bộ dashboard routes cho Counselor & Admin
dashboardRoutes.use("*", requireRole(["counselor", "admin"]));

dashboardRoutes.get("/overview", async (c) => {
  const { db } = createDbClient(c.env);
  const analytics = new AnalyticsService(db);

  const stats = await analytics.getOverviewStats();
  return c.json({
    success: true,
    data: stats,
  });
});

dashboardRoutes.get("/severity", async (c) => {
  const { db } = createDbClient(c.env);
  const analytics = new AnalyticsService(db);

  const data = await analytics.getSeverityDistribution();
  return c.json({
    success: true,
    data,
  });
});

dashboardRoutes.get("/topics", async (c) => {
  const { db } = createDbClient(c.env);
  const analytics = new AnalyticsService(db);

  const data = await analytics.getTopicDistribution();
  return c.json({
    success: true,
    data,
  });
});

dashboardRoutes.get("/grades", async (c) => {
  const { db } = createDbClient(c.env);
  const analytics = new AnalyticsService(db);

  const data = await analytics.getGradeDistribution();
  return c.json({
    success: true,
    data,
  });
});

dashboardRoutes.get("/high-risk", async (c) => {
  const { db } = createDbClient(c.env);
  const screeningService = new ScreeningService(db);

  const highRiskCases = await screeningService.getRecentHighRiskScreenings(50);
  return c.json({
    success: true,
    data: highRiskCases,
  });
});

export default dashboardRoutes;
