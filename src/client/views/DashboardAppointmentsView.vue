<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <span class="inline-flex items-center px-3 py-1 rounded-lg bg-wine-plum/10 text-wine-plum text-xs font-semibold mb-1">Lịch làm việc</span>
        <h1 class="text-3xl font-display text-black tracking-display">Quản Lý Lịch Hẹn</h1>
        <p class="text-sm text-charcoal-blue mt-0.5">Xác nhận và điều phối các phiên tư vấn với học sinh.</p>
      </div>
      <router-link to="/dashboard" class="btn-ghost text-sm">&larr; Tổng quan</router-link>
    </div>

    <LoadingState v-if="isLoading" text="Đang tải danh sách lịch hẹn..." />

    <div v-else-if="appointments.length" class="space-y-3">
      <div v-for="appt in appointments" :key="appt.id" class="card p-6 border border-charcoal-blue/15 shadow-warm-stone">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="space-y-1.5">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-display text-lg text-black tracking-display">{{ appt.studentName }}</span>
              <span class="pill border" :class="statusStyle(appt.status)">{{ statusText(appt.status) }}</span>
            </div>
            <p class="text-sm font-semibold text-black">
              {{ appt.appointmentDate }} &bull; {{ appt.timeSlot }} &bull;
              <span class="text-charcoal-blue font-normal">{{ appt.format === 'offline_school' ? 'Trực tiếp tại phòng tư vấn' : 'Online qua Google Meet' }}</span>
            </p>
            <p class="text-xs text-charcoal-blue">Liên hệ: <strong class="text-black">{{ appt.contactInfo }}</strong></p>
            <p v-if="appt.note" class="text-xs text-charcoal-blue italic bg-porcelain p-2 rounded-lg border border-charcoal-blue/10">Ghi chú: {{ appt.note }}</p>
          </div>

          <div class="flex items-center gap-2">
            <button
              v-if="appt.status === 'pending'"
              @click="handleUpdate(appt.id, 'confirmed')"
              class="btn-primary text-xs"
            >
              Xác nhận
            </button>
            <button
              v-if="appt.status === 'confirmed'"
              @click="handleUpdate(appt.id, 'completed')"
              class="btn-ghost text-xs !bg-wine-plum/10 !border-wine-plum/30 text-wine-plum font-bold"
            >
              Hoàn thành
            </button>
            <button
              v-if="appt.status !== 'cancelled'"
              @click="handleUpdate(appt.id, 'cancelled')"
              class="btn-ghost text-xs text-burnt-rose hover:bg-burnt-rose/10"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!isLoading" class="card p-10 text-center text-charcoal-blue border border-charcoal-blue/15 shadow-warm-stone">
      Chưa có lịch hẹn nào.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { apiFetch } from "@/services/api";
import LoadingState from "@/components/LoadingState.vue";

interface Appointment {
  id: string;
  studentName: string;
  contactInfo: string;
  appointmentDate: string;
  timeSlot: string;
  format: string;
  status: string;
  note: string | null;
}

const appointments = ref<Appointment[]>([]);
const isLoading = ref(false);

const statusText = (s: string) =>
  s === "pending"
    ? "Chờ xác nhận"
    : s === "confirmed"
    ? "Đã xác nhận"
    : s === "completed"
    ? "Đã hoàn thành"
    : "Đã hủy";

const statusStyle = (s: string) =>
  s === "pending"
    ? "bg-charcoal-blue/10 text-charcoal-blue border-charcoal-blue/20 font-semibold"
    : s === "confirmed"
    ? "bg-burnt-rose/15 text-burnt-rose border-burnt-rose/30 font-semibold"
    : s === "completed"
    ? "bg-wine-plum/15 text-wine-plum border-wine-plum/30 font-semibold"
    : "bg-porcelain text-charcoal-blue border-charcoal-blue/20";

async function handleUpdate(id: string, status: string) {
  await apiFetch(`/appointments/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  await fetchAppointments();
}

async function fetchAppointments() {
  const res = await apiFetch<Appointment[]>("/appointments/counselor/list");
  if (res.success && res.data) appointments.value = res.data;
}

onMounted(async () => {
  isLoading.value = true;
  try {
    await fetchAppointments();
  } finally {
    isLoading.value = false;
  }
});
</script>
