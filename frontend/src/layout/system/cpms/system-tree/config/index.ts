import { TREE_ROOT_NAME } from '@/constants'
import { IFileItemConfig } from '@/store/file/type'

export const props = {
  label: 'name',
  children: 'items',
  isLeaf: 'isFile'
}

export const file: IFileItemConfig[] = [
  {
    name: TREE_ROOT_NAME,
    extension: '',
    isFile: false,
    modified: '',
    items: [],
    path: '.',
    size: 0,
    filetype: ''
  }
]

export const treeConfig = {
  props,
  'node-key': 'path',
  lazy: true,
  draggable: true
}
