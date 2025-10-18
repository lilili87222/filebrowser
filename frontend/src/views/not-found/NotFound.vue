<template>
  <el-empty class="empty" description="Page Not Found">
    <el-button @click="$router.replace('/file')" type="primary"
      >返回首页</el-button
    >
  </el-empty>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    setup() {
      return {}
    }
  })
</script>

<style lang="less" scoped>
  .empty {
    width: 100%;
    height: 100%;
  }
</style>
