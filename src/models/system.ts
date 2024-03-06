export interface LogModel {
  _id: string
  path: string
  method: string
  ip: string
  ua: string
  created: string
  updated: string
  id: string
}

export interface LogQueryDto {
  path?: string
  method?: string
  ip?: string
  ua?: string
  page?: number
  size?: number
}
