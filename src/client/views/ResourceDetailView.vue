<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
    <LoadingState v-if="isLoading" text="Đang tải tài nguyên..." />

    <template v-else-if="resource">
      <div class="flex items-center justify-between">
        <router-link to="/resources" class="btn-ghost text-sm">
          &larr; Quay lại danh sách tài nguyên
        </router-link>
      </div>

      <article class="card p-6 sm:p-10 space-y-6 border border-charcoal-blue/15 shadow-warm-stone">
        <header class="space-y-3 border-b border-charcoal-blue/15 pb-6">
          <div class="flex items-center gap-3">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-wine-plum/10 text-wine-plum">{{ resource.category }}</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-display text-black tracking-display">{{ resource.title }}</h1>
          <p class="text-sm sm:text-base text-charcoal-blue leading-relaxed">{{ resource.summary }}</p>
        </header>

        <!-- Render Markdown with marked -->
        <div class="markdown-content text-black text-sm sm:text-base leading-relaxed" v-html="renderedMarkdown"></div>
      </article>
    </template>

    <div v-else-if="!isLoading" class="card p-8 text-center text-charcoal-blue border border-charcoal-blue/15 shadow-warm-stone">
      Không tìm thấy tài nguyên này.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { marked } from "marked";
import { apiFetch } from "@/services/api";
import LoadingState from "@/components/LoadingState.vue";

interface ResourceDetail {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  contentMarkdown: string;
}

const route = useRoute();
const resource = ref<ResourceDetail | null>(null);
const isLoading = ref(false);

const renderedMarkdown = computed(() => {
  if (!resource.value?.contentMarkdown) return "";
  return marked.parse(resource.value.contentMarkdown, { async: false }) as string;
});

onMounted(async () => {
  const slug = route.params.slug as string;
  isLoading.value = true;
  try {
    const res = await apiFetch<ResourceDetail>(`/resources/${slug}`);
    if (res.success && res.data) resource.value = res.data;
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
:deep(.markdown-content) {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

:deep(.markdown-content h1) {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

:deep(.markdown-content h2) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-top: 1rem;
  margin-bottom: 0.375rem;
  line-height: 1.35;
}

:deep(.markdown-content h3) {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-top: 0.75rem;
  margin-bottom: 0.25rem;
}

:deep(.markdown-content p) {
  line-height: 1.7;
  color: #374151;
}

:deep(.markdown-content ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

:deep(.markdown-content ol) {
  list-style-type: decimal;
  padding-left: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

:deep(.markdown-content li) {
  line-height: 1.6;
  color: #4b5563;
}

:deep(.markdown-content blockquote) {
  border-left: 4px solid #d1d5db;
  padding-left: 1rem;
  font-style: italic;
  color: #6b7280;
}

:deep(.markdown-content code) {
  background-color: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

:deep(.markdown-content strong) {
  font-weight: 600;
  color: #111827;
}
</style>
