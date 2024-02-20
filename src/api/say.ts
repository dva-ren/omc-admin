import http from '~/composables/requests'
import type { PaginateResult } from '~/models'
import type { CreateSayModel, SayModel } from '~/models/say'

export const createSay = (data: CreateSayModel) => {
  return http.request<SayModel>({
    url: '/say',
    method: 'POST',
    data,
  })
}

export const getSayList = (pageNum = 1, pageSize = 20) => {
  return http.request<PaginateResult<SayModel>>({
    url: `/say?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'GET',
  })
}

export const updateSay = (id: string, data: CreateSayModel) => {
  return http.request<SayModel[]>({
    url: `/say/${id}`,
    method: 'PUT',
    data,
  })
}

export const getSay = (id: string) => {
  return http.request<SayModel>({
    url: `/say/${id}`,
    method: 'GET',
  })
}

export const deleteSay = (id: string) => {
  return http.request({
    url: `/say/${id}`,
    method: 'DELETE',
  })
}
