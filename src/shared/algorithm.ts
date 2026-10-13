import type {
  ScreeningAnswer,
  ScreeningEvaluationResult,
  SeverityLevel,
  TopicResult,
} from "./types.js";
import { SCREENING_QUESTIONS, SCREENING_TOPICS } from "./questions.js";

export const RESEARCH_DISCLAIMER =
  "Đây là quy tắc sàng lọc được sử dụng trong nghiên cứu khoa học học đường, không phải tiêu chuẩn chẩn đoán y khoa. Kết quả phản ánh mức độ biểu hiện tại thời điểm khảo sát và gợi ý hướng chăm sóc phù hợp.";

export function classifySeverity(score: number): SeverityLevel {
  if (score < 10) return "normal";
  if (score < 14) return "mild";
  if (score < 21) return "moderate";
  if (score < 28) return "severe";
  return "extremely_severe";
}

export function getSeverityLabel(severity: SeverityLevel): string {
  switch (severity) {
    case "normal":
      return "Bình thường / Ít biểu hiện";
    case "mild":
      return "Mức độ nhẹ";
    case "moderate":
      return "Mức độ vừa";
    case "severe":
      return "Mức độ cao";
    case "extremely_severe":
      return "Mức độ rất cao";
  }
}

export function getSeverityDescription(
  severity: SeverityLevel
): string {
  switch (severity) {
    case "normal":
      return "Bạn chưa ghi nhận nhiều biểu hiện đáng lo theo bộ câu hỏi sàng lọc này. Hãy tiếp tục duy trì thói quen học tập và sinh hoạt lành mạnh.";
    case "mild":
      return "Một số biểu hiện đang xuất hiện ở mức độ nhẹ. Bạn có thể tự theo dõi cảm xúc, sắp xếp lại thời gian biểu và thực hành các bài tập thư giãn đơn giản.";
    case "moderate":
      return "Những biểu hiện này có thể đang ảnh hưởng đáng kể đến học tập hoặc đời sống. Bạn nên cân nhắc chia sẻ với người lớn đáng tin cậy hoặc giáo viên tư vấn.";
    case "severe":
      return "Bạn đang có mức độ biểu hiện cao. Việc tìm kiếm sự hỗ trợ trực tiếp từ thầy cô tư vấn tâm lý học đường hoặc chuyên gia là điều rất nên cân nhắc lúc này.";
    case "extremely_severe":
      return "Kết quả sàng lọc cho thấy bạn đang trải qua những áp lực rất lớn. Bạn nên tìm kiếm sự hỗ trợ trực tiếp từ người lớn đáng tin cậy hoặc phòng tư vấn tâm lý càng sớm càng tốt.";
  }
}

export function calculateScreeningResult(
  answers: ScreeningAnswer[]
): ScreeningEvaluationResult {
  const answerMap = new Map<string, number>();
  for (const a of answers) {
    answerMap.set(a.questionId, a.score);
  }

  const topicResults: TopicResult[] = [];
  let hasHighRisk = false;
  let redFlagsCount = 0;

  for (const meta of SCREENING_TOPICS) {
    const questions = SCREENING_QUESTIONS.filter((q) => q.topic === meta.id);
    let topicScore = 0;
    const redFlagsTriggered: string[] = [];

    for (const q of questions) {
      const val = answerMap.get(q.id) ?? 0;
      topicScore += val;

      if (q.redFlag && val >= 2) {
        hasHighRisk = true;
        redFlagsCount++;
        redFlagsTriggered.push(q.id);
      }
    }

    const maxScore = questions.length * 3;
    const severity = classifySeverity(topicScore);

    if (severity === "severe" || severity === "extremely_severe") {
      hasHighRisk = true;
    }

    topicResults.push({
      topic: meta.id,
      score: topicScore,
      maxScore,
      severity,
      isHighRisk:
        severity === "severe" ||
        severity === "extremely_severe" ||
        redFlagsTriggered.length > 0,
      redFlagsTriggered,
      recommendation: getSeverityDescription(severity),
    });
  }

  // Determine overall severity (take worst topic)
  const severityRank: Record<SeverityLevel, number> = {
    normal: 0,
    mild: 1,
    moderate: 2,
    severe: 3,
    extremely_severe: 4,
  };

  let maxRank = 0;
  let overallSeverity: SeverityLevel = "normal";

  for (const tr of topicResults) {
    const r = severityRank[tr.severity];
    if (r > maxRank) {
      maxRank = r;
      overallSeverity = tr.severity;
    }
  }

  return {
    overallSeverity,
    hasHighRisk,
    redFlagsCount,
    topicResults,
    disclaimer: RESEARCH_DISCLAIMER,
  };
}
