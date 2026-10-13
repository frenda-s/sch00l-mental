import { Hono } from "hono";
import { z } from "zod";
import { createDbClient, type ServerEnv } from "../db/client.js";
import * as schema from "../db/schema.js";
import { eq, desc } from "drizzle-orm";
import { requireRole } from "../middleware/auth.js";
import { generateId } from "../utils/tracking-code.js";

const resourceSchema = z.object({
  title: z.string().min(3, "Tiêu đề tối thiểu 3 ký tự").trim(),
  slug: z.string().min(2, "Slug không hợp lệ").trim(),
  category: z.string().min(1, "Danh mục không được để trống"),
  summary: z.string().min(5, "Tóm tắt tối thiểu 5 ký tự"),
  contentMarkdown: z.string().min(10, "Nội dung Markdown tối thiểu 10 ký tự"),
  iconName: z.string().default("BookOpen"),
  isPublished: z.boolean().default(true),
});

const resourceRoutes = new Hono<{ Bindings: ServerEnv }>();

// Public: Lấy tất cả tài nguyên công khai
resourceRoutes.get("/", async (c) => {
  const { db } = createDbClient(c.env);
  const list = await db
    .select()
    .from(schema.mentalResources)
    .where(eq(schema.mentalResources.isPublished, true))
    .orderBy(desc(schema.mentalResources.createdAt));

  return c.json({
    success: true,
    data: list,
  });
});

// Public: Xem chi tiết tài nguyên theo slug
resourceRoutes.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const { db } = createDbClient(c.env);

  const item = await db
    .select()
    .from(schema.mentalResources)
    .where(eq(schema.mentalResources.slug, slug))
    .get();

  if (!item) {
    return c.json(
      {
        success: false,
        error: { code: "NOT_FOUND", message: "Không tìm thấy tài nguyên này" },
      },
      404
    );
  }

  return c.json({
    success: true,
    data: item,
  });
});

// Counselor / Admin: Tạo tài nguyên mới
resourceRoutes.post("/", requireRole(["counselor", "admin"]), async (c) => {
  const body = await c.req.json();
  const parsed = resourceSchema.parse(body);

  const { db } = createDbClient(c.env);
  const id = generateId();
  const now = Date.now();

  await db.insert(schema.mentalResources).values({
    id,
    title: parsed.title,
    slug: parsed.slug,
    category: parsed.category,
    summary: parsed.summary,
    contentMarkdown: parsed.contentMarkdown,
    iconName: parsed.iconName,
    isPublished: parsed.isPublished,
    createdAt: now,
  });

  return c.json({
    success: true,
    data: { id, slug: parsed.slug },
  });
});

// Counselor / Admin: Xóa tài nguyên
resourceRoutes.delete("/:id", requireRole(["counselor", "admin"]), async (c) => {
  const id = c.req.param("id");
  const { db } = createDbClient(c.env);

  await db.delete(schema.mentalResources).where(eq(schema.mentalResources.id, id));

  return c.json({
    success: true,
    data: { message: "Đã xóa tài nguyên" },
  });
});

export default resourceRoutes;
