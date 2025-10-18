<template>
  <div class="resource-lists">
    <el-row class="resource-lists__item header">
      <el-col :span="14"> 名称</el-col>
      <el-col :span="5" class="hidden-sm-and-down"> 大小</el-col>
      <el-col :span="5" class="hidden-xs-only"> 修改时间</el-col>
    </el-row>
    <div class="resource-lists__content">
      <template v-if="showValue?.length">
        <el-row
          v-for="l in showValue"
          :key="l.path"
          @click="handleCapture(l)"
          @dblclick="handleDbclick(l)"
          :class="[
            'resource-lists__item',
            'normal',
            $filter.matchActivePath(l, fs.activeResource, fs.actives) &&
              'active'
          ]"
        >
          <el-col :span="14">
            <div class="resource__name">
              <img
                v-if="$filter.isImageType(l.filetype)"
                :src="$filter.resolveImagePath(l.path)"
                class="preview"
              />
              <MertialIcon
                v-else
                :class="[
                  'name__icon',
                  $filter.matchActivePath(l, fs.activeResource, fs.actives) &&
                    'icon_active'
                ]"
                :name="
                  l.isFile ? $filter.allocationIcon(l.extension) : 'folder'
                "
              />
              <p>{{ l.name }}</p>
            </div>
          </el-col>
          <el-col :span="5" class="hidden-sm-and-down">
            {{ l.isFile ? $filter.handleFileSize(l.size) : '—' }}
          </el-col>
          <el-col :span="5" class="hidden-xs-only">
            {{ $filter.formatGivenTime(l.modified) }}
          </el-col>
        </el-row>
      </template>
      <template v-else>
        <div class="resource-admin__empty">{{ tip }}</div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import MertialIcon from '@/components/material-icon'
  import useResource from '../hooks/useResource'

  export default defineComponent({
    setup() {
      return { ...useResource() }
    },
    components: { MertialIcon }
  })
</script>

<style lang="less" scoped>
  .resource-lists {
    height: 100%;
    position: relative;
    box-sizing: border-box;
    .resource-lists__item {
      box-sizing: border-box;
      padding: 20px;
      color: #484848;
      font-size: 17px;
      transition: all 0.15s ease;
      .resource__name {
        display: flex;
        align-items: center;
        font-weight: 400;
        height: 100%;
        .name__icon {
          font-size: 1.8em;
          color: @shallow-active-color;
        }
        .preview {
          width: 1.5em;
          height: 1.5em;
          margin: 0 0.15em;
          object-fit: contain;
        }
      }
    }
    .header {
      position: absolute;
      top: 0;
      left: 1px;
      right: 0;
      height: 63px;
      box-sizing: border-box;
      z-index: 9;
      box-shadow: 1px 1px 0px @split-color;
    }
    .normal {
      cursor: pointer;
      box-shadow: 0 0 1px rgba(0, 0, 0, 0.52);
      color: @message-color;
      background-color: #fff;
    }
    .active {
      background-color: @primary-active-color;
      color: #fff;
      box-shadow: 0 0 1px @primary-active-color, 0 -1px 1px #fff;
    }
    .resource-lists__content {
      padding: 3px 2px;
      overflow: auto;
      position: absolute;
      top: 63px;
      left: 0;
      right: 0;
      bottom: 10px;
      > * {
        height: 71px;
      }
    }
  }
</style>
