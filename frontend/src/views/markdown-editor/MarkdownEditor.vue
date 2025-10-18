<template>
  <div :id="isFull ? 'markdown-iframe__full' : 'markdown-iframe'">
    <iframe id="markdown-iframe__content" :src="url + '?fmt=editor'" />
  </div>
</template>

<script lang="ts">
  import { MARKDOWN_EDITOR_ID } from '@/constants'
  import { defineComponent } from 'vue'
  import iframe from './hooks/iframe'

  export default defineComponent({
    setup() {
      return { MARKDOWN_EDITOR_ID, ...iframe() }
    }
  })
</script>

<style lang="less" scoped>
  #markdown-iframe {
    position: absolute;
    height: 100%;
    width: 100%;
  }
  #markdown-iframe__full {
    position: fixed;
    height: 100%;
    inset: 0;
  }
  #markdown-iframe__content {
    height: 100%;
    width: 100%;
    border: none;
    > html {
      height: 100%;
    }
  }
</style>
