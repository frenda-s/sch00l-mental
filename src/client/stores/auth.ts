import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { UserDTO } from "../types/index.js";
import { apiFetch } from "../services/api.ts";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<UserDTO | null>(null);
  const isLoading = ref<boolean>(false);
  const isInitialized = ref<boolean>(false);

  const isAuthenticated = computed(() => !!user.value);
  const isCounselorOrAdmin = computed(
    () => user.value?.role === "counselor" || user.value?.role === "admin"
  );
  const isAdmin = computed(() => user.value?.role === "admin");

  async function fetchCurrentUser() {
    isLoading.value = true;
    try {
      const res = await apiFetch<{ user: UserDTO | null }>("/auth/me");
      if (res.success && res.data) {
        user.value = res.data.user;
      } else {
        user.value = null;
      }
    } finally {
      isLoading.value = false;
      isInitialized.value = true;
    }
  }

  async function login(credentials: Record<string, string>) {
    isLoading.value = true;
    try {
      const res = await apiFetch<{ user: UserDTO }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      if (res.success && res.data) {
        user.value = res.data.user;
        return { success: true };
      }
      return {
        success: false,
        error: res.error?.message || "Đăng nhập thất bại",
      };
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    isLoading.value = true;
    try {
      await apiFetch("/auth/logout", { method: "POST" });
      user.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    user,
    isLoading,
    isInitialized,
    isAuthenticated,
    isCounselorOrAdmin,
    isAdmin,
    fetchCurrentUser,
    login,
    logout,
  };
});
