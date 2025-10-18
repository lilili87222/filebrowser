<template>
  <el-dialog class="_dialog" :model-value="valve" v-bind="dialogConfig">
    <template #header>
      <div class="_dialog_header">
        <span class="_title">
          <el-icon class="_icon" v-if="dialogConfig?.icon"
            ><Component :is="dialogConfig?.icon"
          /></el-icon>
          {{ $t(dialogConfig?.title as string) }}</span
        >
        <el-icon
          @click="$emit('on-close')"
          class="_close"
          v-if="
            !dialogConfig?.['show-close'] &&
            !dialogConfig?.['hidden-custom-close']
          "
          ><Close
        /></el-icon>
      </div>
    </template>
    <slot name="default"></slot>
    <template #footer>
      <slot name="footer">
        <DialogBaseAction
          @on-cancel="$emit('on-cancel')"
          @on-confirm="$emit('on-confirm')"
          class="button-group"
        />
      </slot>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue'
  import props from '../props'
  import DialogBaseAction from './cpms/dialog-base-action.vue'

  export default defineComponent({
    emits: ['on-close', 'on-cancel', 'on-confirm'],
    props,
    setup(prop) {
      const valve = ref(prop.valve)
      watch(
        () => prop.valve,
        (v) => (valve.value = v)
      )
      return { valve }
    },
    components: { DialogBaseAction }
  })
</script>

<style lang="less" scoped>
  ._dialog {
    position: relative;
    ._dialog_header {
      position: relative;
      ._title {
        color: white;
        display: inline-flex;
        align-items: center;
      }
      ._close {
        display: inline-block;
        vertical-align: middle;
        position: absolute;
        right: -5px;
        bottom: -5px;
        padding: 5px;
        cursor: pointer;
        &:hover {
          color: #ed4014;
          transition: all 0.55s;
        }
      }
    }
  }
  ._icon {
    margin-right: 3px;
  }
  .button-group {
    display: flex;
    justify-content: center;
    box-sizing: border-box;
  }
</style>
