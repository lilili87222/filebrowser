<template>
  <el-dialog
    :model-value="valve"
    v-bind="config"
    destroy-on-close
    center
    align-center
    :before-close="handleClose"
  >
    <slot></slot>
  </el-dialog>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import props from './props'

  export default defineComponent({
    props,
    emits: ['dialog-close'],
    setup(prop, { emit }) {
      const handleClose = (done: any) => {
        emit('dialog-close')
        done()
      }
      return { handleClose }
    }
  })
</script>
