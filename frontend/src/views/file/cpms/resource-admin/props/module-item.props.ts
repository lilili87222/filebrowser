import { IFileItemConfig } from '@/store/file/type'
import { PropType } from 'vue'

export default {
  item: {
    type: Object as PropType<IFileItemConfig>,
    default: () => ({})
  }
}
