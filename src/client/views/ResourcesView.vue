<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
    <div class="text-center max-w-xl mx-auto space-y-2">
      <span class="inline-flex items-center px-3 py-1 rounded-lg bg-wine-plum/10 text-wine-plum text-xs font-semibold">Cẩm nang sức khỏe</span>
      <h1 class="text-3xl sm:text-4xl font-display text-black tracking-display">
        Tài Nguyên <span class="text-burnt-rose">Tâm Lý</span> Học Đường
      </h1>
      <p class="text-sm sm:text-base text-charcoal-blue">
        Kho kiến thức và phương pháp thực hành giảm stress, điều hòa cảm xúc dành riêng cho lứa tuổi học sinh THPT.
      </p>
    </div>

    <LoadingState v-if="isLoading" text="Đang tải tài nguyên..." />

    <div v-else-if="resources.length" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <router-link
        v-for="r in resources"
        :key="r.id"
        :to="`/resources/${r.slug}`"
        class="card p-6 flex flex-col justify-between border border-charcoal-blue/15 shadow-warm-stone hover:border-burnt-rose transition-all group"
      >
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-11 h-11 rounded-lg bg-porcelain border border-charcoal-blue/10 flex items-center justify-center text-wine-plum group-hover:bg-wine-plum group-hover:text-porcelain transition-colors">
              <component :is="iconFor(r.iconName)" class="w-5 h-5" />
            </div>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-wine-plum/10 text-wine-plum">{{ r.category }}</span>
          </div>
          <h3 class="font-display text-lg text-black mb-2 tracking-display group-hover:text-burnt-rose transition-colors">{{ r.title }}</h3>
          <p class="text-xs sm:text-sm text-charcoal-blue leading-relaxed line-clamp-3">{{ r.summary }}</p>
        </div>
        <div class="pt-4 mt-4 border-t border-charcoal-blue/10 flex items-center justify-between text-xs font-semibold text-charcoal-blue group-hover:text-wine-plum">
          <span>Đọc cẩm nang</span>
          <span>&rarr;</span>
        </div>
      </router-link>
    </div>

    <div v-else-if="!isLoading" class="card p-10 text-center text-charcoal-blue border border-charcoal-blue/15 shadow-warm-stone">
      Chưa có tài nguyên nào được đăng tải.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { apiFetch } from "@/services/api";
import LoadingState from "@/components/LoadingState.vue";
import {
  CloudRain,
  AlertCircle,
  BookOpen,
  Moon,
  MessageCircle,
  ShieldAlert,
  Compass,
  FileText,
} from "lucide-vue-next";

interface Resource {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  iconName: string;
}

const resources = ref<Resource[]>([]);
const isLoading = ref(false);

function iconFor(name: string) {
  const map: Record<string, any> = {
    CloudRain,
    AlertCircle,
    BookOpen,
    Moon,
    MessageCircle,
    ShieldAlert,
    Compass,
    FileText,
  };
  return map[name] || FileText;
}

onMounted(async () => {
  isLoading.value = true;
  try {
    const res = await apiFetch<Resource[]>("/resources");
    if (res.success && res.data) resources.value = res.data;
  } finally {
    isLoading.value = false;
  }
});
</script>
