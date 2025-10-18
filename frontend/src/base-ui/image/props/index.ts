import { PropType } from 'vue'
import { IBaseUIImageConfig } from '../types'

export default {
  config: {
    type: Object as PropType<IBaseUIImageConfig>,
    default: () => ({})
  },
  url: {
    type: String,
    default: ''
  },
  previewSrcList: {
    type: Array as PropType<string[]>,
    default: () => []
  }
}
