<template>
  <div class="breadcrumb">
    <div style="overflow-x: autol" ref="breadcrumbRef">
      <el-breadcrumb
        v-if="trail.length"
        class="breadcrumb__main"
        :separator-icon="ArrowRight"
      >
        <template v-if="gbStore.path === '.' || gbStore.path === ''">
          <MaterialItem @click="captureRoute('.')" name="home" />
        </template>
        <template v-else-if="!hidden">
          <el-breadcrumb-item
            ><MaterialItem @click="captureRoute('.')" name="home"
          /></el-breadcrumb-item>
          <el-breadcrumb-item
            v-for="(t, index) in trail"
            :key="`${t}-${index}`"
            :class="[index === trail.length - 1 && 'hightlight', 'item']"
            @click="handleItem(index)"
            >{{ t }}</el-breadcrumb-item
          >
        </template>
        <el-breadcrumb-item class="hightlight" v-else>{{
          trail[trail.length - 1]
        }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="operate" ref="operateRef">
      <FileActions />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { ArrowRight } from '@element-plus/icons-vue'
  import breadcrumbHooks from '../hooks/breadcrumb.hooks'
  import FileActions from './file-actions.vue'
  import MaterialItem from '@/components/material-item'

  export default defineComponent({
    setup() {
      return { ArrowRight, ...breadcrumbHooks() }
    },
    components: { FileActions, MaterialItem }
  })
</script>

<style lang="less" scoped>
  .breadcrumb {
    height: 48px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    background-color: #fff;
    justify-content: space-between;
    padding: 0 20px;
    flex-wrap: nowrap;
    .breadcrumb__main {
      font-size: 15px;
      display: flex;
      align-items: center;
      white-space: nowrap;
    }
  }
  .item {
    cursor: pointer;
  }
  :deep(.hightlight > .el-breadcrumb__inner, .hightlight
      > .el-breadcrumb__inner:hover) {
    font-weight: 600 !important;
  }
</style>
