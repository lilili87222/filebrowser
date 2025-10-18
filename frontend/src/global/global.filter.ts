import { App } from 'vue'
import DayJS from '@/utils/dayjs'
import {
  allocationIcon,
  isImageType,
  matchActivePath,
  operateFileSize,
  resolveImagePath
} from '@/utils/operation'
import { IFileItemConfig } from '@/store/file/type'

// 声明模块-filter
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $filter: {
      formatTime: (time: number, tmp?: string) => string | number
      formatGivenTime: (time: string, tmp?: string) => string
      handleFileSize: (count: number, scale?: number) => string | number
      matchActivePath: (
        template: IFileItemConfig,
        refer: IFileItemConfig | null | undefined,
        raw: IFileItemConfig[]
      ) => boolean
      allocationIcon: (ext: string) => string
      isImageType: (type: string) => boolean
      resolveImagePath: (path: string) => string
    }
  }
}

export default function (app: App) {
  app.config.globalProperties.$filter = {
    formatTime: DayJS.formatTime,
    formatGivenTime: DayJS.formatGivenTime,
    handleFileSize: operateFileSize,
    matchActivePath,
    allocationIcon,
    isImageType,
    resolveImagePath
  }
}
