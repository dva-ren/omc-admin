import http from '~/composables/requests'
import type { PaginateResult } from '~/models'
import type { ImageModel, ImageQueryDto } from '~/models/image'

export const getImages = (params?: ImageQueryDto) => {
  return http.request<PaginateResult<ImageModel>>({
    url: '/images',
    method: 'GET',
    params,
  })
}

export const addImage = (data: ImageModel) => {
  return http.request<ImageModel>({
    url: '/images',
    method: 'POST',
    data,
  })
}

export const updateImage = (id: string, data: ImageModel) => {
  return http.request<ImageModel>({
    url: `/images/${id}`,
    method: 'PUT',
    data,
  })
}
export const deleteImage = (id: string) => {
  return http.request({
    url: `/images/${id}`,
    method: 'DELETE',
  })
}

export const getImageById = (id: string) => {
  return http.request<ImageModel>({
    url: `/images/${id}`,
    method: 'GET',
  })
}

export const deleteMany = (ids: string[]) => {
  return http.request({
    url: '/images/deletemany',
    method: 'DELETE',
    data: {
      ids,
    },
  })
}

export const imageApi = {
  getImages,
  addImage,
  updateImage,
  deleteImage,
  getImageById,
  deleteMany,
}
