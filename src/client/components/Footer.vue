<template>
  <footer class="bg-porcelain text-charcoal-blue border-t border-charcoal-blue/15 mt-20">
    <div class="max-w-[1200px] mx-auto px-4 sm:px-6 py-14">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <!-- Cột 1: Thông tin đề tài -->
        <div>
          <div class="flex items-center space-x-2 text-black font-display text-xl mb-3 tracking-display">
            <HeartHandshake class="w-6 h-6 text-wine-plum" />
            <span>Tâm Lý Học Đường</span>
          </div>
          <p class="text-sm text-charcoal-blue leading-relaxed mb-4">
            Dự án nghiên cứu khoa học kỹ thuật hỗ trợ sàng lọc sức khỏe tâm thần ban đầu và kết nối tư vấn tâm lý học đường riêng tư, an toàn cho học sinh THPT.
          </p>
          <span class="inline-flex items-center px-3 py-1 text-xs font-semibold bg-wine-plum/10 text-wine-plum rounded-lg border border-wine-plum/20">
            Nghiên cứu KHKT THPT 2026
          </span>
        </div>

        <!-- Cột 2: Đường dây hỗ trợ khẩn cấp -->
        <div class="bg-white p-6 rounded-card border border-charcoal-blue/15 shadow-warm-stone">
          <h4 class="text-xs font-semibold text-burnt-rose uppercase tracking-wider mb-3 flex items-center gap-2">
            <PhoneCall class="w-4 h-4" />
            <span>Hỗ trợ khẩn cấp 24/7</span>
          </h4>
          <ul class="space-y-2 text-sm">
            <li class="flex items-center justify-between bg-porcelain p-3 rounded-lg border border-charcoal-blue/10">
              <span class="text-charcoal-blue font-medium">Tổng đài Trẻ em:</span>
              <a href="tel:111" class="font-bold text-burnt-rose hover:underline">111 (Miễn phí)</a>
            </li>
            <li class="flex items-center justify-between bg-porcelain p-3 rounded-lg border border-charcoal-blue/10">
              <span class="text-charcoal-blue font-medium">Cấp cứu y tế:</span>
              <a href="tel:115" class="font-bold text-black hover:underline">115</a>
            </li>
          </ul>
          <p class="text-xs text-charcoal-blue/80 mt-3 leading-relaxed">
            Nếu bạn hoặc bạn bè đang rơi vào tình huống nguy hiểm, hãy gọi ngay hoặc tìm đến giáo viên, người lớn đáng tin cậy.
          </p>
        </div>

        <!-- Cột 3: Cam kết -->
        <div>
          <h4 class="text-xs font-semibold text-black uppercase tracking-wider mb-3">
            Cam kết bảo mật &amp; Y tế
          </h4>
          <p class="text-xs text-charcoal-blue leading-relaxed mb-3">
            Hệ thống tôn trọng tuyệt đối sự ẩn danh. Không yêu cầu khai báo họ tên thật khi làm khảo sát hay gửi thư tâm sự.
          </p>
          <div class="text-xs text-charcoal-blue leading-relaxed border-l-2 border-wine-plum pl-3 py-1 bg-white rounded-r-lg border border-charcoal-blue/10">
            <strong class="text-black">Lưu ý:</strong> Kết quả sàng lọc chỉ mang tính tham khảo nghiên cứu, không thay thế cho chẩn đoán y khoa chuyên nghiệp.
          </div>
        </div>
      </div>

      <div class="border-t border-charcoal-blue/15 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-blue/70">
        <p>&copy; 2026 Hệ thống Sàng lọc &amp; Tư vấn Tâm lý Học đường THPT.</p>
        <p class="mt-2 sm:mt-0 font-medium text-black">An toàn &bull; Bảo mật &bull; Đồng cảm</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { HeartHandshake, PhoneCall } from "lucide-vue-next";
</script>
