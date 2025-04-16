import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/course",
    name: "course",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/CourseView.vue"),
  },
  {
    path: "/pod",
    name: "pod",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/PodView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
