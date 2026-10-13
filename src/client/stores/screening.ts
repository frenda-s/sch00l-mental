import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  ScreeningAnswer,
  ScreeningEvaluationResult,
  ScreeningQuestion,
  ScreeningTopic,
  ScreeningTopicMeta,
} from "../types/index.js";
import { apiFetch } from "../services/api.ts";

export const useScreeningStore = defineStore("screening", () => {
  const topics = ref<ScreeningTopicMeta[]>([]);
  const questions = ref<ScreeningQuestion[]>([]);
  const selectedTopics = ref<ScreeningTopic[]>([]);
  const answers = ref<Record<string, number>>({});
  const currentStep = ref<number>(1); // 1: Topic Select, 2: Questions, 3: Review, 4: Result
  const isSubmitting = ref<boolean>(false);
  const lastResult = ref<ScreeningEvaluationResult | null>(null);
  const lastScreeningId = ref<string | null>(null);

  const activeQuestions = computed(() => {
    if (selectedTopics.value.length === 0) return questions.value;
    return questions.value.filter((q) => selectedTopics.value.includes(q.topic));
  });

  const progressPercentage = computed(() => {
    if (activeQuestions.value.length === 0) return 0;
    const answeredCount = activeQuestions.value.filter(
      (q) => answers.value[q.id] !== undefined
    ).length;
    return Math.round((answeredCount / activeQuestions.value.length) * 100);
  });

  const isAllAnswered = computed(() => {
    if (activeQuestions.value.length === 0) return false;
    return activeQuestions.value.every((q) => answers.value[q.id] !== undefined);
  });

  async function fetchQuestions() {
    const res = await apiFetch<{
      topics: ScreeningTopicMeta[];
      questions: ScreeningQuestion[];
    }>("/screenings/questions");

    if (res.success && res.data) {
      topics.value = res.data.topics;
      questions.value = res.data.questions;
    }
  }

  function setAnswer(questionId: string, score: number) {
    answers.value = {
      ...answers.value,
      [questionId]: score,
    };
  }

  function toggleTopic(topicId: ScreeningTopic) {
    if (selectedTopics.value.includes(topicId)) {
      selectedTopics.value = selectedTopics.value.filter((t) => t !== topicId);
    } else {
      selectedTopics.value.push(topicId);
    }
  }

  function resetScreening() {
    answers.value = {};
    selectedTopics.value = [];
    currentStep.value = 1;
    lastResult.value = null;
    lastScreeningId.value = null;
  }

  async function submitScreening() {
    if (isSubmitting.value) return null;
    isSubmitting.value = true;

    const formattedAnswers: ScreeningAnswer[] = activeQuestions.value.map((q) => ({
      questionId: q.id,
      score: answers.value[q.id] ?? 0,
    }));

    try {
      const res = await apiFetch<{
        screeningId: string;
        evaluation: ScreeningEvaluationResult;
      }>("/screenings", {
        method: "POST",
        body: JSON.stringify({
          answers: formattedAnswers,
        }),
      });

      if (res.success && res.data) {
        lastResult.value = res.data.evaluation;
        lastScreeningId.value = res.data.screeningId;
        currentStep.value = 4; // Sang màn hình kết quả
        return res.data;
      }
      return null;
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    topics,
    questions,
    selectedTopics,
    answers,
    currentStep,
    isSubmitting,
    lastResult,
    lastScreeningId,
    activeQuestions,
    progressPercentage,
    isAllAnswered,
    fetchQuestions,
    setAnswer,
    toggleTopic,
    resetScreening,
    submitScreening,
  };
});
