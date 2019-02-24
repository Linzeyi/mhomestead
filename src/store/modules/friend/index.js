import * as friendJs from '@/api/friend'

const state = {
  
}
const getters = {

}
const mutations = {}

const actions = {
  GetUserFriends({commit}){
    return new Promise((resolve,reject) =>{
      friendJs.getUserFriends().then(res =>{
        // console.log(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  GetPeopleList({commit},recommendType){
    return new Promise((resolve,reject) =>{
      friendJs.getPeopleList(recommendType).then(res =>{
        // console.log(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  DeleteFriend({commit},friend_id){
    return new Promise((resolve,reject) =>{
      friendJs.deleteFriend(friend_id).then(res =>{
        // console.log(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  AddNewFriend({commit},friend_id){
    return new Promise((resolve,reject) =>{
      friendJs.addNewFriend(friend_id).then(res =>{
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