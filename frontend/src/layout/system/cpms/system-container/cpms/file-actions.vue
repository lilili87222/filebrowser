<template>
  <div class="file-actions">
    <template v-if="$route.path == FILE_PATH">
      <MaterialItem
        v-for="(s, index) in sensors"
        @click="captureSensor(s)"
        :key="index"
        v-bind="s"
      />
    </template>
    <template
      v-if="
        $route.path == MARKDOWN_EDITOR_ROUTER_PATH ||
        $route.path == TEXT_EDITOR_ROUTER_PATH
      "
    >
      <MaterialItem
        name="visibility"
        v-if="$route.path === MARKDOWN_EDITOR_ROUTER_PATH"
        :allow="true"
        title="网页预览"
        @click="handlePreview"
      />
      <el-select
        v-if="$route.path === TEXT_EDITOR_ROUTER_PATH"
        v-model="gb.editLang"
        class="langSelect"
        size="small"
      >
        <el-option
          v-for="(l, i) in langs"
          :key="i"
          :label="i === '' ? '默认' : i"
          :value="i"
        />
      </el-select>
      <MaterialItem
        @click="captureSave(fs.save)"
        name="save"
        title="保存-ctrl+s"
      />
    </template>
  </div>
  <Extension />
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import MaterialItem from '@/components/material-item'
  import fileActionsHooks from '../hooks/file-actions.hooks'
  import langs from '@/tools/monaco-editor/lang.json'
  import {
    FILE_PATH,
    MARKDOWN_EDITOR_ROUTER_PATH,
    TEXT_EDITOR_ROUTER_PATH
  } from '@/constants'
  import Extension from './extension.vue'

  export default defineComponent({
    setup() {
      return {
        FILE_PATH,
        MARKDOWN_EDITOR_ROUTER_PATH,
        TEXT_EDITOR_ROUTER_PATH,
        langs,
        ...fileActionsHooks()
      }
    },
    components: { MaterialItem, Extension }
  })
</script>

<style lang="less" scoped>
  .file-actions {
    display: flex;
    align-items: center;
    .langSelect {
      margin-right: 10px;
      width: 130px;
    }
  }
</style>
