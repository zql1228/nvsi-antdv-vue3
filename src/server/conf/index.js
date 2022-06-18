import vueAxios from './instance'

/** 通用RPC服务查询 */
export const request = (method, searchParameters) => {
  return vueAxios({
    url: `?service=leap&callService=leap&returnJSON=true&method=${method}`,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      Accept: '*/*',
      GETLID: '1',
      'Accept-Language': 'zh-Hans-CN,zh-Hans;q=0.5',
      'Data-Type': '2',
      'Post-Type': '1',
      RESPTYPE: '1',
    },
    data: searchParameters,
  })
}

export const requestGet = (method, params) => {
  return vueAxios({
    url: `?service=leap&callService=leap&returnJSON=true&method=${method}`,
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      Accept: '*/*',
      GETLID: '1',
      'Accept-Language': 'zh-Hans-CN,zh-Hans;q=0.5',
      'Data-Type': '2',
      'Post-Type': '1',
      RESPTYPE: '1',
    },
  })
}

export const requestRb = (method, params, data) => {
  return vueAxios({
    url: `?service=leap&callService=leap&returnJSON=true&method=${method}`,
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      Accept: '*/*',
      GETLID: '1',
      'Accept-Language': 'zh-Hans-CN,zh-Hans;q=0.5',
      'Data-Type': '2',
      'Post-Type': '1',
      RESPTYPE: '1',
    },
    data,
  })
}

export const rpcPost = (method, parameter) => {
  return new Promise((resolve, reject) => {
    request(method, parameter).then((res) => {
      if (!res) {
        return
      }
      if (res.isSuccess === 1) {
        resolve(res.result)
      } else {
        if (res.msg) {
          reject(res.msg)
        } else {
          reject(res.lastError)
        }
      }
    })
  })
}

export const rpcGet = (method, params) => {
  return new Promise((resolve, reject) => {
    requestGet(method, params).then((res) => {
      if (!res) {
        return
      }
      if (res.isSuccess === 1) {
        resolve(res.result)
      } else {
        reject(res.lastError)
      }
    })
  })
}

export const rpcRb = (method, params, data) => {
  return new Promise((resolve, reject) => {
    requestRb(method, params, data).then((res) => {
      if (!res) {
        return
      }
      if (res.isSuccess === 1) {
        resolve(res.result)
      } else {
        reject(res.lastError)
      }
    })
  })
}

/** 获取系统token */
export const getLsid = () => vueAxios.post('?type=997')
