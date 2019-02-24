import interceptor from '@/utils/interceptor'

export function getUserInfo() {
  return interceptor({
    url: 'user/getUserInfo',
    method: 'post'
  })
}