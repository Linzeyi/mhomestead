import * as goalJs from '@/api/goal'

const state = {
  
}
const getters = {

}
const mutations = {}

const actions = {
  GetPathGoals({commit},path_id){
    return new Promise((resolve,reject) =>{
      goalJs.getPathGoals(path_id).then(res =>{
        // console.log(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  AddNewGoal({commit},newGoal){
    return new Promise((resolve,reject) =>{
      goalJs.addNewGoal(newGoal).then(res =>{
        // console.log(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  UpdateGoal({commit},newGoal){
    return new Promise((resolve,reject) =>{
      goalJs.updateGoal(newGoal).then(res =>{
        // console.log(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  DeleteGoal({commit},goal_id){
    return new Promise((resolve,reject) => {
      goalJs.deleteGoal(goal_id).then(res =>{
        // console.loh(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}