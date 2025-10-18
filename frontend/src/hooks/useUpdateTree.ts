import { useGlobalStore } from '@/store'
import { useFileStore } from '@/store/file'
import { sortResource } from '@/store/file/hooks'
import { IFileItemConfig } from '@/store/file/type'
import { ITreeProvide } from '@/types/provide'
import { inject } from 'vue'

export default function () {
  // 更新可视区域的内容
  const fs = useFileStore()
  const gbStore = useGlobalStore()
  const treeInstance = inject('treeInstance') as ITreeProvide

  const updateView = (data: IFileItemConfig, targetPath: string) => {
    gbStore.path = targetPath
    fs.resources = (data as IFileItemConfig)?.items ?? []
    fs.activeResource = null
    fs.actives = []
  }
  const updateTree = (res: IFileItemConfig, uView = true) => {
    sortResource(res.items ?? [])
    treeInstance.updateKeyChildren(res.path, res.items ?? [])
    uView && updateView(res, res.path)
  }
  return {
    updateTree
  }
}
