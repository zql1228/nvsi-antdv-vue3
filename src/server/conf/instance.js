import axios from 'axios'
import store from '@/store'
import storage from 'store'
import { message } from 'ant-design-vue/es'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { VueAxios } from './vueAxios'
import pakos from '@/utils/leap/gzip/pako.min'
import base64 from '@/utils/leap/base64'
import { CONTEXT, API_TAG } from '@/utils/config'
import { LocalGetToken } from '@/utils/localStorage'
// 创建 axios 实例
const instance = axios.create({
  // API 请求的默认前缀
  // baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 60 * 1000, // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    // 从 localstorage 获取 token
    const token = LocalGetToken(),
      user = storage.get('user')
    if (error.response.status === 500 || error.response.status === 404) {
      if (document.getElementsByClassName('ant-message-error').length === 0) {
        message.error({
          content: error.response.status === 500 ? '服务器连接失败' : '登录超时，请重新登录',
        })
      }
      store.dispatch('Logout').then(() => {})
      return
    }
  }
  return Promise.reject(error)
}

function base64encode(d) {
  return btoa(d)
}

function base64decode(d) {
  return atob(d)
}

function g(w) {
  if (w == null || w.length == 0) {
    return null
  }
  if (w.length < 20) {
    throw new Error('请求数据长度不合法')
  }
  var n = w.length - 9
  var r = Math.floor(n * 0.25)
  var p = Math.floor(n * 0.75)
  var q = w.substring(r, r + 6)
  var x = []
  x.push(w.substring(0, r))
  x.push(w.substring(r + 6, p + 6))
  x.push(w.substring(p + 9))
  var u = x.join('')
  x.length = 0
  var o = j(u)
  while (o.length < 6) {
    o = o + '_'
  }
  if (q != o) {
    throw new Error('校验未通过,数据在传输过程中已被篡改')
  }
  u = u.substring(5)
  u = u.substring(0, u.length - 5)
  return u
}
var l = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-~'.split('')
function j(n, p) {
  var o = null
  if (p) {
    o = new Date().getTime()
  }
  var u = 1369
  var q = n.length - 1
  if (typeof n == 'string') {
    for (; q > -1; q--) {
      u += (u << 5) + n.charCodeAt(q)
    }
  } else {
    for (; q > -1; q--) {
      u += (u << 5) + n[q]
    }
  }
  var r = u & 2147483647
  var w = ''
  do {
    w += l[r & 63]
  } while ((r >>= 6))
  if (p) {
    console.log(n.length + '\t:\t' + (new Date().getTime() - o))
  }
  return w
}

// request interceptor
instance.interceptors.request.use((config) => {
  // const token = LocalGetToken()
  // // 如果 token 存在
  // // 让每个请求携带自定义 token 请根据实际情况自行修改
  // if (token) {
  //   config.headers['Access-Token'] = token
  // }

  let _p = null
  let _retstr = null
  config.url = `${API_TAG}${CONTEXT}/LEAP/Service/RPC/RPC.DO` + config.url
  const token = LocalGetToken()
  if (token && !config.url.includes('type=997')) {
    config.url += `&sid=${token}`
  }
  if (config.data) {
    let P = config.data
    if (typeof P == 'object' && P != '') {
      var K = []
      for (var q in P) {
        var J = P[q]
        if (J == null) {
          K.push(null)
        } else {
          if (typeof J != 'function') {
            if (typeof J != 'string') {
              K.push(JSON.stringify(J))
            } else {
              K.push(J)
            }
          }
        }
      }
      _retstr = JSON.stringify(K)
    } else {
      _retstr = JSON.stringify(config.data)
    }
    let _m = pakos.gzip(_retstr, {
      to: 'string',
    })
    _p = base64.base64_encode(_m)
    _p = 'a=' + _p

    config.data = _p
  }

  return config
}, errorHandler)

// response interceptor
instance.interceptors.response.use((response) => {
  if (response && response.headers.resptype == 1) {
    {
      let T = decodeURIComponent(base64decode(g(response.data)))
      if (T && typeof T === 'string') {
        response.data = JSON.parse(T)
        if (response.data && typeof response.data.result === 'string') {
          response.data.result = JSON.parse(response.data.result)
        }
      }
    }
  } else {
    if (response.data && typeof response.data.result === 'string') {
      response.data.result = JSON.parse(response.data.result)
    }
  }
  //这里存在一种异常, status为200,data是一个空串
  if (response.status == 200) {
    if (!response.data) {
      // console.log('error', '响应成功,res.data为空串')
      return {
        error: 'res.data error',
        msg: '响应成功,res.data为空串',
      }
    }
  }
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, instance)
  },
}

export default instance

export { installer as VueAxios, instance as axios }
