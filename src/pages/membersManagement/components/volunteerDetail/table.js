import moment from 'moment'
// 志愿者详情—— 参加项目表
export const VolJoinProjectTable = {
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
      key: 'albx0002',
      ellipsis: true,
      width: '25%',
    },
    {
      title: '项目岗位',
      dataIndex: 'gwmc',
      key: 'gwmc',
      ellipsis: true,
      width: '10%',
    },
    {
      title: '服务区域',
      dataIndex: 'albx0021',
      key: 'albx0021',
      ellipsis: true,
      width: '15%',
    },
    {
      title: '加入项目时间',
      dataIndex: 'albx0055',
      key: 'albx0055',
      customRender: ({ text }) => {
        return moment(text).format('YYYY-MM-DD')
      },
      slots: { customRender: 'albx0055' },
      ellipsis: true,
      width: '10%',
    },
    {
      title: '服务时长',
      dataIndex: 'albx0083',
      customRender: ({ text }) => {
        return text + ' 小时'
      },
      ellipsis: true,
      width: '15%',
    },
    {
      title: '项目所属队伍',
      dataIndex: 'albx0062',
      key: 'albx0062',
      ellipsis: true,
      width: '20%',
    },
  ],
  data: [],
}

// 志愿者详情—— 加入队伍表
export const VolJoinTeamTable = {
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
      ellipsis: true,
      width: '50%',
    },
    {
      title: '服务区域',
      dataIndex: 'albe0012value',
      key: 'albe0012value',
      ellipsis: true,
      width: '15%',
    },
    {
      title: '加入时间',
      dataIndex: 'albe0136',
      key: 'albe0136',
      customRender: ({ text }) => {
        return moment(text).format('YYYY-MM-DD')
      },
      slots: { customRender: 'albe0136' },
      ellipsis: true,
      width: '15%',
    },
    // {
    //   title: '服务时长',
    //   dataIndex: 'albp0089',
    //   customRender: ({ text }) => {
    //     return text + ' 小时'
    //   },
    //   ellipsis: true,
    //   width: '20%',
    // },
  ],
  data: [],
}

// 志愿者详情—— 服务评价表
export const VolServiceEvaluationTable = {
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
      title: '所属项目',
      dataIndex: 'albx7303',
      key: 'albx7303',
      ellipsis: true,
      width: '30%',
    },
    {
      title: '项目所属队伍',
      dataIndex: 'albx7304',
      key: 'albx7304',
      ellipsis: true,
      width: '15%',
    },
    {
      title: '守时程度',
      dataIndex: 'areaname',
      key: 'areaname',
      ellipsis: true,
      width: '15%',
    },
    {
      title: '服务态度',
      dataIndex: 'albx0172',
      key: 'albx0172',
      ellipsis: true,
      width: '15%',
    },
    {
      title: '专业水平',
      dataIndex: 'albx0172',
      key: 'albx0172',
      ellipsis: true,
      width: '15%',
    },
    {
      title: '评价日期',
      dataIndex: 'albx0004',
      key: 'albx0004',
      customRender: (record) => {
        return moment(record).format('YYYY-MM-DD')
      },
      slots: { customRender: 'albx0004' },
      ellipsis: true,
      width: '10%',
    },
  ],
  data: [],
}

// 志愿者详情—— 服务时长表
export const VolDurationTable = {
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
      key: 'albx0002',
      ellipsis: true,
      width: '30%',
    },
    {
      title: '队伍名称',
      dataIndex: 'albe0002',
      key: 'albe0002',
      ellipsis: true,
      width: '30%',
    },
    {
      title: '志愿者姓名',
      dataIndex: 'albp0003',
      key: 'albp0003',
      ellipsis: true,
      width: '10%',
    },
    {
      title: '服务时间',
      dataIndex: 'albx0178',
      key: 'albx0178',
      customRender: ({ text }) => {
        return moment(text).format('YYYY-MM-DD')
      },
      slots: { customRender: 'albx0178' },
      ellipsis: true,
      width: '10%',
    },
    {
      title: '录入时长',
      dataIndex: 'albx0172',
      key: 'albx0172',
      ellipsis: true,
      width: '10%',
    },
    {
      title: '录入方式',
      dataIndex: 'albx0173',
      key: 'albx0173',
      customRender: ({ text }) => {
        switch (text) {
          case '1':
            return '手动录入'
          case '2':
            return '申请录入'
          case '4':
            return '签到录入'
        }
      },
      slots: { customRender: 'albx0173' },
      ellipsis: true,
      width: '10%',
    },
    {
      title: '录入日期',
      dataIndex: 'albx0178',
      key: 'albx0178',
      customRender: ({ text }) => {
        return moment(text).format('YYYY-MM-DD')
      },
      slots: { customRender: 'albx0178' },
      ellipsis: true,
      width: '10%',
    },
  ],
  data: [],
}

// 志愿者详情—— 参与培训表
export const VolJsonTrainTable = {
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
      title: '培训主题',
      dataIndex: 'albx0282',
      key: 'albx0282',
      ellipsis: true,
      width: '40%',
    },
    {
      title: '培训日期',
      dataIndex: 'albx0284',
      key: 'albx0284',
      customRender: (record) => {
        return moment(record).format('YYYY-MM-DD')
      },
      slots: { customRender: 'albx0284' },
      width: '20%',
      ellipsis: true,
    },
    {
      title: '培训时长',
      dataIndex: 'albx0288',
      key: 'albx0288',
      customRender: ({ text }) => {
        return text + ' 小时'
      },
      ellipsis: true,
      width: '20%',
    },
    {
      title: '培训人数',
      dataIndex: 'total',
      key: 'total',
      ellipsis: true,
      width: '20%',
    },
  ],
  data: [],
}

// 志愿者详情—— 获得表彰表
export const VolGetRecognition = {
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
      title: '奖励名称',
      dataIndex: 'albx7303',
      key: 'albx7303',
      width: '40%',
      ellipsis: true,
    },
    {
      title: '奖励文书名称及文号',
      dataIndex: 'albx0172',
      key: 'albx0172',
      ellipsis: true,
      width: '20%',
    },
    {
      title: '颁发者',
      dataIndex: 'areaname',
      key: 'areaname',
      customRender: ({ text }) => {
        return text + ' 小时'
      },
      ellipsis: true,
      width: '20%',
    },
    {
      title: '获奖日期',
      dataIndex: 'albx7304',
      key: 'albx7304',
      ellipsis: true,
      width: '20%',
    },
  ],
  data: [],
}
