<template>
  <el-form v-bind="config" ref="form" :rules="rules" :model="modelValue">
    <template v-for="filed in fileds" :key="filed.bind">
      <!-- :label="$t(filed.label as string)" -->
      <el-form-item
        v-if="!filed['unuse-form-item']"
        :prop="filed.bind"
        :label="filed.label"
      >
        <!-- 是否存在插槽 -->
        <template v-if="filed.slot">
          <slot :name="filed.slot"> </slot>
        </template>
        <template v-else>
          <component
            v-if="modelValue"
            @keydown.enter="$emit('on-keydown')"
            :model-value="modelValue![filed.bind!]"
            @update:modelValue="$emit('on-change', $event, filed.bind)"
            :is="filed['filed-type']"
            v-bind="filed.config"
          >
          </component
        ></template>
      </el-form-item>
      <template v-else>
        <slot :name="filed.slot"></slot>
      </template>
    </template>
    <slot name="Suffix"> </slot>
  </el-form>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import FormHooks from '../hooks'
  import props from '../props'

  export default defineComponent({
    props,
    emits: ['on-change', 'on-keydown'],
    setup() {
      return { ...FormHooks() }
    }
  })
</script>

<style scoped>
  .normal {
    display: flex;
    justify-content: center;
  }
</style>
