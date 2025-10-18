import { useFileStore } from '@/store/file'
import { IFileItemConfig } from '@/store/file/type'
import { reactive, ref } from 'vue'
import { file, props } from '../config'
import { ElTree } from 'element-plus'
import {
  AllowDropType,
  NodeDropType
} from 'element-plus/es/components/tree/src/tree.type'
import Node from 'element-plus/es/components/tree/src/model/node'
import { useGlobalStore } from '@/store'
import { useRoute, useRouter } from 'vue-router'
import EmitMessageBox from '@/tools/element-plus/message-box'
import useSave from '@/hooks/useSave'
import useUpdateTree from '@/hooks/useUpdateTree'
import EmitMessage from '@/tools/element-plus/message'
import { IContextmenu } from '../type/contextmenu.type'

export default function () {
  //#region tree-view
  const fileStore = useFileStore()
  const router = useRouter()
  const route = useRoute()
  const treeRef = ref<InstanceType<typeof ElTree>>()
  const gbStore = useGlobalStore()
  const loadData = (resolve: (data: IFileItemConfig[]) => void, path = '') => {
    if (path === '') resolve(file)
    else {
      fileStore.getFileList({ path }).then((res) => {
        resolve(res?.items ?? [])
        if (route.path !== '/file' && !fileStore.save) router.push('/file')
      })
    }
  }
  const loadNode = (node: Node, resolve: (data: IFileItemConfig[]) => void) => {
    if (node.level === 0) loadData(resolve)
    else loadData(resolve, node.data.path)
  }
  const data = ref(file)
  // 是否允许拖拽
  const allowDrag = (target: Node) => target.data?.path !== '.'
  const allowDrop = (
    draggingNode: Node,
    dropNode: Node,
    type: AllowDropType
  ) => {
    if (dropNode.data?.isFile) {
      return type !== 'inner'
    } else if (dropNode.data?.path === '.') {
      return type === 'inner'
    } else return true
  }
  // 资源获取以及路由跳转等功能
  const { saveDecision } = useSave()
  const captureNode = async (data: IFileItemConfig, node: Node) => {
    const loadNode = () => {
      const resolveResource = async () => {
        if (data.isFile) {
          if (/.md/i.test(data.extension)) {
            if (!fileStore.save) {
              fileStore.content = ''
              fileStore.save = false
              fileStore.path = data.path
              gbStore.path = data.path
              router.push('/markdown-edit')
            }
            router.push('/markdown-edit')
          } else {
            ;(await fileStore.read({ path: data.path })) as any
            router.push('/text-edit')
          }
        }
      }
      if (data.filetype.includes('image')) {
        fileStore.readImage(data.path)
      } else {
        // 文件 && 有修改内容
        if (data.isFile) saveDecision(resolveResource)
        else if (!data.isFile && !fileStore.save) {
          // 文件夹 && 没有修改内容
          const $childs = node.childNodes?.map((n) => n.data) ?? []
          fileStore.resources = $childs as IFileItemConfig[]
          gbStore.path = data.path
          route.path !== '/file' && router.push('/file')
        }
      }
    }
    if (node.loaded) {
      fileStore.getFileList({ path: data.path }).then((res) => {
        if (res) {
          updateTree(res, !fileStore.save)
          loadNode()
        }
      })
    } else loadNode()
  }
  const { updateTree } = useUpdateTree()
  // 移动文件/文件夹成功后的回调
  const handleNodeDrop = (
    draggingNode: Node,
    dropNode: Node,
    dropType: NodeDropType
  ) => {
    let path = dropNode.data?.path
    if (dropType === 'before' || dropType === 'after') {
      path = dropNode.parent?.data?.path
    }
    // 撤回操作
    const back = () => {
      const $data = { ...draggingNode.data }
      const $target = (draggingNode.key as string).match(/.*\//)
      const $root = $target ? $target[0].slice(0, -1) : ''
      const rootData = treeRef.value?.getNode($root)
      treeRef.value?.remove(draggingNode.data)
      rootData && treeRef.value?.append($data, rootData)
    }
    if (fileStore.save) {
      EmitMessage.warning('请先保存文件内容!')
      back()
    } else {
      fileStore
        .move({
          path: draggingNode.data.path,
          dest: path
        })
        .then((res) => {
          if (!res) back()
          else {
            if (res.flag) {
              EmitMessageBox.confirm(
                '检测到存在资源命名冲突问题',
                '资源命名冲突警告',
                {
                  cancelButtonText: '重命名',
                  confirmButtonText: '替换',
                  beforeClose(action, instance, done) {
                    if (action === 'close') {
                      back()
                      done()
                    } else if (action === 'cancel') {
                      fileStore.conflict(res, '/rename').then((res1) => {
                        updateTree(res1 as IFileItemConfig)
                        done()
                      })
                    } else {
                      fileStore.conflict(res, '/replace').then((res1) => {
                        updateTree(res1 as IFileItemConfig)
                        done()
                      })
                    }
                  }
                }
              ).catch(() => ({}))
            } else updateTree(res)
          }
        })
        .catch(back)
    }
  }
  const position = reactive({
    left: 0,
    top: 0
  })
  const menuNode = ref<Node>()
  const contextMenu = ref<IContextmenu>()
  const main = ref<HTMLElement>()
  // 右键 tree 项
  const captureMenu = (e: PointerEvent, data: IFileItemConfig, node: Node) => {
    position.left = e.clientX
    position.top = e.clientY
    menuNode.value = node
    contextMenu.value?.switchPopover(true)
  }
  //#endregion
  return {
    props,
    data,
    loadNode,
    treeRef,
    allowDrag,
    allowDrop,
    captureNode,
    handleNodeDrop,
    captureMenu,
    position,
    menuNode,
    contextMenu,
    main
  }
}
