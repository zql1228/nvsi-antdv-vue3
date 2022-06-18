import moment from 'moment'
// 服务领域配置表
export const confServiceDomainTable = {
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
      title: '服务领域',
      dataIndex: 'albe0112',
      key: 'albe0112',
      ellipsis: true,
      width: '40%',
    },
    {
      title: '领域编号',
      dataIndex: 'albe0113',
      key: 'albe0113',
      width: '20%',
    },
    {
      title: '展示排序',
      dataIndex: 'albe0116',
      key: 'albe0116',
      width: '20%',
    },
    {
      title: '启停状态',
      dataIndex: 'albe0117',
      key: 'albe0117',
      customRender: ({ text }) => {
        return text == '1' ? '启用' : '停用'
      },
      slots: { customRender: 'albe0117' },
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
      width: 180,
    },
  ],
}

// 服务类型配置表
export const confServiceTypeTable = {
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
      title: '服务类型',
      dataIndex: 'albe0122',
      key: 'albe0122',
      ellipsis: true,
    },
    {
      title: '服务编号',
      dataIndex: 'albe0123',
      key: 'albe0123',
      width: 160,
    },
    {
      title: '展示排序',
      dataIndex: 'albe0125',
      key: 'albe0125',
      width: 160,
    },
    {
      title: '启停状态',
      dataIndex: 'albe0126',
      key: 'albe0126',
      customRender: ({ text }) => {
        return text == '1' ? '启用' : '停用'
      },
      slots: { customRender: 'albe0126' },
      width: 160,
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

// 文件资源查找表
export const getFileSourceMapTable = () => {
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
      title: '文件名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: '15%',
    },
    {
      title: '文件路径',
      dataIndex: 'path',
      key: 'path',
      width: '60%',
    },
    {
      title: '创建时间',
      dataIndex: 'filetime',
      key: 'filetime',
      customRender: ({ text }) => {
        return moment(text).format('YYYY-MM-DD HH:mm:ss')
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
      width: 180,
    },
  ]
}
