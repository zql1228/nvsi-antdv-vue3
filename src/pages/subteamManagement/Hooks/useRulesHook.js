import { reactive, ref, onMounted, onBeforeUnmount, toRefs } from 'vue'
import { checkPhoneno, checkEmail, checkCardNo, checkName } from '@/utils/publicMethods/common'
import apis from '@/server/request'
// 队伍审核表单验证
export const TeamReviewDrawerHook = (form) => {
  const checkOptionLength = async (rule, value) => {
    if (!value) {
      return Promise.reject('请输入审核意见')
    } else {
      if (value.length > 25) {
        return Promise.reject('字符超出最大长度,请重新输入')
      } else {
        return Promise.resolve()
      }
    }
  }
  return reactive({
    isPass: [{ required: true, message: '请输入审核结果', trigger: 'blur' }],
    option: [{ required: true, validator: checkOptionLength, trigger: 'blur' }],
  })
}

// 队伍修改信息表单验证
export const TeamInfoUpdateDrawerHook = (form, teamInfo) => {
  const checkemail = async (rule, value) => {
    //联系人邮箱验证
    if (!value) {
      return Promise.reject('联系人邮箱不能为空')
    } else if (!checkEmail(value)) {
      return Promise.reject('请输入正确的联系人邮箱')
    } else {
      return Promise.resolve()
    }
  }
  const checkPhone = async (rule, value) => {
    if (value && checkPhoneno(value)) {
      return Promise.resolve()
    } else if (value && !checkPhoneno(value)) {
      return Promise.reject('请输入正确的手机号码')
    } else {
      return Promise.reject('联系人手机不能为空')
    }
  }

  const checkalbe2508 = () => {
    if (!form.albe2508) {
      return Promise.reject('请上传修改证明')
    } else {
      return Promise.resolve()
    }
  }
  const rules = reactive({
    // 队伍名称
    albe0002: [{ required: true, message: '请输入队伍名称', trigger: 'blur' }],
    // 负责人姓名
    albe0022: [{ required: true, message: '请输入负责人姓名', trigger: 'blur' }],
    // 负责人手机
    albe0024: [{ required: true, validator: checkPhone, trigger: 'blur' }],
    // 联系人姓名
    albe0018: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
    // 联系人手机号
    albe0019: [{ required: true, validator: checkPhone, trigger: 'blur' }],
    // 联系人邮箱
    albe0049: [{ required: true, validator: checkemail, trigger: 'blur' }],
    // 修改证明
    albe2508: [{ required: true, validator: checkalbe2508, trigger: 'change' }],
  })
  return rules
}

