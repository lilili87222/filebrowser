import { IMaterialItem } from '@/components/material-item/types'
import { useGlobalStore } from '@/store'
import { IFileItemConfig } from '@/store/file/type'
import { ITreeProvide } from '@/types/provide'
import { inject, ref } from 'vue'
import treeActionHooks from './tree-action.hooks'
import { fileActions } from '../config/file-actions.config'
import { IOperateType } from '../types/file-actions.type'
import useSave from '@/hooks/useSave'
import useUpdateTree from '@/hooks/useUpdateTree'

export default function () {
  const { fs, replaceContent } = useSave()
  const gb = useGlobalStore()
  const sensors = ref(fileActions)

  //#region 文件系统操作
  const treeInstance = inject('treeInstance') as ITreeProvide
  const { updateTree } = useUpdateTree()
  const { renameResource, handleRemove, handleMkdir, handleCreate } =
    treeActionHooks()

  // 文件夹操作中转站
  const captureSensor = (sensor: IMaterialItem<IOperateType>) => {
    if (!sensor.allow) return
    const $key = fs.activeResource?.path ?? gb.path
    // 获取节点
    const $data =
      (treeInstance.getNode($key)?.data as IFileItemConfig) ?? fs.activeResource
    switch (sensor.name) {
      case 'border_color':
        return renameResource($data, (data) => {
          updateTree(data, fs.searchValue === '')
          if (fs.searchValue !== '') {
            fs.activeResource = null
            fs.search()
          }
        })
      case 'delete_forever':
        return handleRemove($data as IFileItemConfig, () => {
          fs.deleteFile({
            path: $data.path
          }).then((res) => {
            if (res) updateTree(res, fs.searchValue === '')
            if (fs.searchValue !== '') {
              fs.activeResource = null
              fs.search()
            }
          })
        })
      case 'create_new_folder':
        return handleMkdir(undefined, updateTree)
      case 'note_add':
        return handleCreate(undefined, updateTree)
      case 'extension':
        gb.extension = !gb.extension
        return
      case 'file_copy':
        fs.copy().then(updateTree)
        return
    }
  }
  const captureSave = (state: boolean) => {
    if (state) return replaceContent()
  }
  const handlePreview = () => {
    const p = captureSave(fs.save)
    if (p) {
      p.then(fs.preview)
    } else fs.preview()
  }
  //#endregion
  return { fs, gb, sensors, captureSensor, captureSave, handlePreview }
}
