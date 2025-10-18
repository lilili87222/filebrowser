import { ITreeProvide } from '@/types/provide'
import { provide, ref } from 'vue'
import ISystemTreeInstance from '../cpms/system-tree/type/system-tree.type'

export default function () {
  const tree = ref<ISystemTreeInstance>()
  provide('treeInstance', {
    getNode: (data) => tree.value?.treeRef.getNode(data),
    remove: (data) => tree.value?.treeRef.remove(data),
    updateKeyChildren: (key, data) =>
      tree.value?.treeRef.updateKeyChildren(key, data)
  } as ITreeProvide)
  return { tree }
}
