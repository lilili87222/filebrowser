import { useFileStore } from '@/store/file'
import { IFileItemConfig } from '@/store/file/type'
import { computed, onMounted, ref, watch } from 'vue'

export default function () {
  const fs = useFileStore()
  const folders = ref<IFileItemConfig[]>([])
  const files = ref<IFileItemConfig[]>([])
  const splitResource = () => {
    if (showValue.value) {
      let index = showValue.value.findIndex((i) => i.isFile)
      if (index === -1) index = showValue.value.length
      folders.value = showValue.value.slice(0, index)
      files.value = showValue.value.slice(index)
    }
  }
  onMounted(splitResource)
  watch(() => fs.resources, splitResource)
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
      splitResource()
    }
  )

  return { fs, folders, files, tip }
}
