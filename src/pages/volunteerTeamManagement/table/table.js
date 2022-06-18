import moment from 'moment'
import { nvsiAlbe0003 } from '@/utils/codevalue'
// 队伍查询
export const TeamQueryTable = {
  columns: [
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
      title: '队伍类型',
      dataIndex: 'albe0003',
      key: 'albe0003',
      slots: {
        customRender: 'albe0003',
      },
      width: '20%',
      ellipsis: true,
    },
    {
      title: '注册时间',
      dataIndex: 'albe0046',
      key: 'albe0046',
      width: '20%',
      ellipsis: true,
    },
    {
      title: '队伍人数',
      dataIndex: 'albe0056',
      key: 'albe0125',
      width: '20%',
      ellipsis: true,
    },
    {
      title: '队伍服务时长',
      dataIndex: 'albe0069',
      key: 'albe0125',
      width: '20%',
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      slots: {
        customRender: 'action',
      },
      width: 240,
    },
  ],
  data: [],
}
//本级队伍
export const SameLevelTeamTableCloums = [
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
    title: '队伍名称',
    dataIndex: 'albe0002',
    key: 'albe0002',
    ellipsis: true,
    width: '20%',
    slots: {
      customRender: 'albe0002',
    },
  },
  {
    title: '队伍类型',
    dataIndex: 'albe0003',
    key: 'albe0003',
    ellipsis: true,
    width: '15%',
    customRender: ({ text }) => {
      return nvsiAlbe0003.find((item) => item.value == text).label
    },
    slots: {
      customRender: 'albe0003',
    },
  },
  {
    title: '服务区域',
    dataIndex: 'albe0012value',
    key: 'albe0012value',
    width: '20%',
    ellipsis: true,
  },
  {
    title: '注册时间',
    dataIndex: 'albe0046',
    customRender: ({ text }) => {
      return moment(text).format('YYYY-MM-DD')
    },
    slots: { customRender: 'albe0046' },
    key: 'albe0046',
    width: '15%',
    ellipsis: true,
  },
  {
    title: '队伍服务时长',
    dataIndex: 'albe0069',
    key: 'albe0069',
    width: '15%',
    ellipsis: true,
  },
  {
    title: '队伍人数',
    dataIndex: 'albe0056',
    key: 'albe0056',
    width: '15%',
    ellipsis: true,
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
    slots: {
      customRender: 'action',
    },
    width: 290,
  },
]
// 下属队伍管理表
export const useSubTeamTable = (tableType) => {
  if (tableType && tableType !== '3') {
    return [
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
        title: '队伍名称',
        dataIndex: 'albe0002',
        key: 'albe0002',
        ellipsis: true,
        width: '35%',
        slots: {
          customRender: 'albe0002',
        },
      },
      {
        title: '队伍类型',
        dataIndex: 'albe0003',
        key: 'albe0003',
        ellipsis: true,
        width: '35%',
        customRender: ({ text }) => {
          return nvsiAlbe0003.find((item) => item.value == text).label
        },
        slots: {
          customRender: 'albe0003',
        },
      },
      {
        title: '服务区域',
        dataIndex: 'albe0012value',
        key: 'albe0012value',
        width: '20%',
        ellipsis: true,
      },
      {
        title: '注册时间',
        dataIndex: 'albe0046',
        customRender: ({ text }) => {
          return moment(text).format('YYYY-MM-DD')
        },
        slots: { customRender: 'albe0046' },
        key: 'albe0046',
        width: '15%',
        ellipsis: true,
      },
      {
        title: '队伍服务时长',
        dataIndex: 'albe0069',
        key: 'albe0069',
        width: '15%',
        ellipsis: true,
      },
      {
        title: '计划招募人数',
        dataIndex: 'planvolnum',
        key: 'planvolnum',
        width: '15%',
        ellipsis: true,
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
    ]
  }
}
/*
export const SubTeamTable = {
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
      title: '队伍名称',
      dataIndex: 'albe0002',
      key: 'albe0002',
      ellipsis: true,
      width: '20%',
      slots: {
        customRender: 'albe0002',
      },
    },
    {
      title: '服务区域',
      dataIndex: 'albe0012value',
      key: 'albe0012value',
      width: '20%',
      ellipsis: true,
    },
    {
      title: '注册时间',
      dataIndex: 'albe0046',
      customRender: ({ text }) => {
        return moment(text).format('YYYY-MM-DD')
      },
      slots: { customRender: 'albe0046' },
      key: 'albe0046',
      width: '20%',
      ellipsis: true,
    },
    {
      title: '队伍服务时长',
      dataIndex: 'albe0069',
      key: 'albe0069',
      width: '20%',
      ellipsis: true,
    },
    {
      title: '队伍人数',
      dataIndex: 'albe0056',
      key: 'albe0056',
      width: '20%',
      ellipsis: true,
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
*/

