import type { LinkModel, LinkModelDto } from '~/models/link'
import type { PagerDto, PaginateResult } from '~/models'
import http from '~/composables/requests'

export const getLinks = (pager?: PagerDto) => {
  return http.request<PaginateResult<LinkModel>>({
    url: '/links',
    method: 'GET',
    params: pager,
  })
}

export const getAllLinks = () => {
  return http.request<LinkModel[]>({
    url: '/links/all',
    method: 'GET',
  })
}

export const deleteLink = (id: string) => {
  return http.request({
    url: `/links/${id}`,
    method: 'DELETE',
  })
}

export const updateLink = (id: string, data: LinkModelDto) => {
  return http.request({
    url: `/links/${id}`,
    method: 'PUT',
    data,
  })
}

export const addLink = (data: LinkModelDto) => {
  return http.request({
    url: '/links',
    method: 'POST',
    data,
  })
}

export const checkLinkHealth = () => {
  return http.request({
    url: '/links/health',
    method: 'GET',
  })
}

export const auditLink = (id: string) => {
  return http.request({
    url: `/links/audit/${id}`,
    method: 'PATCH',
  })
}

export function approveLink(id: string) {
  return http.request({
    url: `/links/audit/${id}`,
    method: 'PATCH',
  })
}
export const link = {
  auditLink,
  checkLinkHealth,
  addLink,
  updateLink,
  deleteLink,
  getAllLinks,
  getLinks,
  approveLink,
}
