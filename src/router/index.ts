import i18n from '@/locale'
import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

import DashboardWrapperView from '../views/DashboardWrapperView.vue'
import HomeView from '../views/HomeView.vue'

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
        path: 'project',
        name: 'ProjectWrapper',
        component: () => import('../views/ProjectView.vue'),
        children: [
          {
            path: ':id',
            name: 'Board',
            component: () => import('../components/dashboard/board/Board.vue'),
            meta: { title: 'Board' },
          },
          {
            path: ':id/members',
            name: 'ProjectMembers',
            component: () =>
              import('../components/dashboard/project/ProjectMembers.vue'),
            meta: { title: 'Project members' },
          },
          // {
          //   path: ':id/statistics',
          //   name: 'ProjectStatistics',
          //   component: () =>
          //     import('../components/dashboard/project/ProjectStatistics.vue'),
          //   meta: { title: 'Project statistics' },
          // }, TODO: Implement project statistics
          {
            path: ':id/settings',
            name: 'ProjectSettings',
            component: () =>
              import(
                '../components/dashboard/project/settings/ProjectSettings.vue'
              ),
            meta: { title: 'Project settings' },
          },
          {
            path: ':id/backlog',
            name: 'ProjectBacklog',
            component: () =>
              import('../components/dashboard/project/ProjectBacklog.vue'),
            meta: { title: 'Project backlog' },
          },
        ],
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
    path: '/:notFound(.*)',
    redirect: '/dashboard',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _, next) => {
  const authStore = useAuthStore()

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
    document.title = title
      ? `Kanban - ${i18n.global.t(
          `views.${title.replace(' ', '_').toLowerCase()}`,
        )}`
      : 'Kanban'
  }
})

export default router
