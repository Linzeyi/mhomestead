import interceptor from '@/utils/interceptor'


export function getUserTasks(pageNum,pageSize) {
  return interceptor({
    url: 'task/getUserTasks',
    method: 'post',
    params: {
      pageNum,
      pageSize
    }
  })
}