import { IFormInstance } from '@/base-ui/form/types'
import { useUserStore } from '@/store/user'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { filedConfig, rule } from '../config'
import { IForm } from '../type'

export default function () {
  const us = useUserStore()
  const router = useRouter()
  const formRef = ref<IFormInstance>()
  const form = reactive<IForm>({
    username: '',
    password: ''
  })
  const receiveForm = (value: string, type: keyof IForm) => (form[type] = value)

  const captureSubmit = () => {
    if (!formRef.value) return
    formRef.value.submitForm(() =>
      us.login(form).then((res) => {
        if (res) {
          formRef.value?.resetForm()
          router.push('/file')
        }
      })
    )
  }

  return {
    rule,
    filedConfig,
    formRef,
    form,
    receiveForm,
    captureSubmit
  }
}
