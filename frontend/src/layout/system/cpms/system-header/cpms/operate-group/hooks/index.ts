import { inject, ref, watch } from 'vue'
import { useFileStore } from '@/store/file'
import { operates } from '../config/operate-group'
import { uploadConfig } from '../../operate-upload/config'
import { useGlobalStore } from '@/store'
import EmitMessage from '@/tools/element-plus/message'
import useCache from '@/hooks/useCache'
import { IMaterialItem } from '@/components/material-item/types'
import { IOperateType } from '../types/operate-group.type'
import { IFileItemConfig } from '@/store/file/type'
import { useRoute, useRouter } from 'vue-router'
import EmitMessageBox from '@/tools/element-plus/message-box'
import { ITreeProvide } from '@/types/provide'
import { useUserStore } from '@/store/user'

export default function () {
  const router = useRouter()
  const route = useRoute()
  const gbStore = useGlobalStore()
  const userStore = useUserStore()
  const fs = useFileStore()
  const opConfig = ref(operates)
  const config = ref()
  const { changeViewMethod } = useCache()
  const actionSensor = (op: IMaterialItem<IOperateType>) => {
    if (!op.allow) return
    switch (op.name) {
      case 'file_upload':
        if (op.allow) {
          config.value = uploadConfig
          switchDialog(true)
        }
        break
      case 'view_module':
        changeViewMethod(
          gbStore.viewMode == 'view_module' ? 'view_list' : 'view_module'
        )
        break
      case 'file_download':
        op.allow && download()
        break
      case 'check_circle':
        // 清除单选,开启多选
        gbStore.multipleMode = !gbStore.multipleMode
        if (gbStore.multipleMode) {
          if (fs.activeResource) {
            fs.actives.push(fs.activeResource)
            fs.activeResource = null
          } else fs.actives = []
        }
        break
      case 'logout':
        logout()
        break
      case 'folder_managed':
        fileUnzip()
        break
    }
  }
  const valve = ref(false)
  const switchDialog = (state: boolean) => (valve.value = state)

  watch(
    () =>
      [fs.activeResource, fs.actives] as [IFileItemConfig, IFileItemConfig[]],
    ([ar, as]) => {
      opConfig.value.file_download.allow = Boolean(ar || as.length)
      opConfig.value.folder_managed.allow = ar?.isFile ?? false
    },
    { deep: true }
  )
  watch(
    () => route.path,
    (v) => {
      if (v && v == '/file') {
        opConfig.value.file_upload.allow = true
        opConfig.value.check_circle.allow = true
        opConfig.value.view_module.allow = true
        opConfig.value.logout.allow = true
      } else {
        allowResource(false)
      }
    }
  )
  const allowResource = (state: boolean) => {
    const keys = Object.keys(opConfig.value) as IOperateType[]
    for (const key of keys) opConfig.value[key].allow = state
  }
  const download = () => {
    let $path = null
    if (fs.actives.length) $path = fs.actives.map((i) => i.path)
    else if (fs.activeResource) $path = [fs.activeResource.path]
    if ($path == undefined) return EmitMessage.error('文件资源路径无效')
    else fs.download($path)
  }
  const logout = () => {
    userStore.logout().then((res) => {
      if (res) {
        gbStore.reset()
        router.replace('/login')
      }
    })
  }
  const treeInstance = inject('treeInstance') as ITreeProvide
  const fileUnzip = () => {
    if (!fs.activeResource) return EmitMessage.error('请选择一个压缩文件!')
    const path = fs.activeResource.path
    const gbPath = gbStore.path
    EmitMessageBox.confirm(
      `${fs.activeResource?.name} 将会解压缩到当前文件夹中,是否继续?`,
      '资源解压缩',
      {}
    )
      .then(() => {
        fs.unzip({ path }).then((res) => {
          if (res) {
            treeInstance.updateKeyChildren(gbPath, res.items ?? [])
            fs.resources = res.items
          }
        })
      })
      .catch(() => ({}))
  }
  return {
    opConfig,
    gbStore,
    fs,
    actionSensor,
    valve,
    switchDialog,
    config
  }
}
