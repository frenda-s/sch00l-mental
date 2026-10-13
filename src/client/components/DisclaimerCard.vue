<template>
  <div class="bg-white border border-charcoal-blue/15 p-5 rounded-card shadow-warm-stone flex items-start space-x-3.5 text-sm text-charcoal-blue leading-relaxed">
    <div class="w-8 h-8 rounded-full bg-burnt-rose/10 flex items-center justify-center flex-shrink-0 text-burnt-rose">
      <ShieldAlert class="w-4 h-4" />
    </div>
    <div>
      <p class="font-semibold text-black mb-0.5">Khẳng định tính chất khoa học &amp; Miễn trừ y tế:</p>
      <p class="text-charcoal-blue text-xs sm:text-sm">
        {{ RESEARCH_DISCLAIMER }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ShieldAlert } from "lucide-vue-next";
import { RESEARCH_DISCLAIMER } from "@shared/algorithm";
</script>
