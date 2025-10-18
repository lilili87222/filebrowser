const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')
const path = require('path')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

function resolve(dir) {
  return path.join(__dirname, './', dir)
}

const proxyPath = {
  test: 'http://192.168.123.214:9999',
  serve: 'http://localhost:9999'
}

module.exports = defineConfig(() => {
  const args = process.argv.slice(2)
  const mode = args[args.length - 1]
  return {
    productionSourceMap: false,
    transpileDependencies: process.env.NODE_ENV === 'production',
    publicPath: '/editor/',
    configureWebpack: {
      plugins: [
        new webpack.DefinePlugin({
          __VUE_I18N_FULL_INSTALL__: true,
          __VUE_I18N_LEGACY_API__: false,
          __INTLIFY_PROD_DEVTOOLS__: false
        }),
        AutoImport({
          resolvers: [ElementPlusResolver()]
        }),
        Components({
          resolvers: [ElementPlusResolver()]
        }),
        new MonacoWebpackPlugin({
          languages: [
            'bat',
            'css',
            'html',
            'ini',
            'java',
            'javascript',
            'json',
            'less',
            'scss',
            'shell',
            'sql',
            'typescript',
            'yaml'
          ],
          filename: './editor/[name].worker.js'
        })
      ]
    },
    lintOnSave: false,
    chainWebpack(config) {
      config.module.rule('svg').exclude.add(resolve('src/assets/icons')).end()
      config.module
        .rule('icons')
        .test(/\.svg$/)
        .include.add(resolve('src/assets/icons'))
        .end()
        .use('svg-sprite-loader')
        .loader('svg-sprite-loader')
        .options({
          symbolId: 'icon-[name]'
        })
        .end()
    },
    pluginOptions: {
      'style-resources-loader': {
        preProcessor: 'less',
        patterns: [path.resolve(__dirname, './src/assets/css/style.less')]
      }
    },
    devServer: {
      proxy: {
        '/api': {
          target: proxyPath[mode],
          changeOrigin: true,
          ws: true,
          pathRewrite: {
            '^/api': ''
          },
          open: true
        }
      },
      port: 5173
    }
  }
})
