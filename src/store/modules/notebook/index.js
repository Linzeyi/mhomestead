import * as notebookJs from '@/api/notebook'

const state = {
  
}
const getters = {

}
const mutations = {}

const actions = {
  GetUserNotebooks({commit}){
    return new Promise((resolve,reject) =>{
      notebookJs.getUserNotebooks().then(res =>{
        // console.log(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  AddNewNotebook({commit},newNotebook){
    return new Promise((resolve,reject) =>{
      notebookJs.addNewNotebook(newNotebook).then(res =>{
        // console.log(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  UpdateNotebook({commit},newNotebook){
    return new Promise((resolve,reject) =>{
      notebookJs.updateNotebook(newNotebook).then(res =>{
        // console.log(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  DeleteNotebook({commit},notebook_id){
    return new Promise((resolve,reject) => {
      notebookJs.deleteNotebook(notebook_id).then(res =>{
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