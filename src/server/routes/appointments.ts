import { Hono } from "hono";
import { z } from "zod";
import { createDbClient, type ServerEnv } from "../db/client.js";
import { AppointmentService } from "../services/appointment.service.ts";
import { requireRole } from "../middleware/auth.js";
import type { AppointmentStatus, AppointmentFormat } from "../../shared/types.js";

const createAppointmentSchema = z.object({
  studentName: z.string().min(2, "Tên/Biệt danh tối thiểu 2 ký tự").trim(),
  contactInfo: z.string().min(5, "Thông tin liên hệ tối thiểu 5 ký tự (SĐT hoặc Zalo)").trim(),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày đặt lịch không hợp lệ (YYYY-MM-DD)"),
  timeSlot: z.string().min(1, "Vui lòng chọn khung giờ"),
  format: z.enum(["offline_school", "online_meet"]),
  note: z.string().max(1000).optional().nullable(),
});

const appointmentRoutes = new Hono<{ Bindings: ServerEnv }>();

// Học sinh đặt lịch hẹn tư vấn
appointmentRoutes.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = createAppointmentSchema.parse(body);

  const currentUser = c.get("user");
  const { db } = createDbClient(c.env);
  const service = new AppointmentService(db);

  const result = await service.createAppointment({
    studentId: currentUser?.userId || null,
    studentName: parsed.studentName,
    contactInfo: parsed.contactInfo,
    appointmentDate: parsed.appointmentDate,
    timeSlot: parsed.timeSlot,
    format: parsed.format as AppointmentFormat,
    note: parsed.note,
  });

  return c.json({
    success: true,
    data: result,
  });
});

// Counselor xem tất cả các lịch hẹn
appointmentRoutes.get(
  "/counselor/list",
  requireRole(["counselor", "admin"]),
  async (c) => {
    const { db } = createDbClient(c.env);
    const service = new AppointmentService(db);

    const list = await service.getAllAppointmentsForCounselor();
    return c.json({
      success: true,
      data: list,
    });
  }
);

// Cập nhật trạng thái lịch hẹn
appointmentRoutes.patch(
  "/:id",
  requireRole(["counselor", "admin"]),
  async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json();
    const user = c.get("user");

    const status = body.status as AppointmentStatus;
    if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
      return c.json(
        {
          success: false,
          error: { code: "INVALID_STATUS", message: "Trạng thái lịch hẹn không hợp lệ" },
        },
        400
      );
    }

    const { db } = createDbClient(c.env);
    const service = new AppointmentService(db);

    await service.updateAppointmentStatus({
      appointmentId: id,
      status,
      counselorId: user?.userId,
      note: body.note,
    });

    return c.json({
      success: true,
      data: { message: "Cập nhật lịch hẹn thành công" },
    });
  }
);

export default appointmentRoutes;
