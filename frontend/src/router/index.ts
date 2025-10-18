import { useFileStore } from '@/store/file'
import EmitMessage from '@/tools/element-plus/message'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
const DEFAULT_REDIRECT = '/login'
import components from './module'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'System',
    redirect: DEFAULT_REDIRECT,
    component: () => import('@/layout/system/System.vue'),
    children: components
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Auth.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/not-found/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((guard, from) => {
  if (from.path === '/markdown-edit' || from.path === '/text-edit') {
    const fs = useFileStore()
    if (fs.save) {
      EmitMessage.warning('请先保存文件内容!')
      return from.path
    }
  }
  if (guard.path === '/markdown-edit' || guard.path === '/text-edit') {
    const fs = useFileStore()
    if (from.path === '/' || fs.path === '') return '/file'
  }
})

export default router
