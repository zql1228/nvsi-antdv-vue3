import { ref, reactive } from 'vue'
export const getAddDomainFormRules = () => {
  return reactive({
    // 领域编号
    // albe0113: [{ required: true, message: '请输入领域编号', trigger: 'blur' }],
    // 领域类型
    albe0112: [{ required: true, message: '请输入领域类型', trigger: 'blur' }],
    // 描述
    // albe0115: [{ required: true, message: '请输入描述', trigger: 'blur' }],
    // 序号
    // albe0116: [{ required: true, message: '请输入序号', trigger: 'blur' }],
  })
}

export const getAddSerTypeFormRules = () => {
  return reactive({
    // 服务类型
    albe0122: [{ required: true, message: '请输入服务类型', trigger: 'blur' }],
  })
}
