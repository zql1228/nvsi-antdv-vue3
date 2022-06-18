import { rpcPost } from '../../conf'
import store from '@/store'
//  以下是codeValue代码表
export default async function getCodeValue(key, method, bean, ...args) {
  return new Promise((resolve, reject) => {
    const allCodeValue = store.getters.getCodeValue
    const codeValue = allCodeValue[key] || null
    console.log(store)
    if (codeValue) {
      resolve({ code: 0, data: codeValue })
    } else {
      rpcPost(method, { bean })
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            store.commit('setCodeValue', { key, value: res.data })
            resolve(res)
          } else {
            resolve({ code: -1, data: [] })
          }
        })
        .catch((e) => {
          resolve({ code: -1, data: [] })
        })
    }
  })
}
