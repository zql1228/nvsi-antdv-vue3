// 参加培训的志愿者表
export const addTrainVolTable = {
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
      title: '姓名',
      dataIndex: 'albx0315',
      width: '20%',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '性别',
      dataIndex: 'albx0316',
      customRender: ({ text }) => {
        return text == '1' ? '男' : '女'
      },
      width: '20%',
      align: 'center',
    },
    {
      title: '志愿者编号',
      dataIndex: 'albx0313',
      width: '40%',
      align: 'center',
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
}

// 队伍下的志愿者表
export const teamVolTable = {
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
      width: 150,
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
      width: 100,
    },
    {
      title: '服务区域',
      dataIndex: 'albp0020value',
      ellipsis: true,
    },
    {
      title: '手机号码',
      dataIndex: 'albp0010',
      width: 150,
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
      width: 200,
      align: 'center',
    },
  ],
}

// 下属队伍表
export const orgTeamListTable = {
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
      ellipsis: true,
      width: 150,
    },
    {
      title: '服务区域',
      dataIndex: 'albe0012value',
      ellipsis: true,
      width: 150,
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
