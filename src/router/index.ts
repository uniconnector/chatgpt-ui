import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import ChatView from '../views/ChatView.vue'
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
        component: () => ChatView,
      },
    ],
  },
  {
    path: '/doc',
    name: 'doc',
    component: () => ChatView,
  },
  {
    path: '/signin',
    name: 'signin',
    component: () => ChatView,
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => ChatView,
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
