import { useGlobalStore } from '@/store'
import { useFileStore } from '@/store/file'
import debounce from '@/utils/debounce'
import { resolveDir } from '@/utils/operation'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'

export default function () {
  const fs = useFileStore()
  const gb = useGlobalStore()
  const route = useRoute()

  const tip = computed(() =>
    route.path === '/file'
      ? `在${resolveDir(gb.path)}中搜索`
      : '编辑操作不允许搜索'
  )

  const debounced = debounce((name) => {
    if (route.path === '/file' && name === '') fs.searchs = null
  }, 550)

  watch(() => fs.searchValue, debounced)
  const handleEnterKey = () => {
    if (fs.searchValue !== '') {
      fs.search()
    }
  }

  return { fs, gb, tip, handleEnterKey }
}
