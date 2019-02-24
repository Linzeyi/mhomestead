import axios from 'axios'
import store from '../store'
import cookie from 'vue-cookie'
import router from '@/router/index'
import qs from 'qs'


// 创建axios实例
const service = axios.create({
  baseURL: process.env.baseURL, // api的base_url
  timeout: 15000                 // 请求超时时间
})

// request 拦截器
service.interceptors.request.use(
  config => {
      if (cookie.get('token')) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
          config.headers.Authorization = `${cookie.get('token')}`;
      }
      // config.headers.ContentType = 'application/json;charset=UTF-8'
      return config;
  },
  err => {
      return Promise.reject(err);
  }
)

// response拦截器
service.interceptors.response.use(
  response => {
    // console.log("拦截器-response:")
    console.log(response)
    if(response.data.code != '200' || response.data.code != 200){
      if (response.data.code === '5' || response.data.code === 5) {  //token过期，返回login
        router.go(0)
        router.push('/login')
      }
      else{
        return Promise.reject(response.data.msg);
      }
    }
    else{
      return response
    }
  },
  err => {
    // console.log(err)
    // return Promise.reject(err);
  }
)

export default service




 