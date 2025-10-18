import useSave from '@/hooks/useSave'
import { useGlobalStore } from '@/store'
import { useFileStore } from '@/store/file'
import { ITreeProvide } from '@/types/provide'
import { inject, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default function () {
  const fileStore = useFileStore()
  const gbStore = useGlobalStore()
  const route = useRoute()
  const router = useRouter()
  //#region 面包屑的展示与隐藏
  const breadcrumbRef = ref<HTMLElement>()
  const operateRef = ref<HTMLElement>()
  const hidden = ref(false)
  //#endregion

  //#region 面包屑的数据获取
  const trail = ref(gbStore.path.split('/'))
  watch(
    () => gbStore.path,
    (v) => {
      trail.value = v.split('/')
    }
  )
  const handleItem = (index: number) => {
    if (index === trail.value.length - 1) return
    else {
      const cache = []
      for (let i = 0; i <= index; i++) cache.push(trail.value[i])
      captureRoute(cache.join('/'))
    }
  }
  const { saveDecision } = useSave()
  const treeInstance = inject('treeInstance') as ITreeProvide
  const captureRoute = (path: string) => {
    const resolve = () => {
      route.path !== '/file' && router.push('/file')
      fileStore.getFileList({ path }, true).then((res) => {
        treeInstance.updateKeyChildren(path, res.items ?? [])
      })
    }
    saveDecision(resolve)
  }
  //#endregion

  //#region 右侧操作栏
  //#endregion
  return {
    fileStore,
    gbStore,
    breadcrumbRef,
    operateRef,
    hidden,
    trail,
    handleItem,
    captureRoute
  }
}
