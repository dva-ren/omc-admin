import http from '~/composables/requests'

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
