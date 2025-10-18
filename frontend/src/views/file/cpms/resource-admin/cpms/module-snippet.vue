<template>
  <div v-if="lists.length" class="module-snippet">
    <p class="title">{{ name }}</p>
    <div class="resource">
      <el-row align="middle">
        <el-col :span="20" :offset="2">
          <el-row :gutter="20">
            <template v-if="lists?.length">
              <template v-for="i in lists" :key="i">
                <el-col class="_card_gruop" :sm="12" :md="6" :lg="3">
                  <ModuleItem
                    @dblclick="handleDbclick(i)"
                    @resource-click="handleCapture"
                    :item="i"
                  />
                </el-col>
              </template>
            </template>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import props from '../props/module-snippet.props'
  import ModuleItem from './module-item.vue'
  import useResource from '../hooks/useResource'

  export default defineComponent({
    props,
    setup() {
      return { ...useResource() }
    },
    components: { ModuleItem }
  })
</script>

<style lang="less" scoped>
  .module-snippet {
    // height: 200px;
    width: 100%;
    box-sizing: border-box;
    padding: 10px 0;
    .title {
      padding: 0 10px;
      box-sizing: border-box;
      font-size: 15px;
      color: @message-color;
    }
  }
</style>
