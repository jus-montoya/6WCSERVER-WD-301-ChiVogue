import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../components/index.vue"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("../components/search.vue"),
  },
  {
    path: "/best",
    name: "best",
    component: () => import("../components/best.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../components/about.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
