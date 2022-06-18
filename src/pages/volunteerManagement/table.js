import { checkage, checkage2 } from '@/utils/publicMethods/common'
import moment from 'moment'
export const InquiryTableColumns = [
  {
    title: '序号',
    slots: {
      customRender: 'serial',
    },
    width: 80,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '志愿者姓名',
    dataIndex: 'albp0003',
    ellipsis: true,
    width: '40%',
    slots: {
      customRender: 'name',
    },
  },
  // {
  //   title: '账户状态',
  //   dataIndex: 'albp0090',
  //   slots: {
  //     customRender: 'accountState',
  //   },
  //   width: 100,
  //   ellipsis: true,
  // },
  {
    title: '性别',
    dataIndex: 'albp0006',
    slots: {
      customRender: 'sex',
    },
    width: 100,
    ellipsis: true,
  },
  {
    title: '年龄',
    dataIndex: 'albp0014',
    customRender: ({ text }) => {
      return checkage2(moment(text).format('YYYY-MM-DD'))
    },
    slots: {
      customRender: 'albp0014',
    },
    width: 100,
    ellipsis: true,
  },
  {
    title: '服务区域',
    dataIndex: 'areaid',
    slots: {
      customRender: 'areaid',
    },
    ellipsis: true,
    width: '40%',
  },
  {
    title: '总服务时长（小时）',
    dataIndex: 'albp0089',
    width: '20%',
    ellipsis: true,
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    slots: {
      customRender: 'action',
    },
    width: 270,
    align: 'center',
  },
]
export const InquiryTableColumns2 = [
  {
    title: '序号',
    slots: {
      customRender: 'serial',
    },
    width: 80,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '志愿者姓名',
    dataIndex: 'albp0064',
    ellipsis: true,
    width: '50%',
    slots: {
      customRender: 'name',
    },
  },
  {
    title: '性别',
    dataIndex: 'albp0006',
    slots: {
      customRender: 'sex',
    },
    width: 100,
    ellipsis: true,
  },
  {
    title: '年龄',
    dataIndex: 'albp0059',
    customRender: ({ text }) => {
      return checkage2(moment(text).format('YYYY-MM-DD'))
    },
    slots: {
      customRender: 'albp0059',
    },
    width: 100,
    ellipsis: true,
  },
  {
    title: '服务区域',
    dataIndex: 'areaid',
    ellipsis: true,
    width: '50%',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    slots: {
      customRender: 'action',
    },
    width: 270,
    align: 'center',
  },
]

export const AuditTableColumns = [
  {
    title: '序号',
    slots: {
      customRender: 'serial',
    },
    width: 80,
    align: 'center',
    ellipsis: true,
  },
  {
    title: '志愿者姓名',
    dataIndex: 'albp0003',
    ellipsis: true,
    slots: {
      customRender: 'albp0003',
    },
    width: '30%',
  },
  {
    title: '区域',
    dataIndex: 'albp0025',
    ellipsis: true,
    slots: {
      customRender: 'albp0025',
    },
    width: '30%',
  },
  {
    title: '性别',
    dataIndex: 'albp0006',
    slots: {
      customRender: 'albp0006',
    },
    width: 100,
    ellipsis: true,
  },
  {
    title: '证件类型',
    dataIndex: 'albp0004',
    slots: {
      customRender: 'albp0004',
    },
    width: 100,
    ellipsis: true,
  },
  {
    title: '注册日期',
    dataIndex: 'albp0034',
    customRender: (record) => {
      let date = record.record.albp0034
        ? moment(new Date(record.record.albp0034)).format('YYYY-MM-DD')
        : record.record.createtime
        ? moment(new Date(record.record.createtime)).format('YYYY-MM-DD')
        : '-'
      return date
    },
    slots: {
      customRender: 'albp0034',
    },
    ellipsis: true,
    width: '30%',
  },
  {
    title: '认证状态',
    dataIndex: 'albp0063',
    slots: {
      customRender: 'albp0063',
    },
    width: '40%',
    ellipsis: true,
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
