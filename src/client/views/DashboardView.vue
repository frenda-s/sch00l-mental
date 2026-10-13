<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
    <!-- Dashboard Header -->
    <div class="flex items-center justify-between">
      <div>
        <span class="inline-flex items-center px-3 py-1 rounded-lg bg-wine-plum/10 text-wine-plum text-xs font-semibold mb-1">Cổng thông tin chuyên môn</span>
        <h1 class="text-3xl font-display text-black tracking-display">Tổng Quan Tư Vấn</h1>
        <p class="text-sm text-charcoal-blue mt-0.5">
          Xin chào, <span class="font-semibold text-black">{{ auth.user?.fullName }}</span>
        </p>
      </div>
      <button @click="handleLogout" class="btn-ghost text-sm">
        <LogOut class="w-4 h-4 text-burnt-rose" />
        <span>Đăng xuất</span>
      </button>
    </div>

    <LoadingState v-if="isLoading" text="Đang tải thống kê..." />

    <template v-else-if="overview">
      <!-- Stat Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="card p-6 border border-charcoal-blue/15 shadow-warm-stone">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold uppercase tracking-wider text-charcoal-blue">Lượt sàng lọc</span>
            <ClipboardList class="w-5 h-5 text-wine-plum" />
          </div>
          <p class="text-3xl font-display text-black tracking-display">{{ overview.totalScreenings }}</p>
        </div>

        <div class="card p-6 border border-burnt-rose/30 bg-burnt-rose/5 shadow-warm-stone">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold uppercase tracking-wider text-burnt-rose">Ca cần quan tâm</span>
            <AlertTriangle class="w-5 h-5 text-burnt-rose" />
          </div>
          <p class="text-3xl font-display text-burnt-rose tracking-display">{{ overview.highRiskCases }}</p>
        </div>

        <div class="card p-6 border border-charcoal-blue/15 shadow-warm-stone">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold uppercase tracking-wider text-charcoal-blue">Thư đang chờ</span>
            <Mail class="w-5 h-5 text-wine-plum" />
          </div>
          <p class="text-3xl font-display text-black tracking-display">{{ overview.pendingLetters }}</p>
        </div>

        <div class="card p-6 border border-charcoal-blue/15 shadow-warm-stone">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold uppercase tracking-wider text-charcoal-blue">Lịch hẹn hôm nay</span>
            <CalendarDays class="w-5 h-5 text-wine-plum" />
          </div>
          <p class="text-3xl font-display text-black tracking-display">{{ overview.todayAppointments }}</p>
        </div>
      </div>

      <!-- Charts: Severity + Topic distribution -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card p-6 space-y-4 border border-charcoal-blue/15 shadow-warm-stone">
          <h3 class="font-display text-black text-lg tracking-display">Phân bố mức độ biểu hiện</h3>
          <div v-if="severityBars.length" class="space-y-3">
            <div v-for="bar in severityBars" :key="bar.label" class="space-y-1">
              <div class="flex items-center justify-between text-xs">
                <span class="font-semibold text-black">{{ bar.label }}</span>
                <span class="text-charcoal-blue">{{ bar.count }}</span>
              </div>
              <div class="h-2.5 bg-porcelain border border-charcoal-blue/10 rounded-full overflow-hidden">
                <div class="h-full rounded-full" :class="bar.color" :style="{ width: bar.percent + '%' }"></div>
              </div>
            </div>
          </div>
          <p v-else class="text-sm text-charcoal-blue">Chưa có dữ liệu sàng lọc.</p>
        </div>

        <div class="card p-6 space-y-4 border border-charcoal-blue/15 shadow-warm-stone">
          <h3 class="font-display text-black text-lg tracking-display">Phân bố chủ đề quan tâm</h3>
          <div v-if="topicBars.length" class="space-y-3">
            <div v-for="bar in topicBars" :key="bar.label" class="space-y-1">
              <div class="flex items-center justify-between text-xs">
                <span class="font-semibold text-black">{{ bar.label }}</span>
                <span class="text-charcoal-blue">{{ bar.count }}</span>
              </div>
              <div class="h-2.5 bg-porcelain border border-charcoal-blue/10 rounded-full overflow-hidden">
                <div class="h-full rounded-full bg-wine-plum" :style="{ width: bar.percent + '%' }"></div>
              </div>
            </div>
          </div>
          <p v-else class="text-sm text-charcoal-blue">Chưa có dữ liệu sàng lọc.</p>
        </div>
      </div>

      <!-- Quick Nav -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <router-link to="/dashboard/letters" class="card p-5 border border-charcoal-blue/15 shadow-warm-stone hover:border-wine-plum transition-all flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-lg bg-porcelain border border-charcoal-blue/10 flex items-center justify-center text-wine-plum group-hover:bg-wine-plum group-hover:text-porcelain transition-colors">
            <Mail class="w-5 h-5" />
          </div>
          <div>
            <p class="font-display text-black text-base tracking-display">Quản lý thư tâm sự</p>
            <p class="text-xs text-charcoal-blue">Trả lời thư ẩn danh từ học sinh</p>
          </div>
        </router-link>

        <router-link to="/dashboard/appointments" class="card p-5 border border-charcoal-blue/15 shadow-warm-stone hover:border-wine-plum transition-all flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-lg bg-porcelain border border-charcoal-blue/10 flex items-center justify-center text-wine-plum group-hover:bg-wine-plum group-hover:text-porcelain transition-colors">
            <CalendarDays class="w-5 h-5" />
          </div>
          <div>
            <p class="font-display text-black text-base tracking-display">Quản lý lịch hẹn</p>
            <p class="text-xs text-charcoal-blue">Xác nhận và sắp xếp cuộc hẹn</p>
          </div>
        </router-link>

        <router-link to="/dashboard/alerts" class="card p-5 border border-burnt-rose/30 shadow-warm-stone hover:border-burnt-rose transition-all flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-lg bg-burnt-rose/10 flex items-center justify-center text-burnt-rose group-hover:bg-burnt-rose group-hover:text-porcelain transition-colors">
            <AlertTriangle class="w-5 h-5" />
          </div>
          <div>
            <p class="font-display text-black text-base tracking-display">Cảnh báo nguy cơ</p>
            <p class="text-xs text-charcoal-blue">Theo dõi các trường hợp cần can thiệp</p>
          </div>
        </router-link>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { apiFetch } from "@/services/api";
