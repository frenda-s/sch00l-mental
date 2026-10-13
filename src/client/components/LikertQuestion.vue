<template>
  <div class="bg-white p-5 sm:p-6 rounded-card border border-charcoal-blue/15 shadow-warm-stone transition-all duration-150 hover:border-burnt-rose">
    <div class="flex items-start space-x-3 mb-4">
      <span class="flex-shrink-0 w-7 h-7 rounded-lg bg-porcelain text-black border border-charcoal-blue/15 text-xs font-bold flex items-center justify-center">
        {{ index + 1 }}
      </span>
      <p class="text-base font-medium text-black leading-snug">
        {{ question.text }}
      </p>
    </div>

    <!-- Likert 4 Options -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      <button
        v-for="opt in LIKERT_OPTIONS"
        :key="opt.value"
        type="button"
        @click="$emit('update:modelValue', opt.value)"
        class="py-2.5 px-3 rounded-lg border text-xs sm:text-sm font-semibold transition-all duration-150 text-center focus:outline-none"
        :class="
          modelValue === opt.value
            ? 'bg-wine-plum border-wine-plum text-porcelain shadow-subtle'
            : 'bg-porcelain border-charcoal-blue/15 text-charcoal-blue hover:text-black hover:border-charcoal-blue/40'
        "
      >
        {{ opt.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ScreeningQuestion } from "@/types";
import { LIKERT_OPTIONS } from "@shared/questions";

defineProps<{
  question: ScreeningQuestion;
  index: number;
  modelValue?: number;
}>();

defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();
</script>
