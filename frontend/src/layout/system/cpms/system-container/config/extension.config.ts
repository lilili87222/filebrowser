import { IBaseUITableCloumn } from '@/base-ui/table/types'

export const columnsConfig: IBaseUITableCloumn[] = [
  {
    config: {
      'i18-label': '插件名称',
      prop: 'name',
      width: 200
    }
  },
  {
    config: {
      'i18-label': '操作',
      prop: 'actions',
      'min-width': 400
    },
    slot: 'Actions'
  }
]

export const data = [
  {
    name: 'Hugo',
    actions: {
      edit_document: {
        allow: true,
        name: 'edit_document',
        title: '新建文章'
      },
      change_circle: {
        allow: true,
        name: 'change_circle',
        title: '新建站点'
      },
      construction: {
        allow: true,
        name: 'construction',
        title: '生成'
      }
    }
  }
]
