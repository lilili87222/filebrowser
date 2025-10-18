import { TModelLanguage } from '@/tools/monaco-editor/type'

export default interface IGlobalStore {
  path: string
  viewMode: 'view_module' | 'view_list'
  multipleMode: boolean
  editLang: TModelLanguage
  handleSave: boolean
  extension: boolean
  isHandleSave: boolean
}
