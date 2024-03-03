import http from '~/composables/requests'

export const getConfigs = () => {
  return http.request({
    url: '/config',
    method: 'GET',
  })
}

export const getConfigJsonSchema = () => {
  return http.request({
    url: '/config/jsonschema',
    method: 'GET',
  })
}

export const getConfigByKey = (key: string) => {
  return http.request({
    url: `/config/${key}`,
    method: 'GET',
  })
}

export const changeConfig = (key: string, data: Record<string, any>) => {
  return http.request({
    url: `/config/${key}`,
    method: 'PATCH',
    data,
  })
}
