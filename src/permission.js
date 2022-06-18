import router from './router'
import store from './store'
import NProgress from '@/plugins/progress'
import { LocalGetUserInfo, LocalSetMenu, LocalGetToken, LocalSetToken, LocalGetUserRole, LocalSetUserRole, LocalGetMenu } from '@/utils/localStorage'

import { getMenuList } from '@/server/request/LeapServer'

import { asyncRouterMap } from '@/router/router.async'

import { h, resolveComponent } from 'vue'

const RouteView = {
  name: 'RouteView',
  render: () => h(resolveComponent('router-view')),
}

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'redirect'] // no redirect whitelist
const loginRoutePath = '/login'

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  /* has token */
  let token = LocalGetToken()
  let user = LocalGetUserInfo()
  const userMenu = LocalGetMenu()
  // if (!token && to.name == 'redirect') {
  //   let id = to.params.id
  //   LocalSetToken(id)
  // }
  // token = LocalGetToken()
  // 这里还有点问题， 应该重新登录后就要清空这个地方
  if (token && user) {
    if (to.path === loginRoutePath) {
      NProgress.done()
      store.dispatch('Logout').then(() => {
        next({ path: loginRoutePath })
      })
    } else {
      // check login user.roles is null
      // request login userInfo const menu = LocalGetMenu()
      // const userRole = LocalGetUserRole()
      if (!to.meta.require || !userMenu) {
        userRouterHandle()
          .then((res) => {
            LocalSetMenu(res) //全部路由

            router.addRoute({ path: '/:pathMatch(.*)', redirect: '/404' })
            // 根据roles权限生成可访问的路由表
            // 动态添加可访问路由表
            // router.addRoutes(res)
            // 请求带有 redirect 重定向时，登录自动重定向到该地址
            // const redirect = decodeURIComponent(from.query.redirect || to.path)
            let menu = LocalGetUserRole() //获取当前角色的路由-跳转第一项
            if (to.path == '/') {
              next({ path: '/' + menu[0].url })
            }
            if (to.redirect) {
              // set the replace: true so the navigation will not leave a history record
              next({ path: to.redirect })
            } else {
              // 跳转到目的路由
              next({ ...to, replace: true })
            }
          })
          .catch(() => {
            store.dispatch('Logout').then(() => {
              next({ path: loginRoutePath })
            })
          })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      store.dispatch('Logout').then(() => {
        next({ path: loginRoutePath })
      })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

const userRouterHandle = () => {
  return new Promise((resolve, reject) => {
    // 在这里获取用户的权限
    getLocalUserMenu().then((menu) => {
      console.log(menu, 'menu')
      let asyncRouter = []
      const copyAsyncRouterMap = []
      deepClone(asyncRouterMap, copyAsyncRouterMap)
      if (copyAsyncRouterMap && copyAsyncRouterMap.length > 0) {
        asyncRouter = copyAsyncRouterMap
      }
      if (menu && menu.length > 0) {
        filterAsyncRouter(asyncRouter, menu)
        resolve(copyAsyncRouterMap[0])
      } else {
        reject(new Error('menuList is null'))
      }
    })
  })
}

const getLocalUserMenu = () => {
  return new Promise((resolve) => {
    const menu = LocalGetUserRole()
    if (menu && menu.length > 0) {
      resolve(menu)
    } else {
      // 在这里获取用户的权限
      getMenuList().then((menu) => {
        LocalSetUserRole(menu)
        resolve(menu)
      })
    }
  })
}
const filterRoles = (roles, name) => {
  return roles.filter((item) => item.url === name)
}

function filterAsyncRouter(routerMap, roles, parentRoute) {
  routerMap.map((route) => {
    const filterRole = filterRoles(roles, route.name)
    /* if (route.path === '/') {
      route.redirect = roles[0].url
      router.addRoute(toRoutes(route))
    } */
    if (filterRole && filterRole.length > 0) {
      route.hidden = false
      if (parentRoute) {
        parentRoute.hidden = false
        const hasBool = router.hasRoute(parentRoute.name)
        if (!hasBool) {
          router.addRoute(toRoutes(parentRoute))
        }
        router.addRoute(parentRoute.name, toRoutes(route))
      } else {
        router.addRoute(toRoutes(route))
      }
    }
    if (route.children && route.children.length > 0) {
      filterAsyncRouter(route.children, roles, route)
    }
  })
}

const toRoutes = (item) => {
  Object.assign(item.meta, {
    require: true,
  })
  return {
    path: item.path,
    name: item.name,
    component: item.component || RouteView,
    redirect: item.redirect,
    meta: item.meta,
  }
}

function deepClone(origin, target) {
  var tar = target || {}
  const toStr = Object.prototype.toString
  var arrType = '[object Array]'

  for (var k in origin) {
    if (Object.prototype.hasOwnProperty.call(origin, k)) {
      if (typeof origin[k] === 'object' && origin[k] !== null) {
        tar[k] = toStr.call(origin[k]) === arrType ? [] : {}
        deepClone(origin[k], tar[k])
      } else {
        tar[k] = origin[k]
      }
    }
  }
  // 返回最终结果
  return tar
}
