import { createWebHistory, createRouter } from 'vue-router'
import Home from '../views/Home.vue'
import Projects from '../views/Projects.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/projects',
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects,
    redirect: '/projects/explore',
    children: [
      {
        path: 'explore',
        name: 'explore',
        component: () => import('../views/ExploreProjects.vue'),
      },
      {
        path: ':id',
        name: 'SingleProject',
        component: () => import('../views/SingleProject.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
