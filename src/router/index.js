import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { userStore } from "../store/user";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/search',
      name: 'search',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SearchView.vue')
    },
    {
      path: '/upload',
      name: 'upload',
      component: () => import('../views/UploadView.vue')
    },
    {
      path: '/bulk-upload',
      name: 'bulk-upload',
      component: () => import('../views/BulkUploadView.vue')
    },
    {
      path: '/doc-status',
      name: 'doc-status',
      component: () => import('../views/DocStatusView.vue')
    },
    {
      path: '/documents',
      name: 'documents',
      component: () => import('../views/DocumentsListView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/change-password',
      name: 'change-password',
      component: () => import('../views/ChangePasswordView.vue')
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPasswordView.vue')
    }
  ]
})

router.beforeEach(async (to, from) => {
  if (
    // make sure the user is authenticated
    !userStore.getState().isAuthenticated &&
    // ❗️ Avoid an infinite redirect
    (to.name !== 'login' && to.name !== 'forgot-password')
  ) {
    // redirect the user to the login page
    return { name: 'login' }
  } else if (
    userStore.getState().isAuthenticated &&
    (to.name === 'login' || to.name === 'forgot-password')
  ) {
    return { name: 'home' }
  }
})

export default router
