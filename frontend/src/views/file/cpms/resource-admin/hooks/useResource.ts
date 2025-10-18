import { useGlobalStore } from '@/store'
import { useFileStore } from '@/store/file'
import { IFileItemConfig } from '@/store/file/type'
import { ITreeProvide } from '@/types/provide'
import { computed, inject, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

export default function () {
  const fs = useFileStore()
  const gb = useGlobalStore()
  const router = useRouter()
  const showValue = ref(fs.resources)
  const tip = computed(() =>
    fs.searchs?.length === 0 ? '没有与搜索条件匹配的项' : '此文件夹为空'
  )
  watch(
    () => [fs.searchs, fs.resources],
    ([s, r]) => {
      if (s == null) {
        showValue.value = r
      } else {
        showValue.value = s
      }
    }
  )

  const handleCapture = (res: IFileItemConfig) => {
    // 单选模式
    if (!gb.multipleMode) {
      fs.activeResource?.path === res.path
        ? (fs.activeResource = null)
        : (fs.activeResource = res)
      fs.actives = []
    } else {
      const index = fs.actives.findIndex((i) => i.path === res.path)
      if (index !== -1) fs.actives.splice(index, 1)
      else fs.actives.push(res)
    }
  }
  const treeInstance = inject('treeInstance') as ITreeProvide
  const handleDbclick = async (res: IFileItemConfig) => {
    if (res.filetype.includes('image')) {
      fs.readImage(res.path)
    } else {
      if (!res.isFile) {
        fs.getFileList({ path: res.path }, true).then((data) => {
          treeInstance.updateKeyChildren(res.path, data.items ?? [])
        })
      } else {
        if (/.md/i.test(res.extension)) {
          if (!fs.save) {
            fs.content = ''
            fs.save = false
            fs.path = res.path
            gb.path = res.path
            router.push('/markdown-edit')
          }
        } else {
          ;(await fs.read({ path: res.path })) as any
          router.push('/text-edit')
        }
      }
    }
  }
  return { fs, showValue, tip, handleCapture, handleDbclick }
}
