import { IPAFiledConfig } from '@/base-ui/form/types'
import { FormRules } from 'element-plus'

export const filedConfig: IPAFiledConfig[] = [
  {
    'filed-type': 'el-input',
    bind: 'username',
    config: {
      placeholder: '账号'
    }
  },
  {
    'filed-type': 'el-input',
    bind: 'password',
    config: {
      type: 'password',
      placeholder: '密码'
    }
  }
]

export const rule: FormRules = {
  username: [
    {
      required: true,
      message: '请输入账号信息',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    }
  ]
}
