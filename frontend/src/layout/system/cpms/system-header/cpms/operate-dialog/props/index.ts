import { PropType } from 'vue'
import { IOperateDialogConfig } from '../types'

export default {
  config: {
    type: Object as PropType<IOperateDialogConfig>
  },
  valve: Boolean
}
