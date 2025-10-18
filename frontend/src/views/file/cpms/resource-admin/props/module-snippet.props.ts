import { PropType } from 'vue'
import { IFileItemConfig } from '@/store/file/type'

export default {
  lists: {
    type: Array as PropType<IFileItemConfig[]>,
    default: () => []
  },
  name: String
}
