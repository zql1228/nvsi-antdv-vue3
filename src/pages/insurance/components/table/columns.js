import { getCodeValue } from '../../Hooks/useInsurTableHook'
const { nvsiInsWork, nvsiInserverType } = getCodeValue()
import moment from 'moment'
const initNvsiInsWork = () => {
  return nvsiInsWork.reduce((pre, cur) => {
    pre[cur.value] = cur['label']
    return pre
  }, {})
}

const initNvsiInserverType = () => {
  return nvsiInserverType.reduce((pre, cur) => {
    pre[cur.value] = cur['label']
    return pre
  }, {})
}

// 计划列表
export const getPropellingPlanTable = () => {
  return {
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
        title: '计划名称',
        dataIndex: 'planname',
        key: 'planname',
        ellipsis: true,
        width: '15%',
      },
      {
        title: '服务区域',
        dataIndex: 'areaidname',
        key: 'areaidname',
        ellipsis: true,
        customRender: ({ text }) => {
          return text ? text : '不限'
        },
        width: '15%',
      },
      {
        title: '从业状态',
        dataIndex: 'employment',
        key: 'employment',
        ellipsis: true,
        customRender: ({ text }) => {
          return text ? initNvsiInsWork()[text.trim()] : ''
        },
        width: '10%',
      },
      {
        title: '服务类别',
        dataIndex: 'servicetypevalues',
        key: 'servicetypevalues',
        ellipsis: true,
        customRender: ({ text }) => {
          return text ? text : '不限'
        },
        width: '15%',
      },
      {
        title: '活动类型',
        dataIndex: 'activitytypevalues',
        key: 'activitytypevalues',
        ellipsis: true,
        customRender: ({ text }) => {
          return text ? text : '不限'
        },
        width: '15%',
      },
      {
        title: '活动地点',
        dataIndex: 'activityaddrname',
        key: 'activityaddrname',
        ellipsis: true,
        customRender: ({ text }) => {
          return text ? text : '不限'
        },
        width: '15%',
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
        width: '120',
      },
    ],
    dataSource: [
      {
        id: 'akshdiwedeu',
        sex: '男',
        age: '21',
        areaid: '湖北省-武汉市-江岸区',
        employment: '国家公务员',
        servicetype: '不限',
        activitytype: '不限',
        activitytime: '3日内',
        activityaddr: '湖北省-武汉市-江岸区',
        activitypeople: '500人内',
      },
    ],
  }
}

