export interface BaseUserModel {
  introduce: string
  mail: string
  url: string
  name: string
  avatar: string
  socialIds?: Record<string, string | number>
}

export interface UserModel extends BaseUserModel {
  id: string
  username: string
  created: string
  lastLoginTime: string
  lastLoginIp?: string
  apiToken?: string
}

export type UserDto = Partial<BaseUserModel>
