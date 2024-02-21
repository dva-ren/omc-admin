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
    const token = localStorage.getItem(ACCESS_TOKEN)
    if (!token)
      return
    const master = await getMasterInfo()
    if (master)
      Object.assign(masterInfo, master)
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
