import { defineStore } from 'pinia'
import type { UserModel } from '~/models/user'
import { getMasterInfo } from '~/api/user'
import { ACCESS_TOKEN } from '~/constants/system'
export const useMasterStore = defineStore('master', () => {
  const masterInfo = reactive<UserModel>({
    avatar: '',
    name: '',
    created: '',
    id: '',
    introduce: '',
    lastLoginTime: '',
    mail: '',
    socialIds: {},
    url: '',
    username: '',
    lastLoginIp: '',
  })

  async function initMasterInfo() {
    // const token = localStorage.getItem(ACCESS_TOKEN)
    try {
      const master = await getMasterInfo()
      if (master)
        Object.assign(masterInfo, master)
    }
    catch (e: any) {
      if (e.response.status === 400 && location.pathname !== '/init')
        location.replace('/init')
    }
  }
  initMasterInfo()
  function logout() {
    localStorage.removeItem(ACCESS_TOKEN)
    location.href = '/login'
  }
  return {
    masterInfo,
    initMasterInfo,
    logout,
  }
})
