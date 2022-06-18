import moment from 'moment'
export const FrontManuscriptColumns = [
  {
    title: '序号',
    slots: {
      customRender: 'serial',
    },
    width: 100,
    align: 'center',
  },
  {
    title: '稿件标题',
    dataIndex: 'title',
    ellipsis: true,
  },
  {
    title: '创建时间',
    dataIndex: 'entrytime',
    slots: {
      customRender: 'entrytime',
    },
    customRender: ({ text }) => {
      return moment(text).format('YYYY-MM-DD')
    },
    key: 'entrytime',
    ellipsis: true,
    width: '100',
  },
  {
    title: '稿件状态',
    dataIndex: 'sendstatus',
    ellipsis: true,
    customRender: (text) => {
      let str =
        text.record.sendstatus == 0
          ? '未投递'
          : text.record.sendstatus == 1
          ? '已投递'
          : text.record.sendstatus == 3
          ? '已被收录'
          : text.record.sendstatus == 4
          ? '撤回'
          : '-'
      return str
    },
  },
  {
    title: '推送状态',
    dataIndex: 'pushto',
    ellipsis: true,
    customRender: (text) => {
      let str =
        text.record.pushto == 0
          ? '未被推送'
          : text.record.pushto == 1
          ? '区级推送'
          : text.record.pushto == 2
          ? '区级退回'
          : text.record.pushto == 3
          ? '市级推送'
          : text.record.pushto == 4
          ? '市级退回'
          : text.record.pushto == 5
          ? '省级推送'
          : text.record.pushto == 6
          ? '省级退回'
          : text.record.pushto == 7
          ? '已被收录'
          : text.record.pushto == 8
          ? '全国退回'
          : '-'
      return str
    },
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    slots: {
      customRender: 'action',
    },
    width: 320,
    align: 'center',
  },
]

export const ManagerManuscriptColumns = [
  {
    title: '序号',
    slots: {
      customRender: 'serial',
    },
    width: 100,
    align: 'center',
  },
  {
    title: '稿件标题',
    dataIndex: 'title',
    ellipsis: true,
  },
  {
    title: '投稿队伍',
    dataIndex: 'contributorname',
    ellipsis: true,
  },
  {
    title: '创建时间',
    dataIndex: 'entrytime',
    slots: {
      customRender: 'entrytime',
    },
    customRender: ({ text }) => {
      return moment(text).format('YYYY-MM-DD')
    },
    key: 'entrytime',
    ellipsis: true,
    width: '100',
  },
  {
    title: '推送状态',
    dataIndex: 'pushto',
    ellipsis: true,
    customRender: (text) => {
      let str =
        text.record.pushto == 0
          ? '未被推送'
          : text.record.pushto == 1
          ? '区级推送'
          : text.record.pushto == 2
          ? '区级退回'
          : text.record.pushto == 3
          ? '市级推送'
          : text.record.pushto == 4
          ? '市级退回'
          : text.record.pushto == 5
          ? '省级推送'
          : text.record.pushto == 6
          ? '省级退回'
          : text.record.pushto == 7
          ? '已被收录'
          : text.record.pushto == 8
          ? '全国退回'
          : '-'
      return str
    },
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    // colSpan: 0,
    slots: {
      customRender: 'action',
    },
    align: 'center',
    width: '320',
  },
]

export const ManuscriptLogColumns = [
  {
    title: '序号',
    slots: {
      customRender: 'serial',
    },
    width: 100,
    align: 'center',
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    ellipsis: true,
  },
  {
    title: '操作时间',
    dataIndex: 'operatetime',
    slots: {
      customRender: 'operatetime',
    },
    customRender: ({ text }) => {
      return moment(text).format('YYYY-MM-DD')
    },
    key: 'operatetime',
    ellipsis: true,
    width: '100',
  },
  {
    title: '推送状态',
    dataIndex: 'pushstatus',
    ellipsis: true,
    customRender: (text) => {
      let str =
        text.record.pushstatus == 0
          ? '待审核'
          : text.record.pushstatus == 1
          ? '推送'
          : text.record.pushstatus == 2
          ? '退回'
          : text.record.pushstatus == 3
          ? '被收录'
          : '-'
      return str
    },
  },
  {
    title: '操作备注',
    dataIndex: 'reason',
    ellipsis: true,
  },
]
