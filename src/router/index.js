import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
Vue.use(VueRouter)

const routes = [

  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login')
  },
  {
    path: '/',
    component: () => import('@/views/Home'),
    children: [
      {
        path: '',
        component: () => import('@/views/Welcome')
      },
      {
        path: 'users',
        component: () => import('@/views/Users')
      },
      {
        path: 'roles',
        component: () => import('@/views/Roles')
      },
      {
        path: 'rights',
        component: () => import('@/views/Rights')
      },
      {
        path: 'goods',
        component: () => import('@/views/Goods')
      },
      {
        path: 'goods/add',
        component: () => import('@/views/Add')
      },
      {
        path: 'params',
        component: () => import('@/views/Params')
      },
      {
        path: 'categories',
        component: () => import('@/views/Categories')
      },
      {
        path: 'orders',
        component: () => import('@/views/Orders')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 前置路由守卫
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !store.state.user.token) next({ name: 'Login' })
  else next()
})
export default router
