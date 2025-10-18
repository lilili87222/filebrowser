import { ElNotification, NotificationHandle } from 'element-plus'

type INotificationType = 'success' | 'warning' | 'info' | 'error'
interface INotificationPayload {
  message: string
  title: string
  icon?: string
  duration?: number
  'show-close'?: boolean
  'on-close'?: () => void
  offset?: number
}

class Notification {
  public type: INotificationType
  public config: INotificationPayload
  public offset = 40

  private notify: NotificationHandle

  constructor(type: INotificationType, config: INotificationPayload) {
    this.type = type
    this.config = config
    this.notify = ElNotification({
      offset: this.offset,
      ...config,
      type
    })
  }

  done() {
    this.notify.close()
  }
}

export default Notification
