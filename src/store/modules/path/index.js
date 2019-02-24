import * as pathJs from '@/api/path'

const state = {
  
}
const getters = {

}
const mutations = {}

const actions = {
  GetUserPaths({commit}){
    return new Promise((resolve,reject) =>{
      pathJs.getUserPaths().then(res =>{
        // console.log(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  DeletePath({commit},path_id){
    return new Promise((resolve,reject) =>{
      pathJs.deletePath(path_id).then(res =>{
        // console.log(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  AddNewPath({commit},newPath){
    return new Promise((resolve,reject) =>{
      pathJs.addNewPath(newPath).then(res =>{
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