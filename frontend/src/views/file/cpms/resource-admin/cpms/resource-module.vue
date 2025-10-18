<template>
  <div class="resource-module">
    <el-row
      v-if="folders.length || files.length"
      class="resource-module__container"
      align="middle"
    >
      <el-col :span="24">
        <ModuleSnippet name="文件夹" :lists="folders" />
        <ModuleSnippet name="文件" :lists="files" />
      </el-col>
    </el-row>
    <template v-else>
      <div class="resource-admin__empty">{{ tip }}</div>
    </template>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import ModuleSnippet from './module-snippet.vue'
  import resourceModuleHooks from '../hooks/resource-module.hooks'

  export default defineComponent({
    setup() {
      return { ...resourceModuleHooks() }
    },
    components: { ModuleSnippet }
  })
</script>

<style lang="less" scoped>
  .resource-module {
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
    position: relative;
    .resource-module__container {
      box-sizing: border-box;
      overflow-x: hidden;
    }
  }
</style>
