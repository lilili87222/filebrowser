<template>
  <ResourceLists v-if="gbStore.viewMode == 'view_module'" />
  <ResourceModule v-else />
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import ResourceLists from './cpms/resource-lists.vue'
  import ResourceModule from './cpms/resource-module.vue'
  import resourceAdminHooks from './hooks/resource-admin.hooks'

  export default defineComponent({
    setup() {
      return { ...resourceAdminHooks() }
    },
    components: { ResourceLists, ResourceModule }
  })
</script>

<style lang="less">
  .resource-admin__empty {
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%);
    font-size: 15px;
    color: @message-color;
  }
</style>
