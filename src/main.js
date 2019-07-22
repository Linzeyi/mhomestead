// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import router from './router'

import jquery from 'jquery'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'

import qs from 'qs'
Vue.prototype.$qs = qs;

import store from './store'

var VueCookie = require('vue-cookie')
Vue.use(VueCookie)

import '@/assets/css/iconfont.css'

import VueDatepickerLocal from 'vue-datepicker-local'
Vue.use(VueDatepickerLocal)

import vcolorpicker from 'vcolorpicker'
Vue.use(vcolorpicker)

import  VueQuillEditor from 'vue-quill-editor'
// require styles 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

//组件
import mheader from '@/components/header'
Vue.component('mheader',mheader)
import draggable from 'vuedraggable'
Vue.component('draggable',draggable)
import sortable  from 'sortablejs'

import util from '@/utils/util.js'
Vue.use(util)

import vuescroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';

Vue.use(vuescroll);



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  qs,
  components: { App,mheader,draggable,sortable },
  template: '<App/>'
})
