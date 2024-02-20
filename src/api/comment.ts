import type { CommentModel, CommentStatePatchDto } from '~/models/comment'
import http from '~/composables/requests'
import type { PagerDto, PaginateResult } from '~/models'

export const getComments = (id: string) => {
  return http.request<CommentModel>({
    url: `/comment/${id}`,
    method: 'GET',
  })
}

export const getRecentlyComments = (data?: PagerDto & CommentStatePatchDto) => {
  return http.request<PaginateResult<CommentModel>>({
    url: '/comment',
    method: 'GET',
    data,
  })
}

export const modifyCommentState = (id: string, data: CommentStatePatchDto) => {
  return http.request<CommentModel>({
    url: `/comment/${id}`,
    method: 'PUT',
    data,
  })
}

export const deleteComment = (id: string) => {
  return http.request({
    url: `/comment/${id}`,
    method: 'DELETE',
  })
}
