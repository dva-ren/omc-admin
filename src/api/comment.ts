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
    params: data,
  })
}

export const modifyCommentState = (id: string, data: CommentStatePatchDto) => {
  return http.request<CommentModel>({
    url: `/comment/${id}`,
    method: 'PATCH',
    data,
  })
}

export const deleteComment = (id: string) => {
  return http.request({
    url: `/comment/${id}`,
    method: 'DELETE',
  })
}

export const deleteComments = (ids: string[]) => {
  return http.request({
    url: '/comment/deletemany',
    method: 'DELETE',
    data: {
      ids,
    },
  })
}
interface TextOnlyDto {
  text: string
  source?: string
}

export const masterReplyComment = (id: string, data: TextOnlyDto) => {
  return http.request<CommentModel>({
    url: `/comment/master/reply/${id}`,
    method: 'POST',
    data,
  })
}
