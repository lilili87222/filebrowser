<template>
  <div
    :style="`left:${left}px;top:${judgeTop(top ?? 0)}px`"
    v-if="valve"
    class="tree-menu"
    ref="contextmenu"
  >
    <ul>
      <li
        v-for="item in fileActions"
        :key="item.name"
        @click="resolveResource(item.name, node!)"
        class="context-menu__item"
      >
        <MaterialIcon :name="item.name" />
        {{ item.title }}
      </li>
    </ul>
  </div>
  <div
    class="tree-mask"
    @click.prevent="releaseMask"
    @contextmenu.prevent
    v-if="valve"
  ></div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import props from '../props/contextmenu.props'
  import contextmenuHooks from '../hooks/contextmenu.hooks'
  import { fileActions } from '../../system-container/config/file-actions.config'
  import MaterialIcon from '@/components/material-icon'

  export default defineComponent({
    props,
    setup() {
      return { fileActions, ...contextmenuHooks() }
    },
    components: { MaterialIcon }
  })
</script>

<style lang="less" scoped>
  .tree-mask {
    position: fixed;
    inset: 0;
    z-index: 9;
  }
  .tree-menu {
    position: fixed;
    z-index: 99;
    min-width: 150px;
    background-color: #fff;
    padding: 5px 0;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    ul {
      margin: 0;
      padding: 0;
    }
    ul li {
      list-style: none;
      margin: 0;
      padding: 0 15px;
      font-size: 14px;
      line-height: 30px;
      cursor: pointer;
    }
    ul li:hover {
      background-color: #eee;
    }
    .context-menu__item {
      display: flex;
      align-items: center;
    }
  }
</style>
