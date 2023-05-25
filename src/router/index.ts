import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/qr-camera',
    name: 'qr-camera',
    component: async () => await import('../pages/QRCamera.vue')
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
