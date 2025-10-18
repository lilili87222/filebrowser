<template>
  <div
    :class="['operate-group__item', !allow && 'operate-item__none_allow']"
    :title="title"
  >
    <slot>
      <span
        :class="['material-symbols-outlined', !allow && 'icon__none-allow']"
      >
        {{ name }}
      </span>
    </slot>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import props from '../props'

  export default defineComponent({
    props
  })
</script>

<style lang="less" scoped>
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
      cursor: pointer;
    }
  }
  .operate-item__none_allow:hover {
    cursor: not-allowed;
  }
</style>
