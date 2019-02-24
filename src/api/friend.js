import interceptor from '@/utils/interceptor'

export function getUserFriends() {
  return interceptor({
    url: 'friend/getUserFriends',
    method: 'post'
  })
}
export function getPeopleList(recommendType) {
  return interceptor({
    url: 'friend/getPeopleList',
    method: 'post',
    params: {
      recommendType
    }
  })
}
export function deleteFriend(friend_id) {
  return interceptor({
    url: 'friend/deleteFriend',
    method: 'post',
    params: {
      friend_id
    }
  })
}
export function addNewFriend(friend_id) {
  return interceptor({
    url: 'friend/addNewFriend',
    method: 'post',
    params: {
      friend_id
    }
  })
}