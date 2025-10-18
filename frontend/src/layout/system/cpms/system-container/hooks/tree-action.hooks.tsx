import { IFileItemConfig } from '@/store/file/type'
import EmitMessageBox from '@/tools/element-plus/message-box'
import EmitMessage from '@/tools/element-plus/message'
import { useFileStore } from '@/store/file'
import { useGlobalStore } from '@/store'
import { resolveDir } from '@/utils/operation'
export type INormalExec = (data: any) => void

export default function () {
  const gb = useGlobalStore()
  const { mkdir, create, rename, createArticle } = useFileStore()
  const handleResourceName = () => {
    const res = gb.path.split('/')
    return res[res.length - 1]
  }
  const handleRemove = (data: IFileItemConfig, success: INormalExec) => {
    EmitMessageBox.confirm(
      `确定删除 ${data?.name ?? handleResourceName()} ${
        data?.isFile ? '文件' : '文件夹'
      }?`,
      '删 除',
      {
        autofocus: false
      }
    )
      .then((res) => {
        if (res) success(res)
      })
      .catch(() => ({}))
  }
  const handleMkdir = (
    path: string | undefined,
    success: (data: any) => void
  ) => {
    if (!path) path = gb.path
    EmitMessageBox.prompt('', `在 ${resolveDir(path)} 中新建文件夹`, {
      beforeClose(action, instance, done) {
        if (action === 'confirm') {
          if (instance.inputValue.trim()) {
            mkdir({ path: path as string, name: instance.inputValue })
              .then((res) => {
                if (res) {
                  success(res)
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

  const handleCreate = (
    path: string | undefined,
    success?: (...args: any[]) => void
  ) => {
    if (!path) path = gb.path
    EmitMessageBox.prompt('', `在 ${resolveDir(path)} 中新建文件`, {
      beforeClose(action, instance, done) {
        if (action === 'confirm') {
          if (instance.inputValue.trim()) {
            create({ path: path as string, name: instance.inputValue })
              .then((res) => {
                if (res) {
                  success && success(res)
                }
              })
              .finally(done)
          } else EmitMessage.error('文件名称不能为空字符串!')
        } else {
          done()
        }
      }
    }).catch(() => ({}))
  }
  const handleCreateMd = (
    data: IFileItemConfig,
    success?: (...args: any[]) => void
  ) => {
    EmitMessageBox.prompt('', `在 ${resolveDir(gb.path)} 中新建文章`, {
      beforeClose(action, instance, done) {
        if (action === 'confirm') {
          if (instance.inputValue.trim()) {
            createArticle({ path: gb.path, name: instance.inputValue })
              .then((res) => {
                if (res) {
                  success && success(res)
                }
              })
              .finally(done)
          } else EmitMessage.error('文章名称不能为空字符串!')
        } else {
          done()
        }
      }
    }).catch(() => ({}))
  }
  // rename
  const renameResource = (
    data: IFileItemConfig,
    success?: (...args: any[]) => void
  ) => {
    // 如果还是不行,说明当前操作为搜索之后,没有选择的操作
    const rawName = data?.name ?? handleResourceName()
    EmitMessageBox.prompt(rawName, '重命名', {
      beforeClose(action, instance, done) {
        if (action === 'confirm') {
          if (instance.inputValue.trim()) {
            if (rawName === instance.inputValue) {
              done()
            } else {
              rename({ path: data?.path ?? gb.path, name: instance.inputValue })
                .then((res) => {
                  if (res) {
                    success && success(res, instance.inputValue.trim())
                  }
                })
                .finally(done)
            }
          } else EmitMessage.error('资源名称不能为空字符串!')
        } else {
          done()
        }
      }
    }).catch(() => ({}))
  }
  return {
    handleRemove,
    handleMkdir,
    handleCreate,
    renameResource,
    handleCreateMd
  }
}
