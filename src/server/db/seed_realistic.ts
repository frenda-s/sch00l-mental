import { createDbClient } from "./client.js";
import * as schema from "./schema.js";
import { generateId } from "../utils/tracking-code.js";

async function populateRealisticData() {
  console.log("🌱 Đang nạp dữ liệu thực nghiệm thực tế cho báo cáo...");
  const { client, db } = createDbClient();

  // 1. Dọn dữ liệu khảo sát, thư từ và lịch hẹn cũ để nạp mới đồng bộ
  await client.execute("DELETE FROM screening_results");
  await client.execute("DELETE FROM screenings");
  await client.execute("DELETE FROM appointments");
  await client.execute("DELETE FROM counseling_letters");

  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const todayStr = new Date().toISOString().split("T")[0];

  // 2. Tạo 15 phiên sàng lọc với các mức độ rủi ro đa dạng
  const screeningTopics = [
    "stress", "depression", "anxiety", "focus",
    "hyperactivity", "social", "study", "career"
  ];

  const severityLevels = [
    { level: "normal", score: 6, isHigh: false },
    { level: "mild", score: 11, isHigh: false },
    { level: "moderate", score: 16, isHigh: false },
    { level: "severe", score: 23, isHigh: true },
    { level: "extremely_severe", score: 28, isHigh: true },
  ];

  for (let i = 1; i <= 15; i++) {
    const sId = generateId();
    const createdTime = now - (15 - i) * 3 * 3600 * 1000;

    await db.insert(schema.screenings).values({
      id: sId,
      userId: null,
      guestSessionId: `guest_ses_${i.toString().padStart(3, '0')}`,
      createdAt: createdTime,
    });

    // Mỗi phiên có kết quả cho 8 chủ đề
    for (const t of screeningTopics) {
      // Xác suất phân bố: đa số bình thường / nhẹ / vừa, vài ca cao
      let pick = severityLevels[0];
      if (i % 5 === 0) pick = severityLevels[4]; // ca rất cao
      else if (i % 3 === 0) pick = severityLevels[3]; // ca cao
      else if (i % 2 === 0) pick = severityLevels[2]; // ca vừa
      else if (i % 4 === 1) pick = severityLevels[1]; // ca nhẹ

      await db.insert(schema.screeningResults).values({
        id: generateId(),
        screeningId: sId,
        topic: t,
        score: pick.score,
        severity: pick.level as any,
        isHighRisk: pick.isHigh,
        answersJson: JSON.stringify([{ questionId: `${t}_01`, score: 2 }]),
        createdAt: createdTime,
      });
    }
  }

  // 3. Tạo 5 lá thư tâm sự ẩn danh với nội dung thực tế và các trạng thái khác nhau
  const sampleLetters = [
    {
      trackingCode: "TAMSU-K7M2",
      studentAlias: "Học sinh 12A1",
      title: "Áp lực chọn khối xét tuyển và kỳ vọng quá lớn từ gia đình",
      content: "Kính gửi Ban tư vấn tâm lý trường học,\nEm là học sinh lớp 12. Dạo gần đây em thường xuyên bị mất ngủ và căng thẳng vì bố mẹ bắt buộc em phải thi vào khối ngành Y Dược, trong khi năng khiếu và đam mê thực sự của em là Công nghệ thông tin. Em rất sợ làm bố mẹ thất vọng nhưng cũng cảm thấy bản thân kiệt sức nếu phải học theo định hướng mình không yêu thích. Em mong được thầy cô cho em lời khuyên về cách trò chuyện thẳng thắn với gia đình mà không làm rạn nứt tình cảm.",
      category: "Định hướng nghề nghiệp & Tương lai",
      status: "answered",
      replyContent: "Chào em, cảm ơn em đã tin tưởng gửi gắm những băn khoăn chân thành đến Ban tư vấn nhà trường.\nSự bất đồng giữa nguyện vọng cá nhân và mong muốn của phụ huynh là vấn đề rất phổ biến ở giai đoạn cuối cấp. Điều quan trọng nhất lúc này là xây dựng một cuộc đối thoại dựa trên sự tôn trọng và dữ liệu thực tế:\n1. Em hãy chuẩn bị một bản kế hoạch học tập chi tiết về ngành Công nghệ thông tin, bao gồm cơ hội việc làm, các trường đào tạo phù hợp và kế hoạch tài chính rõ ràng để trình bày cho cha mẹ thấy sự nghiêm túc của mình.\n2. Ban tư vấn luôn sẵn sàng mời em và phụ huynh đến phòng tham vấn để làm cầu nối hỗ trợ chia sẻ nếu em cảm thấy khó mở lời.\nChúc em luôn giữ vững niềm tin vào bản thân!",
      repliedBy: "Phòng Tư Vấn Tâm Lý Học Đường",
      repliedAt: now - 3600 * 1000,
      createdAt: now - oneDay * 2,
    },
    {
      trackingCode: "TAMSU-R9X4",
      studentAlias: "Người bạn lớp 11",
      title: "Khó khăn trong việc hòa nhập và cảm giác bị cô lập trong lớp học",
      content: "Em cảm thấy mình lạc lõng trong tập thể lớp mới. Mỗi khi đến giờ sinh hoạt nhóm hoặc giờ ra chơi, em thường ngồi một mình và không biết cách bắt chuyện với các bạn. Cảm giác này khiến em rất sợ mỗi buổi sáng phải bước chân đến trường học.",
      category: "Mối quan hệ bạn bè & Trường học",
      status: "pending",
      replyContent: null,
      repliedBy: null,
      repliedAt: null,
      createdAt: now - 5 * 3600 * 1000,
    },
    {
      trackingCode: "TAMSU-C2P8",
      studentAlias: "Bạn nhỏ 10B3",
      title: "Mất ngủ kéo dài và thường xuyên hồi hộp trước các bài kiểm tra 15 phút",
      content: "Cứ mỗi lần chuẩn bị đến tiết kiểm tra là tim em đập rất nhanh, tay run và đầu óc hoàn toàn trống rỗng dù em đã ôn bài rất kỹ ở nhà. Em rất lo lắng tình trạng này sẽ ảnh hưởng xấu đến kết quả thi học kỳ sắp tới.",
      category: "Áp lực học tập & Thi cử",
      status: "pending",
      replyContent: null,
      repliedBy: null,
      repliedAt: null,
      createdAt: now - 2 * 3600 * 1000,
    },
    {
      trackingCode: "TAMSU-H5N1",
      studentAlias: "Ẩn danh",
      title: "Kiệt sức tinh thần và cảm giác không có ai thấu hiểu",
      content: "Em cảm thấy bế tắc hoàn toàn với mọi thứ xung quanh. Điểm số giảm sút, gia đình liên tục trách mắng và em không tìm thấy bất kỳ động lực nào để tiếp tục cố gắng.",
      category: "Khó khăn cảm xúc / Khác",
      status: "flagged_urgent",
      replyContent: null,
      repliedBy: null,
      repliedAt: null,
      createdAt: now - 30 * 60 * 1000,
    },
    {
      trackingCode: "TAMSU-B4L9",
      studentAlias: "Học sinh 11A4",
      title: "Căng thẳng vì bất đồng quan điểm sống với cha mẹ",
      content: "Mỗi bữa cơm gia đình đều trở thành áp lực đối với em vì bố mẹ luôn so sánh em với con nhà người ta. Em cảm thấy bản thân không được tôn trọng quyền riêng tư.",
      category: "Căng thẳng gia đình",
      status: "answered",
      replyContent: "Chào em, sự so sánh từ người lớn thường bắt nguồn từ nỗi lo âu thầm kín nhưng vô tình gây ra tổn thương tâm lý sâu sắc cho con em. Thầy cô khuyên em nên bình tĩnh, tìm cơ hội bày tỏ cảm xúc của mình với cha mẹ bằng những lời chân thành và tiếp tục chứng minh năng lực qua hành động tích cực.",
      repliedBy: "Phòng Tư Vấn Tâm Lý Học Đường",
      repliedAt: now - 12 * 3600 * 1000,
      createdAt: now - oneDay,
    },
  ];

  for (const l of sampleLetters) {
    await db.insert(schema.counselingLetters).values({
      id: generateId(),
      trackingCode: l.trackingCode,
      studentId: null,
      studentAlias: l.studentAlias,
      title: l.title,
      content: l.content,
      category: l.category,
      status: l.status as any,
      replyContent: l.replyContent,
      repliedBy: l.repliedBy,
      repliedAt: l.repliedAt,
      createdAt: l.createdAt,
    });
  }

  // 4. Tạo 4 lịch hẹn tư vấn thực tế (có cả lịch hẹn hôm nay để hiển thị thẻ thống kê)
  const sampleAppointments = [
    {
      studentName: "Nguyễn Văn Hưng (Lớp 12A2)",
      contactInfo: "0912345678 (Zalo)",
      appointmentDate: todayStr,
      timeSlot: "08:00 - 09:00",
      format: "offline_school",
      status: "confirmed",
      note: "Em muốn được tư vấn trực tiếp về phương pháp giải tỏa áp lực thi tốt nghiệp",
    },
    {
      studentName: "Trần Mai Phương (Lớp 11B1)",
      contactInfo: "phuong11b1@gmail.com",
      appointmentDate: todayStr,
      timeSlot: "14:00 - 15:00",
      format: "online_meet",
      status: "pending",
      note: "Em xin hẹn gặp trực tuyến qua Google Meet để trao đổi về xung đột nhóm",
    },
    {
      studentName: "Lê Hoàng Nam (Lớp 10A5)",
      contactInfo: "0987654321",
      appointmentDate: new Date(now + oneDay).toISOString().split("T")[0],
      timeSlot: "09:30 - 10:30",
      format: "offline_school",
      status: "confirmed",
      note: "Tư vấn về kỹ năng quản lý thời gian học tập",
    },
    {
      studentName: "Vũ Thuỳ Linh (Lớp 12D)",
      contactInfo: "linh_vu12d@gmail.com",
      appointmentDate: new Date(now - oneDay).toISOString().split("T")[0],
      timeSlot: "15:30 - 16:30",
      format: "offline_school",
      status: "completed",
      note: "Đã hoàn thành phiên tư vấn định hướng chọn trường",
    },
  ];

  for (const a of sampleAppointments) {
    await db.insert(schema.appointments).values({
      id: generateId(),
      studentId: null,
      studentName: a.studentName,
      contactInfo: a.contactInfo,
      counselorId: null,
      appointmentDate: a.appointmentDate,
      timeSlot: a.timeSlot,
      format: a.format as any,
      status: a.status as any,
      note: a.note,
      createdAt: now,
    });
  }

  console.log("✅ Đã nạp thành công bộ dữ liệu thực nghiệm chân thực!");
}

populateRealisticData()
  .catch((err) => {
    console.error("Lỗi:", err);
    process.exit(1);
  });
