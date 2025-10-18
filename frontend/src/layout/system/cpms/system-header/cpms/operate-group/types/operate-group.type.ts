import { IMaterialItem } from '@/components/material-item/types'

export type IOperateType =
  | 'view_module'
  | 'file_download'
  | 'file_upload'
  | 'folder_managed'
  | 'check_circle'
  | 'logout'

export type TOperates = {
  [name in IOperateType]: IMaterialItem<IOperateType>
}
