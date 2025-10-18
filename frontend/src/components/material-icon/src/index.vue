<template>
  <span class="material-symbols-outlined custom-icon"> {{ name }} </span>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import props from '../props'

  export default defineComponent({
    props,
    setup() {
      return {}
    }
  })
</script>

<style scoped>
  .custom-icon {
    cursor: default;
    user-select: none;
  }
</style>
