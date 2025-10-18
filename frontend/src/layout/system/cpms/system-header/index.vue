<template>
  <div class="system-header">
    <div class="logo">
      <img draggable="false" src="@/assets/imgs/logo.png" alt="FileBrowser" />
      <el-input
        size="large"
        class="search"
        :placeholder="tip"
        :suffix-icon="Search"
        v-model="fs.searchValue"
        :disabled="!($route.path === '/file')"
        @keyup.enter="handleEnterKey"
      />
    </div>
    <OperateGroup />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import OperateGroup from './cpms/operate-group/OperateGroup.vue'
  import hooks from './hooks'

  export default defineComponent({
    setup() {
      return { Search, ...hooks() }
    },
    components: { OperateGroup }
  })
</script>

<style lang="less" scoped>
  .system-header {
    width: 100%;
    height: 100%;
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.5);
    box-sizing: border-box;
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: 8px 10px;
    .logo {
      height: 100%;
      min-width: 360px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      border-bottom: 1px solid white;
      img {
        // position: relative;
        height: 100%;
        width: 100%;
        object-fit: contain;
        user-select: none;
        vertical-align: bottom;
      }
    }
    .search {
      min-width: 250px;
    }
  }
</style>