import { getSeverityLabel } from "@shared/algorithm";
import { SCREENING_TOPICS } from "@shared/questions";
import LoadingState from "@/components/LoadingState.vue";
import {
  ClipboardList,
  AlertTriangle,
  Mail,
  CalendarDays,
  LogOut,
} from "lucide-vue-next";

const auth = useAuthStore();
const router = useRouter();
const isLoading = ref(false);
const overview = ref<any>(null);
const severityData = ref<{ severity: string; count: number }[]>([]);
const topicData = ref<{ topic: string; count: number }[]>([]);

interface StatBar {
  label: string;
  count: number;
  percent: number;
  color: string;
}

const severityColors: Record<string, string> = {
  normal: "bg-charcoal-blue",
  mild: "bg-burnt-rose/70",
  moderate: "bg-wine-plum",
  severe: "bg-burnt-rose",
  extremely_severe: "bg-black",
};

const severityBars = computed<StatBar[]>(() => {
  if (!severityData.value.length) return [];
  const max = Math.max(1, ...severityData.value.map((d) => d.count));
  return severityData.value.map((d) => ({
    label: getSeverityLabel(d.severity as any),
    count: d.count,
    percent: Math.round((d.count / max) * 100),
    color: severityColors[d.severity] || "bg-inkwell-navy",
  }));
});

const topicBars = computed<StatBar[]>(() => {
  if (!topicData.value.length) return [];
  const max = Math.max(1, ...topicData.value.map((d) => d.count));
  return topicData.value.map((d) => ({
    label: topicLabel(d.topic),
    count: d.count,
    percent: Math.round((d.count / max) * 100),
    color: "bg-inkwell-navy",
  }));
});

function topicLabel(topic: string) {
  return SCREENING_TOPICS.find((t) => t.id === topic)?.title || topic;
}

async function handleLogout() {
  await auth.logout();
  router.push("/");
}

onMounted(async () => {
  isLoading.value = true;
  try {
    const [overviewRes, severityRes, topicRes] = await Promise.all([
      apiFetch<any>("/dashboard/overview"),
      apiFetch<{ severity: string; count: number }[]>("/dashboard/severity"),
      apiFetch<{ topic: string; count: number }[]>("/dashboard/topics"),
    ]);

    if (overviewRes.success && overviewRes.data) overview.value = overviewRes.data;
    if (severityRes.success && severityRes.data) severityData.value = severityRes.data;
    if (topicRes.success && topicRes.data) topicData.value = topicRes.data;
  } finally {
    isLoading.value = false;
  }
});
</script>
