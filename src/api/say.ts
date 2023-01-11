import http from '~/composables/requests'
import type { AsyncResponse, PageInfo, Say } from '~/types'

type SayListResult = AsyncResponse<PageInfo<Say>>

export const querySayList = (pageNum = 1, pageSize = 20): SayListResult => {
  return http.request({
    url: `/say?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'GET',
  })
}
export const querySay = (id: string): AsyncResponse<Say> => {
  return http.request({
    url: `/say/${id}`,
    method: 'GET',
  })
}
export const addSay = (data: Say): AsyncResponse<Say> => {
  return http.request({
    url: '/say',
    method: 'POST',
    data,
  })
}

export const updateSay = (id: string, data: Say): AsyncResponse<Say> => {
  return http.request({
    url: `/say/${id}`,
    method: 'POST',
    data,
  })
}

export const deleteSay = (id: string): AsyncResponse<null> => {
  return http.request({
    url: `/say/${id}`,
    method: 'PUT',
  })
}
