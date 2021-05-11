import Vue from "vue";
import VueRouter from "vue-router";
import store from "./store";

Vue.use(VueRouter);
import PageLayout from "@/layouts/page-layout.vue";

const Homepage = () => import("@/pages/homepage/homepage.vue");

const Program = () => import("@/pages/program/program.vue");

const Page404 = () => import("@/pages/page-404/page-404.vue");

const router = new VueRouter({
  mode: "history",
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: "/",
      component: PageLayout,
      children: [
        {
          path: "",
          name: "index",
          component: Homepage
        },
        {
          path: "/program",
          name: "program",
          component: Program
        },
        {
          path: "*",
          name: "404",
          component: Page404
        }
      ]
    }
  ]
});

export default router;
