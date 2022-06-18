//网站请求
import axios from 'axios'
import qs from 'qs' //qs库
import { CONTEXT, API_TAG } from '@/utils/config'

// 创建 axios 实例
const request = axios.create({
  timeout: 60 * 1000, // 请求超时时间
})

request.interceptors.response.use((response) => {
  return response.data
})

const getSM4 = function () {
  const SM4 = require('longrise-sm4')
  let sm4Config = {
    key: 'p6fl4gN1brNfflKK',
    mode: 'cbc',
    iv: 'longrise12345678', //cbc加密的向量iv
    cipherType: 'text',
  }
  let sm4 = new SM4(sm4Config)
  return sm4
}

function webLogin(bean) {
  debugger
  if (bean) {
    const vueParam = {
      bean: JSON.stringify({
        encryData: getSM4().encrypt(JSON.stringify(bean)),
      }),
    } //sm4_cdc加密
    bean = qs.stringify(vueParam)
  }
  return request({
    url: `${API_TAG}${CONTEXT}/restservices/webapi/LEAPLoginFortisWeb/query`,
    method: 'post',
    data: bean,
  })
}

export { getSM4, webLogin }
