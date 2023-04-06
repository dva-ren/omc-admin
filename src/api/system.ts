import axios from 'axios'
import http from '~/composables/requests'
import type { AsyncResponse, Log, Master, MasterForm, PageInfo, SystemState } from '~/types'

type LogListResult = AsyncResponse<PageInfo<Log>>

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
/**
 * 获取api请求日志
 * @returns 日志
 *
 */
export const queryLogList = (pageNum = 1, pageSize = 20, ip?: string): LogListResult => {
  return http.request({
    url: `/log?pageNum=${pageNum}&pageSize=${pageSize}${ip ? (`&ip=${ip}`) : ''}`,
    method: 'GET',
  })
}

/**
 * 获取近期访问的ip列表
 * @returns ips
 *
 */
export const queryIps = (): AsyncResponse<Array<string>> => {
  return http.request({
    url: '/log/ips',
    method: 'GET',
  })
}

export const clearIps = (): AsyncResponse<Array<string>> => {
  return http.request({
    url: '/log/clearIps',
    method: 'get',
  })
}

export const queryIpInfo = (ip: string) => {
  return axios.get(`https://api.vore.top/api/IPdata?ip=${ip}`)
}

export const queryLocation = (lat: number, lng: number) => {
  return axios.get(`https://restapi.amap.com/v3/geocode/regeo?key=46c16b26e9caec5512791d1f9ad4485f&location=${lat},${lng}`)
}
