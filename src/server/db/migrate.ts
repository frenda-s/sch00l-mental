import { createDbClient } from "./client.js";
import { sql } from "drizzle-orm";

async function main() {
  console.log("🛠 Khởi tạo bảng SQLite local nếu chưa có...");
  const { db } = createDbClient();

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL,
      grade INTEGER,
      class_name TEXT,
      created_at INTEGER NOT NULL
    );
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS screenings (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      guest_session_id TEXT,
      created_at INTEGER NOT NULL
    );
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS screening_results (
      id TEXT PRIMARY KEY,
      screening_id TEXT NOT NULL,
      topic TEXT NOT NULL,
      score INTEGER NOT NULL,
      severity TEXT NOT NULL,
      is_high_risk INTEGER NOT NULL,
      answers_json TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS counseling_letters (
      id TEXT PRIMARY KEY,
      tracking_code TEXT NOT NULL UNIQUE,
      student_id TEXT,
      student_alias TEXT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT NOT NULL,
      reply_content TEXT,
      replied_by TEXT,
      replied_at INTEGER,
      created_at INTEGER NOT NULL
    );
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      student_id TEXT,
      student_name TEXT NOT NULL,
      contact_info TEXT NOT NULL,
      counselor_id TEXT,
      appointment_date TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      format TEXT NOT NULL,
      status TEXT NOT NULL,
      note TEXT,
      created_at INTEGER NOT NULL
    );
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS mental_resources (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL,
      summary TEXT NOT NULL,
      content_markdown TEXT NOT NULL,
      icon_name TEXT NOT NULL,
      is_published INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);

  console.log("✅ Tạo bảng SQLite hoàn tất!");
}

main().catch(console.error);
