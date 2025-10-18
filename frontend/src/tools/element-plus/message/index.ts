import { ElMessage } from 'element-plus'
import { VNode } from 'vue'

type TEmitPayload = string | VNode | (() => VNode)
export type TDelayDuration = 'normal' | 'never'

const NORMAL_DURATION = 3000

class EmitMessage {
  public static error(
    message: TEmitPayload,
    showClose = true,
    delay: TDelayDuration = 'normal'
  ) {
    ElMessage({
      type: 'error',
      duration: delay == 'never' ? 0 : NORMAL_DURATION,
      showClose,
      message
    })
  }
  public static info(
    message: TEmitPayload,
    showClose = true,
    delay: TDelayDuration = 'normal'
  ) {
    ElMessage({
      type: 'info',
      duration: delay == 'never' ? 0 : NORMAL_DURATION,
      showClose,
      message
    })
  }
  public static warning(
    message: TEmitPayload,
    showClose = true,
    delay: TDelayDuration = 'normal'
  ) {
    ElMessage({
      type: 'warning',
      duration: delay == 'never' ? 0 : NORMAL_DURATION,
      showClose,
      message
    })
  }
  public static success(
    message: TEmitPayload,
    showClose = false,
    delay: TDelayDuration = 'normal'
  ) {
    ElMessage({
      type: 'success',
      duration: delay == 'never' ? 0 : NORMAL_DURATION,
      showClose,
      message
    })
  }
}

export default EmitMessage
