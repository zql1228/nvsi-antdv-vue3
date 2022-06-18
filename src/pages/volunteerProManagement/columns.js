import moment from 'moment'
export const ProjectQueryColumns = [
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
    title: '项目名称',
    dataIndex: 'albx0002',
    width: '40%',
    slots: {
      customRender: 'albx0002',
    },
    ellipsis: true,
  },
  {
    title: '所属队伍',
    dataIndex: 'albx0062',
    width: '30%',
    ellipsis: true,
  },
  {
    title: '项目时间',
    dataIndex: 'time',
    customRender: (text) => {
      return moment(text.record.albx0004).format('YYYY-MM-DD') + '~' + moment(text.record.albx0005).format('YYYY-MM-DD')
    },
    slots: {
      customRender: 'time',
    },
    width: '30%',
    ellipsis: true,
  },
  {
    title: '项目状态',
    dataIndex: 'albx0072',
    ellipsis: true,
    customRender: (text) => {
      let str =
        text.record.albx0072 == 1
          ? '待发布项目'
          : text.record.albx0072 == 2
          ? '待审核项目'
          : text.record.albx0072 == 3
          ? '待启动项目'
          : text.record.albx0072 == 4
          ? '运行中项目'
          : text.record.albx0072 == 5
          ? '已结项项目'
          : text.record.albx0072 == 6
          ? '补录项目'
          : text.record.albx0072 == 7
          ? '停用项目'
          : text.record.albx0072 == 9
          ? '无效项目'
          : '-'
      return str
    },
    slots: {
      customRender: 'albx0072',
    },
    width: 120,
  },
  {
    title: '项目时长',
    dataIndex: 'albx0061',
    width: 120,
    ellipsis: true,
  },
  {
    title: '项目人数',
    dataIndex: 'albx0016',
    width: 120,
    slots: {
      customRender: 'albx0016',
    },
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

export const NationalProjectQueryColumns = [
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
    title: '项目名称',
    dataIndex: 'albx0002',
    width: '40%',
    slots: {
      customRender: 'albx0002',
    },
    ellipsis: true,
  },
  {
    title: '所属队伍',
    dataIndex: 'albx0062',
    width: '30%',
    ellipsis: true,
  },
  {
    title: '项目时间',
    dataIndex: 'time',
    customRender: (text) => {
      return moment(text.record.albx0004).format('YYYY-MM-DD') + '~' + moment(text.record.albx0005).format('YYYY-MM-DD')
    },
    slots: {
      customRender: 'time',
    },
    width: '30%',
    ellipsis: true,
  },
  {
    title: '项目状态',
    dataIndex: 'albx0015',
    ellipsis: true,
    customRender: ({ text }) => {
      let str =
        text == 0
          ? '待办理项目'
          : text == 1
          ? '待审批'
          : text == 2
          ? '招募待启动'
          : text == 3
          ? '招募中'
          : text == 4
          ? '招募已结束'
          : text == 6
          ? '手动结项项目'
          : text == 7
          ? '自动结项项目'
          : text == 8
          ? '暂停项目'
          : text == 9
          ? '作废项目'
          : text == 11
          ? '停用项目'
          : text == 12
          ? '补录项目'
          : text == 13
          ? '删除项目'
          : '-'
      return str
    },
    slots: {
      customRender: 'albx0015',
    },
    width: 120,
  },
  {
    title: '项目时长',
    dataIndex: 'albx0061',
    width: 120,
    ellipsis: true,
  },
  {
    title: '项目人数',
    dataIndex: 'albx0016',
    width: 120,
    slots: {
      customRender: 'albx0016',
    },
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
