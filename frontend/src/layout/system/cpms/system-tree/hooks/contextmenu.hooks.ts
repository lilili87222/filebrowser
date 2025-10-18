import useUpdateTree from '@/hooks/useUpdateTree'
import { useGlobalStore } from '@/store'
import { useFileStore } from '@/store/file'
import { IFileItemConfig } from '@/store/file/type'
import EmitMessage from '@/tools/element-plus/message'
import Node from 'element-plus/es/components/tree/src/model/node'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import treeActionHooks from '../../system-container/hooks/tree-action.hooks'
import { IOperateType } from '../../system-container/types/file-actions.type'

export default function () {
  const fs = useFileStore()
  const gb = useGlobalStore()
  const router = useRouter()
  const contextmenu = ref<HTMLElement>()
  const valve = ref(false)
  const switchPopover = (state: boolean) => (valve.value = state)

  const judgeTop = (top: number) => {
    const contain = document.documentElement.clientHeight
    const listsHight = contextmenu.value?.offsetHeight ?? 0
    if (top + listsHight > contain) {
      top = contain - listsHight - 5
    }
    return top
  }

  const releaseMask = () => switchPopover(false)
  const { renameResource, handleRemove, handleCreate, handleMkdir } =
    treeActionHooks()
  const { updateTree } = useUpdateTree()
  const resolveResource = (key: IOperateType, node: Node) => {
    if (!node) return EmitMessage.error('无法获取文件节点的信息!')
    else {
      const $data = node.data as IFileItemConfig
      if (fs.save) return EmitMessage.warning('请先保存文件内容')
      switch (key) {
        case 'border_color':
          renameResource($data, (data, name) => {
            if ($data.path === gb.path) {
              gb.path = data.path + '/' + name
            }
            if ($data.path === fs.path) {
              fs.path = data.path + '/' + name
            }
            updateTree(data, false)
            if (fs.searchValue !== '') {
              fs.activeResource = null
              fs.search()
            }
          })
          break
        case 'delete_forever':
          handleRemove($data, () => {
            fs.deleteFile({
              path: $data.path
            }).then((res) => {
              if (res) updateTree(res, true)
              if (fs.searchValue !== '') {
                fs.activeResource = null
                fs.search()
              }
              router.replace('/file')
            })
          })
          break
        case 'create_new_folder':
          {
            const $parent = node.parent.data as IFileItemConfig
            const $path = $data.isFile ? $parent.path : $data.path
            handleMkdir($path, (data) => {
              updateTree(data, false)
            })
          }
          break
        case 'note_add':
          {
            const $parent = node.parent.data as IFileItemConfig
            const $path = $data.isFile ? $parent.path : $data.path
            handleCreate($path, (data) => {
              updateTree(data, false)
            })
          }
          break
        case 'extension':
          gb.extension = !gb.extension
          fs.activeResource = $data
          break
        case 'file_copy':
          fs.activeResource = $data
          fs.copy().then(updateTree)
          break
      }
      releaseMask()
    }
  }
  return {
    contextmenu,
    valve,
    switchPopover,
    judgeTop,
    releaseMask,
    resolveResource
  }
}
