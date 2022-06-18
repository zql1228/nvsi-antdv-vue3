import moment from 'moment'
// 通知公告表
export const InfoNoticeAnmentTable = {
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
      title: '通知标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '紧急程度',
      ellipsis: true,
      key: 'urgentlevel',
      dataIndex: 'urgentlevel',
      customRender: ({ text }) => {
        return text == '1' ? '普通' : '紧急'
      },
      slots: { customRender: 'urgentlevel' },
      width: 150,
    },
    {
      title: '发送人',
      dataIndex: 'creatorname',
      key: 'creatorname',
      width: 180,
    },
    {
      title: '通知类型',
      dataIndex: 'sort',
      ellipsis: true,
      customRender: ({ text }) => {
        switch (text) {
          case '1':
            return '工作通知'
          case '2':
            return '会议通知'
          case '3':
            return '培训通知'
        }
      },
      slots: {
        customRender: 'sort',
      },
      width: 150,
    },
    {
      title: '发送时间',
      ellipsis: true,
      key: 'createtime',
      dataIndex: 'createtime',
      customRender: ({ text }) => {
        return moment(text).format('YYYY-MM-DD')
      },
      slots: { customRender: 'time' },
      width: '20%',
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
  mock: [
    {
      id: '1111',
      albx0002: 'xxxx志愿服务活动', // 通知标题
      albx0021: '紧急', // 紧急程度
      albx0004: 'xxx管理员', // 发送人
      albx0061: '工作通知', // 通知类型
      albx0062: '2021-12-11', // 发送时间
    },
  ],
}

// 培训通知表
export const InfoTrainTable = {
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
      title: '培训标题',
      dataIndex: 'albx0282',
      key: 'albx0282',
      ellipsis: true,
    },
    {
      title: '培训时间',
      dataIndex: 'albx0284',
      key: 'albx0284',
      slots: {
        customRender: 'time',
      },
      width: 150,
    },
    {
      title: '培训学时(小时)',
      dataIndex: 'albx0288',
      key: 'albx0288',
      width: 150,
    },
    {
      title: '参与人数',
      dataIndex: 'volsum',
      key: 'volsum',
      width: 150,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      slots: {
        customRender: 'action',
      },
      width: 250,
    },
  ],
  mock: [
    {
      albx0282: '默认',
      albx0283: '11111111111',
      albx0284: '2021-06-16 14:22:58.0',
      albx0285: '2021-06-16 17:23:01.0',
      albx0286: '340803000000000000',
      albx0287: '湖北省武汉市江汉区民生路117',
      albx0288: '11',
      albx0289: '十个',
      albx0290: '17340582979',
      albx0295: 'a6124ab7ced64a13b806c9418da42d84',
      albx0297: '2',
      albx0298: '114.294713',
      albx0299: '30.581271',
      beanname: 'lbx16',
      createtime: '2021-06-16 14:24:04.756',
      creator: 'Yegol1700',
      id: '29f7c3063c824bf9bf58fb5833edd503',
      isdelete: '0',
      volsum: 0,
    },
  ],
}

