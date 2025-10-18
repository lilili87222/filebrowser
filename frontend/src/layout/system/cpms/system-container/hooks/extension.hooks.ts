import { inject } from 'vue'
import { useFileStore } from '@/store/file'
import EmitMessageBox from '@/tools/element-plus/message-box'
import { ITreeProvide } from '@/types/provide'
import { resolveDir } from '@/utils/operation'
import useUpdateTree from '@/hooks/useUpdateTree'
import EmitMessage from '@/tools/element-plus/message'
import { useGlobalStore } from '@/store'
import { IMaterialItem } from '@/components/material-item/types'
import { IFileItemConfig } from '@/store/file/type'
import treeActionHooks from './tree-action.hooks'

export default function () {
  const fs = useFileStore()
  const gb = useGlobalStore()
  const treeInstance = inject('treeInstance') as ITreeProvide
  const { updateTree } = useUpdateTree()
  const { handleCreateMd } = treeActionHooks()

  const folderGenerate = () => {
    let msg = ''
    if (fs.activeResource) {
      if (fs.activeResource.isFile) {
        msg = '文件所在目录'
      } else msg = resolveDir(fs.activeResource.path)
    } else msg = resolveDir(gb.path)
    EmitMessageBox.prompt('', `对 ${msg} 初始化站点`, {
      beforeClose(action, instance, done) {
        if (action === 'confirm') {
          const path = fs.activeResource?.path ?? gb.path
          if (instance.inputValue.trim()) {
            fs.createSite({
              path,
              site_name: instance.inputValue.trim()
            })
              .then((res) => {
                if (res) {
                  updateTree(res)
                  gb.extension = false
                }
              })
              .finally(done)
          } else EmitMessage.error('文件夹名称不能为空字符串!')
        } else {
          done()
        }
      }
    }).catch(() => ({}))
  }
  // 文件夹构建
  const folderBuild = () =>
    fs.buildSite().then(() => {
      gb.extension = false
    })
  // const handleClose
  const captureSensor = (
    sensor: IMaterialItem<'edit_document' | 'change_circle' | 'construction'>
  ) => {
    if (!sensor.allow) return
    const $key = fs.activeResource?.path ?? gb.path
    // 获取节点
    const $data = treeInstance.getNode($key)?.data as IFileItemConfig
    if (!$data) return EmitMessage.error('找不到资源,请重试!')
    else
      switch (sensor.name) {
        case 'change_circle':
          return folderGenerate()
        case 'construction':
          return folderBuild()
        case 'edit_document':
          return handleCreateMd($data, (data) => {
            updateTree(data)
            gb.extension = false
          })
      }
  }
  const beforeClose = (done: any) => {
    done()
    gb.extension = false
  }
  return { gb, captureSensor, beforeClose }
}
