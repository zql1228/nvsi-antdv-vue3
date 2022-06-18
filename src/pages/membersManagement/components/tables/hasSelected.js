import { checkPhoneno } from '@/utils/publicMethods/common'
export const hasSelected = (record, selectedRowKeys) => {
  const arr = selectedRowKeys.value ? selectedRowKeys.value : selectedRowKeys
  // 判断有没有当前点击的ID，没有返回-1 有返回下标
  if (!arr.includes(record.id)) {
    arr.push(record.id) // 添加
  }
  return arr
}
//错误提示
export const forTips = (id, tip) => {
  // 提示
  const div = document.getElementById(id)
  div.innerHTML = tip
  div.style.color = '#db0000'
}
export const checkPhone = (phone) => {
  // 校验手机号
  if (!phone) {
    forTips('phoneTip', '未填写')
    return false
  } else {
    const result = checkPhoneno(phone)
    if (!result) {
      forTips('phoneTip', '手机号格式错误，请重新新输入')
      return false
    } else {
      forTips('phoneTip', '')
      return true
    }
  }
}
export const getprovinceArea = () => {
  return new Promise((resolve) => {
    apis.listProvinceArea().then((res) => {
      // console.log(res, '省级区划')
      if (res) {
        resolve(res)
      }
    })
  })
}
