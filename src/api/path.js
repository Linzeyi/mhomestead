import interceptor from '@/utils/interceptor'


export function getUserPaths() {
  return interceptor({
    url: 'path/getUserPaths',
    method: 'post'
  })
}
export function getUserHurryPaths() {
  return interceptor({
    url: 'path/getUserHurryPaths',
    method: 'post'
  })
}
export function updatePath(path) {
  return interceptor({
    url: 'path/updatePath',
    method: 'post',
    data: path
  })
}
export function deletePath(path_id) {
  return interceptor({
    url: 'path/deletePath',
    method: 'post',
    params: {
      path_id
    }
  })
}
export function addNewPath(path) {
  return interceptor({
    url: 'path/addNewPath',
    method: 'post',
    data: path
  })
}