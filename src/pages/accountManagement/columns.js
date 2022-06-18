import moment from 'moment'
export const UserInformationColumns = [
  {
    title: '序号',
    slots: {
      customRender: 'serial',
    },
    width: 80,
    align: 'center',
  },
  // {
  //   title: '用户名',
  //   dataIndex: 'userflag',
  //   width: '40%',
  //   slots: {
  //     customRender: 'userflag',
  //   },
  //   ellipsis: true,
  // },
  {
    title: '管理员名称',
    ellipsis: true,
    key: 'fullname',
    dataIndex: 'fullname',
    width: '60%',
  },
  {
    title: '最后登录时间',
    ellipsis: true,
    key: 'lastlogintime',
    dataIndex: 'lastlogintime',
    slots: {
      customRender: 'lastlogintime',
    },
    customRender: ({ text }) => {
      return moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    width: '40%',
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
export const UserInformationColumns2 = [
  {
    title: '序号',
    slots: {
      customRender: 'serial',
    },
    width: 80,
    align: 'center',
  },
  {
    title: '队伍名称',
    dataIndex: 'albe0002',
    key: 'albe0002',
    slots: {
      customRender: 'albe0002',
    },
    width: '50%',
    ellipsis: true,
  },
  {
    title: '最后登录时间',
    ellipsis: true,
    key: 'lastlogintime',
    dataIndex: 'lastlogintime',
    slots: {
      customRender: 'albe0002',
    },
    customRender: ({ text }) => {
      return moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    width: '50%',
  },
  // {
  //   title: '队伍联络编号',
  //   ellipsis: true,
  //   key: 'albe0041',
  //   dataIndex: 'albe0041',
  //   width: '20%',
  // },
  // {
  //   title: '区域',
  //   ellipsis: true,
  //   key: 'albe0038',
  //   dataIndex: 'albe0038',
  //   width: '20%',
  // },
  // {
  //   title: '详细地址',
  //   ellipsis: true,
  //   key: 'albe0013',
  //   dataIndex: 'albe0013',
  //   width: '25%',
  // },
  // {
  //   title: '联系人',
  //   ellipsis: true,
  //   key: 'albe0018',
  //   dataIndex: 'albe0018',
  //   width: '15%',
  // },
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
export const InstitutionalInfoColumns = [
  {
    title: '序号',
    slots: {
      customRender: 'serial',
    },
    width: 50,
    align: 'center',
  },
  // {
  //   title: '用户名',
  //   dataIndex: 'albe0073',
  //   width: '20%',
  //   slots: {
  //     customRender: 'albe0073',
  //   },
  //   ellipsis: true,
  // },
  {
    title: '单位名称',
    ellipsis: true,
    key: 'albe0075',
    slots: {
      customRender: 'albe0075',
    },
    dataIndex: 'albe0075',
    width: '30%',
  },
  {
    title: '区域',
    ellipsis: true,
    key: 'albe0086',
    dataIndex: 'albe0086',
    width: '25%',
  },
  {
    title: '详细地址',
    ellipsis: true,
    key: 'albe0076',
    dataIndex: 'albe0076',
    width: '25%',
  },
  {
    title: '联系人',
    ellipsis: true,
    key: 'albe0077',
    dataIndex: 'albe0077',
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
export const InstitutionalInfoColumns2 = [
  {
    title: '序号',
    slots: {
      customRender: 'serial',
    },
    width: 80,
    align: 'center',
  },
  {
    title: '队伍名称',
    dataIndex: 'albe0002',
    key: 'albe0002',
    slots: {
      customRender: 'albe0002',
    },
    width: '20%',
    ellipsis: true,
  },
  {
    title: '队伍联络编号',
    ellipsis: true,
    key: 'albe0041',
    dataIndex: 'albe0041',
    width: '20%',
  },
  {
    title: '区域',
    ellipsis: true,
    key: 'albe0038',
    dataIndex: 'albe0038',
    width: '20%',
  },
  {
    title: '详细地址',
    ellipsis: true,
    key: 'albe0013',
    dataIndex: 'albe0013',
    width: '25%',
  },
  {
    title: '联系人',
    ellipsis: true,
    key: 'albe0018',
    dataIndex: 'albe0018',
    width: '15%',
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
