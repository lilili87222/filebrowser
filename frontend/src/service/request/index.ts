import axios from 'axios'
import { AxiosInstance } from 'axios'

import { PARequestConfig, PARequestInterceptors } from './type'

const DEFAULT_LOADING = true

class PARequest {
  instance: AxiosInstance
  interceptors?: PARequestInterceptors
  // loading?: any
  showLoading?: boolean
  useGlobalLoading?: boolean

  constructor(config: PARequestConfig) {
    this.instance = axios.create(config)
    this.interceptors = config.interceptors
    this.showLoading = config.showLoading ? config.showLoading : DEFAULT_LOADING
    this.useGlobalLoading = config.useGlobalLoading
      ? config.useGlobalLoading
      : DEFAULT_LOADING
    //请求拦截器
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptors,
      this.interceptors?.requestInterceptorsCatch
    )
    //响应拦截器
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptors,
      this.interceptors?.responseInterceptorsCatch
    )

    this.instance.interceptors.request.use(
      (config) => {
        // config.showLoading = this.showLoading
        return config
      },
      (err) => {
        return err
      }
    )

    this.instance.interceptors.response.use(
      (res) => {
        try {
          return res.data
        } catch (error) {
          return res
        }
      },
      (err) => {
        return err
      }
    )
  }

  request<T>(config: PARequestConfig<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      if (config.interceptors?.requestInterceptors) {
        config = config.interceptors.requestInterceptors(config)
      }
      if (config?.showLoading === false) {
        this.showLoading = config.showLoading
      }
      this.instance
        .request<any, T>(config)
        .then((res) => {
          if (config.interceptors?.responseInterceptors) {
            res = config.interceptors.responseInterceptors(res)
          }
          this.showLoading = DEFAULT_LOADING
          resolve(res)
        })
        .catch((err) => {
          this.showLoading = DEFAULT_LOADING
          reject(err)
          return err
        })
    })
  }

  get<T>(config: PARequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'GET' })
  }

  post<T>(config: PARequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'POST' })
  }

  delete<T>(config: PARequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'DELETE' })
  }

  patch<T>(config: PARequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'PATCH' })
  }

  put<T>(config: PARequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'PUT' })
  }
}

export default PARequest
