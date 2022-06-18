export const AuditMemberCom = {
  columns: [
    {
      title: '序号',
      slots: {
        customRender: 'serial',
      },
      width: 80,
      align: 'center',
    },
    {
      title: '志愿者姓名',
      dataIndex: 'albp3302',
      ellipsis: true,
      width: '12%',
      slots: {
        customRender: 'name',
      },
    },
    {
      title: '服务区域',
      dataIndex: 'albp3303',
      ellipsis: true,
      width: '18%',
      customRender: ({ text }) => {
        if (text) {
          text = text.replace('省', '省>')
          text = text.indexOf('市') == text.length - 1 ? (text = text) : text.replace('市', '市>')
          text = text.indexOf('区') == text.length - 1 ? (text = text) : text.replace('区', '区>')

          return text
        } else {
          return '-'
        }
      },
    },
    {
      title: '个人总服务时长',
      dataIndex: 'albp3304',
      customRender: ({ text }) => {
        return text + ' 小时'
      },
      ellipsis: true,
      width: '15%',
    },
    {
      title: '发起申请时间',
      dataIndex: 'albp3305',
      slots: {
        customRender: 'albp3305',
      },
      ellipsis: true,
      width: '18%',
    },
    {
      title: '操作',
      dataIndex: 'action',
      slots: {
        customRender: 'action',
      },
      width: 200,
      align: 'center',
    },
  ],
  columns2: [
    {
      title: '序号',
      slots: {
        customRender: 'serial',
      },
      width: 50,
      align: 'center',
    },
    {
      title: '志愿者姓名',
      dataIndex: 'albp0003',
      ellipsis: true,
      width: '12%',
      slots: {
        customRender: 'name',
      },
    },
    {
      title: '服务区域',
      dataIndex: 'areaid',
      ellipsis: true,
      width: '15%',
      customRender: ({ text }) => {
        if (text) {
          text = text.replace('省', '省>')
          text = text.indexOf('市') == text.length - 1 ? (text = text) : text.replace('市', '市>')
          text = text.indexOf('区') == text.length - 1 ? (text = text) : text.replace('区', '区>')
          return text
        } else {
          return '-'
        }
      },
    },
    {
      title: '个人总服务时长',
      dataIndex: 'albp0089',
      customRender: ({ text }) => {
        return text + ' 小时'
      },
      ellipsis: true,
      width: '15%',
    },
    {
      title: '发起申请时间',
      dataIndex: 'albx0056',
      slots: {
        customRender: 'albx0056',
      },
      ellipsis: true,
      width: '15%',
    },
    {
      title: '报名项目',
      dataIndex: 'albx0002',
      ellipsis: true,
      width: '15%',
    },
    {
      title: '操作',
      dataIndex: 'action',
      slots: {
        customRender: 'action',
      },
      width: 200,
      align: 'center',
    },
  ],
}
export const TeamMemberCom = {
  columns: [
    {
      title: '序号',
      slots: {
        customRender: 'serial',
      },
      width: 50,
      align: 'center',
    },
    {
      title: '志愿者姓名',
      dataIndex: 'albp0003',
      ellipsis: true,
      width: '12%',
      slots: {
        customRender: 'name',
      },
    },
    {
      title: '性别',
      dataIndex: 'albp0006',
      slots: {
        customRender: 'albp0006',
      },
      ellipsis: true,
      width: '8%',
    },
    {
      title: '服务区域',
      dataIndex: 'albp0020value',
      ellipsis: true,
      width: '15%',
      customRender: ({ text }) => {
        if (text) {
          text = text.replace('省', '省>')
          text = text.indexOf('市') == text.length - 1 ? (text = text) : text.replace('市', '市>')
          text = text.indexOf('区') == text.length - 1 ? (text = text) : text.replace('区', '区>')

          return text
        } else {
          return '-'
        }
      },
    },
    {
      title: '手机号码',
      dataIndex: 'albp0010',
      width: '12%',
      ellipsis: true,
    },

    {
      title: '总服务时长',
      dataIndex: 'albp0089',
      needTotal: true,
      customRender: ({ text }) => {
        return text + ' 小时'
      },
      width: '10%',
      ellipsis: true,
    },

    {
      title: '操作',
      dataIndex: 'action',
      slots: {
        customRender: 'action',
      },
      width: 230,
      align: 'center',
    },
  ],
}
//成员管理-项目成员-成员管理抽屉
export const proMenberCom = {
  columns: [
    {
      title: '志愿者姓名',
      dataIndex: 'albp0003',
      ellipsis: true,
      slots: {
        customRender: 'name',
      },
      width: '12%',
    },
    {
      title: '性别',
      dataIndex: 'albp0006',
      slots: { customRender: 'albp0006' },
      width: '8%',
      ellipsis: true,
    },
    {
      title: '岗位',
      dataIndex: 'albx0072',
      width: '15%',
      ellipsis: true,
    },
    {
      title: '服务区域',
      dataIndex: 'areaname',
      width: '18%',
      ellipsis: true,
    },
    {
      title: '项目服务时长',
      dataIndex: 'albx0083',
      customRender: ({ text }) => {
        return text + ' 小时'
      },
      width: '12%',
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      width: 100,
      align: 'center',
    },
  ],
  columns2: [
    {
      title: '志愿者姓名',
      dataIndex: 'albp0003',
      ellipsis: true,
      width: '20%',
      align: 'center',
      slots: {
        customRender: 'name',
      },
    },
    {
      title: '性别',
      dataIndex: 'albp0006',
      align: 'center',
      slots: {
        customRender: 'albp0006',
      },
      width: '20%',
    },
    {
      title: '服务区域',
      dataIndex: 'albp0020value',
      ellipsis: true,
      width: '40%',
    },
    {
      title: '操作',
      dataIndex: 'action',
      slots: {
        customRender: 'action',
      },
      width: 120,
      align: 'center',
    },
  ],
  columns3: [
    {
      title: '志愿者姓名',
      dataIndex: 'albp0003',
      slots: {
        customRender: 'name',
      },
      width: '10%',
      ellipsis: true,
    },
    {
      title: '性别',
      dataIndex: 'albp0006',
      slots: { customRender: 'albp0006' },
      width: '8%',
    },
    {
      title: '岗位',
      dataIndex: 'albx0072',
      width: '20%',
      ellipsis: true,
    },
    {
      title: '服务区域',
      dataIndex: 'albp0020',
      ellipsis: true,
      width: '20%',
    },
    {
      title: '项目服务时长',
      dataIndex: 'albx0083',
      customRender: ({ text }) => {
        return text + ' 小时'
      },
      ellipsis: true,
      width: '10%',
    },
    {
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      width: 100,
      align: 'center',
    },
  ],
}
export const addCom = {
  columns: [
    {
      title: '序号',
      slots: {
        customRender: 'serial',
      },
      width: 50,
      align: 'center',
    },
    {
      title: '志愿者姓名',
      dataIndex: 'albp0003',
      width: 160,
    },
    {
      title: '身份证号',
      dataIndex: 'albp0005',
      width: 160,
    },
    {
      title: '操作',
      dataIndex: 'action',
      slots: {
        customRender: 'action',
      },
      width: '18%',
      align: 'center',
    },
  ],
  columns2: [
    {
      title: '志愿者姓名',
      dataIndex: 'albp0003',
      width: 120,
    },
    {
      title: '身份证号',
      dataIndex: 'cardno',
      width: 120,
    },
    {
      title: '失败原因',
      dataIndex: 'msg',
      slots: {
        customRender: 'msg',
      },
      width: 200,
      align: 'center',
    },
  ],
}
export const addMemberCom = {
  columns: [
    {
      title: '序号',
      slots: {
        customRender: 'serial',
      },
      width: '10%',
      align: 'center',
    },
    {
      title: '志愿者姓名',
      dataIndex: 'albp0003',
      width: '40%',
      ellipsis: true,
    },
    {
      title: '身份证号',
      dataIndex: 'albp0005',
      width: '40%',
      ellipsis: true,
    },
  ],
}
export const evaluteCom = {
  columns: [
    {
      title: '序号',
      slots: {
        customRender: 'serial',
      },
      width: 50,
      align: 'center',
    },
    {
      title: '志愿者姓名',
      dataIndex: 'albp0003',
      width: 120,
    },
    {
      title: '性别',
      dataIndex: 'albp0005',
      width: 150,
    },
    {
      title: '岗位名称',
      dataIndex: 'albp0005',
      width: 150,
    },
    {
      title: '服务区域',
      dataIndex: 'albp0005',
      width: 150,
    },
    {
      title: '项目服务时长',
      dataIndex: 'albp0005',
      width: 150,
    },
    {
      title: '操作',
      dataIndex: 'action',
      slots: {
        customRender: 'action',
      },
      width: '18%',
      align: 'center',
    },
  ],
  columns2: [
    {
      title: '序号',
      slots: {
        customRender: 'serial',
      },
      width: 50,
      align: 'center',
    },
    {
      title: '志愿者姓名',
      dataIndex: 'albp0003',
      width: 120,
    },
    {
      title: '性别',
      dataIndex: 'albp0005',
      width: 150,
    },
    {
      title: '岗位名称',
      dataIndex: 'albp0005',
      width: 150,
    },
    {
      title: '服务区域',
      dataIndex: 'albp0005',
      width: 150,
    },
    {
      title: '项目服务时长',
      dataIndex: 'albp0005',
      width: 150,
    },
    {
      title: '操作',
      dataIndex: 'action',
      slots: {
        customRender: 'action',
      },
      width: '18%',
      align: 'center',
    },
  ],
}
export const addOutsideCom = {
  columns: [
    {
      title: '志愿者姓名',
      dataIndex: 'volname',
      width: '15%',
      ellipsis: true,
    },
    {
      title: '身份证号',
      dataIndex: 'volcard',
      width: '20%',
      ellipsis: true,
    },
    {
      title: '手机号',
      dataIndex: 'voltel',
      width: '16%',
      ellipsis: true,
    },
    {
      title: '服务区域',
      dataIndex: 'areaname',
      width: '20%',
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'action',
      slots: {
        customRender: 'action',
      },
      width: 80,
      align: 'center',
    },
  ],
  columns2: [
    {
      title: '序号',
      slots: {
        customRender: 'serial',
      },
      width: 50,
      align: 'center',
    },
    {
      title: '志愿者姓名',
      dataIndex: 'albp3401',
      width: '15%',
      ellipsis: true,
    },
    {
      title: '身份证号',
      dataIndex: 'albp3403',
      width: '20%',
      ellipsis: true,
    },
    {
      title: '手机号',
      dataIndex: 'albp3404',
      width: '15%',
      ellipsis: true,
    },
    {
      title: '服务区域',
      dataIndex: 'albp3402',
      width: '20%',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'albp3405',
      slots: {
        customRender: 'albp3405',
      },
      width: 80,
    },
  ],
}
export const changInfoCom = {
  columns: [
    {
      title: '修改人',
      dataIndex: 'albe2501',
      width: 160,
    },
    {
      title: '修改时间',
      dataIndex: 'albe2502',
      width: 160,
    },
    {
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      width: '18%',
      align: 'center',
    },
  ],
}
export const DownloadproofCom = {
  columns: [
    {
      title: '序号',
      slots: {
        customRender: 'serial',
      },
      width: 50,
      align: 'center',
    },
    {
      title: '服务项目名称',
      dataIndex: 'albp0003',
      width: '20%',
    },
    {
      title: '服务队伍名称',
      dataIndex: 'albp0005',
      width: '20%',
    },
    {
      title: '服务区域',
      dataIndex: 'albp0005',
      width: '20%',
    },
    {
      title: '服务时长',
      dataIndex: 'albp0005',
      width: '10%',
    },
  ],
}
