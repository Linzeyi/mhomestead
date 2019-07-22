import * as tagsJs from '@/api/tags'

const state = {
  
}
const getters = {

}
const mutations = {}

const actions = {
  GetTaskTags({commit},task_id){
    return new Promise((resolve,reject) =>{
      tagsJs.getTaskTags(task_id).then(res =>{
        // console.log(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  GetGoalTags({commit},goal_id){
    return new Promise((resolve,reject) =>{
      tagsJs.getGoalTags(goal_id).then(res =>{
        // console.log(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  GetNoteTags({commit},note_id){
    return new Promise((resolve,reject) =>{
      tagsJs.getNoteTags(note_id).then(res =>{
        // console.log(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  GetAllTagsByType({commit},type){
    return new Promise((resolve,reject) => {
      tagsJs.getAllTagsByType(type).then(res =>{
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  SaveTag({commit},tag){
    return new Promise((resolve,reject) =>{
      tagsJs.saveTag(tag).then(res =>{
        // console.log(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  DeleteTag({commit},tags_id){
    return new Promise((resolve,reject) =>{
      tagsJs.deleteTag(tags_id).then(res =>{
        // console.log(res)
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