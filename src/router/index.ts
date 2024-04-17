import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/Panel.vue')
  },

  /* CUSTOMERS */
  {
    path: '/customers',
    name: 'customers',
    component: () => import('@/views/Customers/Index.vue')
  },
  {
    path: '/customers/create',
    name: 'customers-create',
    component: () => import('@/views/Customers/Create.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
