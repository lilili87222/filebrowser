<template>
  <el-table
    :height="height"
    :data="data"
    v-bind="config"
    class="_base_ui_table"
  >
    <el-table-column
      v-for="col in columns"
      :label="col.config['i18-label']"
      :key="col.config.prop"
      v-bind="col.config"
    >
      <template v-if="col.slot" #default="scope">
        <slot :name="col.slot" :row="scope.row" :config="col"></slot>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import props from '../props'
  export default defineComponent({
    props
  })
</script>

<style lang="less" scoped>
  ._base_ui_table {
    width: 100%;
    overflow-x: auto;
    height: 100%;
  }
</style>
