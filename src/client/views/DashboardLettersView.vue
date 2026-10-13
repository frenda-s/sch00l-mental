<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <span class="inline-flex items-center px-3 py-1 rounded-lg bg-wine-plum/10 text-wine-plum text-xs font-semibold mb-1">Hộp thư riêng tư</span>
        <h1 class="text-3xl font-display text-black tracking-display">Thư Tâm Sự Của Học Sinh</h1>
        <p class="text-sm text-charcoal-blue mt-0.5">Quản lý và phản hồi các chia sẻ ẩn danh từ học sinh.</p>
      </div>
      <router-link to="/dashboard" class="btn-ghost text-sm">&larr; Tổng quan</router-link>
    </div>

    <LoadingState v-if="isLoading" text="Đang tải danh sách thư..." />

    <div v-else-if="letters.length" class="space-y-4">
      <div
        v-for="letter in letters"
        :key="letter.id"
        class="card p-6 space-y-3 border border-charcoal-blue/15 shadow-warm-stone transition-all"
        :class="{ 'border-2 border-burnt-rose bg-burnt-rose/5': letter.status === 'flagged_urgent' }"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="space-y-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="badge-ash font-mono text-xs">{{ letter.trackingCode }}</span>
              <span class="pill border" :class="statusStyle(letter.status)">{{ statusText(letter.status) }}</span>
            </div>
            <h3 class="font-display text-black text-lg truncate tracking-display">{{ letter.title }}</h3>
            <p class="text-xs text-charcoal-blue">
              {{ letter.studentAlias || 'Ẩn danh' }} &bull; {{ letter.category }} &bull; {{ formatDate(letter.createdAt) }}
            </p>
          </div>
          <button
            @click="toggleExpand(letter.id)"
            class="btn-ghost text-xs flex-shrink-0"
          >
            {{ expandedId === letter.id ? 'Thu gọn' : 'Đọc & Hồi âm' }}
          </button>
        </div>

        <!-- Expanded content -->
        <div v-if="expandedId === letter.id" class="space-y-4 pt-3 border-t border-charcoal-blue/15">
          <div class="bg-porcelain p-5 rounded-card border border-charcoal-blue/10 text-sm text-black whitespace-pre-line leading-relaxed">
            {{ letter.content }}
          </div>

          <!-- Existing reply -->
          <div v-if="letter.replyContent" class="bg-wine-plum/10 p-5 rounded-card border border-wine-plum/30 text-sm text-black leading-relaxed">
            <p class="text-xs font-bold text-wine-plum mb-1 uppercase tracking-wider">Đã phản hồi trước đó:</p>
            <p class="whitespace-pre-line">{{ letter.replyContent }}</p>
          </div>

          <!-- Reply form -->
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-black">Soạn phản hồi:</label>
            <textarea
              v-model="replyDrafts[letter.id]"
              rows="4"
              placeholder="Viết phản hồi chân thành, tôn trọng và nâng đỡ tinh thần cho học sinh..."
              class="w-full px-4 py-3 rounded-lg border border-charcoal-blue/20 bg-porcelain text-sm text-black focus:outline-none focus:border-wine-plum focus:bg-white resize-y transition-colors"
            ></textarea>
            <div class="flex items-center gap-3">
              <button
                @click="handleReply(letter.id)"
                :disabled="!replyDrafts[letter.id] || replyingId === letter.id"
                class="btn-primary text-sm"
              >
                {{ replyingId === letter.id ? 'Đang gửi...' : 'Gửi phản hồi' }}
              </button>
              <button
                v-if="letter.status !== 'flagged_urgent'"
                @click="handleFlagUrgent(letter.id)"
                class="btn-ghost text-sm text-burnt-rose hover:bg-burnt-rose/10"
              >
                Đánh dấu khẩn cấp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!isLoading" class="card p-10 text-center text-charcoal-blue border border-charcoal-blue/15 shadow-warm-stone">
      Chưa có thư nào trong hòm thư.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { apiFetch } from "@/services/api";
import LoadingState from "@/components/LoadingState.vue";

interface Letter {
  id: string;
  trackingCode: string;
  studentAlias: string | null;
  title: string;
  content: string;
  category: string;
  status: string;
  replyContent: string | null;
  createdAt: number;
}

const letters = ref<Letter[]>([]);
const isLoading = ref(false);
const expandedId = ref<string | null>(null);
const replyDrafts = ref<Record<string, string>>({});
const replyingId = ref<string | null>(null);

const statusText = (s: string) =>
  s === "pending" ? "Đang chờ" : s === "answered" ? "Đã phản hồi" : "Khẩn cấp";

const statusStyle = (s: string) =>
  s === "pending"
    ? "bg-charcoal-blue/10 text-charcoal-blue border-charcoal-blue/20 font-semibold"
    : s === "answered"
    ? "bg-wine-plum/15 text-wine-plum border-wine-plum/30 font-semibold"
    : "bg-burnt-rose text-porcelain border-burnt-rose font-bold";

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toggleExpand(id: string) {
  expandedId.value = expandedId.value === id ? null : id;
}

async function handleReply(letterId: string) {
  const content = replyDrafts.value[letterId];
  if (!content) return;

  replyingId.value = letterId;
  try {
    const res = await apiFetch<{ message: string }>(`/letters/${letterId}/reply`, {
      method: "POST",
      body: JSON.stringify({ replyContent: content }),
    });

    if (res.success) {
      const idx = letters.value.findIndex((l) => l.id === letterId);
      if (idx !== -1) {
        letters.value[idx].replyContent = content;
        letters.value[idx].status = "answered";
      }
      replyDrafts.value[letterId] = "";
    }
  } finally {
    replyingId.value = null;
  }
}

async function handleFlagUrgent(letterId: string) {
  const res = await apiFetch<{ message: string }>(`/letters/${letterId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: "flagged_urgent" }),
  });

  if (res.success) {
    const idx = letters.value.findIndex((l) => l.id === letterId);
    if (idx !== -1) {
      letters.value[idx].status = "flagged_urgent";
    }
  }
}

onMounted(async () => {
  isLoading.value = true;
  try {
    const res = await apiFetch<Letter[]>("/letters/counselor/list");
    if (res.success && res.data) {
      letters.value = res.data;
    }
  } finally {
    isLoading.value = false;
  }
});
</script>
