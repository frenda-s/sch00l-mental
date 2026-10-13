import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// 1. users
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").$type<"student" | "counselor" | "admin">().notNull(),
  grade: integer("grade"), // 10 | 11 | 12 | null
  className: text("class_name"),
  createdAt: integer("created_at").notNull(),
});

// 2. screenings
export const screenings = sqliteTable("screenings", {
  id: text("id").primaryKey(),
  userId: text("user_id"), // null if anonymous
  guestSessionId: text("guest_session_id"), // null if authenticated
  createdAt: integer("created_at").notNull(),
});

// 3. screening_results
export const screeningResults = sqliteTable("screening_results", {
  id: text("id").primaryKey(),
  screeningId: text("screening_id").notNull(),
  topic: text("topic").notNull(), // stress, depression, anxiety, focus, hyperactivity, social, study, career
  score: integer("score").notNull(),
  severity: text("severity")
    .$type<"normal" | "mild" | "moderate" | "severe" | "extremely_severe">()
    .notNull(),
  isHighRisk: integer("is_high_risk", { mode: "boolean" }).notNull(),
  answersJson: text("answers_json").notNull(),
  createdAt: integer("created_at").notNull(),
});

// 4. counseling_letters
export const counselingLetters = sqliteTable("counseling_letters", {
  id: text("id").primaryKey(),
  trackingCode: text("tracking_code").notNull().unique(),
  studentId: text("student_id"), // null if anonymous
  studentAlias: text("student_alias"),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  status: text("status")
    .$type<"pending" | "answered" | "flagged_urgent">()
    .notNull(),
  replyContent: text("reply_content"),
  repliedBy: text("replied_by"),
  repliedAt: integer("replied_at"),
  createdAt: integer("created_at").notNull(),
});

// 5. appointments
export const appointments = sqliteTable("appointments", {
  id: text("id").primaryKey(),
  studentId: text("student_id"), // null if anonymous
  studentName: text("student_name").notNull(),
  contactInfo: text("contact_info").notNull(),
  counselorId: text("counselor_id"),
  appointmentDate: text("appointment_date").notNull(), // YYYY-MM-DD
  timeSlot: text("time_slot").notNull(), // e.g. "08:00 - 09:00"
  format: text("format")
    .$type<"offline_school" | "online_meet">()
    .notNull(),
  status: text("status")
    .$type<"pending" | "confirmed" | "completed" | "cancelled">()
    .notNull(),
  note: text("note"),
  createdAt: integer("created_at").notNull(),
});

// 6. mental_resources
export const mentalResources = sqliteTable("mental_resources", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),
  summary: text("summary").notNull(),
  contentMarkdown: text("content_markdown").notNull(),
  iconName: text("icon_name").notNull(),
  isPublished: integer("is_published", { mode: "boolean" }).notNull(),
  createdAt: integer("created_at").notNull(),
});
