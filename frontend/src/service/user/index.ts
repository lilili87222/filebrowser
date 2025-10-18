import { RawAxiosRequestHeaders } from 'axios'
import request from '..'

export function net_post_user(
  url: string,
  params?: any,
  data?: any,
  headers?: RawAxiosRequestHeaders,
  responseType?: any
) {
  return request.post<any>({
    url: '/user' + url,
    params,
    data,
    headers,
    responseType
  })
}
