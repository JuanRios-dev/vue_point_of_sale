import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../auth';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/Panel.vue')
  },
  {
    path: '/login',
    name: 'auth-login',
    component: () => import('@/views/Auth/Login.vue')
  },

  /* CUSTOMERS */
  {
    path: '/customers',
    name: 'customers',
    component: () => import('@/views/Customers/Index.vue')
  },

  /* PROVIDERS */
  {
    path: '/providers',
    name: 'providers',
    component: () => import('@/views/Providers/Index.vue')
  },

  /* WINERIES */
  {
    path: '/wineries',
    name: 'wineries',
    component: () => import('@/views/Wineries/Index.vue')
  },

  /* ITEMS */
  {
    path: '/items',
    name: 'items',
    component: () => import('@/views/Items/Index.vue')
  },
  {
    path: '/items/create',
    name: 'items-create',
    component: () => import('@/views/Items/Create.vue')
  },
  {
    path: '/items/edit/:id',
    name: 'items-edit',
    component: () => import('@/views/Items/Edit.vue')
  },

  /* MOVEMENTS */
  {
    path: '/movements',
    name: 'movements',
    component: () => import('@/views/Movements/Index.vue')
  },
  {
    path: '/movements/create',
    name: 'movements-create',
    component: () => import('@/views/Movements/Create.vue')
  },
  {
    path: '/movements/show/:id',
    name: 'movements-show',
    component: () => import('@/views/Movements/Show.vue')
  },

  /* MOVEMENTS */
  {
    path: '/transfers',
    name: 'transfers',
    component: () => import('@/views/Transfers/Index.vue')
  },
  {
    path: '/transfers/create',
    name: 'transfers-create',
    component: () => import('@/views/Transfers/Create.vue')
  },
  {
    path: '/transfers/show/:id',
    name: 'transfers-show',
    component: () => import('@/views/Transfers/Show.vue')
  },

  /* CASHES */
  {
    path: '/cashes',
    name: 'cashes',
    component: () => import('@/views/Cashes/Index.vue')
  },


  /* PROVIDER INVOICES */
  {
    path: '/provider-invoices',
    name: 'provider-invoices',
    component: () => import('@/views/ProviderInvoices/Index.vue')
  },
  {
    path: '/provider-invoices/create',
    name: 'provider-invoices-create',
    component: () => import('@/views/ProviderInvoices/Create.vue')
  },
  {
    path: '/provider-invoices/show/:id',
    name: 'provider-invoices-show',
    component: () => import('@/views/ProviderInvoices/Show.vue')
  },

  /* SALES */
  {
    path: '/sales',
    name: 'sales',
    component: () => import('@/views/Sales/Index.vue')
  },
  {
    path: '/sales/create',
    name: 'sales-create',
    component: () => import('@/views/Sales/Create.vue')
  },
  {
    path: '/sales/show/:id',
    name: 'sales-show',
    component: () => import('@/views/Sales/Show.vue')
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

/* GUARDIA DE NAVEGACIÓN */
router.beforeEach(async (to, from, next) => {
  const publicPages = ['/login'];
  const auth = useAuthStore();
  const isPublicPage = publicPages.includes(to.path);

  if (auth.isAuthenticated && isPublicPage) {
    next('/');
  } else if (!isPublicPage && !auth.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router
