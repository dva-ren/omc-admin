import http from '~/composables/requests'
import type { AsyncResponse, Master, MasterForm } from '~/types'

/**
 * 更改密码
 * @param password 密码
 * @returns null
 */
export const updatePassword = (password: string): AsyncResponse<null> => {
  return http.request({
    url: '/changePassword',
    method: 'POST',
    data: { password },
  })
}

/**
 * 更新master信息
 * @param data 信息表单
 * @returns null
 */
export const updateMaster = (data: MasterForm): AsyncResponse<null> => {
  return http.request({
    url: '/user',
    method: 'POST',
    data,
  })
}

/**
 * 获取master信息
 * @returns Master 信息
 */
export const getMaster = (): AsyncResponse<Master> => {
  return http.request({
    url: '/user',
    method: 'GET',
  })
}
