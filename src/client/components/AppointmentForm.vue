<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 bg-white p-6 sm:p-8 rounded-card border border-charcoal-blue/15 shadow-warm-stone">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div>
        <label class="block text-sm font-semibold text-black mb-2">
          Họ tên / Biệt danh <span class="text-burnt-rose">*</span>
        </label>
        <input
          v-model="form.studentName"
          type="text"
          required
          placeholder="Nhập tên hoặc biệt danh bạn muốn xưng hô"
          class="w-full px-4 py-3 rounded-lg border border-charcoal-blue/20 bg-porcelain text-sm text-black focus:outline-none focus:border-wine-plum focus:bg-white transition-colors"
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-black mb-2">
          Thông tin liên hệ (SĐT / Zalo / Email) <span class="text-burnt-rose">*</span>
        </label>
        <input
          v-model="form.contactInfo"
          type="text"
          required
          placeholder="Để thầy cô tư vấn liên lạc lại"
          class="w-full px-4 py-3 rounded-lg border border-charcoal-blue/20 bg-porcelain text-sm text-black focus:outline-none focus:border-wine-plum focus:bg-white transition-colors"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div>
        <label class="block text-sm font-semibold text-black mb-2">
          Ngày mong muốn hẹn <span class="text-burnt-rose">*</span>
        </label>
        <input
          v-model="form.appointmentDate"
          type="date"
          required
          :min="minDate"
          class="w-full px-4 py-3 rounded-lg border border-charcoal-blue/20 bg-porcelain text-sm text-black focus:outline-none focus:border-wine-plum focus:bg-white transition-colors"
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-black mb-2">
          Khung giờ thích hợp <span class="text-burnt-rose">*</span>
        </label>
        <select
          v-model="form.timeSlot"
          required
          class="w-full px-4 py-3 rounded-lg border border-charcoal-blue/20 bg-porcelain text-sm font-medium text-black focus:outline-none focus:border-wine-plum focus:bg-white transition-colors"
        >
          <option value="" disabled>-- Chọn khung giờ --</option>
          <option value="08:00 - 09:00">08:00 - 09:00 (Tiết 1-2)</option>
          <option value="09:30 - 10:30">09:30 - 10:30 (Tiết 3-4)</option>
          <option value="14:00 - 15:00">14:00 - 15:00 (Chiều)</option>
          <option value="15:30 - 16:30">15:30 - 16:30 (Sau giờ học)</option>
        </select>
      </div>
    </div>

    <div>
      <label class="block text-sm font-semibold text-black mb-2">
        Hình thức gặp tư vấn <span class="text-burnt-rose">*</span>
      </label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label
          class="p-4 rounded-card border flex items-center gap-3 cursor-pointer transition-all duration-150"
          :class="form.format === 'offline_school' ? 'bg-wine-plum/10 border-2 border-wine-plum font-semibold text-wine-plum' : 'bg-porcelain border-charcoal-blue/20 text-charcoal-blue hover:bg-white'"
        >
          <input type="radio" v-model="form.format" value="offline_school" class="hidden" />
          <Building class="w-5 h-5 text-wine-plum" />
          <span class="text-sm">Trực tiếp tại phòng tư vấn</span>
        </label>

        <label
          class="p-4 rounded-card border flex items-center gap-3 cursor-pointer transition-all duration-150"
          :class="form.format === 'online_meet' ? 'bg-wine-plum/10 border-2 border-wine-plum font-semibold text-wine-plum' : 'bg-porcelain border-charcoal-blue/20 text-charcoal-blue hover:bg-white'"
        >
          <input type="radio" v-model="form.format" value="online_meet" class="hidden" />
          <Video class="w-5 h-5 text-wine-plum" />
          <span class="text-sm">Trực tuyến (Google Meet)</span>
        </label>
      </div>
    </div>

    <div>
      <label class="block text-sm font-semibold text-black mb-2">
        Ghi chú thêm (Không bắt buộc)
      </label>
      <textarea
        v-model="form.note"
        rows="3"
        placeholder="VD: Em muốn trao đổi về vấn đề chọn khối thi / áp lực gia đình..."
        class="w-full px-4 py-3 rounded-lg border border-charcoal-blue/20 bg-porcelain text-sm text-black focus:outline-none focus:border-wine-plum focus:bg-white resize-y transition-colors"
      ></textarea>
    </div>

    <button
      type="submit"
      :disabled="isSubmitting"
      class="btn-primary w-full"
    >
      <Calendar class="w-5 h-5 text-porcelain" />
      <span>{{ isSubmitting ? 'Đang đăng ký...' : 'Xác nhận đặt lịch' }}</span>
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Calendar, Building, Video } from "lucide-vue-next";

defineProps<{
  isSubmitting: boolean;
}>();

const emit = defineEmits<{
  (e: "submit", payload: any): void;
}>();

const minDate = computed(() => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
});

const form = ref({
  studentName: "",
  contactInfo: "",
  appointmentDate: "",
  timeSlot: "",
  format: "offline_school",
  note: "",
});

function handleSubmit() {
  emit("submit", { ...form.value });
}
</script>
