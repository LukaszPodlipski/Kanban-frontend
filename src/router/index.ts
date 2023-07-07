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
        meta: { title: 'Explore' },
      },
      {
        path: 'project/:id',
        name: 'Project',
        component: () => import('../views/ProjectView.vue'),
        meta: { title: 'Project' },
        children: [
          {
            path: 'members',
            name: 'ProjectMembers',
            component: () => import('../components/table/project/ProjectMembers.vue'),
            meta: { title: 'Project members' },
          },
          {
            path: 'statistics',
            name: 'ProjectStatistics',
            component: () => import('../components/table/project/ProjectStatistics.vue'),
            meta: { title: 'Project statistics' },
          },
          {
            path: 'settings',
            name: 'ProjectSettings',
            component: () => import('../components/table/project/ProjectSettings.vue'),
            meta: { title: 'Project settings' },
          }
        ]
      },
      {
        path: 'account',
        name: 'Account',
        component: () => import('../views/AccountView.vue'),
        meta: { title: 'Account' },
      },
      {
        path: 'preferences',
        name: 'Preferences',
        component: () => import('../views/PreferencesView.vue'),
        meta: { title: 'Preferences' },
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
