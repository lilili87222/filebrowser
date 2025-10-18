<template>
  <div class="operate-upload">
    <div class="to title">上传到 {{ title }} 下</div>
    <div class="title">选择上传选项</div>
    <div class="upload-main">
      <div class="upload-main__selector" @click="captureFileUpload">
        <span class="material-symbols-outlined resource"> description </span>
        <span class="selector__title">文件</span>
        <input
          ref="fileUpload"
          style="display: none"
          type="file"
          multiple
          @change="uploadInput($event, 'upload')"
        />
      </div>
      <div class="upload-main__selector" @click="captureFolderUpload">
        <span class="material-symbols-outlined resource"> folder </span>
        <span class="selector__title">文件夹</span>
        <input
          ref="folderUpload"
          style="display: none"
          type="file"
          @change="uploadInput($event, 'uploadFolder')"
          webkitdirectory
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import hooks from './hooks'

  export default defineComponent({
    emits: ['close-upload'],
    setup(props, { emit }) {
      return { ...hooks(emit) }
    }
  })
</script>

<style lang="less" scoped>
  .operate-upload {
    box-sizing: border-box;
    .title {
      font-weight: 600;
      font-size: 18px;
      margin-bottom: 20px;
    }
    .upload-main {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .upload-main__selector {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 20px;
        box-sizing: border-box;
        padding: 50px;
        flex: 1;
        box-shadow: 0 0 1px 0 #000;
        border-radius: 3px;
        margin: 0 5px;
        box-sizing: border-box;
        cursor: pointer;
        &:hover {
          background-color: #eee;
          transition: all 0.35s;
          box-shadow: 0 0 1px 5px #eee;
        }
        .resource {
          font-size: 70px;
        }
        .selector__title {
          font-weight: 600;
        }
      }
    }
  }
</style>
