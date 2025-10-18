import type Node from 'element-plus/es/components/tree/src/model/node'
import { IFileItemConfig } from '@/store/file/type'
import { ElTree } from 'element-plus'

export type TActionType = 'rename' | 'remove' | 'mkdir'

export interface ITreeProp {
  data: IFileItemConfig | undefined
  treeRef: InstanceType<typeof ElTree> | undefined
  node: Node | undefined
}

export default interface ISystemTreeInstance {
  treeRef: InstanceType<typeof ElTree>
}
