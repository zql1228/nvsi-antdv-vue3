export const delObjSpaces = (obj) => {
  //去掉一个对象里面所有字符串属性的左右两边的空格
  Object.keys(obj).forEach((key) => {
    typeof obj[key] == 'string' ? (obj[key] = obj[key].trim()) : ''
  })
  return obj
}

export default {
  timeFix() {
    const time = new Date()
    const hour = time.getHours()
    return hour < 9 ? '早上好!' : hour <= 11 ? '上午好!' : hour <= 13 ? '中午好!' : hour < 20 ? '下午好!' : '晚上好!'
  },

  removeZero(str, index) {
    index = index ? index : 1
    let _i = index * 3
    let b = str.substring(_i, str.length)
    if (parseInt(b) === 0) {
      return str.substring(0, _i)
    } else {
      return this.removeZero(str, index + 1)
    }
  },

  // origin是拷贝目标， target是输出结果目标
  deepClone1(origin, target) {
    // 如果没有指定输出结果对象，我们就默认给一个空对象{}
    var tar = target || {}
    // 把Object.prototype.toString方法拿出来保存到toStr,后面用
    const toStr = Object.prototype.toString
    // 不想维护字符串， arrType就是Object.prototype.toString的结果
    // 补充知识：
    // 我们用Object.prototype.toString.call()来判断到底是对象类型还是数组类型
    // Object.prototype.toString.call([]) ===>结果是字符串[object Array]
    // Object.prototype.toString.call({}) ===>结果是字符串[object Object]
    var arrType = '[object Array]'

    // 遍历拷贝目标里面的每一项
    for (var k in origin) {
      // 要判断属性一定要在目标的本身，而不是在它的__proto__上
      if (Object.prototype.hasOwnProperty.call(origin, k)) {
        // 如果origin[k]是一个对象类型并且还不是null的时候
        if (typeof origin[k] === 'object' && origin[k] !== null) {
          // 判断origin[k]是数组还是对象
          // 是数组我们就让目标的k属性targe[k]初始化为空数组[]
          // 是对象我们就让标的k属性targe[k]初始化为空对象{}
          tar[k] = toStr.call(origin[k]) === arrType ? [] : {}
          // 递归deepClone, 这次递归的拷贝目标是origin[k], 输出目标是target[k]
          this.deepClone(origin[k], tar[k])
          // 直到一个属性不是对象的时候，就可以直接赋值不用递归循环去一层一层往里面找了
        } else {
          // 直接赋值
          tar[k] = origin[k]
        }
      }
    }
    // 返回最终结果
    return tar
  },

  /* 随机生成一个唯一uuid */
  generateUUID() {
    let d = new Date().getTime()
    const uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
    return uuid
  },

  isIE() {
    const bw = window.navigator.userAgent
    const compare = (s) => bw.indexOf(s) >= 0
    const ie11 = (() => 'ActiveXObject' in window)()
    return compare('MSIE') || ie11
  },

  S4() {
    return (((1 + Math.random()) * 65536) | 0).toString(16).substring(1)
  },

  randomUUID() {
    return this.S4() + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + this.S4() + this.S4()
    // S4: function () {
    //   return (((1 + Math.random()) * 65536) | 0).toString(16).substring(1);
    // },
    // randomUUID: function () {
    //   return (UUID2.S4() + UUID2.S4() + "-" + UUID2.S4() + "-" + UUID2.S4() + "-" + UUID2.S4() + "-" + UUID2.S4() + UUID2.S4() + UUID2.S4());
    // }
  },

  isJSON(str) {
    if (typeof str == 'string') {
      try {
        var obj = JSON.parse(str)
        if (typeof obj == 'object' && obj) {
          return true
        } else {
          return false
        }
      } catch (e) {
        console.log('error：' + str + '!!!' + e)
        return false
      }
    }
    console.log('It is not a string!')
  },

  delObjSpaces(obj) {
    //去掉一个对象里面所有字符串属性的左右两边的空格
    Object.keys(obj).forEach((key) => {
      typeof obj[key] == 'string' ? (obj[key] = obj[key].trim()) : ''
    })
    return obj
  },
}
