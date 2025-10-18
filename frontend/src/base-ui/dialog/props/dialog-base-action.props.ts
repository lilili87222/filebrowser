import { PropType } from 'vue'
import { IPADialogActionsConfig } from '../types'

export default {
  actionsConfig: {
    type: Object as PropType<IPADialogActionsConfig>,
    default: () => ({})
  }
}
