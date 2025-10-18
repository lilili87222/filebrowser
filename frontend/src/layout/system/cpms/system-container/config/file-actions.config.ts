import { TFileAction } from '../types/file-actions.type'

export const fileActions: TFileAction = {
  create_new_folder: {
    allow: true,
    name: 'create_new_folder',
    title: '新建文件夹'
  },
  note_add: {
    allow: true,
    name: 'note_add',
    title: '新建文件'
  },
  border_color: {
    allow: true,
    name: 'border_color',
    title: '重命名'
  },
  file_copy: {
    allow: true,
    name: 'file_copy',
    title: '复制'
  },
  delete_forever: {
    allow: true,
    name: 'delete_forever',
    title: '删除资源'
  },
  extension: {
    allow: true,
    name: 'extension',
    title: '插件拓展'
  }
}
