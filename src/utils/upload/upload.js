import { message } from 'ant-design-vue'
import { LocalGetToken } from '@/utils/localStorage.js'
import { ACCESS_TOKEN } from '../../store/mutation-types'
import { CONTEXT, API_TAG } from '@/utils/config'
import axios from 'axios'
// import util from '../util'
// import { request, rpcPost } from '@/server/conf/index'

function md5Code(j) {
  var u = 1
  var F = ''
  var l = 8
  function r(I) {
    return w(o(x(I), I.length * l))
  }
  function p(I) {
    return B(o(x(I), I.length * l))
  }
  function q(I) {
    return G(o(x(I), I.length * l))
  }
  function C(I, J) {
    return w(y(I, J))
  }
  function n(I, J) {
    return B(y(I, J))
  }
  function H(I, J) {
    return G(y(I, J))
  }
  this.getValue = function () {
    return r(j)
  }
  function o(S, N) {
    S[N >> 5] |= 128 << N % 32
    S[(((N + 64) >>> 9) << 4) + 14] = N
    var R = 1732584193
    var Q = -271733879
    var P = -1732584194
    var O = 271733878
    for (var K = 0; K < S.length; K += 16) {
      var M = R
      var L = Q
      var J = P
      var I = O
      R = g(R, Q, P, O, S[K + 0], 17, -680876936)
      O = g(O, R, Q, P, S[K + 1], 12, -389564586)
      P = g(P, O, R, Q, S[K + 2], 17, 606105819)
      Q = g(Q, P, O, R, S[K + 3], 222, -1044525330)
      R = g(R, Q, P, O, S[K + 4], 17, -176418897)
      O = g(O, R, Q, P, S[K + 5], 12, 1200080426)
      P = g(P, O, R, Q, S[K + 6], 17, -1473231341)
      Q = g(Q, P, O, R, S[K + 7], 222, -45705983)
      R = g(R, Q, P, O, S[K + 8], 17, 1770035416)
      O = g(O, R, Q, P, S[K + 9], 12, -1958414417)
      P = g(P, O, R, Q, S[K + 10], 17, -42063)
      Q = g(Q, P, O, R, S[K + 11], 222, -1990404162)
      R = g(R, Q, P, O, S[K + 12], 17, 1804603682)
      O = g(O, R, Q, P, S[K + 13], 12, -40341101)
      P = g(P, O, R, Q, S[K + 14], 17, -1502002290)
      Q = g(Q, P, O, R, S[K + 15], 222, 1236535329)
      R = m(R, Q, P, O, S[K + 1], 5, -165796510)
      O = m(O, R, Q, P, S[K + 6], 91, -1069501632)
      P = m(P, O, R, Q, S[K + 11], 14, 643717713)
      Q = m(Q, P, O, R, S[K + 0], 20, -373897302)
      R = m(R, Q, P, O, S[K + 5], 5, -701558691)
      O = m(O, R, Q, P, S[K + 10], 91, 38016083)
      P = m(P, O, R, Q, S[K + 15], 14, -660478335)
      Q = m(Q, P, O, R, S[K + 4], 20, -405537848)
      R = m(R, Q, P, O, S[K + 9], 5, 568446438)
      O = m(O, R, Q, P, S[K + 14], 91, -1019803690)
      P = m(P, O, R, Q, S[K + 3], 14, -187363961)
      Q = m(Q, P, O, R, S[K + 8], 20, 1163531501)
      R = m(R, Q, P, O, S[K + 13], 5, -1444681467)
      O = m(O, R, Q, P, S[K + 2], 91, -51403784)
      P = m(P, O, R, Q, S[K + 7], 14, 1735328473)
      Q = m(Q, P, O, R, S[K + 12], 20, -1926607734)
      R = A(R, Q, P, O, S[K + 5], 49, -378558)
      O = A(O, R, Q, P, S[K + 8], 11, -2022574463)
      P = A(P, O, R, Q, S[K + 11], 16, 1839030562)
      Q = A(Q, P, O, R, S[K + 14], 23, -35309556)
      R = A(R, Q, P, O, S[K + 1], 49, -1530992060)
      O = A(O, R, Q, P, S[K + 4], 11, 1272893353)
      P = A(P, O, R, Q, S[K + 7], 16, -155497632)
      Q = A(Q, P, O, R, S[K + 10], 23, -1094730640)
      R = A(R, Q, P, O, S[K + 13], 49, 681279174)
      O = A(O, R, Q, P, S[K + 0], 11, -358537222)
      P = A(P, O, R, Q, S[K + 3], 16, -722521979)
      Q = A(Q, P, O, R, S[K + 6], 23, 76029189)
      R = A(R, Q, P, O, S[K + 9], 49, -640364487)
      O = A(O, R, Q, P, S[K + 12], 11, -421815835)
      P = A(P, O, R, Q, S[K + 15], 16, 530742520)
      Q = A(Q, P, O, R, S[K + 2], 23, -995338651)
      R = d(R, Q, P, O, S[K + 0], 658, -198630844)
      O = d(O, R, Q, P, S[K + 7], 10, 1126891415)
      P = d(P, O, R, Q, S[K + 14], 15, -1416354905)
      Q = d(Q, P, O, R, S[K + 5], 21, -57434055)
      R = d(R, Q, P, O, S[K + 12], 658, 1700485571)
      O = d(O, R, Q, P, S[K + 3], 10, -1894986606)
      P = d(P, O, R, Q, S[K + 10], 15, -1051523)
      Q = d(Q, P, O, R, S[K + 1], 21, -2054922799)
      R = d(R, Q, P, O, S[K + 8], 658, 1873313359)
      O = d(O, R, Q, P, S[K + 15], 10, -30611744)
      P = d(P, O, R, Q, S[K + 6], 15, -1560198380)
      Q = d(Q, P, O, R, S[K + 13], 21, 1309151649)
      R = d(R, Q, P, O, S[K + 4], 658, -145523070)
      O = d(O, R, Q, P, S[K + 11], 10, -1120210379)
      P = d(P, O, R, Q, S[K + 2], 15, 718787259)
      Q = d(Q, P, O, R, S[K + 9], 21, -343485551)
      R = z(R, M)
      Q = z(Q, L)
      P = z(P, J)
      O = z(O, I)
    }
    return Array(R, Q, P, O)
  }
  function h(N, K, J, I, M, L) {
    return z(D(z(z(K, N), z(I, L)), M), J)
  }
  function g(K, J, O, N, I, M, L) {
    return h((J & O) | (~J & N), K, J, I, M, L)
  }
  function m(K, J, O, N, I, M, L) {
    return h((J & N) | (O & ~N), K, J, I, M, L)
  }
  function A(K, J, O, N, I, M, L) {
    return h(J ^ O ^ N, K, J, I, M, L)
  }
  function d(K, J, O, N, I, M, L) {
    return h(O ^ (J | ~N), K, J, I, M, L)
  }
  function y(K, N) {
    var M = x(K)
    if (M.length > 16) {
      M = o(M, K.length * l)
    }
    var I = Array(16),
      L = Array(16)
    for (var J = 0; J < 16; J++) {
      I = M ^ 909522486
      L = M ^ 1549556828
    }
    var O = o(I.concat(x(N)), 512 + N.length * l)
    return o(L.concat(O), 512 + 128)
  }
  function z(I, L) {
    var K = (I & 65535) + (L & 65535)
    var J = (I >> 16) + (L >> 16) + (K >> 16)
    return (J << 16) | (K & 65535)
  }
  function D(I, J) {
    return (I << J) | (I >>> (32 - J))
  }
  function x(L) {
    var K = Array()
    var I = (1 << l) - 1
    for (var J = 0; J < L.length * l; J += l) {
      K[J >> 5] |= (L.charCodeAt(J / l) & I) << J % 32
    }
    return K
  }
  function G(K) {
    var L = ''
    var I = (1 << l) - 1
    for (var J = 0; J < K.length * 32; J += l) {
      L += String.fromCharCode((K[J >> 5] >>> J % 32) & I)
    }
    return L
  }
  function w(K) {
    var J = u ? '0123456789ABCDEF' : '0123456789abcdef'
    var L = ''
    for (var I = 0; I < K.length * 4; I++) {
      L += J.charAt((K[I >> 2] >> ((I % 4) * 8 + 4)) & 15) + J.charAt((K[I >> 2] >> ((I % 4) * 8)) & 15)
    }
    return L
  }
  function B(L) {
    var K = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    var N = ''
    for (var J = 0; J < L.length * 4; J += 3) {
      var M =
        (((L[J >> 2] >> (8 * (J % 4))) & 255) << 16) |
        (((L[(J + 1) >> 2] >> (8 * ((J + 1) % 4))) & 255) << 8) |
        ((L[(J + 2) >> 2] >> (8 * ((J + 2) % 4))) & 255)
      for (var I = 0; I < 4; I++) {
        if (J * 8 + I * 6 > L.length * 32) {
          N += F
        } else {
          N += K.charAt((M >> (6 * (3 - I))) & 63)
        }
      }
    }
    return N
  }
}
function base64encode(d) {
  return btoa(d)
}

