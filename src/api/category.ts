import http from '~/composables/requests'
import type { Category, Response } from '~/types'

export const queryCategoryList = (): Response<Array<Category>> => {
  return http.request({
    url: '/category',
    method: 'GET',
  })
}
export const queryCategory = (id: string): Response<Category> => {
  return http.request({
    url: `/category/${id}`,
    method: 'GET',
  })
}
export const addCategory = (data: Category): Response<Category> => {
  return http.request({
    url: '/category',
    method: 'POST',
    data,
  })
}

export const updateCategory = (id: string, data: Category): Response<Category> => {
  return http.request({
    url: `/category/${id}`,
    method: 'POST',
    data,
  })
}

export const deleteCategory = (id: string): Response<null> => {
  return http.request({
    url: `/category/${id}`,
    method: 'PUT',
  })
}
