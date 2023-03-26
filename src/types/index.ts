export interface Response<T> {
  code: number
  msg: string
  token?: string
  data: T
}
export type AsyncResponse<T> = Promise<Response<T>>

export interface PageParams {
  pageSize: number
  pageNum: string
}

export interface PageInfo<T> {
  total: number
  list: T[]
  pageNum: number
  pageSize: number
  size: number
  startRow: number
  endRow: number
  pages: number
  prePage: number
  nextPage: number
  isFirstPage: boolean
  isLastPage: boolean
  hasPreviousPage: boolean
  hasNextPage: boolean
  navigatePages: number
  navigatepageNums: number[]
  navigateFirstPage: number
  navigateLastPage: number
}
export interface ArticleForm {
  title: string
  content: string
  summary?: string
  categoryId: string
  categoryName?: string
  label?: string
  cover?: string
  isTop: number
  status: number
  socialIds: Array<{ key: string; value: string | number }>
  allowComment: number
  createTime?: string
}
export interface Article {
  id: string
  summary: string
  title: string
  content: string
  categoryId: string
  categoryName: string
  label: string
  cover: string
  isTop: number
  status: number
  commentCount: number
  viewCount: number
  allowComment: number
  createBy: string
  createTime: string
  updateTime: string
  isDelete: number
}
export interface NoteForm {
  id: string
  title: string
  summary: string
  categoryId: string
  content: string
  mood: string
  weather: string
  position: string
  cover: string
  musicId: string
  isTop: number
  status: number
  allowComment: number
  publishTime: string
  createTime: string
}

export interface Note extends NoteForm {
  commentCount: number
  viewCount: number
  updateTime: string
  isDelete: number
}

export interface Category {
  id: string
  name: string
  description: string
  pid: string
  status: number
  createTime: string
  updateTime: string
  isDelete: number
}

export interface Say {
  id: string
  content: string
  author: string
  origin: string
  isTop: number
  status: number
  createTime: string
  updateTime: string
  isDelete: number
}
export interface MasterForm {
  id: string
  introduce: string
  mail: string
  url: string
  username: string
  nickname: string
  avatar: string
  socialIds: Array<{ key: string; value: string }>
}

export interface Master extends MasterForm {
  id: string
  lastLoginIp: string
  lastLoginTime: string
  createTime: string
  updateTime: string
}

export interface Socialids {
  bilibili: number
  netease: number
  github: string
}

export interface SystemState {
  allComments: number
  categories: number
  comments: number
  link_apply: number
  links: number
  notes: number
  pages: number
  posts: number
  says: number
  recently: number
  unreadComments: number
  online: number
  todayMaxOnline: number
  todayOnlineTotal: number
  callTime: number
  uv: number
  todayIpAccessCount: number
}

/**
 * 评论
 */
export interface Comment {
  id: string
  ref: string
  refType: string
  author: string
  mail: string
  url: string
  content: string
  parent: string
  sendIp: string
  commentsIndex: number
  key: string
  location: string
  isWhispers: number
  avatar: string
  children: Comment[]
  status: number
  createTime: string
  updateTime: string
}

export interface Log {
  id: string
  path: string
  ip: string
  ua: string
  createTime: string
}

export interface IP {
  code: number
  msg: string
  ipinfo: Ipinfo
  ipdata: Ipdata
  adcode: Adcode
  tips: string
  time: number
}

interface Adcode {
  o: string
  p: string
  c: string
  n: string
  r: string
  a: string
  i: boolean
}

interface Ipdata {
  info1: string
  info2: string
  info3: string
  isp: string
}

interface Ipinfo {
  type: string
  text: string
  cnip: boolean
}

export interface Picture {
  id: string
  url: string
  nickname?: string
  position?: string
  labels?: string
  description?: string
  createTime: string
  updateTime: string
  isDelete: number
}
export interface PictureForm {
  id?: string
  url: string
  nickname?: string
  position?: string
  labels?: string
  description?: string
}
