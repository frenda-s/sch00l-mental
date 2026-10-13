<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
    <!-- Header Step Progress -->
    <div class="card p-6 flex items-center justify-between border border-charcoal-blue/15 shadow-warm-stone">
      <div>
        <span class="inline-flex items-center px-3 py-1 rounded-lg bg-wine-plum/10 text-wine-plum text-xs font-semibold mb-2">
          Bước {{ store.currentStep }} / 3
        </span>
        <h1 class="text-xl sm:text-2xl font-display text-black tracking-display">
          {{ stepTitle }}
        </h1>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="store.currentStep > 1 && store.currentStep < 4"
          @click="store.currentStep--"
          class="btn-text text-sm"
        >
          Quay lại
        </button>
        <button
          @click="resetAll"
          class="px-3 py-2 text-sm font-medium text-charcoal-blue hover:text-burnt-rose hover:bg-white rounded-lg transition-colors"
        >
          Làm lại
        </button>
      </div>
    </div>

    <!-- Step 1: Chọn chủ đề khảo sát -->
    <div v-if="store.currentStep === 1" class="space-y-6">
      <div class="bg-white p-5 rounded-card border border-charcoal-blue/15 shadow-warm-stone text-sm text-charcoal-blue">
        <strong class="text-black">Gợi ý:</strong> Bạn có thể chọn 1 hoặc nhiều chủ đề quan tâm bên dưới. Nếu không chọn riêng lẻ, hệ thống sẽ thực hiện khảo sát toàn diện 8 nhóm chủ đề.
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ScreeningCard
          v-for="t in store.topics"
          :key="t.id"
          :topic="t"
          :isSelected="store.selectedTopics.includes(t.id)"
          @select="store.toggleTopic(t.id)"
        />
      </div>

      <div class="flex justify-end pt-4">
        <button @click="store.currentStep = 2" class="btn-primary">
          <span>Bắt đầu trả lời câu hỏi</span>
          <ArrowRight class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Step 2: Làm câu hỏi Likert -->
    <div v-else-if="store.currentStep === 2" class="space-y-6">
      <div class="card p-5 border border-charcoal-blue/15 shadow-warm-stone">
        <ProgressBar :percentage="store.progressPercentage" label="Tiến độ trả lời câu hỏi" />
      </div>

      <div class="space-y-4">
        <LikertQuestion
          v-for="(q, idx) in store.activeQuestions"
          :key="q.id"
          :question="q"
          :index="idx"
          :modelValue="store.answers[q.id]"
          @update:modelValue="(val) => store.setAnswer(q.id, val)"
        />
      </div>

      <div class="flex items-center justify-between pt-6">
        <button @click="store.currentStep = 1" class="btn-text text-sm">
          Trở lại chọn chủ đề
        </button>

        <button
          @click="store.currentStep = 3"
          :disabled="!store.isAllAnswered"
          class="btn-primary"
        >
          <span>Xem lại &amp; Nộp bài</span>
          <ArrowRight class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Step 3: Review Answers & Submit -->
    <div v-else-if="store.currentStep === 3" class="space-y-6">
      <div class="card p-6 space-y-4 border border-charcoal-blue/15 shadow-warm-stone">
        <h3 class="font-display text-black text-lg tracking-display">Xác nhận nộp bài sàng lọc</h3>
        <p class="text-sm text-charcoal-blue">
          Bạn đã hoàn thành {{ store.activeQuestions.length }} câu hỏi. Nhấn "Nộp bài khảo sát" để hệ thống tính toán kết quả nguy cơ và đưa ra khuyến nghị thực hành.
        </p>
        <DisclaimerCard />
      </div>

      <div class="flex items-center justify-between pt-4">
        <button @click="store.currentStep = 2" class="btn-text text-sm">
          Sửa câu trả lời
        </button>

        <button
          @click="handleSubmit"
          :disabled="store.isSubmitting"
          class="btn-primary"
        >
          <CheckCircle2 class="w-5 h-5 text-porcelain" />
          <span>{{ store.isSubmitting ? 'Đang phân tích...' : 'Nộp bài khảo sát' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useScreeningStore } from "@/stores/screening";
import ScreeningCard from "@/components/ScreeningCard.vue";
import LikertQuestion from "@/components/LikertQuestion.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import DisclaimerCard from "@/components/DisclaimerCard.vue";
import { ArrowRight, CheckCircle2 } from "lucide-vue-next";

const router = useRouter();
const store = useScreeningStore();

onMounted(async () => {
  await store.fetchQuestions();
});

const stepTitle = computed(() => {
  switch (store.currentStep) {
    case 1:
      return "Chọn chủ đề quan tâm";
    case 2:
      return "Trả lời câu hỏi tự đánh giá";
    case 3:
      return "Xác nhận & Nộp khảo sát";
    default:
      return "Khảo sát tâm lý";
  }
});

const resetAll = () => {
  if (confirm("Bạn có chắc chắn muốn làm lại từ đầu?")) {
    store.resetScreening();
  }
};

const handleSubmit = async () => {
  const result = await store.submitScreening();
  if (result) {
    router.push({ name: "result", params: { code: result.screeningId } });
  }
};
</script>
