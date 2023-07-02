import { createWebHistory, createRouter } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProjectsWrapperView from '../views/ProjectsWrapperView.vue'
import stores from '@/stores'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    redirect: '/projects',
    meta: { public: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { public: true },
  },

  {
    path: '/projects',
    name: 'Projects',
    component: ProjectsWrapperView,
    redirect: '/projects/explore',
    children: [
      {
        path: 'explore',
        name: 'Explore',
        component: () => import('../views/ExploreProjectsView.vue'),
      },
      {
        path: ':id',
        name: 'Project',
        component: () => import('../views/ProjectView.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _, next) => {
  const authStore = stores.useAuthStore()

  const isAuthorized = authStore.isAuthorized()

  if (isAuthorized) {
    if (to.name === 'Login') {
      next({ name: 'Projects' })
    } else {
      next()
    }
  } else if (to.meta.public) {
    next()
  } else {
    next({ name: 'Login' })
  }
})

export default router
