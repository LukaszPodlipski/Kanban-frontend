import { createWebHistory, createRouter } from "vue-router";
import Home from '../views/Home.vue';
import Projects from "../views/Projects.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    redirect: '/projects'
  },
  {
    path: "/projects",
    name: "Projects",
    component: Projects,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;