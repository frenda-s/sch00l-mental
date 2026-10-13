import { Hono } from "hono";
import { z } from "zod";
import { createDbClient, type ServerEnv } from "../db/client.js";
import { ScreeningService } from "../services/screening.service.ts";
import { SCREENING_QUESTIONS, SCREENING_TOPICS } from "../../shared/questions.js";

const answerItemSchema = z.object({
  questionId: z.string(),
  score: z.number().min(0).max(3),
});

const submitScreeningSchema = z.object({
  guestSessionId: z.string().optional().nullable(),
  answers: z.array(answerItemSchema).min(1, "Vui lòng trả lời ít nhất 1 câu hỏi"),
});

const screeningRoutes = new Hono<{ Bindings: ServerEnv }>();

// Lấy danh sách câu hỏi & topics
screeningRoutes.get("/questions", (c) => {
  return c.json({
    success: true,
    data: {
      topics: SCREENING_TOPICS,
      questions: SCREENING_QUESTIONS,
    },
  });
});

// Nộp bài sàng lọc
screeningRoutes.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = submitScreeningSchema.parse(body);

  const currentUser = c.get("user");
  const { db } = createDbClient(c.env);
  const service = new ScreeningService(db);

  const result = await service.submitScreening({
    userId: currentUser?.userId || null,
    guestSessionId: parsed.guestSessionId || null,
    answers: parsed.answers,
  });

  return c.json({
    success: true,
    data: result,
  });
});

// Xem chi tiết kết quả bài sàng lọc theo ID
screeningRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  const { db } = createDbClient(c.env);
  const service = new ScreeningService(db);

  const data = await service.getScreeningById(id);
  if (!data) {
    return c.json(
      {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Không tìm thấy kết quả sàng lọc này",
        },
      },
      404
    );
  }

  return c.json({
    success: true,
    data,
  });
});

export default screeningRoutes;
