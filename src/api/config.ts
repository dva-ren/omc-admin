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
