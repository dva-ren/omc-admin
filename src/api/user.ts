import http from '~/composables/requests'
import type { UserModel } from '~/models/user'

export interface LoginResponse {
  id: string
  token: string
  lastLoginTime: string
  username: string
  created: string
}

export const getMasterInfo = () => {
  return http.request<UserModel>({
    url: '/master',
    method: 'GET',
  })
}

export const login = (username: string, password: string) => {
  return http.request<LoginResponse>({
    url: '/master/login',
    method: 'POST',
    data: {
      username,
      password,
    },
  })
}
