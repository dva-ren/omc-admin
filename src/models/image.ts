export interface ImageModel {
  id: string
  description?: string
  height?: number
  location?: string
  path?: string
  tag?: string[]
  title?: string
  url: string
  width?: number
  created: string
  updated: string
}

export type ImageQueryDto = {
  page?: number
  size?: number
} &
Pick<ImageModel, 'height' | 'width' | 'tag' | 'path' | 'location'>
