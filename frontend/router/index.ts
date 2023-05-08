import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

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
    path: '/demo-3',
    name: 'Demo-3',
    component: () => import('../views/Demo-3.vue'),
    meta: {
      desc: 'Preset Prompt',
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
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
