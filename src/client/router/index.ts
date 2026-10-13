import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth.ts";

import HomeView from "../views/HomeView.vue";
import ScreeningView from "../views/ScreeningView.vue";
import ResultView from "../views/ResultView.vue";
import LetterView from "../views/LetterView.vue";
import LetterTrackingView from "../views/LetterTrackingView.vue";
import BookingView from "../views/BookingView.vue";
import ResourcesView from "../views/ResourcesView.vue";
import ResourceDetailView from "../views/ResourceDetailView.vue";
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";
import DashboardLettersView from "../views/DashboardLettersView.vue";
import DashboardAppointmentsView from "../views/DashboardAppointmentsView.vue";
import DashboardAlertsView from "../views/DashboardAlertsView.vue";

const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/screening", name: "screening", component: ScreeningView },
  { path: "/result/:id?", name: "result", component: ResultView },
  { path: "/letter", name: "letter", component: LetterView },
  { path: "/track", name: "track", component: LetterTrackingView },
  { path: "/letter-tracking", name: "letter-tracking", component: LetterTrackingView },
  { path: "/booking", name: "booking", component: BookingView },
  { path: "/resources", name: "resources", component: ResourcesView },
  { path: "/resources/:slug", name: "resource-detail", component: ResourceDetailView },
  { path: "/login", name: "login", component: LoginView },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
    meta: { requiresCounselor: true },
  },
  {
    path: "/dashboard/letters",
    name: "dashboard-letters",
    component: DashboardLettersView,
    meta: { requiresCounselor: true },
  },
  {
    path: "/dashboard/appointments",
    name: "dashboard-appointments",
    component: DashboardAppointmentsView,
    meta: { requiresCounselor: true },
  },
  {
    path: "/dashboard/alerts",
    name: "dashboard-alerts",
    component: DashboardAlertsView,
    meta: { requiresCounselor: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();

  if (!authStore.isInitialized) {
    await authStore.fetchCurrentUser();
  }

  if (to.meta.requiresCounselor && !authStore.isCounselorOrAdmin) {
    return next({ name: "login", query: { redirect: to.fullPath } });
  }

  next();
});

export default router;
