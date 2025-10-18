import { App } from 'vue'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-loading.css'
import 'element-plus/theme-chalk/el-message-box.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/display.css'
import 'element-plus/theme-chalk/el-popover.css'
import { ElInput, ElMenuItem, ElPopover, ElSubMenu } from 'element-plus'

const Elements = [
  ElSubMenu,
  ElMenuItem,
  ElInput,
  ElPopover
  // #region iocn
  // Icon
]

export default function (app: App) {
  Elements.map((item) => app.component(item.name, item))
}