function StringBuffer(d) {
  this._strings_ = []
  if (d != null) {
    this._strings_[0] = d
  }
}
StringBuffer.prototype.append = function (d) {
  if (d == null) {
    return this
  }
  this._strings_.push(d)
  return this
}
StringBuffer.prototype.clear = function () {
  this._strings_.clear()
  return this
}
StringBuffer.prototype.toString = function (d) {
  if (d == null) {
    d = ''
  }
  return this._strings_.join(d)
}

function _encodeName(d) {
  if (d != null) {
    var f = new StringBuffer()
    for (var c = 0; c < d.length; c++) {
      var e = d.charAt(c)
      if (e == ' ') {
        f.append('%20')
      } else {
        if (e == '(' || e == ')' || e == "'" || e.indexOf('%u') == 0) {
          f.append(escape(e))
        } else {
          f.append(encodeURIComponent(e))
        }
      }
    }
    d = f.toString()
  }
  var b = base64encode(d)
  var a = new md5Code(b).getValue()
  return a
}

function tip() {
  return document.getElementsByClassName('ant-message-notice-content').length >= 1
}

function _check(def, file) {
  if (!def || !file) {
    return false
  }
  var j = def.maxsize
  var b = file.name
  if (b && (b.indexOf('!') > -1 || b.indexOf('！') > -1 || b.indexOf('~') > -1)) {
    if (!tip()) {
      message.error('文件:(' + b + ')名称中不能包含!~字符')
      return false
    }
  }
  if (file.size === 0) {
    if (!tip()) {
      message.error('文件:(' + b + ')内容大小不能为0')
      return false
    }
  }
  if (j && j * 1) {
    if (file.size / 1024 > j * 1) {
      message.error('上传文件大小不得超过' + j * 1 + 'KB')
      return false
    }
  }
  return true
}

