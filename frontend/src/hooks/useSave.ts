import {
  MARKDOWN_EDITOR_ROUTER_PATH,
  TEXT_EDITOR_ROUTER_PATH
} from '@/constants'
import { useFileStore } from '@/store/file'
import { useRoute } from 'vue-router'
import EmitMessageBox from '@/tools/element-plus/message-box'
import { useGlobalStore } from '@/store'

export default function () {
  const fs = useFileStore()
  const route = useRoute()
  const gb = useGlobalStore()
  const replaceContent = () => {
    return new Promise<void>((resolve) => {
      const $path = route.path
      if ($path === MARKDOWN_EDITOR_ROUTER_PATH) {
        fs.saveEdit().then((res) => {
          if (res) {
            fs.save = false
            resolve()
          }
        })
      } else if ($path === TEXT_EDITOR_ROUTER_PATH) {
        gb.isHandleSave = true
        resolve()
      }
    })
  }
  const saveDecision = (resolve: () => any) => {
    if (fs.save)
      EmitMessageBox.confirm('当前内容区内容已改变,是否进行保存?', '保存确认', {
        beforeClose(action, instance, done) {
          if (action === 'close') {
            done()
          } else if (action === 'cancel') {
            done()
            fs.clearFileState()
            resolve()
          } else {
            replaceContent().then(() => {
              done()
              resolve()
            })
          }
        }
      }).catch(() => ({}))
    else resolve()
  }
  return { replaceContent, fs, saveDecision }
}
