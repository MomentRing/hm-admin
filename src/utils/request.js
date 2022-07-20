import axios from 'axios'
import store from '@/store'
const request = axios.create({
  baseURL: 'http://liufusong.top:8899/api/private/v1/',
  timeout: 8000
})

request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers = {
    Authorization: store.state.user.token
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

export default request
