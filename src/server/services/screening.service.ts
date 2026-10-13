import type { LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "../db/schema.js";
import { calculateScreeningResult } from "../../shared/algorithm.js";
import type { ScreeningAnswer } from "../../shared/types.js";
import { generateId } from "../utils/tracking-code.js";
import { eq, desc } from "drizzle-orm";

export class ScreeningService {
  constructor(private db: LibSQLDatabase<typeof schema>) {}

  async submitScreening(params: {
    userId?: string | null;
    guestSessionId?: string | null;
    answers: ScreeningAnswer[];
  }) {
    const evalResult = calculateScreeningResult(params.answers);

    const screeningId = generateId();
    const now = Date.now();

    // 1. Tạo bản ghi screenings
    await this.db.insert(schema.screenings).values({
      id: screeningId,
      userId: params.userId || null,
      guestSessionId: params.guestSessionId || null,
      createdAt: now,
    });

    // 2. Tạo các bản ghi screening_results cho từng topic
    for (const tr of evalResult.topicResults) {
      // Lọc các câu trả lời thuộc topic này
      const topicAnswers = params.answers.filter((a) =>
        a.questionId.startsWith(
          tr.topic === "depression"
            ? "dep_"
            : tr.topic === "anxiety"
            ? "anx_"
            : tr.topic === "focus"
            ? "foc_"
            : tr.topic === "hyperactivity"
            ? "hyp_"
            : tr.topic === "social"
            ? "soc_"
            : tr.topic === "study"
            ? "std_"
            : tr.topic === "career"
            ? "car_"
            : "stress_"
        )
      );

      await this.db.insert(schema.screeningResults).values({
        id: generateId(),
        screeningId,
        topic: tr.topic,
        score: tr.score,
        severity: tr.severity,
        isHighRisk: tr.isHighRisk,
        answersJson: JSON.stringify(topicAnswers),
        createdAt: now,
      });
    }

    return {
      screeningId,
      evaluation: evalResult,
      createdAt: now,
    };
  }

  async getScreeningById(id: string) {
    const screening = await this.db
      .select()
      .from(schema.screenings)
      .where(eq(schema.screenings.id, id))
      .get();

    if (!screening) return null;

    const results = await this.db
      .select()
      .from(schema.screeningResults)
      .where(eq(schema.screeningResults.screeningId, id));

    return {
      screening,
      results,
    };
  }

  async getRecentHighRiskScreenings(limit: number = 20) {
    const highRiskResults = await this.db
      .select()
      .from(schema.screeningResults)
      .where(eq(schema.screeningResults.isHighRisk, true))
      .orderBy(desc(schema.screeningResults.createdAt))
      .limit(limit);

    return highRiskResults;
  }
}
