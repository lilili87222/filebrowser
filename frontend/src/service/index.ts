import PARequest from './request'
import { BASE_URL, TIME_OUT } from './request/config'
import { endLoading, startLoading } from '@/tools/element-plus/loading'
import { AxiosError } from 'axios'
import EmitMessage from '@/tools/element-plus/message'

const request = new PARequest({
  timeout: TIME_OUT,
  baseURL: BASE_URL,
  // 本次项目使用session进行信息保存，开启cookie
  withCredentials: true,
  useGlobalLoading: true,
  // 拦截器
  interceptors: {
    requestInterceptors: (config) => {
      if (config.useGlobalLoading) startLoading()
      return config
    },
    responseInterceptorsCatch(error: AxiosError) {
      endLoading()
      if (error.status !== 200) {
        let err = String(error.response?.data)
        if (err == undefined || String(err) === '') err = '无效操作!'
        EmitMessage.error(err)
        if (error.response?.status === 401) {
          window.location.replace('#/login')
        }
      }
    },
    responseInterceptors: (res) => {
      endLoading()
      if (res.status === 200 && res.data.code === 200) {
        if (String((res as any).data.msg) !== '')
          EmitMessage.success(String((res as any).data.msg))
        return res.data
      } else {
        EmitMessage.error(String((res as any).data.msg))
        return undefined
      }
    }
  }
})

export default request
