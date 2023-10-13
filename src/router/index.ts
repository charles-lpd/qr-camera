import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Camera from '../pages/Camera.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: Camera
  },
  {
    path: '/test',
    name: 'test',
    component: Home
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
