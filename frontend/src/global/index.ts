import { App } from 'vue'
import ElementPlus from './global.element-plus'
import filter from './global.filter'

export default function (app: App) {
  ElementPlus(app)
  filter(app)
}
