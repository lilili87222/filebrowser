import { TREE_ROOT_NAME } from '@/constants'
import { IFileItemConfig } from '@/store/file/type'

// 计算文件/文件夹大小
enum EBit {
  Bits = 1,
  Byte = 1024,
  KB = Byte * 1024,
  MB = KB * 1024,
  GB = MB * 1024,
  TB = MB * 1024
}

export function operateFileSize(count: number, scale = 2) {
  count = count * EBit.Byte
  try {
    if (count <= EBit.Byte) return `≤ 1B`
    else if (count > EBit.Byte && count <= EBit.KB)
      return `${matchScale(count / EBit.Byte, scale)} B`
    else if (count > EBit.KB && count <= EBit.MB)
      return `${matchScale(count / EBit.KB, scale)} KB`
    else if (count > EBit.MB && count <= EBit.GB)
      return `${matchScale(count / EBit.MB, scale)} M`
    else if (count > EBit.GB && count <= EBit.TB)
      return `${matchScale(count / EBit.GB, scale)} G`
    else return `${matchScale(count / EBit.TB, scale)} T`
  } catch (error) {
    return count
  }
}

function matchScale(primitive: number, scale: number) {
  if (scale <= 0) return primitive
  scale = 10 ** scale
  return Math.floor(primitive * scale) / scale
}

export const matchActivePath = (
  template: IFileItemConfig,
  refer: IFileItemConfig | null | undefined,
  raw: IFileItemConfig[]
) => {
  return (
    refer?.path === template.path ||
    raw?.findIndex((i) => template.path === i.path) !== -1
  )
}

const ZIP_MAP = ['.zip', '.rar', '.tar.gz', ' .tgz', '.7z']

export const allocationIcon = (ext: string) => {
  if (!ext) return 'description'
  else {
    const index = ZIP_MAP.indexOf(ext.toLocaleLowerCase())
    return index == -1 ? 'description' : 'folder_zip'
  }
}

export const isImageType = (type: string) => type.includes('image')

export const resolveImagePath = (path: string) =>
  `${process.env.VUE_APP_BASE_URL}/file/read?path=${encodeURIComponent(path)}`

export const resolveDir = (path: string) => {
  let msg
  const paths = path.split('/')
  const $path = paths[paths.length - 1]
  if ($path == '.') msg = `${TREE_ROOT_NAME}目录`
  else msg = $path + '目录'
  return msg
}
