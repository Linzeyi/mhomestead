import { signIn,regist,signOut } from '@/api/login'
import * as userJs  from '@/api/user'
import cookie from 'vue-cookie'

const state = {
  userInfo: ''
}
const getters = {
  userInfo:state => state.userInfo,
  id:state => state.userInfo.id,
  name:state => {
    if(state.userInfo == ''){
      return cookie.get('name')
    }
    else{
      return state.userInfo.name
    }
  },
  username:state => {
    if(state.userInfo == ''){
      return cookie.get('username')
    }
    else{
      return state.userInfo.username
    }
  },
  sex:state => {
    if(state.userInfo == ''){
      return cookie.get('sex')
    }
    else{
      return state.userInfo.sex
    }
  },
  interest:state => state.userInfo.interest
}
const mutations = {
  SET_USERINFO(state,data){
    state.userInfo = data
  }
}
const actions = {
  GetUserInfo({ commit }){
    return new Promise((resolve,reject) => {
      userJs.getUserInfo().then(res => {
        commit("SET_USERINFO",res.data.data)
        cookie.set('sex',res.data.data.sex)
        cookie.set('name',res.data.data.name)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  SignIn({dispatch, commit },loginForm){
    const username = loginForm.username.trim()
    const password = loginForm.password.trim()
    return new Promise((resolve,reject) => {
      signIn(username,password).then(res => {
        const data = res.data.data
        commit("SET_TOKEN",data.token)
        cookie.set('username',data.name,1)
        cookie.set('token',data.token,1)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  Regist({ commit },registForm){
    return new Promise((resolve,reject) => {
      regist(username,password).then(res => {
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
  //前端登出
  SignOut({ commit }){
    return new Promise(resolve => {
      cookie.delete('username')
      cookie.delete('token')
      cookie.delete('name')
      cookie.delete('sex')
      commit("SET_USERINFO",'')
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
