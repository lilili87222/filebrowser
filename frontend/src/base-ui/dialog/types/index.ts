export interface IPADialogConfig {
  width?: string
  'show-close'?: boolean
  modal?: boolean
  'align-center'?: boolean
  title?: string
  'close-on-click-modal'?: boolean
  'hidden-custom-close'?: boolean // 是否隐藏自定义的loase icon
  draggable?: boolean // 拖拽
  'close-on-press-escape'?: boolean
  'destroy-on-close'?: boolean
  class?: string
  icon?: string
  'append-to-body'?: boolean
  'actions-config'?: IPADialogActionsConfig
}

export interface IPADialogActionsConfig {
  'confirm-button-text'?: string
  'cancel-button-text'?: string
}
