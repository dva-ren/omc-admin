import http from '~/composables/requests'
import type { AsyncResponse, Note, PageInfo } from '~/types'

type NoteListResult = AsyncResponse<PageInfo<Note>>

export const queryNoteList = (pageNum = 1, pageSize = 20): NoteListResult => {
  return http.request({
    url: `/note?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'GET',
  })
}
export const queryNote = (id: string): AsyncResponse<Note> => {
  return http.request({
    url: `/note/${id}`,
    method: 'GET',
  })
}
export const addNote = (data: Note): AsyncResponse<Note> => {
  return http.request({
    url: '/note',
    method: 'POST',
    data,
  })
}

export const updateNote = (id: string, data: Note): AsyncResponse<Note> => {
  return http.request({
    url: `/note/${id}`,
    method: 'POST',
    data,
  })
}

export const deleteNote = (id: string): AsyncResponse<null> => {
  return http.request({
    url: `/note/${id}`,
    method: 'PUT',
  })
}
