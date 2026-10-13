import type { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { verifySessionToken, type SessionPayload } from "../utils/crypto.js";
import type { UserRole } from "../../shared/types.js";
import type { ServerEnv } from "../db/client.js";

declare module "hono" {
  interface ContextVariableMap {
    user: SessionPayload | null;
  }
}

export const COOKIE_NAME = "smh_session";

export function authMiddleware(): MiddlewareHandler<{ Bindings: ServerEnv }> {
  return async (c, next) => {
    const token = getCookie(c, COOKIE_NAME);
    const secret = c.env?.SESSION_SECRET || "smh-default-dev-secret-at-least-32-chars";

    if (token) {
      const payload = await verifySessionToken(token, secret);
      c.set("user", payload);
    } else {
      c.set("user", null);
    }

    await next();
  };
}

export function requireAuth(): MiddlewareHandler<{ Bindings: ServerEnv }> {
  return async (c, next) => {
    const user = c.get("user");
    if (!user) {
      return c.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn",
          },
        },
        401
      );
    }
    await next();
  };
}

export function requireRole(allowedRoles: UserRole[]): MiddlewareHandler<{ Bindings: ServerEnv }> {
  return async (c, next) => {
    const user = c.get("user");
    if (!user) {
      return c.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Bạn chưa đăng nhập",
          },
        },
        401
      );
    }

    if (!allowedRoles.includes(user.role)) {
      return c.json(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Bạn không có quyền thực hiện thao tác này",
          },
        },
        403
      );
    }

    await next();
  };
}
