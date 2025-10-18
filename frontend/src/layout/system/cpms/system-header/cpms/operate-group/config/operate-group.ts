import { TOperates } from '../types/operate-group.type'

export const operates: TOperates = {
  view_module: {
    // view_list
    name: 'view_module',
    title: '切换显示模式',
    allow: true
  },
  file_download: {
    name: 'file_download',
    title: '下载',
    allow: false
  },
  file_upload: {
    name: 'file_upload',
    title: '上传',
    allow: true
  },
  folder_managed: {
    name: 'folder_managed',
    title: '解压缩',
    allow: false
  },
  check_circle: {
    name: 'check_circle',
    title: '多选',
    allow: true
  },
  logout: {
    name: 'logout',
    title: '退出登录',
    allow: true
  }
}
