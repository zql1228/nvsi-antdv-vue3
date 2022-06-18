import moment from 'moment'
import * as echarts from 'echarts'
// 验证身份证号码
export const checkCardNo = (cardno) => {
  var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}X)$)$/
  if (regIdCard.test(cardno)) {
    if (cardno.length == 18) {
      var idCardWi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      var idCardY = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]
      var idCardWiSum = 0
      for (var i = 0; i < 17; i++) {
        idCardWiSum += cardno.substring(i, i + 1) * idCardWi[i]
      }
      var idCardMod = idCardWiSum % 11
      var idCardLast = cardno.substring(17)
      if (idCardMod == 2) {
        // return idCardLast == "X" || idCardLast == "x";
        return idCardLast == 'X'
      } else {
        // 用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
        return idCardLast == idCardY[idCardMod]
      }
    } else {
      return true
    }
  } else {
    return false
  }
}

// 验证手机号
export const checkPhoneno = (phoneno) => {
  var phonenoExp = /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/
  return phonenoExp.test(phoneno)
}

// 用户名验证
export const checkUsername = (username) => {
  var usernameExp = /^[A-z][A-z_0-9]{5,19}$/
  return usernameExp.test(username)
}

// 密码验证
export const checkPW = (pw) => {
  //var pwExp = /^(?=.*[0-9])(?=.*[a-zA-Z])(.{8,20})$/;
  var pwExp = /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{8,20}$/ //8-20个字符，且必须同时包含数字、大写字母和小写字母
  return pwExp.test(pw)
}

// 邮箱验证
export const checkEmail = (email) => {
  //var emailExp = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
  var emailExp = /^(\w-*\.*)+@(\w-?)+(\.[a-zA-Z]{2,})+$/ //域名只能为英文
  return emailExp.test(email)
}

// 验证固定电话
export const checkTelPhoneno = (data) => {
  var dataExp = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,4}))?$/
  return dataExp.test(data)
}

// 验证QQ号
export const checkqqphoneno = (qq) => {
  var qqExp = /^[1-9]\d{4,10}$/ ///^\d{5,11}$/;
  return qqExp.test(qq)
}

// 校验是否是纯数字字符串
export const reg1 = (str) => {
  var reg = /^[0-9]*$/
  return reg.test(str)
}

// 校验是否是大于或等于0的整数
export const reg2 = (str) => {
  var reg = /^(0|\+?[1-9][0-9]*)$/
  return reg.test(str)
}

// 校验是否是大于或等于0且最多2位小数的数字
export const reg3 = (str) => {
  var reg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/
  return reg.test(str)
}

//判断传入时间是否比当前时间早
export const checktime = (time) => {
  let oldtime = new Date(Date.parse(time.replace(/-/g, '/')))
  let newtime = new Date(
    Date.parse(
      moment(new Date())
        .format('YYYY-MM-DD')
        .replace(/-/g, '/')
    )
  )
  if (oldtime < newtime) {
    return true //说明超时了
  }
  return false
}

//判断前面时间是否比后面时间早
export const checktime2 = (time1, time2) => {
  let oldtime = new Date(time1)
  let newtime = new Date(time2)
  if (oldtime < newtime) {
    return true //说明超时了
  }
  return false
}

//判断传入时间与当前时间间隔几天
export const getDate = (time) => {
  let startTime = new Date(time) // 开始时间
  let endTime = new Date() // 结束时间
  let usedTime = endTime - startTime // 相差的毫秒数
  let days = Math.floor(usedTime / (24 * 3600 * 1000)) // 计算出天数
  // let leavel = usedTime % (24 * 3600 * 1000) // 计算天数后剩余的时间
  // let hours = Math.floor(leavel / (3600 * 1000)) // 计算剩余的小时数
  // let leavel2 = leavel % (3600 * 1000) // 计算剩余小时后剩余的毫秒数
  // let minutes = Math.floor(leavel2 / (60 * 1000)) // 计算剩余的分钟数
  return days
}

export const addDays = (date, days, seperator = '-') => {
  //获取指定日期n天之后的日期 data传参格式2020 - 11 - 01
  let oDate = new Date(date).valueOf()
  let nDate = oDate + days * 24 * 3600 * 1000
  nDate = new Date(nDate)
  let y = nDate
    .getFullYear()
    .toString()
    .padStart(2, 0)
  let m = (nDate.getMonth() + 1).toString().padStart(2, 0)
  let d = nDate
    .getDate()
    .toString()
    .padStart(2, 0)
  return `${y}${seperator}${m}${seperator}${d}`
}

