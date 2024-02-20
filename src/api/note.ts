import type { NoteCreateModel, NoteModel, NoteResponse } from '~/models/note'
import http from '~/composables/requests'

export const getNoteList = (pageNum = 1, pageSize = 20) => {
  return http.request<NoteResponse>({
    url: `/notes?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'GET',
  })
}
export const getNote = (id?: string) => {
  return http.request<NoteModel>({
    url: `/notes/${id ?? 'latest'}`,
    method: 'GET',
  })
}

export const addNote = (data: NoteCreateModel) => {
  return http.request<NoteModel>({
    url: '/notes',
    method: 'POST',
    data,
  })
}

export const updateNote = (id: string, data: NoteCreateModel) => {
  return http.request<NoteModel>({
    url: `/notes/${id}`,
    method: 'PUT',
    data,
  })
}

export const deleteNote = (id: string) => {
  return http.request({
    url: `/notes/${id}`,
    method: 'DELETE',
  })
}
