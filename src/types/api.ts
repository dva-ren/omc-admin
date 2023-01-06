export interface ArticleForm {
  _id?: string
  title: string
  content: string
  category: Category
  label?: string[]
  cover?: string
  topping: boolean
  allowComment: boolean
}

export interface Article extends ArticleForm {
  createTime: string | Date
  updateTime?: string | Date
  state: 0 | 1 | 2
}

export interface Category {
  _id?: string
  name: string
  value: string
  count?: number
  createTime?: string | Date
  updateTime?: string | Date
}
export interface Note {
  _id?: string
  title: string
  content: string
  mood: string
  weather: string
  position: string
  allowComment: boolean
  state: 0 | 1 | 2
  topping: boolean
  publishTime?: string | Date
  createTime: string | Date
  updateTime?: string | Date
}

export interface LoginForm {
  username: string
  password: string
}

export interface User {
  _id: string
  username: string
  role: string
  isDeleted: number
  createTime: string
  updateTime: string
}

export interface Image {
  _id?: string
  name: string
  url: string
  articleId?: string
  description?: string
  createTime?: string
  state?: number
}

export interface Picture {
  _id?: string
  nickname: string
  url: string
  labels: string[]
  description?: string
  createTime?: string | Date
  updateTime?: string | Date
  state?: number
}

export interface PictureMessage {
  _id?: string
  pictureId: string
  nickname: string
  content: string
  createTime?: string
  updateTime?: string
  state?: number
}

export interface Say {
  _id: string
  content: string
  origin?: string
  author?: string
  state?: number
  createTime?: string
  updateTime?: string
}
