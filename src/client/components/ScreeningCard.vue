<template>
  <button
    type="button"
    @click="$emit('select')"
    class="p-6 rounded-card text-left transition-all duration-150 flex flex-col justify-between shadow-warm-stone"
    :class="
      isSelected
        ? 'bg-white border-2 border-wine-plum ring-2 ring-burnt-rose/30'
        : 'bg-white border border-charcoal-blue/15 hover:border-burnt-rose'
    "
  >
    <div>
      <div class="flex items-center justify-between mb-4">
        <div
          class="w-12 h-12 rounded-lg flex items-center justify-center transition-colors"
          :class="isSelected ? 'bg-wine-plum text-porcelain' : 'bg-porcelain text-black border border-charcoal-blue/10'"
        >
          <component :is="iconComponent" class="w-6 h-6" />
        </div>
        <div
          class="w-6 h-6 rounded-lg border flex items-center justify-center transition-colors"
          :class="isSelected ? 'bg-wine-plum border-wine-plum text-porcelain' : 'border-charcoal-blue/20 bg-white'"
        >
          <Check v-if="isSelected" class="w-4 h-4 stroke-[3]" />
        </div>
      </div>

      <h3 class="font-display text-base text-black mb-1.5 tracking-display">{{ topic.title }}</h3>
      <p class="text-xs sm:text-sm text-charcoal-blue leading-relaxed">
        {{ topic.description }}
      </p>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ScreeningTopicMeta } from "@/types";
import {
  Brain,
  CloudRain,
  AlertCircle,
  Target,
  Zap,
  Users,
  BookOpen,
  Compass,
  Check,
  HelpCircle,
} from "lucide-vue-next";

const props = defineProps<{
  topic: ScreeningTopicMeta;
  isSelected: boolean;
}>();

defineEmits<{
  (e: "select"): void;
}>();

const iconComponent = computed(() => {
  switch (props.topic.icon) {
    case "Brain":
      return Brain;
    case "CloudRain":
      return CloudRain;
    case "AlertCircle":
      return AlertCircle;
    case "Target":
      return Target;
    case "Zap":
      return Zap;
    case "Users":
      return Users;
    case "BookOpen":
      return BookOpen;
    case "Compass":
      return Compass;
    default:
      return HelpCircle;
  }
});
</script>
