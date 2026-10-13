<template>
  <div class="bg-white p-5 rounded-card border border-charcoal-blue/15 shadow-warm-stone">
    <div class="flex items-center justify-between mb-3">
      <span class="font-display text-black text-base tracking-display">{{ topicTitle }}</span>
      <span
        class="pill border"
        :class="badgeStyle"
      >
        {{ getSeverityLabel(result.severity) }}
      </span>
    </div>

    <!-- Score bar -->
    <div class="w-full bg-porcelain border border-charcoal-blue/10 h-2 rounded-full overflow-hidden mb-3">
      <div
        class="h-full rounded-full transition-all duration-500"
        :class="barColor"
        :style="{ width: `${scorePercent}%` }"
      ></div>
    </div>

    <p class="text-xs sm:text-sm text-charcoal-blue leading-relaxed bg-porcelain p-3 rounded-lg border border-charcoal-blue/10">
      {{ result.recommendation }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { TopicResult } from "@/types";
import { getSeverityLabel } from "@shared/algorithm";
import { SCREENING_TOPICS } from "@shared/questions";

const props = defineProps<{
  result: TopicResult;
}>();

const topicTitle = computed(() => {
  const meta = SCREENING_TOPICS.find((t) => t.id === props.result.topic);
  return meta?.title || props.result.topic;
});

const scorePercent = computed(() => {
  return Math.min(100, Math.round((props.result.score / props.result.maxScore) * 100));
});

const badgeStyle = computed(() => {
  switch (props.result.severity) {
    case "normal":
      return "bg-charcoal-blue/10 text-charcoal-blue border-charcoal-blue/20 font-semibold";
    case "mild":
      return "bg-burnt-rose/15 text-burnt-rose border-burnt-rose/30 font-semibold";
    case "moderate":
      return "bg-wine-plum/20 text-wine-plum border-wine-plum/40 font-semibold";
    case "severe":
      return "bg-burnt-rose text-porcelain border-burnt-rose font-bold";
    case "extremely_severe":
      return "bg-black text-porcelain border-burnt-rose font-bold";
  }
});

const barColor = computed(() => {
  switch (props.result.severity) {
    case "normal":
      return "bg-charcoal-blue";
    case "mild":
      return "bg-burnt-rose/70";
    case "moderate":
      return "bg-wine-plum";
    case "severe":
      return "bg-burnt-rose";
    case "extremely_severe":
      return "bg-black";
  }
});
</script>
