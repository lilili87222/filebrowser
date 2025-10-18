import * as monaco from 'monaco-editor'

type TLanguage = {
  conf: any
  language: {
    defaultToken: string
    tokenPostfix: string
    ignoreCase: boolean
    brackets: {
      open: string
      close: string
      token: string
    }[]
    keywords?: string[]
    operators: string[]
    builtinFunctions: string[]
    builtinVariables: string[]
    pseudoColumns: string[]
    tokenizer: any
  }
}

const getSQLSuggest = (keywords: string[]) => {
  return keywords.map((key) => ({
    label: key,
    kind: monaco.languages.CompletionItemKind.Enum,
    insertText: key
  }))
}

export default function (lang: string) {
  if (!lang || lang === '') return
  else {
    if (lang === 'json') {
      monaco.languages.register({ id: lang })
      return
    }
    return import(`monaco-editor/esm/vs/basic-languages/${lang}/${lang}`).then(
      ({ language }: TLanguage) => {
        if (!language) return
        let keywords = language.keywords ?? []
        if (lang === 'php') keywords = (language as any).phpKeywords
        // 注册语言
        monaco.languages.register({ id: lang })
        // 提供语法分析和词法分析
        monaco.languages.setMonarchTokensProvider(lang, language)
        // 提供语法提示
        if (lang === 'bat') {
          monaco.languages.registerCompletionItemProvider('bat', {
            provideCompletionItems: (model, position) => {
              const suggestions: any[] = []
              const wordInfo = model.getWordUntilPosition(position)

              // 如果前面一个单词匹配到了关键字，则不再提示
              if (
                /call|defined|echo|errorlevel|exist|for|goto|if|pause|set|shift|start|title|not|pushd|popd/.test(
                  wordInfo.word
                )
              ) {
                return { suggestions }
              }

              // 补全项集合
              const keywords = [
                'call',
                'defined',
                'echo',
                'errorlevel',
                'exist',
                'for',
                'goto',
                'if',
                'pause',
                'set',
                'shift',
                'start',
                'title',
                'not',
                'pushd',
                'popd'
              ]

              // 根据上下文信息返回合适的补全项集合
              if (
                /^if\s+not/i.test(
                  model.getValueInRange({
                    startLineNumber: position.lineNumber,
                    endColumn: position.column - wordInfo.word.length - 1,
                    endLineNumber: position.lineNumber,
                    startColumn: 0
                  })
                )
              ) {
                // 如果上一个单词是 if 并且已经输入了 not，则提示 true 和 false
                suggestions.push(
                  {
                    label: 'true',
                    kind: monaco.languages.CompletionItemKind.Keyword
                  },
                  {
                    label: 'false',
                    kind: monaco.languages.CompletionItemKind.Keyword
                  }
                )
              } else {
                // 否则提示所有的关键字
                keywords.forEach((keyword) => {
                  suggestions.push({
                    label: keyword,
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: keyword
                  })
                })
              }

              return {
                suggestions
              }
            }
          })
        } else {
          monaco.languages.registerCompletionItemProvider(lang, {
            triggerCharacters: ['.', ...keywords],
            provideCompletionItems: (model, position) => {
              let suggestions: any[] = getSQLSuggest(keywords)
              const { lineNumber, column } = position

              const textBeforePointer = model.getValueInRange({
                startLineNumber: lineNumber,
                startColumn: 0,
                endLineNumber: lineNumber,
                endColumn: column
              })

              const tokens = textBeforePointer.trim().split(/\s+/)
              const lastToken = tokens[tokens.length - 1] // 获取最后一段非空字符串

              suggestions = lastToken === '.' ? [] : getSQLSuggest(keywords)

              return {
                suggestions
              }
            }
          })
        }
      }
    )
  }
}
