import dayjs from 'dayjs'

const TIMER_TEMPLATE = 'YYYY/MM/DD hh:mm'

export default class DayJS {
  static formatTime(time: number, tmp = TIMER_TEMPLATE) {
    try {
      if (time.toString().length > 13) time = Number(String(time).slice(0, 13))
      return dayjs(time).format(tmp)
    } catch (error) {
      return time
    }
  }
  static formatGivenTime(time: string, tmp = TIMER_TEMPLATE) {
    try {
      return dayjs(time).format(tmp)
    } catch (error) {
      return time
    }
  }
}