// 队伍
export const TeamUpdateOrChargeInfoHook = () => {
  const FormTeamInfoRules = (form, formTeamType, teamInfo) => {
    const checkServiceType = () => {
      //服务类型验证
      if (form.albe0017.length == 0) {
        return Promise.reject('请选择服务类别')
      } else if (form.albe0017.length > 4) {
        return Promise.reject('服务类别最多选4项')
      } else {
        return Promise.resolve()
      }
    }
    const checkTeamName = async (rule, value) => {
      if (!value) {
        return Promise.reject('请输入队伍名称')
      } else if (value) {
        // 没有改队伍类型
        if (!formTeamType.value) {
          if (teamInfo.value.albe0002 == form.albe0002) {
            return Promise.resolve()
          } else {
            const params = {
              albe0002: form.albe0002,
              areaId: form.albe0012[form.albe0012.length - 1],
            }

            const res = await apis.checkTeamNameFortis(params)

            if (res.code == '0') {
              // 成功了 说明没有同名的
              return Promise.resolve()
            } else {
              return Promise.reject(res.message)
            }
          }
        } else {
          // 改了队伍类型就要根据队伍类型
          return Promise.resolve()
        }
      }

      //
    }
    return reactive({
      // 队伍名称
      albe0002: [{ required: true, validator: checkTeamName, trigger: 'blur' }],
      // 服务区域
      albe0012: [{ required: true, message: '请选择服务区域' }],
      // 地址验证
      albe0013: [{ required: true, message: '请点击右边的地图图标在地图上选择项目详细地址' }],
      // 服务类别
      albe0017: [{ required: true, validator: checkServiceType, trigger: 'change' }],
    })
  }
  const FormTeamTypeRules = (form) => {
    const checkTeamType = () => {
      //服务类型验证
      if (form.albe0003.length >= 2) {
        return Promise.reject('服务类别最多选1项')
      } else {
        return Promise.resolve()
      }
    }
    return reactive({
      // 队伍类型
      albe0003: [{ required: true, validator: checkTeamType, trigger: 'change' }],
      // 主管单位名称
      albe0011: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
      // 组织类型
      albe0005: [{ required: true, message: '请选择组织类型', trigger: 'change' }],
      // 登记部门
      albe0006: [{ required: true, message: '请选择登记部门', trigger: 'change' }],
      // 登记机关
      albe0007: [{ required: true, message: '请选择登记机关' }],
      // 联络组织
      albe0004: [{ required: true, message: '请选择联络组织', trigger: 'change' }],
      // 是否有直属组织
      albe0065: [{ required: true, message: '请选择是否有直属组织', trigger: 'blur' }],
      // 是否有联络组织
      albe0063: [{ required: true, message: '请选择是否有联络组织', trigger: 'blur' }],
    })
  }
  const FormChargeInfoRules = () => {
    const checkPhone_albe0019 = async (rule, value) => {
      if (value && checkPhoneno(value)) {
        return Promise.resolve()
      } else if (value && !checkPhoneno(value)) {
        return Promise.reject('请输入正确的手机号码')
      } else {
        return Promise.reject('请输入联系人手机')
      }
    }
    const checkPhone_albe0024 = async (rule, value) => {
      if (value && checkPhoneno(value)) {
        return Promise.resolve()
      } else if (value && !checkPhoneno(value)) {
        return Promise.reject('请输入正确的手机号码')
      } else {
        return Promise.reject('请输入负责人手机')
      }
    }
    const checkCardNo_albe0023 = async (rule, value) => {
      // if (value) {
      //   if(value.length == )
      // }
      // 这里要判断加密的身份证和自己输入的身份证

      if (value && checkCardNo(value)) {
        return Promise.resolve()
      } else if (value && !checkCardNo(value)) {
        return Promise.reject('请输入正确的身份证号')
      } else {
        return Promise.reject('请输入身份证号')
      }
    }
    const checkName_albe0018 = async (rule, value) => {
      if (value && checkName(value)) {
        return Promise.resolve()
      } else if (value && !checkName(value)) {
        return Promise.reject('请输入正确的姓名')
      } else {
        return Promise.reject('请输入联系人姓名')
      }
    }
    const checkName_albe0022 = async (rule, value) => {
      if (value && checkName(value)) {
        return Promise.resolve()
      } else if (value && !checkName(value)) {
        return Promise.reject('请输入正确的姓名')
      } else {
        return Promise.reject('请输入负责人姓名')
      }
    }

    const checkemail = async (rule, value) => {
      if (value && checkEmail(value)) {
        return Promise.resolve()
      } else if (!value) {
        return Promise.reject('请输入联系人邮箱')
      } else if (!checkEmail(value)) {
        return Promise.reject('请输入正确的邮箱')
      }
    }

    return reactive({
      //  联系人姓名
      albe0018: [{ required: true, validator: checkName_albe0018, trigger: 'blur' }],
      // 联系人手机
      albe0019: [{ required: true, validator: checkPhone_albe0019, trigger: 'blur' }],
      // 联系人邮箱
      albe0049: [{ required: true, validator: checkemail, trigger: 'blur' }],
      // 负责人姓名
      albe0022: [{ required: true, validator: checkName_albe0022, trigger: 'blur' }],
      // 负责人手机
      albe0024: [{ required: true, validator: checkPhone_albe0024, trigger: 'blur' }],
      // 身份证号
      albe0023: [{ required: true, validator: checkCardNo_albe0023, trigger: 'blur' }],
    })
  }
  return {
    FormTeamInfoRules,
    FormTeamTypeRules,
    FormChargeInfoRules,
  }
}
