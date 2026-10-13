<template>
  <div class="w-full">
    <div class="flex items-center justify-between text-xs font-semibold text-charcoal-blue mb-1.5">
      <span>{{ label || 'Tiến độ khảo sát' }}</span>
      <span class="text-wine-plum font-bold">{{ percentage }}%</span>
    </div>
    <div class="w-full h-2.5 bg-porcelain border border-charcoal-blue/15 rounded-full overflow-hidden">
      <div
        class="h-full bg-wine-plum rounded-full transition-all duration-200 ease-out"
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  percentage: number;
  label?: string;
}>();
</script>
