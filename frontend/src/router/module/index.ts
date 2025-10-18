import {
  FILE_PATH,
  MARKDOWN_EDITOR_ROUTER_PATH,
  TEXT_EDITOR_ROUTER_PATH
} from '@/constants'
import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: FILE_PATH,
    name: 'File',
    component: () => import('@/views/file/File.vue')
  },
  {
    path: TEXT_EDITOR_ROUTER_PATH,
    name: 'TextEdit',
    component: () => import('@/views/text-editor/TextEditor.vue')
  },
  {
    path: MARKDOWN_EDITOR_ROUTER_PATH,
    name: 'MarkdownEdit',
    component: () => import('@/views/markdown-editor/MarkdownEditor.vue')
  }
]
export default routes
