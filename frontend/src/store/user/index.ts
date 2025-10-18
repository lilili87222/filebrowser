import { net_post_user } from '@/service/user'
import { defineStore } from 'pinia'
import { ILoginPayload, IUserStore } from './type'
import qs from 'qs'

export const useUserStore = defineStore('user', {
  state: (): IUserStore => ({
    islogin: false
  }),
  actions: {
    login(payload: ILoginPayload) {
      return net_post_user('/login', undefined, qs.stringify(payload), {
        'content-type': 'application/x-www-form-urlencoded'
      })
    },
    logout() {
      return net_post_user('/logout')
    }
  }
})
