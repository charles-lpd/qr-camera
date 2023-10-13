import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/test',
    name: 'test',
    component: async () => await import('@/pages/Test.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
router.afterEach(() => {
  document.documentElement.scrollTop = 0
})
export default router
