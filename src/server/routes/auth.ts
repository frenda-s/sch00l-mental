import { Hono } from "hono";
import { setCookie, deleteCookie } from "hono/cookie";
import { z } from "zod";
import { createDbClient, type ServerEnv } from "../db/client.js";
import * as schema from "../db/schema.js";
import { eq } from "drizzle-orm";
import { verifyPassword, createSessionToken } from "../utils/crypto.js";
import { COOKIE_NAME } from "../middleware/auth.js";

const loginSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập tối thiểu 3 ký tự").trim(),
  password: z.string().min(4, "Mật khẩu tối thiểu 4 ký tự"),
});

const authRoutes = new Hono<{ Bindings: ServerEnv }>();

authRoutes.post("/login", async (c) => {
  const body = await c.req.json();
  const parsed = loginSchema.parse(body);

  const { db } = createDbClient(c.env);

  const user = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.username, parsed.username.toLowerCase()))
    .get();

  if (!user) {
    return c.json(
      {
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Tên đăng nhập hoặc mật khẩu không chính xác",
        },
      },
      400
    );
  }

  const isValidPassword = await verifyPassword(parsed.password, user.passwordHash);
  if (!isValidPassword) {
    return c.json(
      {
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Tên đăng nhập hoặc mật khẩu không chính xác",
        },
      },
      400
    );
  }

  const secret = c.env?.SESSION_SECRET || "smh-default-dev-secret-at-least-32-chars";
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 ngày

  const token = await createSessionToken(
    {
      userId: user.id,
      username: user.username,
      role: user.role,
      exp,
    },
    secret
  );

  setCookie(c, COOKIE_NAME, token, {
    httpOnly: true,
    secure: c.env?.APP_ENV === "production",
    sameSite: "Lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return c.json({
    success: true,
    data: {
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        grade: user.grade,
        className: user.className,
        createdAt: user.createdAt,
      },
    },
  });
});

authRoutes.post("/logout", async (c) => {
  deleteCookie(c, COOKIE_NAME, {
    path: "/",
  });
  return c.json({ success: true, data: { message: "Đăng xuất thành công" } });
});

authRoutes.get("/me", async (c) => {
  const session = c.get("user");
  if (!session) {
    return c.json({ success: true, data: { user: null } });
  }

  const { db } = createDbClient(c.env);
  const user = await db
    .select({
      id: schema.users.id,
      username: schema.users.username,
      fullName: schema.users.fullName,
      role: schema.users.role,
      grade: schema.users.grade,
      className: schema.users.className,
      createdAt: schema.users.createdAt,
    })
    .from(schema.users)
    .where(eq(schema.users.id, session.userId))
    .get();

  return c.json({
    success: true,
    data: { user: user || null },
  });
});

export default authRoutes;
