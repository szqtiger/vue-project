import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import home from '@/components/home'
import welcome from '@/components/welcome'
import user from '@/components/user'
import rights from '@/components/rights'
import Role from '@/components/Role'
import cate from '@/components/cat'
import reports from '@/components/reports'
Vue.use(Router)

const router = new Router({
  routes: [
      {path:'/',redirect:'/home'},
      {path:'/login',component:Login},
      {path:'/home',
       component:home,
       redirect:'/welcome',
       children:[
        {path:'/welcome',component:welcome},
        {path:'/users',component:user},
        {path:'/rights',component:rights},
        {path:'/roles',component:Role},
        {path:'/categories',component:cate},
        {path:'/reports',component:reports}
      ]
    }
  ]
})

// 设置路由守卫  让没带token的都去登录页
router.beforeEach((to, from, next) => {
  var token = window.sessionStorage.getItem('token')
  if(token===null && to.path!=='/login'){
    return next('/login')
  }
  next()
})
export  default router