import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    redirect: '/chat',
    children: [
      {
        path: '/chat/:uuid?',
        name: 'Chat',
        component: () => import('../views/ChatView.vue'),
      },
    ],
  },
  {
    path: '/doc',
    name: 'doc',
    component: () => import('../views/DocView.vue'),
  },
  {
    path: '/signin',
    name: 'signin',
    component: () => import('../views/signin/index.vue'),
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/signup/index.vue'),
  }
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}

export default router
