import { describe, it, expect } from "vitest";
import {
  classifySeverity,
  calculateScreeningResult,
} from "./algorithm.js";
import type { ScreeningAnswer } from "./types.js";

describe("Screening Algorithm Unit Tests", () => {
  it("classifySeverity nên phân loại đúng ngưỡng điểm", () => {
    expect(classifySeverity(0)).toBe("normal");
    expect(classifySeverity(9)).toBe("normal");
    expect(classifySeverity(10)).toBe("mild");
    expect(classifySeverity(13)).toBe("mild");
    expect(classifySeverity(14)).toBe("moderate");
    expect(classifySeverity(20)).toBe("moderate");
    expect(classifySeverity(21)).toBe("severe");
    expect(classifySeverity(27)).toBe("severe");
    expect(classifySeverity(28)).toBe("extremely_severe");
    expect(classifySeverity(30)).toBe("extremely_severe");
  });

  it("calculateScreeningResult nên tính toán đúng kết quả bình thường", () => {
    const answers: ScreeningAnswer[] = [
      { questionId: "stress_01", score: 0 },
      { questionId: "dep_01", score: 1 },
    ];

    const result = calculateScreeningResult(answers);
    expect(result.overallSeverity).toBe("normal");
    expect(result.hasHighRisk).toBe(false);
    expect(result.redFlagsCount).toBe(0);
  });

  it("calculateScreeningResult nên kích hoạt High Risk nếu có câu Red Flag >= 2", () => {
    const answers: ScreeningAnswer[] = [
      { questionId: "dep_10", score: 2 }, // Red flag question: suy nghĩ tự hại
    ];

    const result = calculateScreeningResult(answers);
    expect(result.hasHighRisk).toBe(true);
    expect(result.redFlagsCount).toBe(1);

    const depResult = result.topicResults.find((t) => t.topic === "depression");
    expect(depResult?.isHighRisk).toBe(true);
    expect(depResult?.redFlagsTriggered).toContain("dep_10");
  });
});
