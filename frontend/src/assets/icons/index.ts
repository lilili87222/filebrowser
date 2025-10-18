/**
 * require.context 的参数说明
 * './svg' 代表要查找的文件路径
 * false 代表是否查找子目录
 * /\.svg$/ 代表要匹配文件的正则
 *
 */
const svg = require.context('./svg', false, /\.svg$/)
const requireAll = (requireContext: __WebpackModuleApi.RequireContext) =>
  requireContext.keys().map(requireContext)
requireAll(svg)
