import { defineStore } from 'pinia'

import { getMaster } from '~/api'

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
        socialIds: [{
          key: 'bilibili',
          value: '1111',
        }],
      },
      isLogin: false,
    }
  },
  actions: {
    async init() {
      const res = await getMaster()
      if (res.code === 200) {
        this.master = res.data
        this.isLogin = true
      }
      else if (res.code === 405) {
        localStorage.removeItem('token')
        this.isLogin = false
      }
    },
  },
})
