<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
    <div class="text-center max-w-xl mx-auto space-y-2">
      <span class="inline-flex items-center px-3 py-1 rounded-lg bg-wine-plum/10 text-wine-plum text-xs font-semibold">Tra cứu ẩn danh</span>
      <h1 class="text-3xl sm:text-4xl font-display text-black tracking-display">
        Tra Cứu Phản Hồi <span class="text-burnt-rose">Tâm Sự</span>
      </h1>
      <p class="text-sm sm:text-base text-charcoal-blue">
        Nhập mã số riêng của bạn (VD: TAMSU-A7K9) để xem nội dung phản hồi từ thầy cô tư vấn.
      </p>
    </div>

    <!-- Input Form -->
    <form @submit.prevent="handleTrack" class="card p-6 flex flex-col sm:flex-row items-center gap-3 border border-charcoal-blue/15 shadow-warm-stone">
      <input
        v-model="trackingCodeInput"
        type="text"
        required
        placeholder="Nhập mã tra cứu: TAMSU-XXXX"
        class="w-full sm:flex-1 px-4 py-3 rounded-lg border border-charcoal-blue/20 bg-porcelain font-mono text-base font-bold uppercase text-black focus:outline-none focus:border-wine-plum focus:bg-white transition-colors"
      />
      <button type="submit" :disabled="isLoading" class="btn-primary w-full sm:w-auto">
        <Search class="w-4 h-4 text-porcelain" />
        <span>{{ isLoading ? 'Đang tìm...' : 'Tra cứu thư' }}</span>
      </button>
    </form>

    <div v-if="errorMsg" class="p-4 bg-burnt-rose/10 border border-burnt-rose/30 text-burnt-rose text-sm font-semibold rounded-card">
      {{ errorMsg }}
    </div>

    <!-- Found Letter Content -->
    <div v-if="letterData" class="card p-6 sm:p-8 space-y-6 animate-fade-in border border-charcoal-blue/15 shadow-warm-stone">
      <div class="flex items-center justify-between border-b border-charcoal-blue/15 pb-4">
        <div>
          <span class="badge-ash mb-1 inline-block font-mono">
            Mã: {{ letterData.trackingCode }}
          </span>
          <h2 class="text-xl sm:text-2xl font-display text-black tracking-display">{{ letterData.title }}</h2>
        </div>
        <span class="pill border" :class="statusBadgeStyle">
          {{ statusText }}
        </span>
      </div>

      <div class="space-y-2">
        <span class="text-xs font-semibold text-charcoal-blue uppercase">Nội dung thư của bạn:</span>
        <div class="bg-porcelain p-5 rounded-card border border-charcoal-blue/10 text-sm text-black leading-relaxed whitespace-pre-line">
          {{ letterData.content }}
        </div>
      </div>

      <!-- Counselor Reply -->
      <div v-if="letterData.replyContent" class="space-y-3 pt-2">
        <div class="flex items-center gap-2 text-black font-semibold text-sm">
          <MessageCircle class="w-5 h-5 text-wine-plum" />
          <span>Hồi âm từ Ban Tư Vấn ({{ letterData.repliedBy }}):</span>
        </div>

        <div class="bg-wine-plum/10 p-5 rounded-card border border-wine-plum/30 text-sm text-black leading-relaxed whitespace-pre-line shadow-subtle">
          {{ letterData.replyContent }}
        </div>
      </div>

      <div v-else class="p-4 bg-charcoal-blue/10 border border-charcoal-blue/20 text-black text-sm font-medium rounded-card flex items-center gap-3">
        <Clock class="w-5 h-5 text-charcoal-blue flex-shrink-0" />
        <span>Thư của bạn đã được tiếp nhận và ban tư vấn đang chuẩn bị phản hồi. Vui lòng quay lại kiểm tra sau ít ngày nhé.</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { apiFetch } from "@/services/api";
import type { CounselingLetterDTO } from "@/types";
import { Search, MessageCircle, Clock } from "lucide-vue-next";

const route = useRoute();
const trackingCodeInput = ref("");
const isLoading = ref(false);
const errorMsg = ref("");
const letterData = ref<CounselingLetterDTO | null>(null);

const statusText = computed(() => {
  if (!letterData.value) return "";
  switch (letterData.value.status) {
    case "pending":
      return "Đang chờ phản hồi";
    case "answered":
      return "Đã có phản hồi";
    case "flagged_urgent":
      return "Ưu tiên phản hồi";
  }
});

const statusBadgeStyle = computed(() => {
  if (!letterData.value) return "";
  switch (letterData.value.status) {
    case "pending":
      return "bg-charcoal-blue/10 text-charcoal-blue border-charcoal-blue/20 font-semibold";
    case "answered":
      return "bg-wine-plum/15 text-wine-plum border-wine-plum/30 font-semibold";
    case "flagged_urgent":
      return "bg-burnt-rose text-porcelain border-burnt-rose font-bold";
  }
});

onMounted(() => {
  const code = route.query.code as string;
  if (code) {
    trackingCodeInput.value = code;
    handleTrack();
  }
});

async function handleTrack() {
  if (!trackingCodeInput.value.trim()) return;
  isLoading.value = true;
  errorMsg.value = "";
  letterData.value = null;

  try {
    const res = await apiFetch<CounselingLetterDTO>(`/letters/track/${encodeURIComponent(trackingCodeInput.value.trim())}`);
    if (res.success && res.data) {
      letterData.value = res.data;
    } else {
      errorMsg.value = res.error?.message || "Không tìm thấy thư với mã số này. Vui lòng kiểm tra lại.";
    }
  } catch (err: any) {
    errorMsg.value = "Lỗi kết nối khi tra cứu. Vui lòng thử lại.";
  } finally {
    isLoading.value = false;
  }
}
</script>
