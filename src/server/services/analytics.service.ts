import type { LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "../db/schema.js";
import { eq, sql } from "drizzle-orm";

export class AnalyticsService {
  constructor(private db: LibSQLDatabase<typeof schema>) {}

  async getOverviewStats() {
    const totalScreeningsRes = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.screenings)
      .get();

    const highRiskRes = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.screeningResults)
      .where(eq(schema.screeningResults.isHighRisk, true))
      .get();

    const pendingLettersRes = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.counselingLetters)
      .where(eq(schema.counselingLetters.status, "pending"))
      .get();

    const todayStr = new Date().toISOString().split("T")[0];
    const todayApptsRes = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.appointments)
      .where(eq(schema.appointments.appointmentDate, todayStr))
      .get();

    const totalStudentsRes = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.users)
      .where(eq(schema.users.role, "student"))
      .get();

    return {
      totalScreenings: totalScreeningsRes?.count ?? 0,
      highRiskCases: highRiskRes?.count ?? 0,
      pendingLetters: pendingLettersRes?.count ?? 0,
      todayAppointments: todayApptsRes?.count ?? 0,
      totalRegisteredStudents: totalStudentsRes?.count ?? 0,
    };
  }

  async getSeverityDistribution() {
    const rows = await this.db
      .select({
        severity: schema.screeningResults.severity,
        count: sql<number>`count(*)`,
      })
      .from(schema.screeningResults)
      .groupBy(schema.screeningResults.severity);

    return rows;
  }

  async getTopicDistribution() {
    const rows = await this.db
      .select({
        topic: schema.screeningResults.topic,
        count: sql<number>`count(*)`,
        avgScore: sql<number>`avg(${schema.screeningResults.score})`,
      })
      .from(schema.screeningResults)
      .groupBy(schema.screeningResults.topic);

    return rows;
  }

  async getGradeDistribution() {
    // Phân tích theo khối lớp 10, 11, 12 thông qua join users
    const rows = await this.db
      .select({
        grade: schema.users.grade,
        severity: schema.screeningResults.severity,
        count: sql<number>`count(*)`,
      })
      .from(schema.screeningResults)
      .innerJoin(
        schema.screenings,
        eq(schema.screeningResults.screeningId, schema.screenings.id)
      )
      .innerJoin(schema.users, eq(schema.screenings.userId, schema.users.id))
      .groupBy(schema.users.grade, schema.screeningResults.severity);

    return rows;
  }
}
