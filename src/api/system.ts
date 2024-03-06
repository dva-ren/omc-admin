import http from '~/composables/requests'
import type { LogModel, LogQueryDto, PaginateResult } from '~/models'

export const getKeys = () => {
  return http.request<Record<string, any>>({
    url: '/system/keys',
    method: 'GET',
  })
}

export const getKey = (key: string) => {
  return http.request<Record<string, any>>({
    url: `/system/keys/${key}`,
    method: 'GET',
  })
}

export const addKey = (key: string, data: any) => {
  return http.request<Record<string, any>>({
    url: `/system/keys/${key}`,
    method: 'POST',
    data,
  })
}

export const updateKey = (key: string, data: any) => {
  return http.request<Record<string, any>>({
    url: `/system/keys/${key}`,
    method: 'PATCH',
    data,
  })
}

export const deleteKey = (key: string) => {
  return http.request<Record<string, any>>({
    url: `/system/keys/${key}`,
    method: 'DELETE',
  })
}

export const deleteLogs = (ids: string[]) => {
  return http.request({
    url: '/log/deletemany',
    method: 'DELETE',
    data: {
      ids,
    },
  })
}

export const queryLogs = (query: LogQueryDto) => {
  return http.request<PaginateResult<LogModel>>({
    url: '/log',
    method: 'GET',
    params: query,
  })
}

export const clearLogs = (date?: Date | string) => {
  return http.request({
    url: '/log/clear',
    method: 'DELETE',
    params: {
      date,
    },
  })
}
