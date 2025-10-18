<template>
  <div class="auth">
    <div class="logo">
      <img draggable="false" src="@/assets/imgs/logo.png" alt="FileBrowser" />
    </div>
    <div class="form">
      <PAForm
        @on-keydown="captureSubmit"
        @on-change="receiveForm"
        :fileds="filedConfig"
        :model-value="form"
        :rules="rule"
        ref="formRef"
      >
      </PAForm>
      <el-button type="primary" @click="captureSubmit" class="submit"
        >登录</el-button
      >
      <br />
    </div>
  </div>
</template>

<script lang="ts">
  import PAForm from '@/base-ui/form'
  import { defineComponent } from 'vue'
  import hooks from './hooks'

  export default defineComponent({
    setup() {
      return { ...hooks() }
    },
    components: { PAForm }
  })
</script>

<style lang="less" scoped>
  .auth {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -70%);
    max-width: 17em;
    width: 99%;
  }
  .logo {
    height: 70px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    margin: 20px 0;
    img {
      // position: relative;
      height: 100%;
      width: 100%;
      object-fit: contain;
      user-select: none;
    }
  }
  .submit {
    width: 100%;
  }
  .state-switch {
    margin: 5px 0;
    direction: rtl;
    font-size: 15px;
    color: @shallow-active-color;
    cursor: pointer;
    &:hover {
      color: @primary-active-color;
    }
  }
</style>
