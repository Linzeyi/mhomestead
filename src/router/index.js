import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import cookie from 'vue-cookie'
Vue.use(Router)

const router = new Router({
  name: 'router',
  routes: [
    {
      path: '',
      // component: Login,
      component: resolve => require(['@/page/login'],resolve)
    },
    {
      path: '/',
      // component: Login
      component: resolve => require(['@/page/login'],resolve)
    },
    {
      path: '/home',
      name: 'Home',
      // component: Home,
      component: resolve => require(['@/page/home'],resolve),
      meta: {
        login_require: true
      }
    },
    {
      path: '/life',
      name: 'Life',
      // component: Life,
      component: resolve => require(['@/page/life'],resolve),
      meta: {
        login_require: true
      }
    },
    {
      path: '/note',
      name: 'Note',
      // component: Note,
      component: resolve => require(['@/page/note'],resolve),
      meta: {
        login_require: true
      }
    },
    {
      path: '/document',
      name: 'Document',
      // component: Document,
      component: resolve => require(['@/page/document'],resolve),
      meta: {
        login_require: true
      }
    },
    {
      path: '/friends',
      name: 'Friends',
      // component: Friends,
      component: resolve => require(['@/page/friends'],resolve),
      meta: {
        login_require: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      // component:Login,
      component: resolve => require(['@/page/login'],resolve),
      meta: {
        login_require: false
      }
    }
  ],
  linkActiveClass: 'active',
  mode: 'history',
  history: true,
  base:'/mhomestead/',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach(function(to,from,next){
  var login_require = (to.matched.some(function (item) {   //页面是否需要检测登录状态
      return item.meta.login_require
    }))
  var meta_length = to.matched.length
  

  if (login_require || meta_length == 0) {
    store.commit("SET_SHOWNFIXED",true) //显示或隐藏header等固定组件
    if(cookie.get('token')){
      // if(!store.state.isEdit){
      if(true){
        store.dispatch('user/GetUserInfo').then((res) => {
          console.log("用户信息：")
          console.log(res.data.data)
          if(store.getters['webSocket/ws'] == ''){
            store.dispatch('webSocket/InitWebSocket',store.getters['user/userInfo'].user_id)
          }
        }).catch((e) => {
          console.log(e)
        })
        
        next()
      }
      else {
        next(false)
      }
    } 
    else {
      store.commit("SET_SHOWNFIXED",false) //显示或隐藏header等固定组件
      next('/login')
    }
  } else {
    store.commit("SET_SHOWNFIXED",false) //显示或隐藏header等固定组件
    next()
  }
})
export default router


