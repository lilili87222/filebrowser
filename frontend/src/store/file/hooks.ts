import { IFileItemConfig } from './type'

export function sortResource(arr: IFileItemConfig[]) {
  if (!Array.isArray(arr)) return
  arr.sort((a, b) => {
    if (a.isFile !== b.isFile) {
      return a.isFile ? 1 : -1 // 先按照是否为文件夹排序
    } else {
      return a.name.localeCompare(b.name) // 再按照名称排序
    }
  })
}
