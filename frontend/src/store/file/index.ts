import { net_get_file, net_get_file_read, net_post_file } from '@/service/file'
import { net_get, net_get_hugo } from '@/service/hugo'
import { defineStore } from 'pinia'
import { useGlobalStore } from '..'
import { sortResource } from './hooks'
import IFileStore, {
  IFileCreate,
  IFileCreatePayload,
  IFileDeletePayload,
  IFileItemConfig,
  IFileListPayload,
  IFileMkdirPayload,
  IFileMovePayload,
  IFileRenamePayload,
  IFileUpload,
  IReadPayload,
  ISaveMdPayload
} from './type'

export const useFileStore = defineStore('file', {
  state: (): IFileStore => ({
    path: '',
    content: '',
    save: false,
    resources: null,
    activeResource: null,
    actives: [],
    searchs: null,
    searchValue: ''
  }),
  actions: {
    //#region network
    getFileList(payload: IFileListPayload, useLoad = false) {
      return net_get_file('/list', payload, useLoad).then((data) => {
        if (data && !this.save) {
          sortResource((data as IFileItemConfig).items!)
          const gbStore = useGlobalStore()
          gbStore.path = payload.path
          this.resources = (data as IFileItemConfig)?.items ?? []
          this.activeResource = null
          this.actives = []
          this.searchs = null
          this.searchValue = ''
        }
        return data as IFileItemConfig
      })
    },
    rename(payload: IFileRenamePayload) {
      return net_post_file('/rename', payload)
    },
    mkdir(payload: IFileMkdirPayload) {
      return net_post_file('/mkdir', payload)
    },
    deleteFile(payload: IFileDeletePayload) {
      payload.force = true
      return net_post_file('/delete', payload)
    },
    create(payload: IFileCreatePayload) {
      return net_post_file('/create', payload)
    },
    createArticle(payload: IFileCreatePayload) {
      return net_post_file('/new_mdfile', payload)
    },
    move(payload: IFileMovePayload) {
      return net_post_file('/move', payload) as Promise<IFileItemConfig>
    },
    conflict(payload: IFileItemConfig, mode: '/replace' | '/rename') {
      return net_get_file(`/move${mode}`, payload)
    },
    readImage(path: string) {
      window.open(
        `${process.env.VUE_APP_BASE_URL}/file/read?path=${encodeURIComponent(
          path
        )}`,
        '_blank'
      )
    },
    read(payload: IReadPayload) {
      const gbStore = useGlobalStore()
      return net_get_file_read(`/${payload.path}`, {
        fmt: 'json'
      }).then((res) => {
        if (!this.save) {
          this.content = (res as string | undefined) ?? ''
          this.save = false
          this.path = payload.path
          gbStore.path = payload.path
        }
        return res
      })
    },
    saveEdit() {
      return net_post_file(
        '/save',
        undefined,
        {
          path: this.path,
          content: this.content
        } as ISaveMdPayload,
        {
          'Content-Type': 'multipart/form-data'
        }
      )
    },
    // 文件上传
    upload(payload: IFileUpload) {
      return net_post_file(
        '/upload',
        {
          path: payload.path ?? '.'
        },
        payload.data,
        {
          'Content-Type': 'multipart/form-data'
        }
      )
    },
    // 文件夹上传
    uploadFolder(payload: IFileUpload) {
      return net_post_file(
        '/upload_dir',
        {
          path: payload.path ?? '.'
        },
        payload.data,
        {
          'Content-Type': 'multipart/form-data'
        }
      )
    },
    uploadMD(payload: IFileUpload) {
      return net_post_file(
        '/upload_md',
        {
          path: payload.path
        },
        payload.data,
        {
          'Content-Type': 'multipart/form-data'
        }
      )
    },
    // 初始化站点
    createSite(payload: IFileCreate) {
      return net_get_hugo('/create', payload).then((res) => {
        this.resources = res?.items ?? []
        // this.activeResource = null
        //   this.actives = []
        //   gbStore.path = payload.path
        return res
      })
    },
    buildSite() {
      const gb = useGlobalStore()
      return net_get_hugo('/build', {
        path: this.activeResource?.path ?? gb.path
      })
    },
    preview() {
      return net_get('/preview', {
        path: this.path
      }).then((res) => {
        if (res) {
          let a: any = document.createElement('a')
          a.setAttribute('href', res)
          a.setAttribute('target', '_blank')
          a.click()
          a = null
        }
      })
    },
    unzip(payload: IFileListPayload) {
      return net_get_file('/unzip', payload) as Promise<IFileItemConfig>
    },
    download(path: string[]) {
      const form = document.createElement('form')
      form.style.display = 'none'
      form.method = 'POST'
      const baseUrl = process.env.VUE_APP_BASE_URL
      form.action = `${baseUrl}/file/download`
      form.enctype = 'multipart/form-data'

      const file = document.createElement('input')
      file.name = 'path'
      file.value = JSON.stringify(path)

      form.appendChild(file)

      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)
    },
    // 搜索
    search() {
      const gb = useGlobalStore()
      return net_get_file('/search', {
        path: gb.path,
        name: this.searchValue
      }).then((res) => {
        this.searchs = (res as IFileItemConfig)?.items ?? []
      })
    },
    // 资源复制
    copy() {
      const gb = useGlobalStore()
      return net_post_file('/copy', {
        path: this.activeResource?.path ?? gb.path
      })
    },
    clearFileState() {
      this.save = false
      this.path = ''
      this.content = ''
    }
    //#endregion
  }
})
