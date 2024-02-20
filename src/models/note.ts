import type { Pager } from './base'
import type { TopicModel } from './topic'
export interface NoteModel {
  id: string
  hide: boolean
  allowComment: boolean
  count: {
    read: number
    like: number
  }
  title: string
  text: string
  mood?: string
  weather?: string
  created: string
  modified: string
  hasMemory?: boolean
  password?: string | null
  secret: Date | null
  nid: number
  music?: NoteMusicRecord[]
  location?: string
  topicId?: string
  topic?: TopicModel
  coordinates?: Coordinate

  meta?: any
}

export type NoteCreateModel = Omit<NoteModel, 'id' | 'created' | 'modified' | 'count'>

export interface NoteMusicRecord {
  type: string
  id: string
}

export interface NoteResponse {
  data: NoteModel[]
  pagination: Pager
}

export interface Coordinate {
  latitude: number
  longitude: number
}
