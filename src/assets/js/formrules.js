import { message } from 'ant-design-vue'

// 验证身份证号码 传入前缀身份证号码
export const checkCardNo = (cardno) => {
  // var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
  var regIdCard =
    /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}X)$)$/
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

// 验证手机号
export const checkPhoneno = function (phoneno) {
  var phonenoExp = /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$|^0\d{2,3}-\d{7,8}/
  return phonenoExp.test(phoneno)
}

// 验证密码
export const checkPwd = function (pwd) {
  var pwdExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,18}$/
  return pwdExp.test(pwd)
}

//验证文件格式大小
export const checkUpload = function (file) {
  let reg = /.(jpg|png|jpeg|gif|doc|docx|xls|xlsx|pdf)$/i
  if (file.name.substring().match(reg)) {
    if (file.size / 1024 > 10000) {
      message.warning('上传文件大小不能超过10M,请重新上传')
      return false
    }
    return true
  } else {
    message.warning('只支持jpg、png、jpeg、gif、doc、docx、xls、xlsx、pdf格式文件上传,已自动为您过滤,请重新上传')
    return false
  }
}

//过滤文件
export const fileFormatter = (data) => {
  let file = {
    uid: data.id, // 文件唯一标识
    name: data.showname, // 文件名
    status: 'done', // 状态有：uploading done error removed
    response: '{"status": "success"}', // 服务端响应内容
  }
  return file
}

export const downloadFile = (file) => {
  var a = document.createElement('a')
  a.download = file.showname
  a.href = window.location.origin + '/SWMS/LEAP/Download/' + file.url
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
