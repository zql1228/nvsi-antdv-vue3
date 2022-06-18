/*
  大半辈子心血,别tm乱改了,再改就剁手（创个文件再改吧，这个地方改烂了）
  */

import { reactive, ref, watch } from 'vue'
import { checkPhoneno, checkTelPhoneno, checkEmail, checkName } from '@/utils/publicMethods/common'
import apis from '@/server/request'
const { checkShzhFortis, checkCunJuFortis, checkTeamNameFortis } = apis
import storageUtil from './storageUtil'
// 服务对象代码表
import {
  nvsiAlbe0003, //队伍类型
  nvsiAlbe0005, // 主管单位组织类型 （志愿服务团体 ）
  nvsiAlbe0005_type2, // 其它开展志愿服务活动的法人组织
  nvsiAlbe0009, // 志愿服务组织———— 主管单位组织类型
  nvsiAlbe0006, // 登记部门
  nvsiAlbx0100, // 有 / 无
  nvsiAlbe0042, // 队伍提供
  nvsiAlbe0043, // 队伍需要
} from '@/utils/codevalue'

export const getCodeValue = () => {
  return reactive({
    nvsiAlbe0003,
    nvsiAlbe0005,
    nvsiAlbe0009,
    nvsiAlbe0006,
    nvsiAlbx0100,
    nvsiAlbe0042,
    nvsiAlbe0043,
    nvsiAlbe0005_type2,
  })
}

export const getFormRefs = () => {
  const formTeamTypeOwnRef = ref()
  return {
    formTeamTypeOwnRef,
  }
}

