import http from '~/composables/requests'
import type { Article, PageInfo, Response } from '~/types'

type ArticleListResult = Response<PageInfo<Article>>

export const queryArticleList = (pageNum = 1, pageSize = 20): ArticleListResult => {
  return http.request({
    url: `/article?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'GET',
  })
}
export const queryArticle = (id: string): Response<Article> => {
  return http.request({
    url: `/article/${id}`,
    method: 'GET',
  })
}
export const addArticle = (data: Article): Response<Article> => {
  return http.request({
    url: '/article',
    method: 'POST',
    data,
  })
}

export const updateArticle = (id: string, data: Article): Response<Article> => {
  return http.request({
    url: `/article/${id}`,
    method: 'POST',
    data,
  })
}

export const deleteArticle = (id: string): Response<null> => {
  return http.request({
    url: `/article/${id}`,
    method: 'PUT',
  })
}
