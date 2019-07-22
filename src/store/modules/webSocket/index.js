const state = {
  ws: '',
  msg: ''
}
const getters = {
  ws: state => state.ws,
  msg:state => state.msg
}
const mutations = {
  SET_WEBSOCKET(state,ws){
    state.ws = ws
  },
  SET_MSG(state,msg){
    state.msg = msg
  }
}
const actions = {
  InitWebSocket({ dispatch,commit },user_id){
    commit("SET_WEBSOCKET",new WebSocket(process.env.wsURL + "/webSocket/" + user_id))
    state.ws.onopen = function () {
      console.log("webSocket连接成功！")
    }
    state.ws.onclose = function() {
      console.log("webSocket断开连接！")
      setTimeout(function(){
        console.log("重新进行webSocket连接...")
        dispatch("InitWebSocket",user_id)
      },10000)
      commit("SET_WEBSOCKET",'')
    }
    state.ws.onerror = function() {
      console.log("webSocket连接失败！")
      commit("SET_WEBSOCKET",'')
    }
    state.ws.onmessage = function(msg){
      console.log("收到一条来自服务器的消息：")
      console.log(msg.data)
      commit("SET_MSG",msg.data)
    }
  },
  Send({dispatch,commit},msgdata){
    var msg = JSON.stringify(msgdata)
    state.ws.send(msg, function(data){
      console.log(data)
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