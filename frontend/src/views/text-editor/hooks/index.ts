import { onBeforeUnmount, onMounted, onUnmounted, watch } from 'vue'
import type { editor, IDisposable } from 'monaco-editor'
import { useFileStore } from '@/store/file'
import debounce from '@/utils/debounce'
import langs from '@/tools/monaco-editor/lang.json'
import { useGlobalStore } from '@/store'
import monaco from '@/tools/monaco-editor'
import { TModelLanguage } from '@/tools/monaco-editor/type'
import useSave from '@/hooks/useSave'

export default function () {
  const fs = useFileStore()
  const gb = useGlobalStore()
  let monacoInstance: editor.IStandaloneCodeEditor | undefined
  let $el: HTMLElement | null
  let model: IDisposable | undefined

  watch(
    () => fs.path,
    () => {
      monacoInstance?.setValue(fs.content)
      const ext = gb.path.match(/\.\w+$/)
      if (ext && ext[0]) {
        for (const key in langs) {
          const langItem = (langs as any)[key] as string[]
          if (langItem.includes(ext[0]))
            return (gb.editLang = key as TModelLanguage)
        }
        gb.editLang = ''
      } else gb.editLang = ''
    },
    { immediate: true }
  )
  watch(
    () => fs.content,
    (v) => monacoInstance?.setValue(v)
  )
  watch(
    () => gb.isHandleSave,
    (v) => {
      if (v && $el) {
        const $editor = monaco.getInstance($el).getEditor()
        fs.content = $editor?.getValue() ?? fs.content
        fs.saveEdit().then(() => (gb.isHandleSave = false))
      }
    }
  )

  const resetLanguage = (v: TModelLanguage) => {
    const $model = monacoInstance?.getModel()
    $model && monaco.setModelLanguage($model, v)
    monaco.setLanguage(v)
  }
  const { replaceContent } = useSave()
  const handleSave = (e: any) => {
    if (
      e.keyCode === 83 &&
      (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)
    ) {
      e.preventDefault()
      replaceContent()
    }
  }

  watch(() => gb.editLang, resetLanguage)

  onMounted(() => {
    $el = document.getElementById('text-editor')
    if ($el) {
      monacoInstance = monaco.getInstance($el).getEditor()
      monacoInstance?.setValue(fs.content)
      resetLanguage(gb.editLang)
      const debounced = debounce(
        () => {
          if (monacoInstance) {
            const $md = monacoInstance.getValue()
            fs.save = $md !== fs.content
          }
        },
        500,
        { immediate: true }
      )
      model = monacoInstance?.onDidChangeModelContent(debounced)
    }
  })
  onBeforeUnmount(() => {
    model?.dispose()
    $el && monaco.getInstance($el).instanceDispose()
  })
  onUnmounted(() => {
    model = undefined
    monacoInstance = undefined
  })
  return { handleSave }
}
