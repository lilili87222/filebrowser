import { PropType } from 'vue'
import { IPADialogConfig } from '../types'

export default {
  valve: {
    type: Boolean,
    default: false
  },
  dialogConfig: {
    type: Object as PropType<IPADialogConfig>,
    require: true
  }
}
