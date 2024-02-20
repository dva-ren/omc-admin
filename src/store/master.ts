import { defineStore } from 'pinia'
import type { UserModel } from '@omc-space/api-client'
import { getMasterInfo } from '~/api/user'
export const useMasterStore = defineStore('master', () => {
  const masterInfo = reactive<UserModel>({
    avatar: '',
    name: '',
    created: '',
    id: '',
    introduce: '',
    lastLoginTime: '',
    mail: '',
    modified: '',
    postID: '',
    socialIds: {},
    url: '',
    username: '',
    v: 0,
    lastLoginIp: '',
  })

  async function initMasterInfo() {
    const master = await getMasterInfo()
    if (master)
      Object.assign(masterInfo, master)
  }
  initMasterInfo()
  return {
    masterInfo,
    initMasterInfo,
  }
})
