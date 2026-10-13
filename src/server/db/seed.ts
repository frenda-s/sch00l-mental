import { createDbClient } from "./client.js";
import * as schema from "./schema.js";
import { hashPassword } from "../utils/crypto.js";
import { generateId } from "../utils/tracking-code.js";
import { stressArticleMarkdown, sleepArticleMarkdown } from "./articles.js";
import {
  anxietyArticleMarkdown,
  peerPressureArticleMarkdown,
  careerOrientationArticleMarkdown,
  digitalWellbeingArticleMarkdown,
} from "./articles-more.js";

async function main() {
  console.log("🌱 Đang khởi tạo dữ liệu mẫu (Seed Database)...");
  const { db } = createDbClient();

  // 1. Chỉ tạo tài khoản quản trị và tư vấn viên chính thức
  const now = Date.now();
  const defaultAdminPass = process.env.ADMIN_INITIAL_PASSWORD || "Admin@2026";
  const defaultCounselorPass = process.env.COUNSELOR_INITIAL_PASSWORD || "Counselor@2026";

  const passAdmin = await hashPassword(defaultAdminPass);
  const passCounselor = await hashPassword(defaultCounselorPass);

  await db.insert(schema.users).values([
    {
      id: generateId(),
      username: "admin",
      passwordHash: passAdmin,
      fullName: "Quản Trị Viên Hệ Thống",
      role: "admin",
      createdAt: now,
    },
    {
      id: generateId(),
      username: "counselor",
      passwordHash: passCounselor,
      fullName: "Phòng Tư Vấn Tâm Lý Học Đường",
      role: "counselor",
      createdAt: now,
    },
  ]).onConflictDoNothing();

  // 2. Tạo Mental Resources Kiến thức chuẩn mực
  await db.insert(schema.mentalResources).values([
    {
      id: generateId(),
      title: "5 Phương Pháp Quản Lý Căng Thẳng Học Tập Hiệu Quả",
      slug: "5-phuong-phap-quan-ly-cang-thang",
      category: "Stress & Áp lực",
      summary: "Các kỹ thuật hít thở sâu, chia nhỏ thời gian học Pomodoro và duy trì nhịp sinh học lành mạnh cho học sinh THPT.",
      contentMarkdown: stressArticleMarkdown,
      iconName: "Brain",
      isPublished: true,
      createdAt: now,
    },
    {
      id: generateId(),
      title: "Cải Thiện Giấc Ngủ Trong Giai Đoạn Ôn Thi",
      slug: "cai-thien-giac-ngu-giai-doan-on-thi",
      category: "Giấc ngủ",
      summary: "Bí quyết ngủ ngon 7-8 tiếng mỗi ngày để não bộ ghi nhớ kiến thức tối ưu trước các kỳ thi quan trọng.",
      contentMarkdown: sleepArticleMarkdown,
      iconName: "CloudRain",
      isPublished: true,
      createdAt: now,
    },
    {
      id: generateId(),
      title: "Nhận Diện Và Kiểm Soát Rối Loạn Lo Âu Thi Cử",
      slug: "kiem-soat-lo-au-thi-cu",
      category: "Lo âu học đường",
      summary: "Phân biệt lo âu thích ứng và bệnh lý, quy trình tự can thiệp nhận thức hành vi (CBT) và kỹ thuật điều hòa cảm xúc trong phòng thi.",
      contentMarkdown: anxietyArticleMarkdown,
      iconName: "AlertCircle",
      isPublished: true,
      createdAt: now,
    },
    {
      id: generateId(),
      title: "Áp Lực Đồng Lứa Và Xây Dựng Bản Sắc Cá Nhân",
      slug: "ap-luc-dong-lua-va-ban-sac-ca-nhan",
      category: "Quan hệ bạn bè",
      summary: "Lý giải tâm lý học lứa tuổi vị thành niên về áp lực đồng lứa, kỹ năng giao tiếp quyết đoán và xác lập ranh giới bảo vệ bản thân.",
      contentMarkdown: peerPressureArticleMarkdown,
      iconName: "Users",
      isPublished: true,
      createdAt: now,
    },
    {
      id: generateId(),
      title: "Khoa Học Hướng Nghiệp Và Quản Lý Áp Lực Chọn Ngành",
      slug: "khoa-hoc-huong-nghiep-va-chon-nganh",
      category: "Định hướng nghề nghiệp",
      summary: "Ứng dụng mô hình RIASEC của John Holland và giao điểm IKIGAI để đưa ra quyết định chọn ngành, chọn trường khách quan.",
      contentMarkdown: careerOrientationArticleMarkdown,
      iconName: "Compass",
      isPublished: true,
      createdAt: now,
    },
    {
      id: generateId(),
      title: "Sức Khỏe Tinh Thần Trong Kỷ Nguyên Số Và Mạng Xã Hội",
      slug: "suc-khoe-tinh-than-ky-nguyen-so",
      category: "Tập trung & Chú ý",
      summary: "Cơ chế Dopamine và thuật toán video ngắn, giao thức cai nghiện kỹ thuật số có cấu trúc và phương pháp làm việc sâu trong học tập.",
      contentMarkdown: digitalWellbeingArticleMarkdown,
      iconName: "Target",
      isPublished: true,
      createdAt: now,
    },
  ]).onConflictDoNothing();

  console.log("✅ Seed dữ liệu khởi tạo production hoàn tất!");
  console.log("👉 Admin: admin /", defaultAdminPass);
  console.log("👉 Counselor: counselor /", defaultCounselorPass);
}

main().catch((err) => {
  console.error("❌ Seed lỗi:", err);
  process.exit(1);
});
