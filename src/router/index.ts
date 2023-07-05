import { createWebHistory, createRouter } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardWrapperView from '../views/DashboardWrapperView.vue'
import stores from '@/stores'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    redirect: '/projects',
    meta: { public: true, title: 'Welcome' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { public: true, title: 'Auth' },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardWrapperView,
    redirect: '/dashboard/explore',
    children: [
      {
        path: 'explore',
        name: 'Explore',
        component: () => import('../views/ExploreProjectsView.vue'),
        meta: { public: true, title: 'Explore' },
      },
      {
        path: 'project/:id',
        name: 'Project',
        component: () => import('../views/ProjectView.vue'),
        meta: { public: true, title: 'Project' },
      },
    ],
  },
  {
    path: "/:notFound(.*)",
    redirect: '/dashboard',
  }
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
      next({ name: 'Dashboard' })
    } else {
      next()
    }
  } else if (to.meta.public) {
    next()
  } else {
    next({ name: 'Login' })
  }

  const title = to.meta.title as string
  if (title) {
    document.title = `Kanban - ${title}`
  }
})

export default router
