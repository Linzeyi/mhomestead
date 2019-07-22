import interceptor from '@/utils/interceptor'


export function getTaskTags(task_id) {
  return interceptor({
    url: 'tags/getTaskTags',
    method: 'post',
    params: {
      task_id
    }
  })
}
export function getGoalTags(goal_id) {
  return interceptor({
    url: 'tags/getGoalTags',
    method: 'post',
    params: {
      goal_id
    }
  })
}
export function saveTag(tag) {
  return interceptor({
    url: 'tags/saveTag',
    method: 'post',
    data: tag
  })
}
export function getAllTagsByType(type){
  return interceptor({
    url: 'tags/getAllTagsByType',
    method: 'post',
    params: {
      type
    }
  })
}
export function deleteTag(tags_id) {
  return interceptor({
    url: 'tags/deleteTag',
    method: 'post',
    params: {
      tags_id
    }
  })
}

export function getNoteTags(note_id) {
  return interceptor({
    url: 'tags/getNoteTags',
    method: 'post',
    params: {
      note_id
    }
  })
}