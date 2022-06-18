import moment from 'moment'
export const timeEntryCom = {
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
      title: '项目名称',
      dataIndex: 'albx0002',
      slots: {
        customRender: 'albx0002',
      },
      ellipsis: true,
      width: '18%',
    },
    {
      title: '服务区域',
      dataIndex: 'albx0012',
      width: '12%',
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
      ellipsis: true,
    },
    {
      title: '项目时间',
      dataIndex: 'albx0004',
      customRender: ({ record }) => {
        if (record.albx0004) {
          return moment(record.albx0004).format('YYYY-MM-DD') + ' ~ ' + moment(record.albx0005).format('YYYY-MM-DD')
        } else {
          return '-'
        }
      },
      ellipsis: true,
      width: '15%',
    },
    {
      title: '时长',
      dataIndex: 'albx0061',
      needTotal: true,
      width: '10%',
      customRender: ({ text }) => {
        return text + ' 小时'
      },
    },
    {
      title: '项目人数',
      dataIndex: 'albx0016',
      customRender: ({ text }) => {
        return text + ' 人'
      },
      ellipsis: true,
      width: '10%',
    },
    {
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      width: 120,
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
      title: '志愿者名称',
      dataIndex: 'albp0003',
      ellipsis: true,
      width: '15%',
    },
    {
      title: '项目时长',
      dataIndex: 'albx0083',
      customRender: ({ text }) => {
        return text + ' 小时'
      },
      ellipsis: true,
      width: '15%',
    },
    {
      title: '岗位',
      dataIndex: 'albx0072',
      ellipsis: true,
      width: '20%',
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 100,
      align: 'center',
      slots: {
        customRender: 'action',
      },
    },
  ],
  columns3: [
    {
      title: '序号',
      slots: {
        customRender: 'serial',
      },
      width: 50,
      align: 'center',
    },
    {
      title: '志愿者名称',
      dataIndex: 'albp0003',
      width: '14%',
      ellipsis: true,
    },
    {
      title: '岗位名称',
      dataIndex: 'albx0072',
      width: '20%',
      ellipsis: true,
    },
    {
      title: '录入时长',
      dataIndex: 'albx0172',
      customRender: ({ text }) => {
        return text + ' 小时'
      },
      width: '10%',
      ellipsis: true,
    },
    {
      title: '录入状态',
      dataIndex: 'albx0174',
      slots: { customRender: 'albx0174' },
      width: '15%',
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 100,
      align: 'center',
      slots: { customRender: 'action' },
    },
  ],
}
export const AuditCom = {
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
      width: '10%',
    },
    {
      title: '申请时长',
      dataIndex: 'albx0172',
      needTotal: true,
      slots: {
        customRender: 'albx0172',
      },
      width: '8%',
      ellipsis: true,
    },
    {
      title: '所属项目',
      dataIndex: 'albx0002',
      needTotal: true,
      width: '8%',
      ellipsis: true,
    },
    {
      title: '所属岗位',
      dataIndex: 'albx0072',
      needTotal: true,
      width: '9%',
      ellipsis: true,
    },
    {
      title: '发起申请时间',
      dataIndex: 'albx0180',
      customRender: ({ record }) => {
        return moment(record.albx0180).format('YYYY-MM-DD')
      },
      width: '9%',
      ellipsis: true,
    },
    {
      title: '开始时间',
      dataIndex: 'albx0181',
      customRender: ({ record }) => {
        if (record.albx0181) {
          return moment(record.albx0181).format('YYYY-MM-DD HH:mm:ss')
        } else {
          return '-'
        }
      },
      width: '9%',
      ellipsis: true,
    },
    {
      title: '结束时间',
      dataIndex: 'albx0181',
      customRender: ({ record }) => {
        if (record.albx0182) {
          return moment(record.albx0182).format('YYYY-MM-DD HH:mm:ss')
        } else {
          return '-'
        }
      },
      width: '9%',
      ellipsis: true,
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
export const RecordCom = {
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
      title: '项目名称',
      dataIndex: 'albx0002',
      ellipsis: true,
      width: '20%',
    },
    {
      title: '服务区域',
      dataIndex: 'albx0012',
      width: '20%',
      ellipsis: true,
    },
    {
      title: '项目时间',
      dataIndex: 'albx0004',
      customRender: ({ record }) => {
        if (record.albx0004) {
          return moment(record.albx0004).format('YYYY-MM-DD') + ' ~ ' + moment(record.albx0005).format('YYYY-MM-DD')
        } else {
          return '-'
        }
      },
      width: '30%',
      ellipsis: true,
    },
    {
      title: '项目时长',
      dataIndex: 'albx0061',
      customRender: ({ text }) => {
        return text + ' 小时'
      },
      width: '10%',
      ellipsis: true,
    },
    {
      title: '项目人数',
      dataIndex: 'albx0016',
      width: '10%',
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'action',
      slots: {
        customRender: 'action',
      },
      width: 100,
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
      slots: {
        customRender: 'albp0003',
      },
      align: 'center',
      ellipsis: true,
      width: '10%',
    },
    {
      title: '岗位',
      dataIndex: 'albx0072',
      ellipsis: true,
      width: '8%',
    },
    {
      title: '开始时间',
      dataIndex: 'albx0181',
      customRender: ({ record }) => {
        if (record.albx0181) {
          return moment(record.albx0181).format('YYYY-MM-DD HH:mm:ss')
        } else {
          return '-'
        }
      },
      width: '15%',
      ellipsis: true,
    },
    {
      title: '结束时间',
      dataIndex: 'albx0182',
      customRender: ({ record }) => {
        if (record.albx0182) {
          return moment(record.albx0182).format('YYYY-MM-DD HH:mm:ss')
        } else {
          return '-'
        }
      },
      width: '15%',
      ellipsis: true,
    },
    {
      title: '录入时长',
      dataIndex: 'albx0172',
      customRender: ({ text }) => {
        return text + '小时'
      },
      width: '10%',
      ellipsis: true,
    },
    {
      title: '录入方式',
      dataIndex: 'albx0173',
      slots: {
        customRender: 'albx0173',
      },
      width: '10%',
      ellipsis: true,
    },
    {
      title: '录入日期',
      dataIndex: 'albx0178',
      customRender: ({ record }) => {
        if (record) {
          return moment(record.albx0178).format('YYYY-MM-DD')
        } else {
          return '-'
        }
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
      width: 100,
      align: 'center',
    },
  ],
}
export const TimeInquiryCom = {
  columns: [
    {
      title: '序号',
      dataIndex: 'serial',
      slots: {
        customRender: 'serial',
      },
      width: 100,
      key: 'serial',
      align: 'center',
    },
    {
      title: '志愿者姓名',
      dataIndex: 'albp0003',
      slots: {
        customRender: 'albp0003',
      },
      width: '10%',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '服务时间',
      dataIndex: 'albx0181',
      slots: {
        customRender: 'albx0181',
      },
      ellipsis: true,
      width: '15%',
    },
    {
      title: '服务时长',
      dataIndex: 'albx0172',
      slots: {
        customRender: 'albx0172',
      },
      width: '10%',
      ellipsis: true,
    },
    {
      title: '所属项目',
      dataIndex: 'albx0002',
      ellipsis: true,
      width: '30%',
    },
    {
      title: '所属队伍',
      dataIndex: 'albe0002',
      width: '30%',
      ellipsis: true,
    },
  ],
}
export const VolCom = {
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
    },
    {
      title: '性别',
      dataIndex: 'albp0006',
      width: 150,
    },
    {
      title: '年龄',
      dataIndex: 'albp0014',
      width: 150,
    },
    {
      title: '服务区域',
      dataIndex: 'albp0025',
      width: 260,
    },
    {
      title: '总服务时长',
      dataIndex: 'albp0089',
      needTotal: true,
      customRender: ({ text }) => {
        return text + ' 小时'
      },
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
