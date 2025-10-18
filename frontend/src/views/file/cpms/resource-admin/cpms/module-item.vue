<template>
  <div
    @click="$emit('resource-click', item)"
    :class="[
      'module-item',
      $filter.matchActivePath(item, fs.activeResource, fs.actives) && 'active'
    ]"
  >
    <div class="resource-detail" :title="item.name">
      <img
        v-if="$filter.isImageType(item.filetype)"
        :src="$filter.resolveImagePath(item.path)"
        class="preview"
      />
      <MaterialIcon
        v-else
        :class="[
          'icon',
          item.isFile ? 'description' : 'folder',
          $filter.matchActivePath(item, fs.activeResource, fs.actives) &&
            'icon_active'
        ]"
        :name="item.isFile ? $filter.allocationIcon(item.extension) : 'folder'"
      />
      <div class="name">{{ item.name }}</div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import MaterialIcon from '@/components/material-icon'
  import { useFileStore } from '@/store/file'
  import props from '../props/module-item.props'

  export default defineComponent({
    props,
    emits: ['resource-click'],
    setup() {
      const fs = useFileStore()
      return { fs }
    },
    components: { MaterialIcon }
  })
</script>

<style lang="less" scoped>
  .module-item {
    transition: all 0.15s ease;
    box-sizing: border-box;
    margin: 10px 0;
    padding: 10px 8px;
    // width: 100px;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 0px 2px;
    border-radius: 3px;
    background-color: #fff;
    cursor: pointer;
    &:hover {
      box-shadow: rgba(0, 0, 0, 0.4) -2px 2px 6px;
    }
    .resource-detail {
      .preview {
        width: 60px;
        height: 60px;
        object-fit: contain;
      }
      color: @message-color;
      &:nth-child(n + 1) {
        font-size: 15px;
      }
      .icon {
        color: @shallow-active-color;
        font-size: 60px;
        cursor: pointer !important;
      }
      .description {
        color: #6f6f6f;
      }
      display: flex;
      align-items: center;
      flex-direction: column;
      .name {
        margin-top: 10px;
        width: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 15px;
        font-weight: 600;
        text-align: center;
        word-wrap: break-word;
      }
    }
  }
  .active {
    color: #fff;
    background-color: @primary-active-color;
    .resource-detail {
      color: #fff;
    }
  }
</style>
