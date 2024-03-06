import http from '~/composables/requests'
import type { StatModel } from '~/models'

export const getAggregate = () => {
  return http.request({
    url: '/aggregate',
    method: 'GET',
  })
}

export const getAggregateStat = () => {
  return http.request<StatModel>({
    url: '/aggregate/stat',
    method: 'GET',
  })
}
