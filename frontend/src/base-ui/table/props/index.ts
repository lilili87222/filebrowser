import { PropType } from 'vue'
import { IBaseUITableCloumn, IBaseUITableConfig } from '../types'

export default {
  config: {
    type: Object as PropType<IBaseUITableConfig>,
    default: () => ({}),
    require: true
  },
  columns: {
    type: Array as PropType<IBaseUITableCloumn[]>,
    default: () => [],
    require: true
  },
  data: {
    type: Array,
    default: () => []
  },
  height: {
    type: String
  }
}
