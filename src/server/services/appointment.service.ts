import type { LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "../db/schema.js";
import { generateId } from "../utils/tracking-code.js";
import { eq, desc } from "drizzle-orm";
import type { AppointmentFormat, AppointmentStatus } from "../../shared/types.js";

export class AppointmentService {
  constructor(private db: LibSQLDatabase<typeof schema>) {}

  async createAppointment(params: {
    studentId?: string | null;
    studentName: string;
    contactInfo: string;
    appointmentDate: string;
    timeSlot: string;
    format: AppointmentFormat;
    note?: string | null;
  }) {
    const id = generateId();
    const now = Date.now();

    await this.db.insert(schema.appointments).values({
      id,
      studentId: params.studentId || null,
      studentName: params.studentName,
      contactInfo: params.contactInfo,
      counselorId: null, // Counselor sẽ nhận sau
      appointmentDate: params.appointmentDate,
      timeSlot: params.timeSlot,
      format: params.format,
      status: "pending",
      note: params.note || null,
      createdAt: now,
    });

    return {
      id,
      status: "pending",
      appointmentDate: params.appointmentDate,
      timeSlot: params.timeSlot,
      createdAt: now,
    };
  }

  async getAppointmentById(id: string) {
    const appt = await this.db
      .select()
      .from(schema.appointments)
      .where(eq(schema.appointments.id, id))
      .get();

    return appt || null;
  }

  async getAllAppointmentsForCounselor() {
    return this.db
      .select()
      .from(schema.appointments)
      .orderBy(desc(schema.appointments.createdAt));
  }

  async updateAppointmentStatus(params: {
    appointmentId: string;
    status: AppointmentStatus;
    counselorId?: string;
    note?: string;
  }) {
    const updateData: Partial<typeof schema.appointments.$inferInsert> = {
      status: params.status,
    };
    if (params.counselorId) updateData.counselorId = params.counselorId;
    if (params.note) updateData.note = params.note;

    await this.db
      .update(schema.appointments)
      .set(updateData)
      .where(eq(schema.appointments.id, params.appointmentId));

    return { success: true };
  }
}
