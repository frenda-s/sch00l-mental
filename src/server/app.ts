import { Hono } from "hono";
import { corsMiddleware } from "./middleware/cors.js";
import { errorHandler } from "./middleware/error.js";
import { authMiddleware } from "./middleware/auth.js";
import type { ServerEnv } from "./db/client.js";

import authRoutes from "./routes/auth.js";
import screeningRoutes from "./routes/screenings.js";
import letterRoutes from "./routes/letters.js";
import appointmentRoutes from "./routes/appointments.js";
import dashboardRoutes from "./routes/dashboard.js";
import resourceRoutes from "./routes/resources.js";

export const app = new Hono<{ Bindings: ServerEnv }>();

// Global Middlewares
app.use("*", corsMiddleware());
app.use("*", authMiddleware());
app.onError(errorHandler);

// Healthcheck / Root API
app.get("/api/health", (c) => {
  return c.json({
    status: "ok",
    system: "Hệ thống hỗ trợ sàng lọc và tư vấn tâm lý học đường THPT",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.route("/api/auth", authRoutes);
app.route("/api/screenings", screeningRoutes);
app.route("/api/letters", letterRoutes);
app.route("/api/appointments", appointmentRoutes);
app.route("/api/dashboard", dashboardRoutes);
app.route("/api/resources", resourceRoutes);

export type { ServerEnv } from "./db/client.js";
