import interceptor from '@/utils/interceptor'


export function signIn(username,password) {
  return interceptor({
    url: 'signIn',
    method: 'post',
    params: {
      username,
      password
    }
  })
}
export function regist(username,password) {
  return interceptor({
    url: 'regist',
    method: 'post',
    data: {
      username,
      password
    }
  })
}
export function signOut() {
  return interceptor({
    url: 'signOut',
    method: 'get'
  })
}