export const redDate = (someDate, n) => {
  //获取指定日期n天之前的日期 someDate传参格式2020-11-01
  var datt = someDate.split('-')
  var newDate = new Date(datt[0], datt[1] - 1, datt[2])
  var befminuts = newDate.getTime() - 1000 * 60 * 60 * 24 * parseInt(n)
  var beforeDat = new Date()
  beforeDat.setTime(befminuts)
  var befMonth = beforeDat.getMonth() + 1
  var mon = befMonth >= 10 ? befMonth : '0' + befMonth
  var befDate = beforeDat.getDate()
  var da = befDate >= 10 ? befDate : '0' + befDate
  var newDate1 = beforeDat.getFullYear() + '-' + mon + '-' + da
  return newDate1
}

export const redDateYear = (dtstr, n) => {
  //获取指定日期n个月以后的日期 startdate传参格式2020-11-01
  var s = dtstr.split('-')
  var yy = parseInt(s[0])
  var mm = parseInt(s[1])
  var dd = parseInt(s[2])
  var dt = new Date(yy, mm, dd)
  var num = dt.getMonth() + parseInt(n)
  if (num / 12 > 1) {
    undefined
    yy += Math.floor(num / 12)
    mm = num % 12
  } else {
    undefined
    mm += parseInt(n)
  }
  let date = mm == 0 ? parseInt(yy * 1 - 1) + '-' + 12 + '-' + dd : yy + '-' + mm + '-' + dd
  console.log(date)
  return date
}

export const checkage = (idnumber) => {
  //根据身份证号计算年龄 传入身份证号码
  let myyear = idnumber.substring(6, 10)
  let mymonth = idnumber.substring(10, 12)
  let myday = idnumber.substring(12, 14)
  let date = new Date()
  let dayNow = date.getDay()
  let monthNow = date.getMonth() + 1
  let age = date.getFullYear() - myyear
  if (monthNow < mymonth || (monthNow == mymonth && dayNow < myday)) {
    age--
  }
  return age
}

export const checkage2 = (birthday) => {
  //根据出生日期计算年龄 传入格式 2020-11-11
  let oldDate = new Date(birthday.replace(/-/g, '/'))
  let newDate = new Date()
  let age =
    newDate.getFullYear() -
    oldDate.getFullYear() -
    (newDate.getMonth() < oldDate.getMonth() || (newDate.getMonth() == oldDate.getMonth() && newDate.getDate() < oldDate.getDate()) ? 1 : 0)
  return age
}

export const getLevel = (areaid) => {
  //判断传入areaid级别
  if (areaid.slice(0, 6) === '000000' || areaid.slice(0, 6) === '100000') {
    return '全国'
  } else if (areaid.slice(2, 6) === '0000') {
    return '省'
  } else if (areaid.slice(4, 6) === '00') {
    return '市'
  } else {
    return '区'
  }
}

export const checkName = (arg) => {
  //中文姓名校验
  var reg = /^[A-z]+$|^[a-zA-Z]+(\s*[a-zA-Z]+)+$|^((?![\u3000-\u303F])[\u2E80-\uFE4F]|\·)*(?![\u3000-\u303F])[\u2E80-\uFE4F](\·)*$/
  return reg.test(arg)
}
export const loadEcharts = (id) => {
  var myChart = echarts.getInstanceByDom(document.getElementById(id))
  var url = myChart.getConnectedDataURL({
    pixelRatio: 5, //导出的图片分辨率比率,默认是1
    backgroundColor: '#fff', //图表背景色
    excludeComponents: [
      //保存图表时忽略的工具组件,默认忽略工具栏
      'toolbox',
    ],
    type: 'png', //图片类型支持png和jpeg
  })
  var $a = document.createElement('a')
  var type = 'png'
  $a.download = 'echarts图' + '.' + type
  $a.target = '_blank'
  $a.href = url
  // Chrome and Firefox
  if (typeof MouseEvent === 'function') {
    var evt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: false,
    })
    $a.dispatchEvent(evt)
  } // IE
  else {
    var html = ''

    ;('<body style="margin:0;">')
    '![](' + url + ')'
    ;('</body>')
    var tab = window.open()
    tab.document.write(html)
  }
}

export const sortCode = (arr) => {
  //将'其他'放到数组最后面
  let brr = JSON.parse(JSON.stringify(arr))
  let index = brr.findIndex((num, numIndex, nums) => {
    //查找服务类别 '其他'的下标
    if (num.codevalue == '其他') {
      return numIndex
    }
  })
  let obj = brr.splice(index, 1)[0]
  brr.push(obj)
  return brr
}
