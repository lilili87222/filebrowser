import { PropType } from 'vue'
import { FormRules } from 'element-plus'
import { IPAFiledConfig, IPAFormConfig } from '../types'

export default {
  config: {
    type: Object as PropType<IPAFormConfig>,
    require: true
  },
  modelValue: {
    type: Object,
    require: true
  },
  fileds: {
    type: Array as PropType<IPAFiledConfig[]>,
    require: true
  },
  rules: {
    type: Object as PropType<FormRules>
  }
}
