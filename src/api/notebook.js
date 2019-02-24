import interceptor from '@/utils/interceptor'


export function getUserNotebooks() {
  return interceptor({
    url: 'notebook/getUserNotebooks',
    method: 'post'
  })
}
export function addNewNotebook(notebook) {
  return interceptor({
    url: 'notebook/addNewNotebook',
    method: 'post',
    data: notebook
  })
}
export function updateNotebook(notebook) {
  return interceptor({
    url: 'notebook/updateNotebook',
    method: 'post',
    data: notebook
  })
}
export function deleteNotebook(notebook_id) {
  return interceptor({
    url: 'notebook/deleteNotebook',
    method: 'post',
    params: {
      notebook_id
    }
  })
}