import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import cookie from 'vue-cookie'
import Login from '@/page/login'
import Home from '@/page/home'
import Life from '@/page/life'
import Note from '@/page/note'
import Document from '@/page/document'
import Friends from '@/page/friends'

Vue.use(Router)

const router = new Router({
  name: 'router',
  routes: [
    {
      path: '',
      component: Login
    },
    {
      path: '/',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        login_require: true
      }
    },
    {
      path: '/life',
      name: 'Life',
      component: Life,
      meta: {
        login_require: true
      }
    },
    {
      path: '/note',
      name: 'Note',
      component: Note,
      meta: {
        login_require: true
      }
    },
    {
      path: '/document',
      name: 'Document',
      component: Document,
      meta: {
        login_require: true
      }
    },
    {
      path: '/friends',
      name: 'Friends',
      component: Friends,
      meta: {
        login_require: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component:Login,
      meta: {
        login_require: false
      }
    }
  ],
  linkActiveClass: 'active',
  mode: 'history',
  history: true,
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


