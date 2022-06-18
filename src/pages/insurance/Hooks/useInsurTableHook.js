import { ref, reactive } from 'vue'
import {
  nvsiInsSex,
  nvsiInsAge,
  nvsiInserverType,
  nvsiInsServerArea,
  nvsiInsWork,
  nvsiInsActime,
  nvsiInsAddress,
  nvsiInsPerNum,
} from '@/utils/codevalue/modules/insurance'
import { nvsiAlbe0036 } from '@/utils/codevalue'
export const getCodeValue = () => {
  return reactive({
    nvsiInsSex,
    nvsiInsAge,
    nvsiInserverType,
    nvsiInsServerArea,
    nvsiInsWork,
    nvsiInsActime,
    nvsiInsPerNum,
    nvsiInsAddress,
    nvsiAlbe0036,
  })
}

export const getCreateInsPlanParam = () => {
  return reactive({
    planname: '', // 计划名称
    plandesc: '', // 计划描述
    sex: '0', //性别
    age: '0', // 年龄
    insArea: '0', // 服务区域类型
    areaid: [], // 服务区域
    areaidname: '',
    employment: '', //	从业状况
    servicetype: [], //	服务类别
    activitytype: [], //	活动类型
    activitytime: '0', //	活动时间
    activityaddr: '0', //	活动地点
    activityaddId: [], // 活动区域id
    activityaddrname: '',
    activitypeople: '', //	活动人数
  })
}

export const getCreateInsPlanRules = (form) => {
  const checkPlanname = async (rules, value) => {
    if (!value) {
      return Promise.reject('请填写项目名称')
    } else {
      return Promise.resolve()
    }
  }
  const checkPlandesc = async (rules, value) => {
    if (!value) {
      return Promise.reject('请填写项目描述')
    } else {
      return Promise.resolve()
    }
  }
  const checkSex = async (rules, value) => {
    if (!value) {
      return Promise.reject('请选择性别')
    } else {
      return Promise.resolve()
    }
  }
  const checkAge = async (rules, value) => {
    if (!value) {
      return Promise.reject('请选择年龄')
    } else {
      return Promise.resolve()
    }
  }
  const checkInsArea = async (rules, value) => {
    if (!value) {
      return Promise.reject('请选择服务区域')
    } else {
      return Promise.resolve()
    }
  }
  const checkAreaid = async (rules, value) => {
    if (value.length === 0) {
      return Promise.reject('请选择服务区域')
    } else {
      return Promise.resolve()
    }
  }
  const checkEmployment = async (rules, value) => {
    if (!value) {
      return Promise.reject('请选择从业状况')
    } else {
      return Promise.resolve()
    }
  }
  const checkServicetype = async (rules, value) => {
    if (value.length == 0) {
      return Promise.reject('请选择服务类别')
    } else {
      return Promise.resolve()
    }
  }
  const checkActivitytype = async (rules, value) => {
    if (value.length == 0) {
      return Promise.reject('请选择活动类型')
    } else {
      return Promise.resolve()
    }
  }
  const checkActivitytime = (rules, value) => {
    if (!value) {
      return Promise.reject('请选择活动时间')
    } else {
      return Promise.resolve()
    }
  }
  const checkActivityaddr = async (rules, value) => {
    if (!value) {
      return Promise.reject('请选择活动地点')
    } else {
      return Promise.resolve()
    }
  }
  const checkActivityaddId = async (rules, value) => {
    if (value.length === 0) {
      return Promise.reject('请选择活动地点')
    } else {
      return Promise.resolve()
    }
  }
  const checkActivitypeople = async (rules, value) => {
    if (value.length === 0) {
      return Promise.reject('请选择活动人数')
    } else {
      return Promise.resolve()
    }
  }
  const noCheck = async (rules, value) => {
    return Promise.resolve()
  }
  const rules = reactive({
    planname: [{ required: true, validator: checkPlanname, trigger: 'blur' }],
    plandesc: [{ required: true, validator: checkPlandesc, trigger: 'blur' }],
    sex: [{ required: true, validator: checkSex, trigger: 'change' }],
    age: [{ required: true, validator: checkAge, trigger: 'change' }],
    insArea: [{ required: true, validator: checkInsArea, trigger: 'change' }],
    areaid: [{ required: true, validator: checkAreaid, trigger: 'change' }],
    employment: [{ required: true, validator: checkEmployment, trigger: 'change' }],
    servicetype: [{ required: true, validator: checkServicetype, trigger: 'change' }],
    activitytype: [{ required: true, validator: checkActivitytype, trigger: 'change' }],
    activitytime: [{ required: true, validator: checkActivitytime, trigger: 'change' }],
    activityaddr: [{ required: true, validator: checkActivityaddr, trigger: 'change' }],
    activityaddId: [{ required: true, validator: checkActivityaddId, trigger: 'change' }],
    activitypeople: [{ required: true, validator: checkActivitypeople, trigger: 'change' }],
  })
  if (form.insArea == '0') {
    rules.areaid[0].validator = noCheck
  }
  if (form.activityaddr == '0') {
    rules.activityaddId[0].validator = noCheck
  }
  return rules
}
