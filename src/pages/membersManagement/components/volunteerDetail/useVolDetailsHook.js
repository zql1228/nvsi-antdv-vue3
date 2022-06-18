import { defineComponent, reactive, ref, onMounted, toRefs, watch } from 'vue'
// 服务对象代码表
import {
  nvsiAlbp0006, // 性别
  nvsiAlbp0004, // 证件类型
  nvsiAlbp0007, // 政治面貌
  nvsiAlbp0008, // 民族
  nvsiAlbp0017, // 学历
  nvsiAlbp0018, // 从业状况
  nvsiAlbp0002, // 国籍
  sortOptions, // 服务类别
  nvsiAlbp0039, // 个人特长
} from '@/utils/codevalue'
// 服务类别 服务领域
import { vol_serviceType, vol_serviceDoMain } from '@/utils/codevalue/modules/volunteer'
import {} from '@/assets/js/codeTable'
export const getCodeValue = () => {
  return reactive({
    nvsiAlbp0006,
    nvsiAlbp0004,
    nvsiAlbp0007,
    nvsiAlbp0008,
    nvsiAlbp0017,
    nvsiAlbp0018,
    nvsiAlbp0002,
    sortOptions,
    nvsiAlbp0039,
    serverTypeList: vol_serviceType, // 服务类别
    serverDoMainList: vol_serviceDoMain, // 服务领域或行业
  })
}

// 通过身份证获取年龄
/*
export const getAgeByCardNo = (identityCard) => {
  var len = (identityCard + '').length
  if (len == 0) {
    return 0
  } else {
    if (len != 15 && len != 18) {
      //身份证号码只能为15位或18位其它不合法
      return 0
    }
  }
  var strBirthday = ''
  if (len == 18) {
    //处理18位的身份证号码从号码中得到生日和性别代码
    strBirthday = identityCard.substr(6, 4) + '/' + identityCard.substr(10, 2) + '/' + identityCard.substr(12, 2)
  }
  if (len == 15) {
    strBirthday = '19' + identityCard.substr(6, 2) + '/' + identityCard.substr(8, 2) + '/' + identityCard.substr(10, 2)
  }
  //时间字符串里，必须是“/”
  var birthDate = new Date(strBirthday)
  var nowDateTime = new Date()
  var age = nowDateTime.getFullYear() - birthDate.getFullYear()
  //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
  if (
    nowDateTime.getMonth() < birthDate.getMonth() ||
    (nowDateTime.getMonth() == birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())
  ) {
    age--
  }
  return age
}
// */

// export const getAgeByCardNo = (identityCard) => {
//   let myDate = new Date()
//   let month = myDate.getMonth() + 1
//   let day = myDate.getDate()
//   // let age = myDate.getFullYear() - identityCard.substring(6, 10) - 1
//   let age = myDate.getFullYear() - identityCard.substring(6, 10)
//   // if (identityCard.substring(10, 12) < month || (identityCard.substring(10, 12) == month && identityCard.substring(12, 14) <= day)) {
//   //   age++
//   // }
//   return age
// }

