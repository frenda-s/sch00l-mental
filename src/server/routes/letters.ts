import { Hono } from "hono";
import { z } from "zod";
import { createDbClient, type ServerEnv } from "../db/client.js";
import { LetterService } from "../services/letter.service.ts";
import { requireRole } from "../middleware/auth.js";
import type { LetterStatus } from "../../shared/types.js";

const createLetterSchema = z.object({
  title: z.string().min(3, "Tiêu đề tối thiểu 3 ký tự").max(150, "Tiêu đề quá dài").trim(),
  content: z.string().min(10, "Nội dung thư tối thiểu 10 ký tự").max(5000, "Nội dung quá dài").trim(),
  category: z.string().min(1, "Vui lòng chọn danh mục"),
  studentAlias: z.string().max(50).optional().nullable(),
  isUrgent: z.boolean().optional(),
});

const replyLetterSchema = z.object({
  replyContent: z.string().min(5, "Nội dung phản hồi quá ngắn").max(5000),
});

const letterRoutes = new Hono<{ Bindings: ServerEnv }>();

// Gửi thư tâm sự ẩn danh (Không yêu cầu login)
letterRoutes.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = createLetterSchema.parse(body);

  const currentUser = c.get("user");
  const { db } = createDbClient(c.env);
  const service = new LetterService(db);

  const result = await service.createLetter({
    studentId: currentUser?.userId || null,
    studentAlias: parsed.studentAlias || "Học sinh ẩn danh",
    title: parsed.title,
    content: parsed.content,
    category: parsed.category,
    isUrgent: parsed.isUrgent,
  });

  return c.json({
    success: true,
    data: result,
  });
});

// Tra cứu thư theo tracking code (Public, ẩn danh hoàn toàn)
// Hỗ trợ cả /track/:trackingCode lẫn /:trackingCode
const handleGetByTrackingCode = async (c: any) => {
  const code = c.req.param("trackingCode");
  const { db } = createDbClient(c.env);
  const service = new LetterService(db);

  const letter = await service.getLetterByTrackingCode(code);

  if (!letter) {
    return c.json(
      {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Không tìm thấy thư với mã tra cứu này. Vui lòng kiểm tra lại mã.",
        },
      },
      404
    );
  }

  return c.json({
    success: true,
    data: letter,
  });
};

letterRoutes.get("/track/:trackingCode", handleGetByTrackingCode);
letterRoutes.get("/:trackingCode", handleGetByTrackingCode);

// API dành cho Counselor / Admin xem danh sách thư
letterRoutes.get(
  "/counselor/list",
  requireRole(["counselor", "admin"]),
  async (c) => {
    const statusParam = c.req.query("status") as LetterStatus | undefined;
    const { db } = createDbClient(c.env);
    const service = new LetterService(db);

    const list = await service.getAllLettersForCounselor(statusParam);
    return c.json({
      success: true,
      data: list,
    });
  }
);

// Counselor phản hồi thư
letterRoutes.post(
  "/:id/reply",
  requireRole(["counselor", "admin"]),
  async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json();
    const parsed = replyLetterSchema.parse(body);
    const user = c.get("user");

    const { db } = createDbClient(c.env);
    const service = new LetterService(db);

    await service.replyToLetter({
      letterId: id,
      replyContent: parsed.replyContent,
      counselorName: user?.username || "Tư vấn viên",
    });

    return c.json({
      success: true,
      data: { message: "Đã trả lời thư thành công" },
    });
  }
);

// Cập nhật trạng thái thư (VD: cắm cờ khẩn cấp)
letterRoutes.patch(
  "/:id/status",
  requireRole(["counselor", "admin"]),
  async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json();
    const status = body.status as LetterStatus;

    if (!["pending", "answered", "flagged_urgent"].includes(status)) {
      return c.json(
        {
          success: false,
          error: { code: "INVALID_STATUS", message: "Trạng thái không hợp lệ" },
        },
        400
      );
    }

    const { db } = createDbClient(c.env);
    const service = new LetterService(db);
    await service.updateLetterStatus(id, status);

    return c.json({ success: true, data: { message: "Cập nhật thành công" } });
  }
);

export default letterRoutes;
