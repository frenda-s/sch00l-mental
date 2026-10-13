<template>
  <div>
    <!-- Top Announcement Banner -->
    <div
      v-if="showBanner"
      class="w-full bg-wine-plum text-porcelain py-2 px-4 text-sm font-medium transition-all"
    >
      <div class="max-w-[1200px] mx-auto flex items-center justify-between">
        <div class="flex-1 text-center">
          <span>Không gian lắng nghe và tư vấn hoàn toàn ẩn danh. Cần trợ giúp gấp? </span>
          <router-link to="/letter" class="text-porcelain underline font-semibold ml-1 hover:opacity-90">
            Gửi tâm sự ngay
          </router-link>
        </div>
        <button
          @click="showBanner = false"
          class="text-porcelain/80 hover:text-porcelain text-lg leading-none p-1 ml-2"
          aria-label="Đóng banner"
        >
          &times;
        </button>
      </div>
    </div>

    <!-- Main Navigation Header -->
    <header class="sticky top-0 z-40 bg-porcelain/90 backdrop-blur-md border-b border-charcoal-blue/15">
      <div class="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-3 group">
          <div class="w-9 h-9 rounded-full bg-wine-plum flex items-center justify-center text-porcelain shadow-subtle group-hover:scale-105 transition-transform">
            <HeartHandshake class="w-5 h-5 text-porcelain" />
          </div>
          <div class="leading-tight">
            <span class="font-display text-lg text-black tracking-tight block">Tâm Lý THPT</span>
            <span class="text-xs text-charcoal-blue block -mt-0.5">Sàng lọc &amp; tư vấn</span>
          </div>
        </router-link>

        <!-- Desktop Navigation Items -->
        <nav class="hidden md:flex items-center space-x-1">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="
              $route.path === item.to
                ? 'text-wine-plum bg-white shadow-subtle font-semibold border border-charcoal-blue/10'
                : 'text-charcoal-blue hover:text-black hover:bg-white/60'
            "
          >
            {{ item.label }}
          </router-link>

          <router-link
            v-if="authStore.isCounselorOrAdmin"
            to="/dashboard"
            class="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-burnt-rose text-porcelain text-sm font-semibold transition-colors hover:bg-wine-plum shadow-subtle"
          >
            <ShieldAlert class="w-4 h-4" />
            <span>Dashboard</span>
          </router-link>
        </nav>

        <!-- Auth Actions -->
        <div class="hidden md:flex items-center space-x-3">
          <template v-if="authStore.isAuthenticated">
            <div class="text-right leading-tight">
              <span class="text-xs text-charcoal-blue block">Xin chào</span>
              <span class="text-sm font-semibold text-black">{{ authStore.user?.fullName }}</span>
            </div>
            <button
              @click="handleLogout"
              class="p-2 text-charcoal-blue hover:text-burnt-rose hover:bg-white rounded-lg transition-colors border border-transparent hover:border-charcoal-blue/20"
              title="Đăng xuất"
              aria-label="Đăng xuất"
            >
              <LogOut class="w-5 h-5" />
            </button>
          </template>

          <template v-else>
            <router-link to="/login" class="btn-ghost">
              Ban tư vấn
            </router-link>
          </template>
        </div>

        <!-- Mobile Toggle -->
        <button
          @click="isOpen = !isOpen"
          class="md:hidden p-2 rounded-lg text-black hover:bg-white focus:outline-none"
          aria-label="Mở menu điều hướng"
          :aria-expanded="isOpen"
        >
          <Menu v-if="!isOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </div>

      <!-- Mobile Dropdown -->
      <div v-if="isOpen" class="md:hidden border-b border-charcoal-blue/15 bg-porcelain px-4 pt-2 pb-4 space-y-1 shadow-sm">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          @click="isOpen = false"
          :to="item.to"
          class="block px-3 py-2 rounded-lg text-base font-medium"
          :class="
            $route.path === item.to
              ? 'text-wine-plum bg-white font-semibold'
              : 'text-charcoal-blue hover:text-black'
          "
        >
          {{ item.label }}
        </router-link>

        <router-link
          v-if="authStore.isCounselorOrAdmin"
          @click="isOpen = false"
          to="/dashboard"
          class="block px-3 py-2 rounded-lg text-base font-semibold text-porcelain bg-burnt-rose"
        >
          Dashboard tư vấn viên
        </router-link>

        <div class="pt-3 border-t border-charcoal-blue/15 flex items-center justify-between">
          <template v-if="authStore.isAuthenticated">
            <span class="text-sm font-semibold text-black">{{ authStore.user?.fullName }}</span>
            <button @click="handleLogout" class="text-sm text-burnt-rose font-medium">Đăng xuất</button>
          </template>
          <template v-else>
            <router-link
              @click="isOpen = false"
              to="/login"
              class="w-full text-center btn-ghost"
            >
              Đăng nhập Ban tư vấn
            </router-link>
          </template>
        </div>
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { HeartHandshake, ShieldAlert, LogOut, Menu, X } from "lucide-vue-next";

const router = useRouter();
const authStore = useAuthStore();
const isOpen = ref(false);
const showBanner = ref(true);

const navItems = [
  { label: "Trang chủ", to: "/" },
  { label: "Sàng lọc", to: "/screening" },
  { label: "Gửi tâm sự", to: "/letter" },
  { label: "Tra cứu thư", to: "/letter-tracking" },
  { label: "Đặt lịch hẹn", to: "/booking" },
  { label: "Tài liệu", to: "/resources" },
];

const handleLogout = async () => {
  isOpen.value = false;
  await authStore.logout();
  router.push("/");
};
</script>
