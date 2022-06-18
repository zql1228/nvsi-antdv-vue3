import { reactive } from 'vue'

// 新增培训表单验证
export const useInfoTrainDrawerHook = () => {
  const rules = reactive({
    albx0282: [{ required: true, message: '请输入培训主题', trigger: 'blur' }],
    albx0284: [{ required: true, message: '请选择培训开始时间' }],
    albx0285: [{ required: true, message: '请选择培训结束时间' }],
    areaid: [{ required: true, message: '请选择区域' }],
    albx0287: [{ required: true, message: '请选择详细地址' }],
    albx0291: [{ required: true, message: '请输入培训类型', trigger: 'blur' }],
    albx0292: [{ required: true, message: '请输入培训方式', trigger: 'blur' }],
    albx0288: [{ required: true, message: '请输入培训学时', trigger: 'blur' }],
    albx0293: [{ required: true, message: '请输入培训组织者', trigger: 'blur' }],
    albx0289: [{ required: true, message: '请输入培训联系人', trigger: 'blur' }],
    albx0296: [{ required: true, message: '请输入联系人电话', trigger: 'blur' }],
  })
  return rules
}

// 新增通知公告表单验证
export const useInfoNoticeDrawerHook = (form, QuillEditor) => {
  const checkUnit = async (rule, value) => {
    //接收单位验证
    if (form.unit.length > 0) {
      return Promise.resolve()
    } else {
      return Promise.reject('请选择接收单位')
    }
  }

  const checkContent = async (rule, value) => {
    //公告内容验证
    form.content = QuillEditor.value.getHTML()
    if (!form.content) {
      return Promise.reject('请填写公告内容')
    } else {
      return Promise.resolve()
    }
  }
  const rules = reactive({
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
    urgentlevel: [{ required: true, message: '请选择紧急程度', trigger: 'change' }],
    sort: [{ required: true, message: '请选择通知类别', trigger: 'change' }],
    unit: [{ required: true, validator: checkUnit, trigger: 'change' }],
    team: [{ required: true, message: '请选择接收志愿队伍', trigger: 'change' }],
    content: [{ required: true, validator: checkContent, trigger: 'blur' }],
  })
  return rules
}

// 新增通知公告下拉框的配置项
export const useInfoNoticeOptionHook = (userInfo) => {
  const optionsList = reactive({
    levelOption: [
      {
        label: '紧急',
        value: '0',
      },
      {
        label: '普通',
        value: '1',
      },
    ],
    noticeTypeOption: [
      {
        label: '工作通知',
        value: '0',
      },
      {
        label: '会议通知',
        value: '1',
      },
      {
        label: '培训通知',
        value: '2',
      },
    ],
    unitOption: [
      {
        label: '各省级管理部门',
        value: '0',
        disabled: userInfo.areaLevel != 0,
      },
      {
        label: '全市级管理部门',
        value: '1',
        disabled: userInfo.areaLevel != 1,
      },
      {
        label: '全区/县级管理部门',
        value: '2',
        disabled: userInfo.areaLevel != 1 && userInfo.areaLevel != 3,
      },
      {
        label: '本级其它管理人员',
        value: '3',
        disabled: false,
      },
    ],
    teamOption: [
      {
        label: '管辖范围内全部志愿服务队伍',
        value: '0',
      },
      {
        label: '指定服务队伍',
        value: '1',
      },
    ],
  })
  return optionsList
}

// 修改评价表单验证
export const useInfoUpdateEvluaHook = () => {
  return reactive({
    albp0003: [{ required: true, message: '请填写评价人', trigger: 'blur' }],
    albx0002: [{ required: true, message: '请填写被评价的项目', trigger: 'blur' }],
    albx0463: [{ required: true, message: '请评价守时程度' }],
    albx0464: [{ required: true, message: '请评价服务态度' }],
    albx0465: [{ required: true, message: '请评价专业水平' }],
    albx0508: [{ required: true, message: '请填写评价内容', trigger: 'blur' }],
  })
}

// 新增表彰表单验证
export const useInfoCommendDrawerHook = (form, QuillEditor) => {
  const checkContent = () => {
    let str = QuillEditor.value.getText() //
    if (str !== '\n') {
      form.albx0356 = QuillEditor.value.getHTML()
      return Promise.resolve()
    }

    if (!form.albx0356) {
      return Promise.reject('请填写表彰内容')
    } else {
    }
  }
  return reactive({
    albx0352: [{ required: true, message: '请填写表彰名称', trigger: 'blur' }],
    albx0353: [{ required: true, message: '请选择获奖日期' }],
    albx0354: [{ required: true, message: '请填写颁发者名称', trigger: 'blur' }],
    albx0355: [{ required: true, message: '请填写奖励文书名称', trigger: 'blur' }],
    albx0363: [{ required: true, message: '请填写奖励文书文号', trigger: 'blur' }],
    albx0362: [{ required: true, message: '请选择表彰类型', trigger: 'change' }],
    albx0356: [{ required: true, validator: checkContent, trigger: 'change' }],
  })
}

// 物资捐赠表单验证
export const useInfoMaterDrawerHook = () => {
  return reactive({
    albe1802: [{ required: true, message: '请填写物资名称', trigger: 'blur' }],
    albe1808: [{ required: true, message: '请填写捐赠数量', trigger: 'blur' }],
    albe1804: [{ required: true, message: '请填写物资单位', trigger: 'blur' }],
    albe1803: [{ required: true, message: '请填写库存数量', trigger: 'blur' }],
    albe1812: [{ required: true, message: '请选择物资类型', trigger: 'change' }],
    albe1805: [{ required: true, message: '请填写捐赠方名称', trigger: 'blur' }],
    albe1806: [{ required: true, message: '请填写捐赠方电话', trigger: 'blur' }],
    albe1807: [{ required: true, message: '请填写捐赠日期' }],
  })
}
