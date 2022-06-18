import moment from 'moment'
export const FrontNewsColumns = [
  {
    title: '序号',
    slots: {
      customRender: 'serial',
    },
    width: 100,
    align: 'center',
  },
  {
    title: '新闻标题',
    dataIndex: 'title',
    ellipsis: true,
  },
  {
    title: '新闻所属资源',
    ellipsis: true,
    dataIndex: 'beresourcename',
  },
   {
    title: '录入时间',
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
  // {
  //   title: '是否发布',
  //   dataIndex: 'ispublish',
  //   ellipsis: true,
  //   slots: {
  //     customRender: 'ispublish',
  //   },
  // },
  {
    title: '是否置顶',
    dataIndex: 'istop',
    ellipsis: true,
    slots: {
      customRender: 'istop',
    },
  },
  {
    title: '访问量',
    dataIndex: 'pageviews',
    ellipsis: true,
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    slots: {
      customRender: 'action',
    },
    width: 220,
    align: 'center',
  },
]


