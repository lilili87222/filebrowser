import { IMaterialItem } from '@/components/material-item/types'

export type IOperateType =
  | 'create_new_folder'
  | 'note_add'
  // | 'edit_document'
  | 'delete_forever'
  | 'border_color'
  | 'file_copy'
  // | 'change_circle'
  // | 'construction'
  | 'extension'

export type TFileAction = {
  [name in IOperateType]: IMaterialItem<IOperateType>
}
