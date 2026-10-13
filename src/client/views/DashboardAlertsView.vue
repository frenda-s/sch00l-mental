<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <span class="inline-flex items-center px-3 py-1 rounded-lg bg-burnt-rose/10 text-burnt-rose text-xs font-semibold mb-1">Ưu tiên theo dõi</span>
        <h1 class="text-3xl font-display text-black tracking-display">Cảnh Báo Nguy Cơ Cao</h1>
        <p class="text-sm text-charcoal-blue mt-0.5">Theo dõi các trường hợp có điểm số sàng lọc ở mức cảnh báo cao.</p>
      </div>
      <router-link to="/dashboard" class="btn-ghost text-sm">&larr; Tổng quan</router-link>
    </div>

    <LoadingState v-if="isLoading" text="Đang tải danh sách cảnh báo..." />

    <div v-else-if="alerts.length" class="space-y-3">
      <div
        v-for="alert in alerts"
        :key="alert.id"
        class="card p-6 border-2 border-burnt-rose/30 bg-white shadow-warm-stone"
      >
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="space-y-1.5">
            <div class="flex items-center gap-2 flex-wrap">
              <AlertTriangle class="w-5 h-5 text-burnt-rose" />
              <span class="font-display text-lg text-black tracking-display">{{ topicLabel(alert.topic) }}</span>
              <span class="pill border" :class="severityStyle(alert.severity)">{{ getSeverityLabel(alert.severity as SeverityLevel) }}</span>
            </div>
            <p class="text-xs sm:text-sm text-charcoal-blue">
              {{ formatDate(alert.createdAt) }} &bull; Điểm tích lũy: <strong class="text-black">{{ alert.score }}</strong>
            </p>
          </div>

          <div class="flex items-center gap-2">
            <router-link to="/dashboard/letters" class="btn-ghost text-xs">Xem hòm thư liên quan</router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!isLoading" class="card p-10 text-center text-charcoal-blue border border-charcoal-blue/15 shadow-warm-stone">
      Không có cảnh báo nguy cơ cao nào vào lúc này.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { apiFetch } from "@/services/api";
import { getSeverityLabel } from "@shared/algorithm";
import { SCREENING_TOPICS } from "@shared/questions";
import type { SeverityLevel } from "@shared/types";
import LoadingState from "@/components/LoadingState.vue";
import { AlertTriangle } from "lucide-vue-next";

interface AlertRow {
  id: string;
  topic: string;
  score: number;
  severity: string;
  createdAt: number;
}

const alerts = ref<AlertRow[]>([]);
const isLoading = ref(false);

const severityStyle = (s: string) =>
  s === "extremely_severe"
    ? "bg-black text-porcelain border-burnt-rose font-bold"
    : s === "severe"
    ? "bg-burnt-rose text-porcelain border-burnt-rose font-bold"
    : "bg-wine-plum/15 text-wine-plum border-wine-plum/30 font-semibold";

function topicLabel(topic: string) {
  return SCREENING_TOPICS.find((t) => t.id === topic)?.title || topic;
}

function formatDate(ts: number) {
  // Chuẩn hóa timestamp tính bằng milliseconds
  const timeMs = ts < 1e11 ? ts * 1000 : ts;
  return new Date(timeMs).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function fetchAlerts() {
  const res = await apiFetch<AlertRow[]>("/dashboard/high-risk");
  if (res.success && res.data) alerts.value = res.data;
}

onMounted(async () => {
  isLoading.value = true;
  try {
    await fetchAlerts();
  } finally {
    isLoading.value = false;
  }
});
</script>
