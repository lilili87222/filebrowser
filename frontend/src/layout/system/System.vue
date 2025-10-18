<template>
  <div class="system">
    <header class="header">
      <SystemHeader />
    </header>
    <div class="main custom-scrollbar">
      <SystemTree ref="tree" class="menu" />
      <SystemContainer class="container" />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import SystemContainer from './cpms/system-container'
  import SystemHeader from './cpms/system-header'
  import SystemTree from './cpms/system-tree'
  import hooks from './hooks'

  export default defineComponent({
    components: {
      SystemContainer,
      SystemHeader,
      SystemTree
    },
    setup() {
      return { ...hooks() }
    }
  })
</script>

<style lang="less" scoped>
  .system {
    width: inherit;
    height: inherit;
    position: relative;
    overflow: hidden;
    .header {
      height: 65px;
      position: relative;
    }
    .main {
      width: 100%;
      position: absolute;
      top: 66px;
      left: 0;
      bottom: 0;
      right: 0;
      overflow: hidden;
      .menu {
        overflow-x: auto;
        width: 300px;
        position: absolute;
        left: 0;
        bottom: 0;
        top: 0;
      }
      .container {
        position: absolute;
        left: 300px;
        right: 0;
        bottom: 0;
        top: 0;
      }
    }
  }
</style>