// 统计表
export const teamStatisticsChart = (chartData) => {
  let echartData = chartData || [
    {
      city: '杭州',
      value: 3000,
    },
    {
      city: '宁波',
      value: 3000,
    },
    {
      city: '杭州',
      value: 3000,
    },
    {
      city: '杭州',
      value: 3000,
    },
    {
      city: '杭州',
      value: 3000,
    },
    {
      city: '杭州',
      value: 3000,
    },
    {
      city: '杭州',
      value: 3000,
    },
    {
      city: '杭州',
      value: 3000,
    },
    {
      city: '杭州',
      value: 3000,
    },
  ]
  let xData = echartData.map((i) => i.city)
  let yData = echartData.map((i) => i.value)
  return {
    grid: {
      left: '2%',
      right: '1%',
      bottom: '9%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      axisTick: {
        show: false,
      },
      data: xData,
      // data: ['杭州', '宁波', '温州', '绍兴', '潮州', '嘉兴', '金华', '衡州', '台州', '丽水', '舟山'],
      axisLine: {
        lineStyle: {
          color: '#0066ff',
        },
      },
    },
    yAxis: {
      type: 'value',
      splitNumber: '6',
      max: '300000',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#0066ff',
        },
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: 'rgba(255,255,255,0.3)',
        },
      },
      axisLabel: {},
    },
    series: [
      {
        name: '',
        type: 'bar',
        barWidth: '20%',
        itemStyle: {
          normal: {
            label: {
              show: true,
              position: 'top',
              textStyle: {
                color: '#fff',
              },
            },
            color: {
              type: 'linear',
              x: 0,
              y: 1,
              x2: 0,
              y2: 0,
              colorStops: [
                {
                  offset: 1,
                  color: '#1ff9fd',
                },
                {
                  offset: 0.5,
                  color: '#16acea',
                },
                {
                  offset: 0,
                  color: 'rgba(54,134,185,.1)',
                },
              ],
              global: false, // 缺省为 false
            },
            barBorderRadius: 0,
          },
        },
        // data: yData,
        data: [30000, 38000, 38000, 90000, 138000, 110000, 110000, 39500, 38000, 236000, 142666],
      },
    ],
  }
}

// 推荐队伍
export const RecommendTeamTablColumns = [
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
    title: '区域',
    dataIndex: 'albe0012value',
    key: 'albe0012value',
    width: '20%',
    ellipsis: true,
  },
  {
    title: '联系人',
    dataIndex: 'albe0018',
    key: 'albe0018',
    width: '20%',
    ellipsis: true,
  },
  {
    title: '注册日期',
    dataIndex: 'albe0046',
    key: 'albe0046',
    width: '20%',
    ellipsis: true,
  },
  {
    title: '时长',
    dataIndex: 'albe0069',
    key: 'albe0069',
    width: '20%',
    ellipsis: true,
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
    slots: {
      customRender: 'action',
    },
    width: 120,
  },
]
