import http from '~/composables/requests'
import type { AsyncResponse, Comment, PageInfo } from '~/types'

export const queryComment = (status: number, pageNum = 1, pageSize = 20): AsyncResponse<PageInfo<Comment>> => {
  return http.request({
    url: `/comment?status=${status}&pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'GET',
  })
}

export const changeCommentStatus = (id: string, status: number): AsyncResponse<null> => {
  return http.request({
    url: `/comment/status/${id}/${status}`,
    method: 'POST',
  })
}
export const deleteComment = (id: string): AsyncResponse<null> => {
  return http.request({
    url: `/comment/delete/${id}`,
    method: 'POST',
  })
}
