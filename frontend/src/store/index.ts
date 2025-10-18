import { defineStore } from 'pinia'
import { useFileStore } from './file'
import IGlobalStore from './types'

export const useGlobalStore = defineStore('global', {
  state: (): IGlobalStore => ({
    path: '',
    viewMode: 'view_module',
    multipleMode: false,
    editLang: '',
    handleSave: false,
    extension: false,
    isHandleSave: false
  }),
  actions: {
    reset() {
      const fs = useFileStore()
      fs.$reset()
      this.$reset()
    }
  }
})
