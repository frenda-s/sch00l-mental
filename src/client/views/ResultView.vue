<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
    <!-- Empty state khi reload trang, store không còn dữ liệu -->
    <div v-if="!evalResult" class="card p-10 text-center space-y-4 border border-charcoal-blue/15 shadow-warm-stone">
      <div class="w-14 h-14 bg-porcelain rounded-full flex items-center justify-center mx-auto text-charcoal-blue border border-charcoal-blue/15">
        <ClipboardCheck class="w-7 h-7" />
      </div>
      <h1 class="text-2xl font-display text-black tracking-display">
        Chưa có kết quả sàng lọc
      </h1>
      <p class="text-sm text-charcoal-blue max-w-md mx-auto">
        Kết quả sàng lọc được hiển thị ngay sau khi bạn hoàn thành khảo sát để bảo vệ tính riêng tư của bạn.
      </p>
      <router-link to="/screening" class="btn-primary">
        Bắt đầu khảo sát
      </router-link>
    </div>

    <template v-else>
      <!-- Result Overview Card -->
      <div class="card p-6 sm:p-8 space-y-6 border border-charcoal-blue/15 shadow-warm-stone">
        <div class="flex items-center justify-between border-b border-charcoal-blue/15 pb-5">
          <div>
            <span class="inline-flex items-center px-3 py-1 rounded-lg bg-wine-plum/10 text-wine-plum text-xs font-semibold mb-2">
              Kết quả tự đánh giá
            </span>
            <h1 class="text-2xl sm:text-3xl font-display text-black tracking-display">
              Tổng quan chỉ báo cảm xúc
            </h1>
          </div>
          <span class="pill border" :class="severityBadgeStyle">
            {{ getSeverityLabel(evalResult.overallSeverity) }}
          </span>
        </div>

        <DisclaimerCard />

        <div
          v-if="evalResult.hasHighRisk"
          class="p-5 bg-burnt-rose/10 border border-burnt-rose/30 rounded-card flex items-start gap-3.5 text-sm text-black"
        >
          <AlertTriangle class="w-5 h-5 text-burnt-rose flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-bold text-burnt-rose">Ghi nhận chỉ báo cần hỗ trợ:</p>
            <p class="text-charcoal-blue mt-1 leading-relaxed">
              Kết quả khảo sát cho thấy bạn đang trải qua mức độ áp lực hoặc lo âu đáng kể. Bạn không cần chịu đựng một mình, hãy kết nối với ban tư vấn nhà trường qua thư hoặc lịch hẹn nhé.
            </p>
          </div>
        </div>
      </div>

      <!-- Topic Results Grid -->
      <div class="space-y-4">
        <h2 class="text-xl font-display text-black tracking-display">
          Chi tiết 8 nhóm biểu hiện
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ResultCard v-for="tr in evalResult.topicResults" :key="tr.topic" :result="tr" />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <router-link to="/screening" class="btn-text">
          Làm khảo sát khác
        </router-link>

        <div class="flex items-center gap-3 w-full sm:w-auto">
          <router-link to="/letter" class="btn-primary flex-1 sm:flex-none">
            Gửi thư tâm sự
          </router-link>
          <router-link to="/booking" class="btn-ghost flex-1 sm:flex-none">
            Đặt lịch gặp tư vấn
          </router-link>
        </div>
      </div>
    </template>

    <!-- Smart Alert Modal -->
    <SmartAlertModal
      :is-open="isAlertOpen"
      :title="riskInfo.alertTitle"
      :message="riskInfo.alertMessage"
      @close="isAlertOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useScreeningStore } from "@/stores/screening";
import { getSeverityLabel } from "@shared/algorithm";
import { analyzeRiskStatus } from "@shared/risk";
import ResultCard from "@/components/ResultCard.vue";
import DisclaimerCard from "@/components/DisclaimerCard.vue";
import SmartAlertModal from "@/components/SmartAlertModal.vue";
import { AlertTriangle, ClipboardCheck } from "lucide-vue-next";

const store = useScreeningStore();
const evalResult = computed(() => store.lastResult);
const isAlertOpen = ref(false);

const riskInfo = computed(() => {
  if (!evalResult.value) {
    return { isHighRisk: false, alertTitle: "", alertMessage: "", suggestedActions: [] as string[] };
  }
  return analyzeRiskStatus(evalResult.value.overallSeverity, evalResult.value.hasHighRisk);
});

const severityBadgeStyle = computed(() => {
  if (!evalResult.value) return "";
  switch (evalResult.value.overallSeverity) {
    case "normal":
      return "bg-charcoal-blue/10 text-charcoal-blue border-charcoal-blue/20 font-bold";
    case "mild":
      return "bg-burnt-rose/15 text-burnt-rose border-burnt-rose/30 font-bold";
    case "moderate":
      return "bg-wine-plum/20 text-wine-plum border-wine-plum/40 font-bold";
    case "severe":
      return "bg-burnt-rose text-porcelain border-burnt-rose font-bold";
    case "extremely_severe":
      return "bg-black text-porcelain border-burnt-rose font-bold";
    default:
      return "bg-porcelain text-charcoal-blue border-charcoal-blue/20";
  }
});

onMounted(() => {
  if (evalResult.value?.hasHighRisk) {
    isAlertOpen.value = true;
  }
});
</script>
