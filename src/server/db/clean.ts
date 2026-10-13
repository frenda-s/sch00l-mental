import { createDbClient } from "./client.js";

async function cleanTestData() {
  console.log("🧹 Đang dọn sạch toàn bộ test data...");
  const { client } = createDbClient();

  // Dọn dữ liệu theo đúng tên bảng trong schema.ts
  await client.execute("DELETE FROM screening_results");
  await client.execute("DELETE FROM screenings");
  await client.execute("DELETE FROM appointments");
  await client.execute("DELETE FROM counseling_letters");
  await client.execute("DELETE FROM users");
  await client.execute("DELETE FROM mental_resources");

  console.log("✅ Dọn sạch thành công!");
}

cleanTestData()
  .catch((err) => {
    console.error("Lỗi dọn test data:", err);
    process.exit(1);
  });
