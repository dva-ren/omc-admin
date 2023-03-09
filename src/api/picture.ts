import http from '~/composables/requests'
import type { AsyncResponse, PageInfo, Picture, PictureForm } from '~/types'

type PictureListResult = AsyncResponse<PageInfo<Picture>>
interface PictureParams {
  labels?: string
  pageNum?: number
  pageSize: number
}
export const queryPictrues = (params: PictureParams): PictureListResult => {
  return http.request({
    url: '/picture',
    method: 'GET',
    params,
  })
}

export const addPictrue = (picture: PictureForm): PictureListResult => {
  return http.request({
    url: '/picture',
    method: 'POST',
    data: picture,
  })
}

export const updatePictrue = (id: string, picture: PictureForm): PictureListResult => {
  return http.request({
    url: `/picture/update/${id}`,
    method: 'POST',
    data: picture,
  })
}

export const deletePictrue = (id: string): PictureListResult => {
  return http.request({
    url: `/picture/delete/${id}`,
    method: 'POST',
  })
}
