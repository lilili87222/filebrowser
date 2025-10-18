import * as monaco from 'monaco-editor'
import dynamicConfig from './dynamic-config'
import { TModelLanguage } from './type'

class MonacoEditorSingleton {
  private static instance: MonacoEditorSingleton | null
  public editor: monaco.editor.IStandaloneCodeEditor | undefined

  private constructor(el: HTMLElement) {
    this.editor = monaco.editor.create(el, {
      value: '',
      language: '',
      automaticLayout: true, // 自动布局
      theme: 'vs' // 官方自带三种主题vs, hcblack, or vsdark
    })
  }

  public static getInstance(el: HTMLElement): MonacoEditorSingleton {
    if (!MonacoEditorSingleton.instance) {
      MonacoEditorSingleton.instance = new MonacoEditorSingleton(el)
    }

    return MonacoEditorSingleton.instance
  }

  public instanceDispose() {
    this.editor?.dispose()
    this.editor = undefined
    MonacoEditorSingleton.instance = null
  }

  public getEditor(): monaco.editor.IStandaloneCodeEditor | undefined {
    return this.editor
  }

  public static setLanguage(language: TModelLanguage) {
    dynamicConfig(language)
  }
  public static setModelLanguage(
    model: monaco.editor.ITextModel,
    language: TModelLanguage
  ) {
    monaco.editor.setModelLanguage(model, language)
  }
}

export default MonacoEditorSingleton
