<template>
  <div class="space-y-20 py-8">
    <!-- Hero Section (Ash Canvas, GRIFTER/Bagel display, Coral Emphasis, inline widgets) -->
    <section class="max-w-[1200px] mx-auto px-4 sm:px-6">
      <div class="max-w-3xl mx-auto text-center pt-8 pb-4 space-y-6">
        <!-- Annotation label doodled badge -->
        <div class="inline-flex items-center gap-2 bg-white border border-charcoal-blue/20 px-4 py-1.5 rounded-full shadow-subtle text-xs font-semibold text-black">
          <span class="w-2 h-2 rounded-full bg-burnt-rose animate-pulse"></span>
          <span>Không gian lắng nghe an toàn cho học sinh THPT</span>
        </div>

        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-display text-black leading-[1.1] tracking-display">
          Thấu hiểu cảm xúc,
          <br class="hidden sm:block" />
          chia sẻ áp lực
          <span class="text-burnt-rose">học đường</span>
        </h1>

        <p class="text-base sm:text-lg text-charcoal-blue leading-relaxed max-w-xl mx-auto font-normal">
          Không gian riêng tư, tôn trọng ẩn danh. Giúp bạn tự nhận diện trạng thái tâm lý qua 8 nhóm vấn đề chuẩn mực và kết nối với ban tư vấn khi cần.
        </p>

        <!-- Inline Demo / Timer style Widget from Tracky reference -->
        <div class="pt-2 flex justify-center">
          <div class="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-charcoal-blue/20 shadow-warm-stone text-sm">
            <span class="w-7 h-7 rounded-full bg-wine-plum flex items-center justify-center text-porcelain font-bold text-xs">
              ✓
            </span>
            <span class="font-semibold text-black">100% Ẩn danh</span>
            <span class="text-charcoal-blue">&bull;</span>
            <span class="text-charcoal-blue">Không thu thập danh tính</span>
          </div>
        </div>

        <!-- Primary Actions: Filled Primary Button, Outlined Ghost, Text link -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <router-link to="/screening" class="btn-primary w-full sm:w-auto">
            <ClipboardCheck class="w-5 h-5 text-porcelain" />
            <span>Bắt đầu khảo sát (5 phút)</span>
          </router-link>

          <router-link to="/letter" class="btn-ghost w-full sm:w-auto">
            <Send class="w-4 h-4 text-burnt-rose" />
            <span>Gửi thư tâm sự ẩn danh</span>
          </router-link>

          <router-link to="/booking" class="btn-text w-full sm:w-auto">
            <Calendar class="w-4 h-4 text-charcoal-blue" />
            <span>Đặt lịch tư vấn</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Feature Card với nền mềm mại nhẹ nhàng -->
    <section class="max-w-[1200px] mx-auto px-4 sm:px-6">
      <div class="relative bg-white border border-charcoal-blue/20 text-black rounded-feature p-8 sm:p-12 lg:p-14 overflow-hidden shadow-warm-stone">
        <!-- Background accents -->
        <div class="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-burnt-rose/10 blur-3xl pointer-events-none"></div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-7 space-y-4">
            <span class="inline-flex items-center px-3 py-1 rounded-lg bg-wine-plum/10 text-wine-plum text-xs font-semibold">Quy trình 3 bước</span>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-display text-black tracking-display leading-tight">
              Tự nhận diện bản thân,
              <span class="text-burnt-rose">nhẹ lòng</span> hơn mỗi ngày
            </h2>
            <p class="text-sm sm:text-base text-charcoal-blue leading-relaxed font-normal max-w-lg">
              Chỉ mất 5 phút trả lời 24 câu hỏi tự đánh giá. Thuật toán tự động phân tích mức độ nguy cơ theo chuẩn tâm lý học đường, đưa ra lời khuyên thực tế tức thì.
            </p>

            <div class="pt-2 flex flex-wrap gap-3">
              <router-link to="/screening" class="btn-primary">
                Làm bài ngay
              </router-link>
              <router-link to="/letter-tracking" class="btn-ghost">
                Tra cứu thư phản hồi
              </router-link>
            </div>
          </div>

          <!-- Overlapping White Card (rotated -3 deg) -->
          <div class="lg:col-span-5 flex justify-center lg:justify-end">
            <div class="bg-white text-black p-6 rounded-card shadow-warm-stone w-full max-w-sm sm:rotate-[-3deg] border border-charcoal-blue/20 transition-transform hover:rotate-0">
              <div class="flex items-center justify-between pb-3 border-b border-charcoal-blue/15">
                <span class="text-xs font-semibold text-charcoal-blue uppercase tracking-wider">Phiếu kết quả mẫu</span>
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-wine-plum/10 text-wine-plum">An toàn</span>
              </div>
              <div class="py-4 space-y-3">
                <div class="flex justify-between text-sm">
                  <span class="text-charcoal-blue">Áp lực học tập:</span>
                  <span class="font-semibold text-black">Nhẹ (25%)</span>
                </div>
                <div class="w-full bg-porcelain h-2 rounded-full overflow-hidden border border-charcoal-blue/10">
                  <div class="bg-wine-plum h-full rounded-full" style="width: 25%"></div>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-charcoal-blue">Lo âu - Khó ngủ:</span>
                  <span class="font-semibold text-black">Bình thường (10%)</span>
                </div>
                <div class="w-full bg-porcelain h-2 rounded-full overflow-hidden border border-charcoal-blue/10">
                  <div class="bg-wine-plum h-full rounded-full" style="width: 10%"></div>
                </div>
              </div>
              <p class="text-xs text-charcoal-blue border-t border-charcoal-blue/15 pt-3 italic">
                Mã tra cứu riêng biệt giúp bạn xem lại kết quả mọi lúc mà không lộ thông tin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Disclaimer Section -->
    <section class="max-w-[1200px] mx-auto px-4 sm:px-6">
      <DisclaimerCard />
    </section>

    <!-- 8 Topics Accent Grid -->
    <section class="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-8">
      <div class="text-center max-w-2xl mx-auto space-y-2">
        <h2 class="text-3xl sm:text-4xl font-display text-black tracking-display">
          8 nhóm vấn đề sàng lọc
        </h2>
        <p class="text-sm sm:text-base text-charcoal-blue">
          Thang đo chuẩn hóa giúp học sinh nhận diện chính xác nguồn cơn của cảm xúc và căng thẳng.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          v-for="t in SCREENING_TOPICS"
          :key="t.id"
          class="card p-6 flex flex-col justify-between hover:border-burnt-rose transition-all group"
        >
          <div>
            <div class="w-12 h-12 rounded-lg bg-porcelain border border-charcoal-blue/10 flex items-center justify-center mb-4 text-wine-plum group-hover:bg-wine-plum group-hover:text-porcelain transition-colors">
              <component :is="getTopicIcon(t.icon)" class="w-6 h-6" />
            </div>
            <h3 class="font-display text-base text-black mb-2 tracking-display">
              {{ t.title }}
            </h3>
            <p class="text-xs sm:text-sm text-charcoal-blue leading-relaxed">
              {{ t.description }}
            </p>
          </div>
          <div class="pt-4 mt-4 border-t border-charcoal-blue/10 flex items-center justify-between text-xs font-semibold text-charcoal-blue group-hover:text-wine-plum">
            <span>3 câu hỏi chuẩn hóa</span>
            <span>&rarr;</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 3 Steps Section -->
    <section class="max-w-[1200px] mx-auto px-4 sm:px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="(step, i) in steps" :key="i" class="card p-6 flex items-start gap-4">
          <div class="w-10 h-10 rounded-lg bg-wine-plum text-porcelain font-display flex items-center justify-center text-lg flex-shrink-0">
            {{ i + 1 }}
          </div>
          <div>
            <h4 class="font-display text-base text-black mb-1 tracking-display">{{ step.title }}</h4>
            <p class="text-xs sm:text-sm text-charcoal-blue leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { SCREENING_TOPICS } from "@shared/questions";
import DisclaimerCard from "@/components/DisclaimerCard.vue";
import {
  ClipboardCheck,
  Send,
  Calendar,
  Brain,
  CloudRain,
  AlertCircle,
  Target,
  Zap,
  Users,
  BookOpen,
  Compass,
} from "lucide-vue-next";

const steps = [
  {
    title: "1. Tự đánh giá ẩn danh",
    desc: "Trả lời các câu hỏi trắc nghiệm một cách chân thật. Hệ thống không lưu họ tên hay IP cá nhân.",
  },
  {
    title: "2. Nhận kết quả & mã số",
    desc: "Xem biểu đồ phân tích 8 nhóm nguy cơ và nhận khuyến nghị tự chăm sóc tâm lý phù hợp.",
  },
  {
    title: "3. Kết nối khi cần thiết",
    desc: "Dùng mã ẩn danh để gửi thư tâm sự hoặc đặt lịch gặp chuyên viên tư vấn của trường.",
  },
];

const getTopicIcon = (icon: string) => {
  const map: Record<string, unknown> = {
    CloudRain,
    AlertCircle,
    Zap,
    Users,
    BookOpen,
    Target,
    Compass,
    Brain,
  };
  return map[icon] || Brain;
};
</script>
