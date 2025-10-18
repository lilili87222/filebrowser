import { FormInstance } from 'element-plus'

export interface IPAFormConfig {
  'label-position'?: 'left' | 'right' | 'top'
  'label-width'?: string | number
  'status-icon'?: boolean
  inline?: boolean
}

export interface IPAFiledItemConfig {
  label?: string
  type?: string
  value?: string
  size?: string
  name?: string
  style?: string
  underline?: boolean
  href?: string
  disabled?: boolean
  placeholder?: string
}

export interface IPAFiledConfig {
  'filed-type'?: string // 标签类型
  bind?: string // 绑定的值
  label?: string
  config?: IPAFiledItemConfig
  slot?: string
  value?: any
  'sub-options'?: IPAFiledConfig[]
  'unuse-form-item'?: boolean // 不使用formItem进行包裹
}
// hooks export
export interface IFormInstance {
  form: FormInstance
  submitForm: (success?: () => void) => void
  resetForm: () => void
}
