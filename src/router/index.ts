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
  {
    path: "/signin",
    name: "signin",
    meta: { transition: "slide" },
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/SignInView.vue"),
  },
  {
    path: "/signup",
    name: "signup",
    meta: { transition: "slide" },
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/SignUpView.vue"),
  },
  {
    path: "/signupfull",
    name: "signupfull",
    meta: { transition: "slide" },
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/SigbUpFullView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