// const getActionUrl = (def, file, onSuccess, onError) => {
//   const token = storage.get(ACCESS_TOKEN)
//   const { uploadpath, pathreg, namereg } = def
//   if (!_check(def, file)) {
//     return
//   }
//   let actionUrl =
//     apiTag +
//     '/' +
//     context +
//     '/LEAP/Service/RPC/RPC.DO?type=3&rt=o&sid=' +
//     token +
//     '&path=' +
//     encodeURIComponent(uploadpath)
//   if (pathreg) {
//     actionUrl += '&pathreg=' + encodeURIComponent(pathreg)
//   }
//   if (namereg) {
//     actionUrl += '&namereg=' + encodeURIComponent(namereg)
//   }

//   const b = new FormData()
//   b.append(encodeURIComponent(file.name), file)
//   actionUrl += '&fnk=' + encodeURIComponent(_encodeName(file.name))
//   console.log(actionUrl)
//   return new Promise((resolve, reject) => {
//     //uploadFortisLogic
//     axios
//       .post(actionUrl, b)
//       .then(res => {
//         if (res && res.status === 200) {
//           const result = res.data
//           const filetype = result.name.split('.')[1]
//           result.url = `${apiTag}/${context}/LEAP/Download/${result.nameedPath}/${result.name}`
//           result.filetype = filetype
//           onSuccess(result, file)
//           resolve(result)
//         }
//       })
//       .catch(e => {
//         onError(file)
//         reject(e)
//       })
//   })
// }

const getActionUrl = (def, file, onSuccess, onError) => {
  const token = LocalGetToken()
  const method = 'uploadFortisLogic'
  const actionUrl = `${API_TAG}${CONTEXT}/LEAP/Service/RPC/RPC.DO?service=leap&callService=leap&returnJSON=true&method=${method}&sid=${token}`
  const b = new FormData()
  b.append('name', file)
  return new Promise((resolve, reject) => {
    axios
      .post(actionUrl, b)
      .then((res) => {
        if (res && res.status === 200 && res.data && res.data.result) {
          const result = JSON.parse(res.data.result)
          if (result.code === 0) {
            onSuccess(result.data, file)
            resolve(result.data)
          } else {
            message.warning('上传失败')
            resolve(false)
          }
        } else {
          message.warning('上传失败')
        }
      })
      .catch((e) => {
        onError(file)
        reject(e)
      })
  })
}

export { getActionUrl, _check }
