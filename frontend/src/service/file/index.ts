import { RawAxiosRequestHeaders } from 'axios'
import request from '..'

export function net_get_file(
  url: string,
  params: any,
  useGlobalLoading?: boolean
) {
  return request.get({
    url: '/file' + url,
    params,
    useGlobalLoading
  })
}

export function net_post_file(
  url: string,
  params: any,
  data?: any,
  headers?: RawAxiosRequestHeaders,
  responseType?: any
) {
  return request.post<any>({
    url: '/file' + url,
    params,
    data,
    headers,
    responseType
  })
}

export function net_get_file_read(url: string, params: any) {
  return request.get({
    url: '/home' + url,
    params
  })
}
