<template>
  <div class="flex flex-col items-center justify-center p-8 space-y-3">
    <div class="w-8 h-8 border-[3px] border-warm-stone border-t-inkwell-navy rounded-full animate-spin"></div>
    <p class="text-sm font-medium text-slate animate-pulse">
      {{ text || 'Đang tải dữ liệu...' }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text?: string;
}>();
</script>
