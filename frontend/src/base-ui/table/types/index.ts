export interface IBaseUITableConfig {
  stripe?: boolean // 斑马纹
  border?: boolean // 纵向边框
  'highlight-current-row': boolean // 高亮当前行
}

type IBaseUIFixedPosition = 'left' | 'right'
type IBaseUIAlignPosition = IBaseUIFixedPosition | 'center'

export interface IBaseUIColumnConfig {
  prop: string
  'i18-label': string
  width?: string | number
  'min-width'?: string | number
  fixed?: IBaseUIFixedPosition | boolean
  align?: IBaseUIAlignPosition
}

export interface IBaseUITableCloumn {
  config: IBaseUIColumnConfig
  slot?: string
}
