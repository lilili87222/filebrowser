<template>
  <el-drawer
    v-model="gb.extension"
    :before-close="beforeClose"
    title="拓展功能"
    direction="rtl"
    size="600"
  >
    <PATable :columns="columnsConfig" :data="data">
      <template #Actions="{ row: { actions } }">
        <div class="actions">
          <el-button
            v-for="a in actions"
            :key="a.name"
            @click="captureSensor(a)"
          >
            <MaterialIcon :name="a.name" />
            {{ a.title }}</el-button
          >
        </div>
      </template>
    </PATable>
  </el-drawer>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import PATable from '@/base-ui/table'
  import MaterialIcon from '@/components/material-icon'
  import { columnsConfig, data } from '../config/extension.config'
  import props from '../props/extension.props'
  import extensionResize from '../hooks/extemsion-resize.hooks'
  import extensionHooks from '../hooks/extension.hooks'

  export default defineComponent({
    props,
    emits: ['close-drawer'],
    setup() {
      extensionResize()
      return { columnsConfig, data, ...extensionHooks() }
    },
    components: { PATable, MaterialIcon }
  })
</script>

<style scoped>
  .actions {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
  }
</style>
