import { defineStore } from 'pinia'

import { getMaster } from '~/api'
import type { Master } from '~/types'

export const useMainStore = defineStore('main', {
  state() {
    return {
      master: {
        id: '',
        username: '',
        nickname: '',
        avatar: '',
        mail: '',
        introduce: '',
        lastLoginTime: '',
        lastLoginIp: '',
        createTime: '',
        updateTime: '',
        url: '',
        socialIds: [],
      } as Master,
      isLogin: false,
    }
  },
  actions: {
    async init() {
      const res = await getMaster()
      if (res.code === 200) {
        this.master = res.data
        this.isLogin = true
        this.master.socialIds = res.data.socialIds || []
      }
      else if (res.code === 405) {
        localStorage.removeItem('token')
        this.isLogin = false
      }
    },
  },
})
