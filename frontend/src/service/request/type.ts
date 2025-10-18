import type { AxiosRequestConfig, AxiosResponse } from 'axios'
//AxiosResponse
export interface PARequestInterceptors<T = AxiosResponse> {
  requestInterceptors?: (config: PARequestConfig<T>) => AxiosRequestConfig
  requestInterceptorsCatch?: (error: any) => any
  responseInterceptors?: (res: T) => T
  responseInterceptorsCatch?: (error: any) => any
}

export interface PARequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: PARequestInterceptors<T>
  showLoading?: boolean
  useGlobalLoading?: boolean
}
