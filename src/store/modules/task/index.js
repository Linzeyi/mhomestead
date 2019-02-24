import * as taskJs from '@/api/task'

const state = {
  
}
const getters = {

}
const mutations = {}

const actions = {
  GetUserTasks({commit},pageForm){
    return new Promise((resolve,reject) =>{
      taskJs.getUserTasks(pageForm.pageNum,pageForm.pageSize).then(res =>{
        console.log(res)
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