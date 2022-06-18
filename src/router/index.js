import { createRouter, createWebHistory } from 'vue-router'

const Login = () => import('../pages/Login.vue')
const Redirect = () => import('../pages/redirect.vue')
const NotFound = () => import('../pages/NotFound.vue')

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { require: true, hidden: true },
  },
  {
    path: '/redirect',
    name: 'redirect',
    component: Redirect,
    meta: { require: true, hidden: true },
  },
  {
    // 会匹配所有路径,添加路由时请放在该配置前面
    path: '/404',
    name: '404',
    component: NotFound,
    meta: { require: true, hidden: true },
  },
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})
export default router
