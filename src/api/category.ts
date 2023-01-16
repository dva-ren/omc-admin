import http from '~/composables/requests'
import type { AsyncResponse, Category } from '~/types'

export const queryCategoryList = (): AsyncResponse<Array<Category>> => {
  return http.request({
    url: '/category',
    method: 'GET',
  })
}
export const queryCategory = (id: string): AsyncResponse<Category> => {
  return http.request({
    url: `/category/${id}`,
    method: 'GET',
  })
}
export const addCategory = (data: Category): AsyncResponse<Category> => {
  return http.request({
    url: '/category',
    method: 'POST',
    data,
  })
}

export const updateCategory = (id: string, data: Category): AsyncResponse<Category> => {
  return http.request({
    url: `/category/${id}`,
    method: 'POST',
    data,
  })
}

export const deleteCategory = (id: string): AsyncResponse<null> => {
  return http.request({
    url: `/category/${id}`,
    method: 'PUT',
  })
}
