<template>
  <div class="min-h-[70vh] flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md space-y-8">
      <div class="text-center space-y-2">
        <div class="w-14 h-14 bg-wine-plum text-porcelain rounded-card flex items-center justify-center mx-auto shadow-warm-stone">
          <ShieldCheck class="w-7 h-7" />
        </div>
        <h1 class="text-3xl font-display text-black tracking-display">Đăng Nhập</h1>
        <p class="text-sm text-charcoal-blue">
          Cổng thông tin chuyên biệt cho Ban Tư Vấn &amp; Quản trị viên.
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="card p-6 sm:p-8 space-y-5 border border-charcoal-blue/15 shadow-warm-stone">
        <div>
          <label class="block text-sm font-semibold text-black mb-2">Tên đăng nhập</label>
          <input
            v-model="username"
            type="text"
            required
            placeholder="Nhập tên đăng nhập"
            class="w-full px-4 py-3 rounded-lg border border-charcoal-blue/20 bg-porcelain text-sm text-black focus:outline-none focus:border-wine-plum focus:bg-white transition-colors"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-black mb-2">Mật khẩu</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-4 py-3 rounded-lg border border-charcoal-blue/20 bg-porcelain text-sm text-black focus:outline-none focus:border-wine-plum focus:bg-white transition-colors"
          />
        </div>

        <div v-if="errorMsg" class="p-3 bg-burnt-rose/10 border border-burnt-rose/30 text-burnt-rose text-sm font-semibold rounded-lg">
          {{ errorMsg }}
        </div>

        <button type="submit" :disabled="isSubmitting" class="btn-primary w-full">
          <LogIn class="w-5 h-5 text-porcelain" />
          <span>{{ isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập' }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { ShieldCheck, LogIn } from "lucide-vue-next";

const router = useRouter();
const auth = useAuthStore();

const username = ref("");
const password = ref("");
const isSubmitting = ref(false);
const errorMsg = ref("");

async function handleLogin() {
  isSubmitting.value = true;
  errorMsg.value = "";
  try {
    const result = await auth.login({ username: username.value, password: password.value });
    if (result.success) {
      router.push("/dashboard");
    } else {
      errorMsg.value = result.error || "Tên đăng nhập hoặc mật khẩu không đúng.";
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>
