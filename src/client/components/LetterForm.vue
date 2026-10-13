<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 bg-white p-6 sm:p-8 rounded-card border border-charcoal-blue/15 shadow-warm-stone">
    <div>
      <label class="block text-sm font-semibold text-black mb-2">
        Danh mục áp lực / vấn đề
      </label>
      <select
        v-model="form.category"
        required
        class="w-full px-4 py-3 rounded-lg border border-charcoal-blue/20 bg-porcelain text-sm font-medium text-black focus:outline-none focus:border-wine-plum focus:bg-white transition-colors"
      >
        <option value="" disabled>-- Chọn chủ đề phù hợp --</option>
        <option value="Áp lực học tập & Thi cử">Áp lực học tập &amp; Thi cử</option>
        <option value="Mối quan hệ bạn bè & Trường học">Mối quan hệ bạn bè &amp; Trường học</option>
        <option value="Căng thẳng gia đình">Căng thẳng gia đình</option>
        <option value="Định hướng nghề nghiệp & Tương lai">Định hướng nghề nghiệp &amp; Tương lai</option>
        <option value="Khó khăn cảm xúc / Khác">Khó khăn cảm xúc / Khác</option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-semibold text-black mb-2">
        Tên viết tắt / Biệt danh (Tùy chọn)
      </label>
      <input
        v-model="form.studentAlias"
        type="text"
        placeholder="VD: Học sinh lớp 11 / Người bạn nhỏ"
        class="w-full px-4 py-3 rounded-lg border border-charcoal-blue/20 bg-porcelain text-sm text-black focus:outline-none focus:border-wine-plum focus:bg-white transition-colors"
      />
    </div>

    <div>
      <label class="block text-sm font-semibold text-black mb-2">
        Tiêu đề thư <span class="text-burnt-rose">*</span>
      </label>
      <input
        v-model="form.title"
        type="text"
        required
        placeholder="Tóm tắt ngắn gọn tâm tư hoặc điều bạn đang băn khoăn..."
        class="w-full px-4 py-3 rounded-lg border border-charcoal-blue/20 bg-porcelain text-sm text-black focus:outline-none focus:border-wine-plum focus:bg-white transition-colors"
      />
    </div>

    <div>
      <label class="block text-sm font-semibold text-black mb-2">
        Nội dung tâm sự <span class="text-burnt-rose">*</span>
      </label>
      <textarea
        v-model="form.content"
        rows="6"
        required
        placeholder="Hãy tự nhiên trút bỏ những suy nghĩ, khúc mắc của bạn. Ban tư vấn sẽ đọc và phản hồi kín đáo..."
        class="w-full px-4 py-3 rounded-lg border border-charcoal-blue/20 bg-porcelain text-sm text-black focus:outline-none focus:border-wine-plum focus:bg-white resize-y transition-colors"
      ></textarea>
    </div>

    <div class="flex items-start space-x-3 bg-charcoal-blue/5 p-4 rounded-card border border-charcoal-blue/20">
      <input
        id="isUrgent"
        v-model="form.isUrgent"
        type="checkbox"
        class="mt-0.5 w-4 h-4 text-wine-plum rounded border-charcoal-blue/30 focus:ring-wine-plum"
      />
      <label for="isUrgent" class="text-xs sm:text-sm font-medium text-black cursor-pointer">
        Đánh dấu thư khẩn cấp (Nếu bạn đang ở trong tình trạng vô cùng mệt mỏi hoặc cần ban tư vấn phản hồi ưu tiên)
      </label>
    </div>

    <div v-if="errorMsg" class="p-3 bg-burnt-rose/10 border border-burnt-rose/30 text-burnt-rose text-sm font-semibold rounded-lg">
      {{ errorMsg }}
    </div>

    <button
      type="submit"
      :disabled="isSubmitting"
      class="btn-primary w-full"
    >
      <Send class="w-5 h-5 text-porcelain" />
      <span>{{ isSubmitting ? 'Đang gửi thư...' : 'Gửi thư ẩn danh' }}</span>
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Send } from "lucide-vue-next";

const emit = defineEmits<{
  (e: "submit", payload: any): void;
}>();

defineProps<{
  isSubmitting: boolean;
  errorMsg?: string;
}>();

const form = ref({
  category: "Áp lực học tập & Thi cử",
  studentAlias: "Học sinh ẩn danh",
  title: "",
  content: "",
  isUrgent: false,
});

function handleSubmit() {
  emit("submit", { ...form.value });
}
</script>
