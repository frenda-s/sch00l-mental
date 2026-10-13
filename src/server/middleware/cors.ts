import { cors } from "hono/cors";
import type { MiddlewareHandler } from "hono";

export function corsMiddleware(): MiddlewareHandler {
  return cors({
    origin: (origin, c) => {
      const allowedOrigin = c.env?.CORS_ORIGIN || "http://localhost:5173";
      if (!origin) return allowedOrigin;
      if (origin === allowedOrigin || origin.startsWith("http://localhost:")) {
        return origin;
      }
      return allowedOrigin;
    },
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  });
}
