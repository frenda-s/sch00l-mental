<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
    <div class="text-center max-w-xl mx-auto space-y-2">
      <span class="inline-flex items-center px-3 py-1 rounded-lg bg-wine-plum/10 text-wine-plum text-xs font-semibold">Gặp mặt &amp; Trực tuyến</span>
      <h1 class="text-3xl sm:text-4xl font-display text-black tracking-display">
        Đặt Lịch Hẹn <span class="text-burnt-rose">Tư Vấn</span>
      </h1>
      <p class="text-sm sm:text-base text-charcoal-blue">
        Chọn khung giờ rảnh để trò chuyện trực tiếp tại phòng tư vấn tâm lý nhà trường hoặc qua cuộc gọi kín.
      </p>
    </div>

    <div v-if="successData" class="card p-8 sm:p-10 space-y-6 text-center animate-fade-in border border-charcoal-blue/15 shadow-warm-stone">
      <div class="w-16 h-16 bg-wine-plum/10 text-wine-plum rounded-full flex items-center justify-center mx-auto border-2 border-wine-plum">
        <CheckCircle2 class="w-8 h-8 text-wine-plum" />
      </div>

      <h2 class="text-2xl font-display text-black tracking-display">Đặt lịch thành công!</h2>
      <p class="text-sm text-charcoal-blue max-w-md mx-auto">
        Thầy cô tư vấn sẽ liên hệ xác nhận cuộc hẹn qua kênh liên lạc bạn đã chọn.
      </p>

      <div class="bg-black text-porcelain p-5 rounded-card text-sm space-y-1.5 text-left border border-charcoal-blue/30 shadow-warm-stone max-w-sm mx-auto">
        <p><span class="text-porcelain/60">Ngày hẹn:</span> <strong class="text-porcelain">{{ successData.date }}</strong></p>
        <p><span class="text-porcelain/60">Khung giờ:</span> <strong class="text-burnt-rose">{{ successData.time }}</strong></p>
      </div>

      <div class="pt-2 flex items-center justify-center gap-3">
        <router-link to="/" class="btn-primary">Về trang chủ</router-link>
        <button @click="successData = null" class="btn-ghost">Đặt lịch khác</button>
      </div>
    </div>

    <AppointmentForm
      v-else
      :is-submitting="isSubmitting"
      @submit="handleCreateAppointment"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { apiFetch } from "@/services/api";
import AppointmentForm from "@/components/AppointmentForm.vue";
import { CheckCircle2 } from "lucide-vue-next";

const isSubmitting = ref(false);
const successData = ref<{ date: string; time: string } | null>(null);

async function handleCreateAppointment(payload: any) {
  isSubmitting.value = true;
  try {
    const res = await apiFetch<{ appointmentDate: string; timeSlot: string }>("/appointments", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (res.success && res.data) {
      successData.value = {
        date: res.data.appointmentDate,
        time: res.data.timeSlot,
      };
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>
