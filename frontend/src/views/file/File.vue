<template>
  <ResourceAdmin />
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import ResourceAdmin from './cpms/resource-admin/ResourceAdmin.vue'

  export default defineComponent({
    components: {
      ResourceAdmin
    }
  })
</script>
