import useUpdateTree from '@/hooks/useUpdateTree'
import { useGlobalStore } from '@/store'
import { useFileStore } from '@/store/file'
import EmitMessage from '@/tools/element-plus/message'
import { TEmit } from '@/types'
import { resolveDir } from '@/utils/operation'
import { computed, ref } from 'vue'

export default function (emit: TEmit<'close-upload'>) {
  const gb = useGlobalStore()
  const fileStore = useFileStore()
  const fileUpload = ref<HTMLElement>()
  const folderUpload = ref<HTMLElement>()
  const { updateTree } = useUpdateTree()
  const title = computed(() => resolveDir(gb.path))
  const uploadInput = (event: Event, key: 'upload' | 'uploadFolder') => {
    try {
      const files = (event.currentTarget as any).files
      const folder_upload =
        files[0].webkitRelativePath !== undefined &&
        files[0].webkitRelativePath !== ''
      if (folder_upload) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          files[i].fullPath = file.webkitRelativePath
        }
      }
      if (files.length) {
        const $file = new FormData()
        Array.from(files as FileList).forEach((file) => {
          $file.append('file', file)
        })
        fileStore[key]({
          path: gb.path,
          data: $file
        }).then((res) => {
          if (res) {
            updateTree(res)
            emit('close-upload')
          }
        })
      }
    } catch (error) {
      EmitMessage.error('资源上传失败!')
    }
  }

  const captureFileUpload = () => fileUpload.value?.click()
  const captureFolderUpload = () => folderUpload.value?.click()
  return {
    gb,
    title,
    uploadInput,
    fileUpload,
    folderUpload,
    captureFileUpload,
    captureFolderUpload
  }
}
