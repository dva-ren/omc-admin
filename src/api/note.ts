import http from '~/composables/requests'
import type { Note, PageInfo, Response } from '~/types'

type NoteListResult = Response<PageInfo<Note>>

export const queryNoteList = (pageNum = 1, pageSize = 20): NoteListResult => {
  return http.request({
    url: `/note?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'GET',
  })
}
export const queryNote = (id: string): Response<Note> => {
  return http.request({
    url: `/note/${id}`,
    method: 'GET',
  })
}
export const addNote = (data: Note): Response<Note> => {
  return http.request({
    url: '/note',
    method: 'POST',
    data,
  })
}

export const updateNote = (id: string, data: Note): Response<Note> => {
  return http.request({
    url: `/note/${id}`,
    method: 'POST',
    data,
  })
}

export const deleteNote = (id: string): Response<null> => {
  return http.request({
    url: `/note/${id}`,
    method: 'PUT',
  })
}
