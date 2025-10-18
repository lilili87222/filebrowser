import { useGlobalStore } from '@/store'
import { onMounted } from 'vue'
const TOKEN_VIEW_METHOD = '@XQPA__VIEW_METHOD'
type TMethod = 'view_list' | 'view_module'
// 对特定的信息进行浏览器缓存
export default function () {
  const gbStore = useGlobalStore()
  onMounted(getViewMethod)
  function getViewMethod() {
    try {
      let $cache: any = localStorage.getItem(TOKEN_VIEW_METHOD) ?? 'view_module'
      if ($cache !== 'view_list' && $cache !== 'view_module')
        $cache = 'view_module'
      gbStore.viewMode = $cache
    } catch (error) {
      gbStore.viewMode = 'view_module'
    }
  }

  const changeViewMethod = (str: TMethod) => {
    gbStore.viewMode = str
    localStorage.setItem(TOKEN_VIEW_METHOD, str)
  }

  return { changeViewMethod }
}
