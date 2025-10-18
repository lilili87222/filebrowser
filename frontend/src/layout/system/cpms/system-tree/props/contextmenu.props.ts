import Node from 'element-plus/es/components/tree/src/model/node'
import { PropType } from 'vue'

export default {
  left: {
    type: Number
  },
  top: {
    type: Number
  },
  node: {
    type: Object as PropType<Node>
  }
}
