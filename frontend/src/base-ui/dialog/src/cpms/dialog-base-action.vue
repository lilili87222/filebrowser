<template>
  <div>
    <el-button @click="$emit('on-cancel')" class="_btn" type="info">
      <pre><el-icon class="_btn_icon"><CloseBold /></el-icon> {{ actionsConfig['cancel-button-text']?? '取 消' }}</pre>
    </el-button>
    <el-button @click="$emit('on-confirm')" class="_btn" type="primary">
      <pre><el-icon class="_btn_icon"><Select /></el-icon> {{ actionsConfig['confirm-button-text']?? '确 认' }}</pre>
    </el-button>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import props from '../../props/dialog-base-action.props'

  export default defineComponent({
    emit: ['on-cancel', 'on-confirm'],
    props,
    setup() {
      return {}
    }
  })
</script>

<style lang="less" scoped>
  ._btn {
    ._btn_icon {
      display: inline-block;
    }
  }
</style>