// 我的评价表
export const InfoEvluaTable = {
  // 被评价
  columns_evaluated: [
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
      dataIndex: 'albx0002',
      key: 'albx0002',
      ellipsis: true,
    },
    {
      title: '志愿者姓名',
      dataIndex: 'albp0003',
      key: 'albp0003',
      width: 160,
    },
    {
      title: '培训质量',
      dataIndex: 'albx0503',
      key: 'albx0503',
      width: 150,
    },
    {
      title: '团队合作',
      dataIndex: 'albx0504',
      key: 'albx0504',
      width: 150,
    },
    {
      title: '执行能力',
      dataIndex: 'albx0505',
      key: 'albx0505',
      width: 150,
    },
    {
      title: '评价日期',
      dataIndex: 'albx0506',
      key: 'albx0506',
      width: 150,
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
  // 评价志愿者
  columns_volunteers: [
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
      dataIndex: 'albx0002',
      key: 'albx0002',
      ellipsis: true,
    },
    {
      title: '志愿者姓名',
      dataIndex: 'albp0003',
      key: 'albp0003',
      width: 160,
    },
    {
      title: '守时程度',
      dataIndex: 'albx0463',
      key: 'albx0463',
      width: 150,
    },
    {
      title: '服务态度',
      dataIndex: 'albx0464',
      key: 'albx0464',
      width: 150,
    },
    {
      title: '专业水平',
      dataIndex: 'albx0465',
      key: 'albx0465',
      width: 150,
    },
    {
      title: '评价日期',
      dataIndex: 'albx0466',
      key: 'albx0466',
      customRender: ({ text }) => {
        return moment(text).format('YYYY-MM-DD')
      },
      slots: { customRender: 'albx0466' },
      width: 150,
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
  mock: [
    // 被评价
    {
      albp0003: '李四', // 志愿者姓名
      albx0002: '测试123456', // 项目名称
      albx0502: 'a6124ab7ced64a13b806c9418da42d84', // 团体id
      albx0503: '5', // 对项目开展培训的满意度
      albx0504: '5', // 与志愿队伍合作的满意度
      albx0505: '5', // 项目执行与计划的符合度
      albx0506: '2021-06-21 09:32:49.0', // 评价日期
      albx0508: '非常好', // 评价内容
      albx0509: 'ab4520545e514983b6ad78a38128fe99', // 项目id
      albx0510: '11000000155756351281924807878374', // 志愿者编号
      beanname: 'lbx31',
      createtime: '2021-06-21 09:32:49.891',
      id: '6d220dca76f44b3da3ff5bd612240ab1',
      isdelete: '0',
    },
    // 评价志愿者
    {
      albp0003: '大哥1', // 志愿者姓名
      albx0002: '测试123456', // 项目名
      albx0462: 'a6124ab7ced64a13b806c9418da42d84', // 团体id
      albx0463: '5', // 守时程度
      albx0464: '5', // 服务态度
      albx0465: '5', // 专业水平
      albx0466: '2021-06-05 09:54:01.0', // 评价日期
      albx0468: '111111111111', // 评价内容
      albx0469: 'BDC3EE182664460FAE5B116B8C4A50C2', // 项目id
      albx0470: '11000000114064045458043292419601', // 志愿者id(编号)
      beanname: 'lbx29',
      createtime: '2021-06-05 09:42:48.089',
      creator: 'Yegol1127',
      id: '18b3ae5a726a40c0b7e8e13680a4b871',
      isdelete: '0',
    },
  ],
}

// 我的投诉表
export const InfoComplaintTable = {
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
      title: '被投诉对象',
      dataIndex: 'albx0355',
      key: 'albx0355',
      width: 160,
      ellipsis: true,
    },
    {
      title: '投诉人姓名',
      dataIndex: 'albx0356',
      key: 'albx0356',
      width: 150,
    },
    {
      title: '投诉类型',
      dataIndex: 'albx0346',
      key: 'albx0346',
      customRender: ({ text }) => {
        switch (text) {
          case '0':
            return '时长'
          case '1':
            return '队伍'
          case '2':
            return '项目'
          case '3':
            return '人员'
        }
      },
      slots: { customRender: 'albx0346' },
    },
    {
      title: '投诉人手机',
      dataIndex: 'albx0351',
      key: 'albx0351',
      width: 160,
    },
    {
      title: '投诉日期',
      dataIndex: 'albx0349',
      key: 'albx0349',
      customRender: ({ text }) => {
        return moment(text).format('YYYY-MM-DD')
      },
      slots: { customRender: 'albx0349' },
      width: 150,
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
  mock: [],
}
// 我的表彰表
export const InfoCommendTable = {
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
      title: '表彰标题',
      dataIndex: 'albx0352',
      key: 'albx0352',
      ellipsis: true,
    },
    {
      title: '获奖日期',
      dataIndex: 'albx0353',
      key: 'albx0353',
      customRender: ({ text }) => {
        return moment(text).format('YYYY-MM-DD')
      },
      slots: { customRender: 'albx0353' },
      width: 160,
    },
    {
      title: '表彰类型',
      dataIndex: 'albx0362',
      key: 'albx0362',
      customRender: ({ text }) => {
        switch (text) {
          case '1':
            return '队伍'
          case '2':
            return '项目'
          case '3':
            return '人员'
        }
      },
      width: 150,
    },

    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      slots: {
        customRender: 'action',
      },
      width: 260,
    },
  ],
  mock: [],
}

// 物资捐赠表
export const InfoGoodsTable = {
  columns: [
    {
      title: '序号',
      slots: {
        customRender: 'serial',
      },
      width: 100,
      align: 'center',
    },
    {
      title: '物资名称',
      dataIndex: 'albe1802',
      key: 'albe1802',
      ellipsis: true,
    },
    {
      title: '捐赠时间',
      dataIndex: 'albe1807',
      key: 'albe1807',
      customRender: ({ text }) => {
        return moment(text).format('YYYY-MM-DD')
      },
      slots: { customRender: 'albe1807' },
      width: 160,
    },
    {
      title: '库存',
      dataIndex: 'albe1803',
      key: 'albe1803',
      width: 150,
    },
    {
      title: '物品单位',
      dataIndex: 'albe1804',
      key: 'albe1804',
      width: 150,
    },
    {
      title: '捐赠方',
      dataIndex: 'albe1805',
      key: 'albe1805',
      width: 150,
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
  mock: [
    {
      id: 1,
      albp0001: '棉被',
      albp0002: '2021-12-15',
      albp0003: '48',
      albp0004: '床',
      albp0005: 'xxxx志愿队',
    },
  ],
}

// 添加培训人员中的下属队伍表
export const TrainListOrgTeamTable = {
  columns: [
    {
      title: '序号',
      slots: {
        customRender: 'serial',
      },
      width: 100,
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
