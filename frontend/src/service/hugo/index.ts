import { IFileItemConfig } from '@/store/file/type'
import request from '..'

export function net_get_hugo(url: string, params: any) {
  return request.get<IFileItemConfig>({
    url: '/hugo' + url,
    params
  })
}

export function net_get(url: string, params: any) {
  return request.get<string>({
    url,
    params
  })
}
