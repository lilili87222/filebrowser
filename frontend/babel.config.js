let plugins = [
  [
    'import',
    {
      libraryName: 'vxe-table',
      style: true // 样式是否也按需加载
    }
  ]
]
if (process.env.NODE_ENV === 'production') {
  plugins.push('transform-remove-console')
}

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins
}
