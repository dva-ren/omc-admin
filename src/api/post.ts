import type { PostResponse } from '../models/post'
import type { PostDto, PostModel } from '~/models/post'
import http from '~/composables/requests'

export const getPostList = (pageNum = 1, pageSize = 20) => {
  return http.request<PostResponse>({
    url: `/posts?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'GET',
  })
}
export const getPost = (id: string) => {
  return http.request<PostModel>({
    url: `/posts/${id}`,
    method: 'GET',
  })
}

export const addPost = (data: PostDto) => {
  return http.request<PostModel>({
    url: '/posts',
    method: 'POST',
    data,
  })
}

export const updatePost = (id: string, data: PostDto) => {
  return http.request<PostModel>({
    url: `/posts/${id}`,
    method: 'PUT',
    data,
  })
}

export const deletePost = (id: string) => {
  return http.request({
    url: `/posts/${id}`,
    method: 'DELETE',
  })
}
