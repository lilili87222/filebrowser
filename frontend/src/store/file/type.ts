export default interface IFileStore {
  path: string
  content: string
  save: boolean
  resources: IFileItemConfig[] | null | undefined
  activeResource: IFileItemConfig | null | undefined
  actives: IFileItemConfig[]
  searchs: IFileItemConfig[] | null
  searchValue: string
}
/* store */
export interface IFileItemConfig {
  extension: string
  isFile: boolean
  modified: string
  name: string // 目录/文件名称
  path: string // 目录的唯一键值
  size: number
  items?: IFileItemConfig[]
  flag?: boolean
  filetype: string
}
export type TFileItemConfig = keyof IFileItemConfig
//#region
export interface IFileListPayload {
  path: string
}
export interface IFileRenamePayload extends IFileListPayload {
  name: string
}
export type IFileMkdirPayload = IFileRenamePayload
export interface IFileDeletePayload extends IFileListPayload {
  force?: boolean
}
export type IFileCreatePayload = IFileRenamePayload
export interface IFileMovePayload extends IFileListPayload {
  dest: string
}
export type IReadPayload = IFileListPayload

export interface ISaveMdPayload extends IFileListPayload {
  content: string
}

export interface IFileUpload extends IFileListPayload {
  data: FormData
}

export interface IFileCreate extends IFileListPayload {
  site_name: string
}

export interface IFileSearch extends IFileListPayload {
  name: string
}
//#endregion
