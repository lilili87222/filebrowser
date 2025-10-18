<template>
  <div @keydown.stop="handleSave" :id="TEXT_EDITOR_ID" />
</template>

<script lang="ts">
  import { TEXT_EDITOR_ID } from '@/constants'
  import { defineComponent } from 'vue'
  import hooks from './hooks'

  export default defineComponent({
    setup() {
      return { TEXT_EDITOR_ID, ...hooks() }
    }
  })
</script>

<style scoped>
  #text-editor {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 1px;
    right: 0;
    top: 2px;
    bottom: 0;
  }
</style>
