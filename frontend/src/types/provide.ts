import {
  TreeData,
  TreeKey,
  TreeNodeData
} from 'element-plus/es/components/tree/src/tree.type'
import Node from 'element-plus/es/components/tree/src/model/node'

export interface ITreeProvide {
  getNode: (data: TreeKey | TreeNodeData) => Node | undefined
  remove: (data: Node) => void
  updateKeyChildren: (key: TreeKey, data: TreeData) => any
}
