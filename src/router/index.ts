import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/home/index.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/pages/admin/index.vue')
    },
    {
      path: '/admin/list',
      name: 'admin-list',
      component: () => import('@/pages/admin/list.vue')
    },
    {
      path: '/three-d',
      name: 'three-d',
      component: () => import('@/pages/three-d/index.vue')
    }
  ],
})

export default router