export const getWhiteListTable = (tableType) => {
  const whiteListManage = {
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
        title: '姓名',
        dataIndex: 'albp0003',
        key: 'albp0003',
        ellipsis: true,
        width: '8%',
      },
      {
        title: '性别',
        dataIndex: 'albp0006',
        key: 'albp0006',
        ellipsis: true,
        customRender: ({ text }) => {
          return text == '1' ? '男' : '女'
        },
        width: '8%',
      },
      {
        title: '联系人电话',
        dataIndex: 'albp0010',
        key: 'albp0010',
        ellipsis: true,
        width: '10%',
      },
      {
        title: '服务区域',
        dataIndex: 'albp0025',
        key: 'albp0025',
        ellipsis: true,
        width: '15%',
      },
      {
        title: '邮箱',
        dataIndex: 'albp0081',
        key: 'albp0081',
        ellipsis: true,
        width: '10%',
        // customRender: ({ text }) => {
        //   return text ? initNvsiInsWork()[text.trim()] : ''
        // },
      },
      {
        title: '服务类别',
        dataIndex: 'albp0021',
        key: 'albp0021',
        ellipsis: true,
        width: '10%',
        customRender: ({ text }) => {
          if (text) {
            return text
              .split(',')
              .map((item) => initNvsiInserverType()[item])
              .join(',')
          }
        },
      },
      {
        title: '是否已经加入白名单',
        dataIndex: 'volunid',
        key: 'volunid',
        ellipsis: true,
        width: '10%',
        customRender: ({ text }) => {
          return text ? '是' : '否'
        },
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
        ellipsis: true,
        width: '120',
      },
    ],
    dataSource: [],
  }
  const whiteListMenu = {
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
        title: '志愿者编号',
        dataIndex: 'albp0029',
        key: 'albp0029',
        ellipsis: true,
        width: '15%',
      },
      {
        title: '姓名',
        dataIndex: 'albp0003',
        key: 'albp0003',
        ellipsis: true,
        width: '8%',
      },
      {
        title: '性别',
        dataIndex: 'albp0006',
        key: 'albp0006',
        ellipsis: true,
        customRender: ({ text }) => {
          return text == '1' ? '男' : '女'
        },
        width: '5%',
      },
      {
        title: '联系人电话',
        dataIndex: 'albp0010',
        key: 'albp0010',
        ellipsis: true,
        width: '10%',
      },
      {
        title: '服务区域',
        dataIndex: 'albp0020value',
        key: 'albp0020value',
        ellipsis: true,
        width: '15%',
      },
      {
        title: '邮箱',
        dataIndex: 'albp0081',
        key: 'albp0081',
        ellipsis: true,
        width: '10%',
        // customRender: ({ text }) => {
        //   return text ? initNvsiInsWork()[text.trim()] : ''
        // },
      },
      {
        title: '注册时间',
        dataIndex: 'albp0034',
        key: 'albp0034',
        ellipsis: true,
        width: '20%',
        customRender: ({ text }) => {
          return moment(text).format('YYYY-MM-DD')
        },
      },
      // {
      //   title: '服务类别',
      //   dataIndex: 'albp0021',
      //   key: 'albp0021',
      //   ellipsis: true,
      //   width: '20%',
      //   customRender: ({ text }) => {
      //     if (text) {
      //       return text
      //         .split(',')
      //         .map((item) => initNvsiInserverType()[item])
      //         .join(',')
      //     }
      //   },
      // },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        slots: {
          customRender: 'action',
        },
        ellipsis: true,
        width: '120',
      },
    ],
    dataSource: [
      {
        id: 'akshdiwedeu',
        a11: 'L00001',
        a12: '王刚',
        a13: '15102621220',
        a14: '湖北省 -> 武汉市 -> 江岸区',
        a15: '国家公务员',
        a16: '疫情防护',
      },
    ],
  }
  switch (tableType) {
    case 'whiteListManage':
      return whiteListManage
    case 'whiteListMenu':
      return whiteListMenu
    default:
      return whiteListManage
  }
}

export const getWhiteProjectList = () => {
  return {
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
        title: '活动名称',
        dataIndex: 'albx0002',
        key: 'albx0002',
        ellipsis: true,
        width: '20%',
      },
      {
        title: '联系人',
        dataIndex: 'albx0025',
        key: 'albx0025',
        ellipsis: true,
        width: '5%',
      },
      {
        title: '联系方式',
        dataIndex: 'albx0026',
        key: 'albx0026',
        ellipsis: true,
        width: '10%',
      },
      {
        title: '服务区域',
        dataIndex: 'albx0012',
        key: 'albx0012',
        ellipsis: true,
        width: '10%',
      },
      {
        title: '服务类别',
        dataIndex: 'albx0009l',
        key: 'albx0009l',
        ellipsis: true,
        width: '10%',
      },
      {
        title: '所属组织',
        dataIndex: 'albx0062',
        key: 'albx0062',
        ellipsis: true,
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
        ellipsis: true,
        width: '120',
      },
    ],
    dataSource: [
      {
        id: 'akshdiwedeu',
        a11: 'L00001',
        a12: '欢喜保险',
        a13: '王刚',
        a14: '13211221333',
        a15: '湖北省 -> 武汉市 -> 江岸区',
        a16: '疫情防护',
      },
    ],
  }
}
