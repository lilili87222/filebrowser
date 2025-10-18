<template>
  <main>
    <Breadcrumb class="system-container__breadcrumb" />
    <div class="system-conatiner__show-main">
      <router-view class="" v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </main>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import Breadcrumb from './cpms/breadcrumb.vue'

  export default defineComponent({
    components: { Breadcrumb }
  })
</script>

<style lang="less" scoped>
  .system-container__breadcrumb {
    position: absolute;
    top: 0;
    left: 1px;
    right: 0;
    box-shadow: 1px 1px 0px @split-color;
  }
  .system-conatiner__show-main {
    position: absolute;
    top: 48px;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