export const getAgeByCardNo = (idnumber) => {
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

export const getAgeByBirthday = (birthday) => {
  //根据出生日期计算年龄 传入格式 2020-11-11
  let oldDate = new Date(birthday.replace(/-/g, '/'))
  let newDate = new Date()
  let age =
    newDate.getFullYear() -
    oldDate.getFullYear() -
    (newDate.getMonth() < oldDate.getMonth() || (newDate.getMonth() == oldDate.getMonth() && newDate.getDate() < oldDate.getDate()) ? 1 : 0)
  return age
}

// 身份证号脱敏
export const getProtectCardNo = (cardNo) => {
  if (!cardNo) {
    return '*********'
  }
  const temp = cardNo.substring(6, 15)
  return cardNo.replace(temp, '*********')
}

// 志愿者详情表刷新
export const refreshTableHook = (tag) => {
  const getJoinTeamSearch = () => {
    const volJoinTeamTableRef = ref()
    const queryParam = reactive({
      teamName: '',
    })
    const refreshTable = () => {
      volJoinTeamTableRef.value.refresh(true)
    }
    const searchForm = () => {
      refreshTable()
    }
    const resetForm = () => {
      queryParam.teamName = ''
      refreshTable()
    }
    return {
      volJoinTeamTableRef,
      queryParam,
      refreshTable,
      searchForm,
      resetForm,
    }
  }
  const getJoinProjectSearch = () => {
    const volJoinProTableRef = ref()
    const queryParam = reactive({
      proName: '',
    })
    const refreshTable = () => {
      volJoinProTableRef.value.refresh(true)
    }
    const searchForm = () => {
      refreshTable()
    }
    const resetForm = () => {
      queryParam.proName = ''
      refreshTable()
    }
    return {
      volJoinProTableRef,
      queryParam,
      refreshTable,
      searchForm,
      resetForm,
    }
  }
  const getVolServiceEvaluationSearch = () => {
    const volServiceEvaluationRef = ref()
    const queryParam = reactive({
      proName: '',
      teamName: '',
    })
    const refreshTable = () => {
      volServiceEvaluationRef.value.refresh(true)
    }
    const searchForm = () => {
      refreshTable()
    }
    const resetForm = () => {
      queryParam.proName = ''
      queryParam.teamName = ''
      refreshTable()
    }
    return {
      volServiceEvaluationRef,
      queryParam,
      refreshTable,
      searchForm,
      resetForm,
    }
  }
  const getvolServiceDurationSearch = () => {
    const volServiceDurationRef = ref()
    const queryParam = reactive({
      proName: '',
      albx0173: '',
      teamName: '',
    })
    const refreshTable = () => {
      volServiceDurationRef.value.refresh(true)
    }
    const searchForm = () => {
      refreshTable()
    }
    const resetForm = () => {
      queryParam.proName = ''
      queryParam.albx0173 = ''
      queryParam.teamName = ''
      refreshTable()
    }
    return {
      volServiceDurationRef,
      queryParam,
      refreshTable,
      searchForm,
      resetForm,
    }
  }
  const getVolJoinTrainSearch = () => {
    const volJoinTrainRef = ref()
    const queryParam = reactive({
      proName: '',
    })
    const refreshTable = () => {
      volJoinTrainRef.value.refresh(true)
    }
    const searchForm = () => {
      refreshTable()
    }
    const resetForm = () => {
      queryParam.proName = ''
      refreshTable()
    }
    return {
      volJoinTrainRef,
      queryParam,
      refreshTable,
      searchForm,
      resetForm,
    }
  }
  switch (tag) {
    case 'volJoinProTableRef':
      return getJoinProjectSearch()
    case 'volJoinTeamTableRef':
      return getJoinTeamSearch()
    case 'volServiceDurationRef':
      return getvolServiceDurationSearch()
    case 'volServiceEvaluationRef':
      return getVolServiceEvaluationSearch()
    case 'volJoinTrainRef':
      return getVolJoinTrainSearch()
    default:
      return {}
  }
}

export const getSertimeList = () => {
  const weekList = reactive([])
  let index = 1
  for (let i = 0; i < 8; i++) {
    let timeList = []
    for (let j = 1; j <= 3; j++) {
      let obj = {
        flag: false,
        value: index < 10 ? '0' + index++ : String(index++),
        time: j == '1' ? '上午' : j == '2' ? '下午' : '晚上',
      }
      timeList.push(obj)
    }
    weekList.push(timeList)
  }
  return weekList
}
/*
albp01_129: "[{\n\"province\":\"11\",\n\"areaid\":\"110101000000000000\",\n\"id\":\"35041487637d4b069abe53e67d02ecc8\"\n}]"
albp0003: "闵畅"
albp0004: "01"
albp0005: "110101199003078515"
albp0006: "1"
albp0010: "13554574896"
albp0019: "0"
albp0020: "110000000000000000"
albp0025: "北京市"
albp0028: "1"
albp0029: "V1100002201000004V"
albp0034: "2022-01-11 09:34:56.0"
albp0052: "xy456789"
albp0057: "110000000000000000"
albp0063: "1"
albp0084: "xy456789"
albp0089: "0"
albp0090: "1"
albp0093: "0"
albp0094: "0"
albp0095: "0"
albp0098: "0"
albp0099: "0"
areaid: "北京市"
axaa0001: "11"
axaa0002: "1100"
axaa0003: "110000"
beanname: "lbp01_110101"
createtime: "2022-01-11 09:34:57.562"
id: "ac70283f749e493488900dd7fe156868"
isdelete: "0"
javaClass: "com.longrise.LEAP.Base.Objects.EntityBean"
source: "0"
  */
