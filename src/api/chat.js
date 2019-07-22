import interceptor from '@/utils/interceptor'

export function handleChat(chatItem) {
  return interceptor({
    url: 'chat/handleChat',
    method: 'post',
    data: chatItem
  })
}

export function getChatList(size,friend_id) {
  return interceptor({
    url: 'chat/getChatList',
    method: 'post',
    params: {
      size,
      friend_id
    }
  })
}
