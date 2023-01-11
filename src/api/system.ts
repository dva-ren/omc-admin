import http from '~/composables/requests'
import type { AsyncResponse, Master, MasterForm, SystemState } from '~/types'

/**
 * 登录
 * @param password 密码
 * @returns null
 */
export const login = (password: string): AsyncResponse<Master> => {
  return http.request({
    url: '/login',
    method: 'POST',
    data: { password },
  })
}

/**
 * 更改密码
 * @param password 密码
 * @returns null
 */
export const updatePassword = (password: string): AsyncResponse<null> => {
  return http.request({
    url: '/password',
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
    url: '/master',
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
    url: '/master',
    method: 'GET',
  })
}

/**
 * 获取系统状态信息
 * @returns 系统状态信息
 *
 */
export const querySystemState = (): AsyncResponse<SystemState> => {
  return http.request({
    url: '/state',
    method: 'GET',
  })
}
