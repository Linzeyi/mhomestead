import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import user from './modules/user/index.js'
import task from './modules/task/index.js'
import goal from './modules/goal/index.js'
import path from './modules/path/index.js'
import notebook from './modules/notebook/index.js'
import note from './modules/note/index.js'
import friend from './modules/friend/index.js'
import tag from './modules/tag/index.js'
import chat from './modules/chat/index.js'
import doc from './modules/doc/index.js'
import webSocket from './modules/webSocket/index.js'

const state = {
  shownFixed: false,
  isEdit: false,
}
const getters = {
  shownFixed:state => state.shownFixed,
  isEdit:state => state.isEdit
}
const mutations = {
  SET_SHOWNFIXED(state,flag){
    state.shownFixed = flag
  },
  SET_ISEDIT(state,flag){
    state.isEdit = flag
  }
}
const actions = {
  SetIsEdit({commit},flag){
    // alert("storeChange:" + flag)
    commit('SET_ISEDIT',flag)
  }
}
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
    user: user,
    task: task,
    goal: goal,
    path: path,
    tag: tag,
    notebook: notebook,
    note: note,
    friend: friend,
    chat: chat,
    doc: doc,
    webSocket: webSocket
  }
})