import { ref } from 'vue'
import { FormInstance } from 'element-plus'

export default function () {
  const form = ref<FormInstance>()
  function submitForm(success?: () => void) {
    if (!form.value) return
    form.value.validate((valid) => {
      if (valid) {
        if (success) success()
        return true
      } else {
        return false
      }
    })
  }
  function resetForm() {
    if (!form.value) return
    form.value.resetFields()
  }
  return { form, submitForm, resetForm }
}
