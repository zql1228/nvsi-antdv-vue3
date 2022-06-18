import moment from 'moment'
export const McaworkNoticeColumns = [
  {
    title: '序号',
    slots: {
      customRender: 'serial',
    },
    width: 80,
    align: 'center',
  },
  {
    title: '通知标题',
    dataIndex: 'title',
    key: 'title',
    ellipsis: true,
    width: '40%',
  },
  {
    title: '紧急程度',
    ellipsis: true,
    key: 'urgentlevel',
    dataIndex: 'urgentlevel',
    slots: {
      customRender: 'urgentlevel',
    },
    width: '15%',
  },
  {
    title: '发送人',
    ellipsis: true,
    key: 'creatorname',
    dataIndex: 'creatorname',
    width: '15%',
  },
  {
    title: '通知类型',
    dataIndex: 'sort',
    ellipsis: true,
    slots: {
      customRender: 'sort',
    },
    width: '15%',
  },
  {
    title: '创建时间',
    ellipsis: true,
    key: 'createtime',
    dataIndex: 'createtime',
    customRender: (text) => {
      return moment(text.text).format('YYYY-MM-DD')
    },
    slots: { customRender: 'createtime' },
    width: '15%',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    slots: {
      customRender: 'action',
    },
    width: 200,
    align: 'center',
  },
]
export const McaworkComplaintColumns = [
  {
    title: '序号',
    slots: {
      customRender: 'serial',
    },
    width: 80,
    align: 'center',
  },
  {
    title: '投诉类型',
    dataIndex: 'albx0346',
    slots: {
      customRender: 'albx0346',
    },
    width: 100,
    ellipsis: true,
  },
  {
    title: '被投诉对象',
    ellipsis: true,
    key: 'albx0355',
    dataIndex: 'albx0355',
    width: '40%',
  },
  {
    title: '投诉人姓名',
    ellipsis: true,
    key: 'albx0356',
    dataIndex: 'albx0356',
    width: '20%',
  },
  {
    title: '投诉人手机',
    dataIndex: 'albx0351',
    key: 'albx0351',
    needTotal: true,
    ellipsis: true,
    width: '20%',
  },
  {
    title: '投诉日期',
    ellipsis: true,
    key: 'albx0349',
    dataIndex: 'albx0349',
    customRender: (text) => {
      return moment(text.text).format('YYYY-MM-DD')
    },
    slots: { customRender: 'albx0349' },
    width: '20%',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    slots: {
      customRender: 'action',
    },
    width: 100,
    align: 'center',
  },
]

export const AccountsAllegedlyColumns = [
  {
    title: '序号',
    slots: {
      customRender: 'serial',
    },
    width: 80,
    align: 'center',
  },
  {
    title: '真实姓名',
    key: 'albp1002',
    dataIndex: 'albp1002',
    slots: {
      customRender: 'albp1002',
    },
    width: '30%',
    ellipsis: true,
  },
  {
    title: '证件号码',
    ellipsis: true,
    key: 'albp1003',
    dataIndex: 'albp1003',
    width: '30%',
  },
  {
    title: '审核状态',
    ellipsis: true,
    key: 'albp1009',
    dataIndex: 'albp1009',
    slots: {
      customRender: 'albp1009',
    },
    width: '20%',
  },
  {
    title: '申诉时间',
    dataIndex: 'createtime',
    slots: {
      customRender: 'createtime',
    },
    customRender: ({ text }) => {
      return moment(text).format('YYYY-MM-DD')
    },
    key: 'createtime',
    ellipsis: true,
    width: '20%',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    slots: {
      customRender: 'action',
    },
    width: 100,
    align: 'center',
  },
]
