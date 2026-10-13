import type { SeverityLevel } from "./types.js";

export interface RiskAnalysis {
  isHighRisk: boolean;
  alertTitle: string;
  alertMessage: string;
  suggestedActions: string[];
}

/**
 * Phân tích trạng thái rủi ro từ kết quả sàng lọc.
 * Pure function — không phụ thuộc DB/HTTP, dùng chung cho client & server.
 */
export function analyzeRiskStatus(
  overallSeverity: SeverityLevel,
  hasRedFlag: boolean
): RiskAnalysis {
  if (hasRedFlag) {
    return {
      isHighRisk: true,
      alertTitle: "Cần hỗ trợ ngay lúc này",
      alertMessage:
        "Kết quả sàng lọc cho thấy bạn đang trải qua những cảm xúc rất khó khăn hoặc có suy nghĩ gây tổn thương bản thân. Bạn không nên đối mặt với điều này một mình.",
      suggestedActions: [
        "Trò chuyện trực tiếp với một người lớn đáng tin cậy ở gần bạn ngay lúc này.",
        "Liên hệ Tổng đài Quốc gia Bảo vệ Trẻ em 111 (miễn phí, 24/7).",
        "Gửi thư tâm sự khẩn cấp hoặc đặt lịch hẹn với phòng tư vấn tâm lý học đường.",
      ],
    };
  }

  if (overallSeverity === "severe" || overallSeverity === "extremely_severe") {
    return {
      isHighRisk: true,
      alertTitle: "Kết quả sàng lọc ghi nhận chỉ báo nguy cơ cao",
      alertMessage:
        "Các biểu hiện của bạn đang ở mức độ cần được quan tâm. Việc chủ động tìm kiếm sự giúp đỡ là bước đi rất tích cực.",
      suggestedActions: [
        "Liên hệ phòng tư vấn tâm lý nhà trường để trao đổi riêng tư.",
        "Đặt lịch hẹn với chuyên viên tư vấn.",
        "Chia sẻ với cha mẹ hoặc thầy cô chủ nhiệm.",
      ],
    };
  }

  return {
    isHighRisk: false,
    alertTitle: "Kết quả ở mức an toàn",
    alertMessage:
      "Hãy tiếp tục duy trì lối sống lành mạnh, cân bằng giữa học tập và thư giãn.",
    suggestedActions: [
      "Tham khảo các bài viết tự chăm sóc sức khỏe tâm thần trong mục Tài nguyên.",
      "Thực hành các kỹ thuật hít thở và quản lý thời gian.",
    ],
  };
}
