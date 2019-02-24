import { signIn,regist,signOut } from '@/api/login'
import * as userJs  from '@/api/user'
import cookie from 'vue-cookie'

const state = {
  name: 'root',
  token: ''
}
const getters = {
  name:state => state.name,
  token:state => state.token
}
const mutations = {
  SET_TOKEN(state,token){
    state.token = token
  },
  SET_NAME(state,name){
    state.name = name
  },
  SET_STATE(state,data){
    state.name = data.name
    state.token = data.token
  }
}
const actions = {
  GetUserInfo({ commit }){
    return new Promise((resolve,reject) => {
      userJs.getUserInfo().then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  SignIn({ commit },loginForm){
    const username = loginForm.username.trim()
    const password = loginForm.password.trim()
    return new Promise((resolve,reject) => {
      signIn(username,password).then(res => {
        const data = res.data.data
        commit("SET_TOKEN",data.token)
        commit("SET_NAME",data.name)
        cookie.set('name',data.name,1)
        cookie.set('token',data.token,1)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  initState({commit},data){
    commit("SET_STATE",data)
  },
  Regist({ commit },registForm){
    const username = loginForm.username.trim()
    const password = loginForm.password.trim()
    return new Promise((resolve,reject) => {
      regist(username,password).then(res => {
        const data = res.data.data
        commit("SET_TOKEN",data.token)
        commit("SET_NAME",data.name)
        cookie.set('name',data.name,1)
        cookie.set('token',data.token,1)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  CheckToken({ commit }){
    return new Promise((resolve,reject) => {

    })
  },
  SignOut({ commit, state }){
    return new Promise((resolve,reject) => {
      signOut().then(res => {
        const data = res.data
        commit("SET_TOKEN",'')
        commit("SET_NAME",'')
        cookie.delete('name')
        cookie.delete('token')
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  //前端登出
  FedSignOut({ commit }){
    return new Promise(resolve => {
      cookie.delete('token')
      commit("SET_TOKEN",false)
      resolve()
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
