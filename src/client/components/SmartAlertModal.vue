<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="smart-alert-title"
      @keydown.esc="$emit('close')"
    >
      <div
        class="bg-white max-w-lg w-full rounded-feature p-6 sm:p-8 border border-charcoal-blue/20 relative overflow-hidden shadow-warm-stone"
      >
        <div class="flex items-start space-x-4 mb-5">
          <div class="w-12 h-12 rounded-lg bg-burnt-rose/15 text-burnt-rose flex items-center justify-center flex-shrink-0">
            <AlertTriangle class="w-7 h-7" />
          </div>
          <div>
            <h3 id="smart-alert-title" class="text-xl font-display text-black leading-snug tracking-display">
              {{ title || 'Kết quả cần được quan tâm' }}
            </h3>
            <p class="text-xs text-burnt-rose font-bold uppercase tracking-wider mt-0.5">
              Chỉ báo hỗ trợ ưu tiên
            </p>
          </div>
        </div>

        <p class="text-sm text-charcoal-blue leading-relaxed mb-6 bg-porcelain p-4 rounded-card border border-charcoal-blue/15">
          {{ message }}
        </p>

        <!-- Suggested Actions -->
        <div class="space-y-3 mb-6">
          <p class="text-xs font-semibold text-charcoal-blue uppercase tracking-wider">Gợi ý dành cho bạn lúc này:</p>

          <a
            href="tel:111"
            class="w-full flex items-center justify-between p-3.5 bg-burnt-rose text-porcelain font-semibold rounded-lg text-sm shadow-subtle hover:bg-wine-plum transition-colors group"
          >
            <span class="flex items-center gap-2">
              <PhoneCall class="w-5 h-5 text-porcelain" />
              <span>Gọi Tổng đài Trẻ em 111 (Miễn phí 24/7)</span>
            </span>
            <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          <router-link
            to="/booking"
            @click="$emit('close')"
            class="w-full flex items-center justify-between p-3.5 bg-wine-plum/10 text-wine-plum font-semibold rounded-lg border border-wine-plum/30 text-sm hover:bg-wine-plum/20 transition-colors"
          >
            <span class="flex items-center gap-2">
              <Calendar class="w-5 h-5 text-wine-plum" />
              <span>Đặt lịch hẹn riêng với Ban Tư Vấn</span>
            </span>
            <ArrowRight class="w-4 h-4" />
          </router-link>

          <router-link
            to="/letter"
            @click="$emit('close')"
            class="w-full flex items-center justify-between p-3.5 bg-porcelain text-black font-medium rounded-lg border border-charcoal-blue/20 text-sm hover:bg-white transition-colors"
          >
            <span class="flex items-center gap-2">
              <Send class="w-5 h-5 text-charcoal-blue" />
              <span>Gửi thư tâm sự khẩn cấp (100% Ẩn danh)</span>
            </span>
            <ArrowRight class="w-4 h-4 text-charcoal-blue" />
          </router-link>
        </div>

        <div class="flex justify-end">
          <button
            @click="$emit('close')"
            class="btn-ghost text-sm"
          >
            Đã hiểu &amp; Đóng
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { AlertTriangle, PhoneCall, Calendar, Send, ArrowRight } from "lucide-vue-next";

defineProps<{
  isOpen: boolean;
  title?: string;
  message?: string;
}>();

defineEmits<{
  (e: "close"): void;
}>();
</script>
