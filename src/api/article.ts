import http from '~/composables/requests'
import type { Article, PageInfo, AsyncResponse } from '~/types'

type ArticleListResult = AsyncResponse<PageInfo<Article>>

export const queryArticleList = (pageNum = 1, pageSize = 20): ArticleListResult => {
  return http.request({
    url: `/article?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'GET',
  })
}
export const queryArticle = (id: string): AsyncResponse<Article> => {
  return http.request({
    url: `/article/${id}`,
    method: 'GET',
  })
}
export const addArticle = (data: Article): AsyncResponse<Article> => {
  return http.request({
    url: '/article',
    method: 'POST',
    data,
  })
}

export const updateArticle = (id: string, data: Article): AsyncResponse<Article> => {
  return http.request({
    url: `/article/${id}`,
    method: 'POST',
    data,
  })
}

export const deleteArticle = (id: string): AsyncResponse<null> => {
  return http.request({
    url: `/article/${id}`,
    method: 'PUT',
  })
}
