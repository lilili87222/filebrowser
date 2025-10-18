<template>
  <div class="operate-group">
    <template v-for="o in opConfig" :key="o.name">
      <MaterialItem
        :title="o.title"
        :name="o.name === 'view_module' ? gbStore.viewMode : o.name"
        :allow="o.allow"
        @click="actionSensor(o)"
      />
    </template>
  </div>
  <OperateDialog
    @dialog-close="switchDialog(false)"
    :config="config"
    :valve="valve"
  >
    <OperateUpload @close-upload="switchDialog(false)" />
  </OperateDialog>
  <div :class="['multiple-mode', gbStore.multipleMode && 'active']">
    <div class="title">已开启多选模式</div>
    <MaterialItem
      class="close"
      @click="gbStore.multipleMode = false"
      name="close"
      title="关闭多选模式"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import MaterialItem from '@/components/material-item'
  import operateGroupHooks from './hooks'
  import OperateDialog from '../operate-dialog/OperateDialog.vue'
  import OperateUpload from '../operate-upload/OperateUpload.vue'

  export default defineComponent({
    setup() {
      return { ...operateGroupHooks() }
    },
    components: { MaterialItem, OperateDialog, OperateUpload }
  })
</script>

<style lang="less" scoped>
  .operate-group {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .operate-group__item {
      height: 43px;
      width: 43px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      border-radius: 50%;
      transition: all 0.25s;
      &:hover {
        background-color: @primary-hover-color;
      }
      .normal {
        color: #ccc;
        cursor: default;
      }
    }
  }
  .multiple-mode {
    position: fixed;
    bottom: -65px;
    left: 0;
    right: 0;
    height: 65px;
    background-color: @shallow-active-color;
    z-index: 9;
    box-sizing: border-box;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.25s ease;
    color: #fff;
    .close:hover {
      background-color: @deep-active-color;
    }
  }
  .active {
    bottom: 0px;
  }
</style>
