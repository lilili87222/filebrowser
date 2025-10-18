import {
  Action,
  ElMessageBox,
  ElMessageBoxOptions,
  MessageBoxState
} from 'element-plus'
import { Component, VNode } from 'vue'

interface IEmitMessageBoxConfig {
  inputValue?: 'string'
  autofocus?: boolean
  type?: 'success' | 'info' | 'warning' | 'error'
  icon?: string | Component
  'show-confirm-button'?: boolean
  cancelButtonText?: string
  confirmButtonText?: string
  'cancel-button-class'?: string
  'confirm-button-class'?: string
  'close-on-click-modal'?: boolean
  'close-on-press-escape'?: boolean
  draggable?: boolean
  distinguishCancelAndClose?: boolean
  beforeClose?: (
    action: Action,
    instance: MessageBoxState,
    done: () => void
  ) => void
}

const DEFAULT_CONFIG: IEmitMessageBoxConfig = {
  autofocus: true,
  'show-confirm-button': true,
  cancelButtonText: '取 消',
  confirmButtonText: '确 认',
  'close-on-click-modal': false,
  'close-on-press-escape': true,
  distinguishCancelAndClose: true,
  draggable: false
}

class EmitMessageBox {
  static alert(
    desc: string | VNode | (() => VNode),
    title: string,
    config: IEmitMessageBoxConfig
  ) {
    const _config = { ...DEFAULT_CONFIG, ...config }
    return ElMessageBox.alert(desc, title, _config as ElMessageBoxOptions)
  }
  static confirm(
    desc: string | VNode | (() => VNode),
    title: string,
    config: IEmitMessageBoxConfig
  ) {
    const _config = { ...DEFAULT_CONFIG, ...config }
    return ElMessageBox.confirm(desc, title, _config as ElMessageBoxOptions)
  }
  static prompt(desc: string, title: string, config: IEmitMessageBoxConfig) {
    const _config = { inputValue: desc, ...DEFAULT_CONFIG, ...config }
    return ElMessageBox.prompt(title, _config as ElMessageBoxOptions)
  }
}

export default EmitMessageBox
