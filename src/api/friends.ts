import http from '~/composables/requests'
import type { AsyncResponse, Friend, FriendForm } from '~/types'

export const queryFriends = (state: number): AsyncResponse<Array<Friend>> => {
  return http.request({
    url: `/friends?state=${state}`,
    method: 'GET',
  })
}

export const changeFriendState = (id: string, state: number): AsyncResponse<null> => {
  return http.request({
    url: '/friends/change',
    method: 'POST',
    data: {
      id,
      state,
    },
  })
}

export const addFriend = (friend: FriendForm): AsyncResponse<null> => {
  return http.request({
    url: '/friends',
    method: 'POST',
    data: friend,
  })
}
export const updateFriend = (friend: FriendForm): AsyncResponse<null> => {
  return http.request({
    url: '/friends/update',
    method: 'POST',
    data: friend,
  })
}

export const deleteFriend = (id: string): AsyncResponse<null> => {
  return http.request({
    url: `/friends/delete/${id}`,
    method: 'POST',
  })
}
