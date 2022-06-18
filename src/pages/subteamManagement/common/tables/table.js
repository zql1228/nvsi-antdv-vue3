import moment from 'moment'
import { reactive, ref } from 'vue'
// 队伍审核表

export const useTeamReviewTable = (tableType) => {
  if (tableType && tableType == 'regirst') {
    return [
      {
        title: '序号',
        slots: {
          customRender: 'serial',
        },
        width: 50,
        align: 'center',
      },
      {
        title: '队伍名称',
        dataIndex: 'albe0002',
        key: 'albe0002',
        slots: {
          customRender: 'name',
        },
        ellipsis: true,
        width: '20%',
      },
      {
        title: '服务区域',
        dataIndex: 'albe0012value',
        key: 'albe0012value',
        ellipsis: true,
        width: '15%',
      },
      {
        title: '注册时间',
        dataIndex: 'albe0046',
        customRender: ({ text }) => {
          return moment(text).format('YYYY-MM-DD')
        },
        slots: { customRender: 'albe0046' },
        key: 'albe0046',
        ellipsis: true,
        width: '15%',
      },
      {
        title: '队伍服务时长',
        dataIndex: 'albe0069',
        key: 'albe0069',
        ellipsis: true,
        width: '10%',
      },
      {
        title: '计划招募人数',
        dataIndex: 'planvolnum',
        key: 'planvolnum',
        ellipsis: true,
        width: '10%',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        slots: {
          customRender: 'action',
        },
        ellipsis: true,
        width: '20%',
      },
    ]
  } else {
    return [
      {
        title: '序号',
        slots: {
          customRender: 'serial',
        },
        width: 50,
        align: 'center',
      },
      {
        title: '队伍名称',
        dataIndex: 'albe0002',
        key: 'albe0002',
        slots: {
          customRender: 'name',
        },
        ellipsis: true,
        width: '20%',
      },
      {
        title: '服务区域',
        dataIndex: 'albe0012value',
        key: 'albe0012value',
        ellipsis: true,
        width: '15%',
      },
      {
        title: '注册时间',
        dataIndex: 'albe0046',
        customRender: ({ text }) => {
          return moment(text).format('YYYY-MM-DD')
        },
        slots: { customRender: 'albe0046' },
        key: 'albe0046',
        ellipsis: true,
        width: '15%',
      },
      {
        title: '队伍服务时长',
        dataIndex: 'albe0069',
        key: 'albe0069',
        ellipsis: true,
        width: '10%',
      },
      {
        title: '队伍人数',
        dataIndex: 'albe0056',
        key: 'albe0056',
        slots: { customRender: 'albe0056' },
        ellipsis: true,
        width: '10%',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        slots: {
          customRender: 'action',
        },
        ellipsis: true,
        width: '220',
      },
    ]
  }
}
export const TeamReviewTable = {
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
      title: '队伍名称',
      dataIndex: 'albe0002',
      key: 'albe0002',
      slots: {
        customRender: 'name',
      },
      ellipsis: true,
      width: '20%',
    },
    {
      title: '服务区域',
      dataIndex: 'albe0012value',
      key: 'albe0012value',
      ellipsis: true,
      width: '15%',
    },
    {
      title: '注册时间',
      dataIndex: 'albe0046',
      customRender: ({ text }) => {
        return moment(text).format('YYYY-MM-DD')
      },
      slots: { customRender: 'albe0046' },
      key: 'albe0046',
      ellipsis: true,
      width: '15%',
    },
    {
      title: '队伍服务时长',
      dataIndex: 'albe0069',
      key: 'albe0069',
      ellipsis: true,
      width: '10%',
    },
    {
      title: '队伍人数',
      dataIndex: 'albe0056',
      key: 'albe0056',
      slots: { customRender: 'albe0056' },
      ellipsis: true,
      width: '10%',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      slots: {
        customRender: 'action',
      },
      ellipsis: true,
      width: '20%',
    },
  ],
  data: [
    {
      id: 'dewscsfdf',
      beanname: 'lbe01_11',
      id: '241332323dsde49fab36b8ab5289f7747',
      albe0012value: '北京市市辖区东城区',
      albe0002: '默认', // 队伍名称
      albe0012: '110101000000000000', // 待审队伍服务区域
      albe0046: '2021-12-06 16:45:03.0', // 注册时间
      albe0069: '23', // 服务时长
      albe0056: '54', // 队伍人数
      albp0052: 'boluogulao7', // 队伍用户名
    },
  ],
}

// 项目发布审核表
export const ProjectReviewTable = {
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
      dataIndex: 'albx7303',
      key: 'albx7303',
      ellipsis: true,
      width: '30%',
    },
    {
      title: '服务区域',
      dataIndex: 'areaname',
      key: 'areaname',
      ellipsis: true,
      width: '15%',
    },
    {
      title: '发布时间',
      dataIndex: 'albx7307',
      key: 'albx7307',
      customRender: ({ text }) => {
        return moment(text).format('YYYY-MM-DD')
      },
      slots: { customRender: 'albx7307' },
      ellipsis: true,
      width: '10%',
    },
    {
      title: '发布队伍名称',
      dataIndex: 'albx7309',
      key: 'albx7309',
      ellipsis: true,
      width: '30%',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      slots: {
        customRender: 'action',
      },
      width: 180,
    },
  ],
  data: [],
}

// 队伍成员表
export const TeamMemberTable = {
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
      key: 'albp0003',
      ellipsis: true,
      width: '30%',
    },
    {
      title: '性别',
      dataIndex: 'albp0006',
      key: 'albp0006',
      ellipsis: true,
      width: '15%',
    },
    {
      title: '手机号码',
      dataIndex: 'albp0010',
      key: 'albp0010',
      ellipsis: true,
      width: '15%',
    },
    {
      title: '服务区域',
      dataIndex: 'albp0020value',
      key: 'albp0020value',
      ellipsis: true,
      width: '20%',
    },
    {
      title: '总服务时长',
      dataIndex: 'albp0089',
      key: 'albp0089',
      customRender: ({ text }) => {
        return text + ' 小时'
      },
      ellipsis: true,
      width: '15%',
    },
  ],
}

// 已发布项目表
export const PublishedProTable = {
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
      width: '25%',
    },
    {
      title: '服务区域',
      ellipsis: true,
      key: 'areanames',
      dataIndex: 'areanames',
      slots: {
        customRender: 'areanames',
      },
      ellipsis: true,
      width: '20%',
    },
    {
      title: '项目时间',
      ellipsis: true,
      key: 'time',
      dataIndex: 'time',
      slots: {
        customRender: 'time',
      },
      ellipsis: true,
      width: '15%',
    },
    {
      title: '时长',
      dataIndex: 'albx0061',
      needTotal: true,
      ellipsis: true,
      align: 'center',
      customRender: ({ text }) => {
        return text + ' 小时'
      },
      width: '15%',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      slots: {
        customRender: 'action',
      },
      ellipsis: true,
      width: 150,
      align: 'center',
    },
  ],
  data: [],
}
