<template>
  <el-image :src="url" :preview-src-list="previewSrcList" v-bind="config" />
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import props from '../props'

  export default defineComponent({
    props,
    setup() {
      return {}
    }
  })
</script>

<style scoped></style>
