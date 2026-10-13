import type { LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "../db/schema.js";
import { generateTrackingCode, generateId } from "../utils/tracking-code.js";
import { eq, desc } from "drizzle-orm";
import type { LetterStatus } from "../../shared/types.js";

export class LetterService {
  constructor(private db: LibSQLDatabase<typeof schema>) {}

  async createLetter(params: {
    studentId?: string | null;
    studentAlias?: string | null;
    title: string;
    content: string;
    category: string;
    isUrgent?: boolean;
  }) {
    const id = generateId();
    const trackingCode = generateTrackingCode("TAMSU");
    const now = Date.now();
    const status: LetterStatus = params.isUrgent ? "flagged_urgent" : "pending";

    await this.db.insert(schema.counselingLetters).values({
      id,
      trackingCode,
      studentId: params.studentId || null,
      studentAlias: params.studentAlias || "Học sinh ẩn danh",
      title: params.title,
      content: params.content,
      category: params.category,
      status,
      createdAt: now,
    });

    return {
      id,
      trackingCode,
      status,
      createdAt: now,
    };
  }

  /**
   * Tra cứu thư ẩn danh theo trackingCode.
   * QUAN TRỌNG: Không trả về studentId, IP, hay bất kỳ PII nào.
   */
  async getLetterByTrackingCode(trackingCode: string) {
    const letter = await this.db
      .select({
        trackingCode: schema.counselingLetters.trackingCode,
        title: schema.counselingLetters.title,
        content: schema.counselingLetters.content,
        category: schema.counselingLetters.category,
        status: schema.counselingLetters.status,
        replyContent: schema.counselingLetters.replyContent,
        repliedBy: schema.counselingLetters.repliedBy,
        repliedAt: schema.counselingLetters.repliedAt,
        createdAt: schema.counselingLetters.createdAt,
      })
      .from(schema.counselingLetters)
      .where(eq(schema.counselingLetters.trackingCode, trackingCode.toUpperCase().trim()))
      .get();

    return letter || null;
  }

  async getAllLettersForCounselor(statusFilter?: LetterStatus) {
    if (statusFilter) {
      return this.db
        .select()
        .from(schema.counselingLetters)
        .where(eq(schema.counselingLetters.status, statusFilter))
        .orderBy(desc(schema.counselingLetters.createdAt));
    }

    return this.db
      .select()
      .from(schema.counselingLetters)
      .orderBy(desc(schema.counselingLetters.createdAt));
  }

  async replyToLetter(params: {
    letterId: string;
    replyContent: string;
    counselorName: string;
  }) {
    const now = Date.now();
    await this.db
      .update(schema.counselingLetters)
      .set({
        replyContent: params.replyContent,
        repliedBy: params.counselorName,
        repliedAt: now,
        status: "answered",
      })
      .where(eq(schema.counselingLetters.id, params.letterId));

    return { success: true };
  }

  async updateLetterStatus(letterId: string, status: LetterStatus) {
    await this.db
      .update(schema.counselingLetters)
      .set({ status })
      .where(eq(schema.counselingLetters.id, letterId));

    return { success: true };
  }
}
