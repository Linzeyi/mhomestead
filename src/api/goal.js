import interceptor from '@/utils/interceptor'


export function getPathGoals(path_id) {
  return interceptor({
    url: 'goal/getPathGoals',
    method: 'post',
    params: {
      path_id
    }
  })
}
export function addNewGoal(goal) {
  return interceptor({
    url: 'goal/addNewGoal',
    method: 'post',
    data: goal
  })
}
export function updateGoal(goal) {
  return interceptor({
    url: 'goal/updateGoal',
    method: 'post',
    data: goal
  })
}
export function deleteGoal(goal_id) {
  return interceptor({
    url: 'goal/deleteGoal',
    method: 'post',
    params: {
      goal_id
    }
  })
}