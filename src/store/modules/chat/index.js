import * as chatJs from '@/api/chat'

const state = {
  
}
const getters = {

}
const mutations = {}

const actions = {
  HandleChat({commit},chatItem){
    return new Promise((resolve,reject) =>{
      chatJs.handleChat(chatItem).then(res =>{
        // console.log(res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  GetChatList({commit},{size,friend_id}){
    return new Promise((resolve,reject) => {
      chatJs.getChatList(size,friend_id).then(res => {
        resolve(res)
      }).catch(err => {

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