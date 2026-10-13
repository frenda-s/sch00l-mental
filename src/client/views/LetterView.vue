<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
    <div class="text-center max-w-xl mx-auto space-y-2">
      <span class="inline-flex items-center px-3 py-1 rounded-lg bg-wine-plum/10 text-wine-plum text-xs font-semibold">100% Ẩn danh</span>
      <h1 class="text-3xl sm:text-4xl font-display text-black tracking-display">
        Gửi Thư Tâm Sự <span class="text-burnt-rose">Ẩn Danh</span>
      </h1>
      <p class="text-sm sm:text-base text-charcoal-blue">
        Ban tư vấn luôn sẵn lòng lắng nghe bạn. Bạn không cần để lại tên thật, chỉ cần giữ mã số bí mật để xem thư hồi đáp.
      </p>
    </div>

    <!-- Success State -->
    <div v-if="successData" class="card p-8 sm:p-10 space-y-6 text-center border border-charcoal-blue/15 shadow-warm-stone animate-fade-in">
      <div class="w-16 h-16 bg-wine-plum/10 text-wine-plum rounded-full flex items-center justify-center mx-auto border-2 border-wine-plum">
        <CheckCircle2 class="w-8 h-8 text-wine-plum" />
      </div>

      <h2 class="text-2xl font-display text-black tracking-display">Đã gửi thư thành công!</h2>
      <p class="text-sm text-charcoal-blue max-w-md mx-auto">
        Lưu lại mã tra cứu bên dưới để xem câu trả lời từ thầy cô tư vấn mà không cần đăng nhập:
      </p>

      <div class="bg-black text-porcelain p-4 rounded-card font-mono text-2xl tracking-widest font-bold flex items-center justify-center gap-3 border border-charcoal-blue/30 shadow-warm-stone max-w-sm mx-auto">
        <span>{{ successData.trackingCode }}</span>
        <button
          @click="copyCode"
          class="p-2 text-porcelain/60 hover:text-porcelain rounded-lg transition-colors"
          title="Sao chép"
          aria-label="Sao chép mã tra cứu"
        >
          <Copy class="w-5 h-5" />
        </button>
      </div>

      <p v-if="copied" class="text-xs text-porcelain font-bold bg-wine-plum py-1 px-3 rounded-full inline-block">Đã sao chép mã vào khay nhớ tạm!</p>

      <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <router-link
          :to="`/letter-tracking?code=${successData.trackingCode}`"
          class="btn-primary"
        >
          Đến trang tra cứu ngay
        </router-link>
        <button @click="successData = null" class="btn-ghost">
          Gửi lá thư khác
        </button>
      </div>
    </div>

    <!-- Form -->
    <LetterForm
      v-else
      :isSubmitting="isSubmitting"
      :errorMsg="errorMsg"
      @submit="handleCreateLetter"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { apiFetch } from "@/services/api";
import LetterForm from "@/components/LetterForm.vue";
import { CheckCircle2, Copy } from "lucide-vue-next";

const isSubmitting = ref(false);
const errorMsg = ref("");
const successData = ref<{ trackingCode: string } | null>(null);
const copied = ref(false);

async function handleCreateLetter(payload: any) {
  isSubmitting.value = true;
  errorMsg.value = "";
  try {
    const res = await apiFetch<{ trackingCode: string }>("/letters", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (res.success && res.data) {
      successData.value = res.data;
    } else {
      errorMsg.value = res.error?.message || "Không thể gửi thư. Vui lòng thử lại.";
    }
  } finally {
    isSubmitting.value = false;
  }
}

function copyCode() {
  if (successData.value) {
    navigator.clipboard.writeText(successData.value.trackingCode);
    copied.value = true;
    setTimeout(() => (copied.value = false), 3000);
  }
}
</script>
