// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/fonts/iconfont.css'
import './assets/css/global.css'

import axios from 'axios'
import ElementUI from 'element-ui'

import NProgress from 'nprogress'
import '../node_modules/nprogress/nprogress.css'

Vue.use(ElementUI)

axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'

//设置拦截器   给所有ajax请求带上token信息   直接去npmjs.com网站上去找
axios.interceptors.request.use(function (config) {

  //设置请求开始动画 设置在请求里面
  NProgress.start();
  //需要授权的 API ，必须在请求头中使用 Authorization 字段提供 token 令牌
  const token = window.sessionStorage.getItem('token')
  // 给ajax的请求头设置Authorization为token
  config.headers.Authorization = token
  return config;
}, function (error) {
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么   请求动画结束
  NProgress.done();
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

Vue.prototype.$http = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render:c=>c(App)
})