export const getFormRules = () => {
  const formTeamTypeOwnRulesHook = (form, areaid) => {
    // 验证单位社区联系电话
    const checkPhone = async (rule, value) => {
      if (value && checkPhoneno(value)) {
        return Promise.resolve()
      } else if (value && !checkPhoneno(value)) {
        return Promise.reject('请输入正确的手机号码')
      } else {
        return Promise.reject('请输入单位（社区）联系电话')
      }
    }
    // 验证单位社区联系人
    const checkvolName = async (rule, value, callback) => {
      if (!value) {
        return Promise.reject('请输入单位（社区）联系人')
      } else {
        if (checkName(value)) {
          return Promise.resolve()
        } else {
          return Promise.reject('单位（社区）联系人格式不正确')
        }
      }
    }

    // 团体类型 验证社会统一信用代码  albe000509 10 验证村居 16 验证社会组织，其他的可以乱填
    const checkAlbe0061_type1 = async (rule, value) => {
      if (!value) {
        return Promise.reject('请输入其成立的单位（社区）统一社会信用代码')
      } else if (value) {
        const a0005Arr = ['09', '10', '16']
        if (!a0005Arr.includes(form.albe0005)) {
          return Promise.resolve()
        } else {
          let res = {}
          const params = { unicode: value }
          if (form.albe0005 == '16') {
            res = await checkShzhFortis(params)

            if (res.code == '0') {
              storageUtil.albe0061Name = res.data[0].aaae0103
              return Promise.resolve()
            } else {
              return Promise.reject(res.message)
            }
          } else if (form.albe0005 == '09' || form.albe0005 == '10') {
            res = await checkCunJuFortis(params)

            if (res.code == '0') {
              storageUtil.albe0061Name = res.data[0].orgname
              return Promise.resolve()
            } else {
              return Promise.reject(res.message)
            }
          }
        }
      }
    }
    // 团体类型 验证 同意其成立的单位（社区）名称
    const checkAlbe0057_type1 = async (rule, value) => {
      if (!value) {
        return Promise.reject('请输入同意其成立的单位（社区）名称')
      } else {
        // 再次判断有没有社会统一信用代码，没有的话说明暂时还没填
        const a0005Arr = ['09', '10', '16']
        if (!a0005Arr.includes(form.albe0005)) {
          return Promise.resolve()
        } else {
          if (!form.albe0061) {
            return Promise.resolve()
          } else {
            // 从缓存中匹配，看有没有匹配上的
            if (storageUtil.albe0061Name) {
              if (storageUtil.albe0061Name == value) {
                return Promise.resolve()
              } else {
                return Promise.reject('统一社会信用代码与同意其成立的单位（社区）名称不匹配')
              }
            } else {
              // 这个理论上来讲应该不存在这种情况
              return Promise.reject('统一社会信用代码与同意其成立的单位（社区）名称不匹配')
            }
          }
        }
      }
    }

    const checkAlbe0005 = async (rule, value) => {
      if (!value) {
        return Promise.reject('请选择组织类型')
      } else {
        // 组织 2
        const a0009Value = nvsiAlbe0009.map((item) => item.value)
        // 其他法人组织 3
        const a0005TypeValue = nvsiAlbe0005_type2.map((item) => item.value)
        // 团体 1
        const a0005Value = nvsiAlbe0005.map((item) => item.value)

        if (form.albe0003 == '2' && a0009Value.includes(form.albe0005)) {
          return Promise.resolve()
        } else if (form.albe0003 == '3' && a0005TypeValue.includes(form.albe0005)) {
          return Promise.resolve()
        } else if (form.albe0003 == '1' && a0005Value.includes(form.albe0005)) {
          return Promise.resolve()
        } else {
          form.albe0005 = ''
          return Promise.reject('请选择组织类型')

          // form.albe0003 == '1' ? (form.albe0005 = '99') : form.albe0003 == '2' ? (form.albe0005 = '13') : (form.albe0005 = '99')
          return Promise.resolve()
          // return Promise.reject('请选择组织类型')
        }
      }
    }

    // 组织类型2 验证主管单位名称
    const checkAlbe0011_type2 = async (rule, value) => {
      if (!value) {
        return Promise.reject('请输入主管单位名称')
      } else {
        if (value && !form.albe0008) {
          // 这个时候统一社会信用代码还没填写
          return Promise.resolve()
        } else if (value && form.albe0008) {
          // 先把社会统一信用代码和主管单位匹配上
          if (value == storageUtil.albe08Name) {
            // 匹配上了再去匹配队伍名称
            // 如果对应上了  再去查询有没有一样的主管单位名称--或者队伍名称
            const params = {
              albe0002: form.albe0011,
              areaId: areaid,
            }
            const res = await checkTeamNameFortis(params)
            if (res.code == '0') {
              // 成功了 说明没有同名的
              if (form.albe0011 !== storageUtil.teamName) {
                return Promise.reject('主管单位名称需和队伍名称保持一致')
              } else {
                return Promise.resolve()
              }
            } else {
              return Promise.reject(res.message)
            }
          } else {
            return Promise.reject('统一社会信用代码与主管单位名称不匹配')
          }
        }
      }
    }

    // 组织类型2 验证社会统一信用代码
    const checkAlbe0008_type2 = async (rule, value) => {
      if (!value) {
        return Promise.reject('请填写社会统一信用代码')
      } else {
        // 填写了社会统一信用代码
        const params = { unicode: value }
        const res = await checkShzhFortis(params)
        if (res.code == '0') {
          storageUtil.albe08Name = res.data[0].aaae0103
          return Promise.resolve()
        } else {
          return Promise.reject(res.message)
        }
      }
    }

    // 组织类型3 验证主管单位名称
    const checkAlbe0011_type3 = async (rule, value) => {
      if (!value) {
        return Promise.reject('请输入主管单位名称')
      } else {
        if (form.albe0005 == '16') {
          // 把社会统一信用代码和主管单位匹配上
          if (value == storageUtil.albe08Name) {
            // 如果对应上了  再去查询有没有一样的主管单位名称--或者队伍名称
            const params = {
              albe0002: form.albe0011,
              areaId: areaid,
            }
            const res = await checkTeamNameFortis(params)
            if (res.code == '0') {
              // 成功了 说明没有同名的
              if (form.albe0011 !== storageUtil.teamName) {
                return Promise.reject('主管单位名称需和队伍名称保持一致')
              } else {
                return Promise.resolve()
              }
            } else {
              return Promise.reject(res.message)
            }
          } else {
            return Promise.reject('统一社会信用代码与主管单位名称不匹配')
          }
        } else {
          return Promise.resolve()
        }
      }
    }

    // 组织类型3 验证社会统一信用代码
    const checkAlbe0008_type3 = async (rule, value) => {
      if (!value) {
        return Promise.reject('请填写社会统一信用代码')
      } else {
        const a0005Arr = ['09', '10', '16']
        // 除了这几个，其他的不用验证
        if (!a0005Arr.includes(form.albe0005)) {
          return Promise.resolve()
        } else {
          const params = { unicode: value }
          let res = {}
          if (form.albe0005 == '16') {
            res = await checkShzhFortis(params)
            if (res.code == '0') {
              storageUtil.albe08Name = res.data[0].aaae0103
            }
          } else if (form.albe0005 == '09' || form.albe0005 == '10') {
            res = await checkCunJuFortis(params)
          }
          if (res.code == '0') {
            return Promise.resolve()
          } else {
            return Promise.reject(res.message)
          }
        }
      }
    }

    // console.log(form, 'form')
    // 进行逻辑判断,如果没有联络组织或者直属组织
    // 队伍类型 队伍类型必选
    if (!form.albe0003) {
      return reactive({
        // 队伍类型
        albe0003: [{ required: true, message: '请选择队伍类型', trigger: 'blur' }],
      })
    }
    // 团体类型 albe0003== '1'    // albe0063 是否有联络组织  albe0065 是否有直属组织1
    if (form.albe0003 == '1') {
      // || !form.albe0065
      if ((form.albe0065 == '1' && form.albe0063 == '0') || (form.albe0065 == '1' && !form.albe0063) || !form.albe0065) {
        // 有直属组织没有联络组织
        return reactive({
          // 队伍类型
          albe0003: [{ required: true, message: '请选择队伍类型', trigger: 'blur' }],
          // 有无直属组织
          albe0065: [{ required: true, message: '请选择有无直属组织' }],
          // 直属组织_ 汉字
          topname: [{ required: true, message: '请选择直属组织' }],
          // 同意其成立的单位（社区）名称
          albe0057: [{ required: true, message: '请输入同意其成立的单位（社区）名称', trigger: 'blur' }],
          // 注册申请表扫描件
          albe0044: [{ required: true, message: '请上传注册申请表扫描件' }],
          // 手持身份证照
          // albe0045: [{ required: true, message: '请上传手持身份证照' }],
        })
      } else if ((form.albe0063 == '1' && form.albe0065 == '0') || (form.albe0063 == '1' && !form.albe0065)) {
        // 没有直属组织 有联络组织
        return reactive({
          // 队伍类型
          albe0003: [{ required: true, message: '请选择队伍类型', trigger: 'blur' }],
          // 有无直属组织
          albe0065: [{ required: true, message: '请选择有无直属组织' }],
          // 同意其成立的单位（社区）名称
          albe0057: [{ required: true, message: '请输入同意其成立的单位（社区）名称', trigger: 'blur' }],
          // 有无联络组织
          albe0063: [{ required: true, message: '请选择有无联络组织' }],
          // 联络组织_ 汉字
          orgname: [{ required: true, message: '请选择联络组织' }],
          // 组织类型（同意其成立的单位（社区）类型）
          albe0005: [{ required: true, message: '请选择同意其成立的单位（社区）类型', trigger: 'change' }],
          // 注册申请表扫描件
          albe0044: [{ required: true, message: '请上传注册申请表扫描件' }],
          // 手持身份证照
          // albe0045: [{ required: true, message: '请上传手持身份证照' }],
        })
      } else if ((form.albe0063 == '0' && form.albe0065 == '0') || (!form.albe0063 && !form.albe0065)) {
        // 没有直属组织 没有联络组织
        return reactive({
          // 队伍类型
          albe0003: [{ required: true, message: '请选择队伍类型', trigger: 'blur' }],
          // 有无直属组织
          albe0065: [{ required: true, message: '请选择有无直属组织' }],
          // 同意其成立的单位（社区）名称 message: '请输入同意其成立的单位（社区）名称'
          albe0057: [{ required: true, validator: checkAlbe0057_type1, trigger: 'blur' }],
          // 有无联络组织
          albe0063: [{ required: true, message: '请选择有无联络组织' }],
          // 组织类型（同意其成立的单位（社区）类型） 这个要验证 不能用message验证
          albe0005: [{ required: true, message: '请选择同意其成立的单位（社区）类型', trigger: 'change' }],
          // 登记机关
          albe0009: [{ required: true, message: '请选择登记机关' }],
          // 同意其成立的单位（社区）统一社会信用代码
          albe0061: [{ required: true, validator: checkAlbe0061_type1, trigger: 'blur' }],
          //  单位（社区）联系人
          albe0058: [{ required: true, validator: checkvolName, trigger: 'blur' }],
          //  单位（社区）联系电话
          albe0059: [{ required: true, validator: checkPhone, trigger: 'blur' }],
          // 注册申请表扫描件
          albe0044: [{ required: true, message: '请上传注册申请表扫描件' }],
          // 手持身份证照
          // albe0045: [{ required: true, message: '请上传手持身份证照' }],
        })
      }
    } else if (form.albe0003 == '2' || form.albe0003 == '3') {
      // 志愿服务组织
      const rules_type2 = reactive({
        // 队伍类型
        albe0003: [{ required: true, message: '请选择队伍类型', trigger: 'blur' }],
        // 主管单位名称
        albe0011: [{ required: true, validator: checkAlbe0011_type2, trigger: 'blur' }],
        // 有无联络组织
        albe0063: [{ required: true, message: '请选择有无联络组织' }],
        // 联络组织_ 汉字
        orgname: [{ required: true, message: '请选择联络组织' }],
        // 组织类型 checkAlbe0005
        albe0005: [{ required: true, validator: checkAlbe0005, trigger: 'change' }],
        //  登记部门
        albe0006: [{ required: true, message: '请选择登记部门', trigger: 'change' }],
        // 登记机关
        albe0009: [{ required: true, message: '请选择登记机关' }],
        // 统一社会信用代码
        albe0008: [{ required: true, validator: checkAlbe0008_type2, trigger: 'blur' }],
        // 社会统一信用代码证
        albe0067: [{ required: true, message: '请上传社会统一信用代码证' }],
      })
      if (form.albe0003 == '2') {
        rules_type2.albe0008[0].validator = checkAlbe0008_type2
        rules_type2.albe0011[0].validator = checkAlbe0011_type2

        if (form.albe0063 == '0') {
          rules_type2.orgname[0].required = false
          return rules_type2
        } else {
          return rules_type2
        }
      } else {
        rules_type2.albe0008[0].validator = checkAlbe0008_type3
        rules_type2.albe0011[0].validator = checkAlbe0011_type3

        if (form.albe0063 == '0') {
          rules_type2.orgname[0].required = false
          return rules_type2
        } else {
          return rules_type2
        }
      }
    }
  }
  return {
    formTeamTypeOwnRulesHook,
  }
}

/*
  1, 团体验证（三五团体）
     a:  居民委员会 9  村委会 10   checkCunJu(unicode)
      16 社会组织   checkShzh(unicode)
  */
