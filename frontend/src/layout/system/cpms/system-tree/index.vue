<template>
  <div ref="main" class="tree">
    <el-tree
      :load="loadNode"
      ref="treeRef"
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      v-bind="treeConfig"
      @node-drop="handleNodeDrop"
      @node-click="captureNode"
      @node-contextmenu="captureMenu"
      :default-expanded-keys="['.']"
    >
      <template #default="{ node, data }">
        <div class="custom-node">
          <div class="desc">
            <MaterialIcon v-if="!data.isFile" name="folder" />
            <span class="label">{{ node.label }}</span>
          </div>
        </div>
      </template>
    </el-tree>
    <TreeContextmenu
      ref="contextMenu"
      :left="position.left"
      :top="position.top"
      :node="menuNode"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import MaterialIcon from '@/components/material-icon'
  import { treeConfig } from './config'
  import hooks from './hooks'
  import TreeContextmenu from './cpms/tree-contextmenu.vue'
  export default defineComponent({
    setup() {
      return { treeConfig, ...hooks() }
    },
    components: { MaterialIcon, TreeContextmenu }
  })
</script>

<style lang="less" scoped>
  .tree {
    border-right: 1px solid #eee;
  }
  .custom-node {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .desc {
    flex: 1;
    display: flex;
    .label {
      display: flex;
      align-items: center;
      flex: 1;
      text-overflow: ellipsis;
      overflow: hidden;
      display: inline-block;
    }
  }
</style>
