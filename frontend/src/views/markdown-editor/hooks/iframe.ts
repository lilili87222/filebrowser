import useSave from '@/hooks/useSave'
import { useFileStore } from '@/store/file'
import EmitMessage from '@/tools/element-plus/message'
import { computed, onMounted, onUnmounted, ref } from 'vue'

export default function () {
  const fs = useFileStore()
  const url = computed(() => `${process.env.VUE_APP_BASE_URL}/home/${fs.path}`)
  let iframe: HTMLIFrameElement
  const isFull = ref(false)
  const { replaceContent } = useSave()
  const messageListener = (e: MessageEvent) => {
    if (e.data && e.data.code) {
      if (e.data.code !== 200) {
        EmitMessage.error(e.data.msg)
      } else {
        if (e.data.data === 'handleSave') {
          if (e.data.invoke) fs.save = true
          fs.content = e.data.msg
        } else if (e.data.data === 'fullscreen') {
          isFull.value = true
        } else if (e.data.data === 'fullscreenExit') {
          isFull.value = false
        } else if (e.data.data === 'saveContent') {
          replaceContent()
        }
      }
    }
  }
  onMounted(() => {
    iframe = document.getElementById(
      'markdown-iframe__content'
    ) as HTMLIFrameElement

    const postMessage = () => {
      iframe!.contentWindow!.postMessage(
        {
          method: 'loadContent',
          args: {
            path: `/home/${fs.path}`,
            server: `${url.value}?fmt=json`,
            file: `${process.env.VUE_APP_BASE_URL}/file/upload_md?path=${fs.path}`
          }
        },
        '*'
      )
    }
    iframe!.onload = () => {
      postMessage()
    }
    window.addEventListener('message', messageListener)
  })
  onUnmounted(() => {
    window.removeEventListener('message', messageListener)
    iframe.onload = null
  })
  return { url, isFull }
}
