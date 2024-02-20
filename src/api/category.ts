import http from '~/composables/requests'
import type { CategoryDto, CategoryModel, CategoryResponse } from '~/models/category'

export const createCategory = (data: CategoryDto) => {
  return http.request<CategoryModel>({
    url: '/categories',
    method: 'POST',
    data,
  })
}

export const getAllCategories = () => {
  return http.request<CategoryResponse>({
    url: '/categories',
    method: 'GET',
  })
}

export const updateCategory = (id: string, data: CategoryDto) => {
  return http.request<CategoryModel>({
    url: `/categories/${id}`,
    method: 'PUT',
    data,
  })
}

export const deleteCateGory = (id: string) => {
  return http.request({
    url: `/categories/${id}`,
    method: 'DELETE',
  })
}
