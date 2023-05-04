import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Demo-1',
    alias: '/demo-1',
    component: () => import('../views/Demo-1.vue'),
    meta: {
      desc: 'Translate & Generate Image',
    },
  },
  {
    path: '/demo-2',
    name: 'Demo-2',
    component: () => import('../views/Demo-2.vue'),
    meta: {
      desc: 'AI Conversation',
    },
  },
  {
    path: '/config',
    name: 'Config',
    component: () => import('../views/Config.vue'),
    meta: {
      desc: 'Config',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
