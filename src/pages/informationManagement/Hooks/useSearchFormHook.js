import { defineComponent, reactive, ref, onMounted, toRefs } from 'vue'
import { message } from 'ant-design-vue'
/*
  注意：查询条件后续可能会有扩展,所以就先一个个加
  */

// 通知公告查询按钮
export const refreshInfoNoticeTableHook = (queryParam) => {
  const InfoNoticeAnmentComUnread = ref()
  const InfoNoticeAnmentComRead = ref()
  const refreshTable = () => {
    InfoNoticeAnmentComUnread.value && InfoNoticeAnmentComUnread.value.$refs.noticeTable.refresh(true)
    InfoNoticeAnmentComRead.value && InfoNoticeAnmentComRead.value.$refs.noticeTable.refresh(true)
  }
  const resetForm = () => {
    queryParam.noticeTitle = ''
    queryParam.sort = ''
    refreshTable()
  }
  const searchForm = () => {
    refreshTable()
  }

  return {
    InfoNoticeAnmentComUnread,
    InfoNoticeAnmentComRead,
    resetForm,
    searchForm,
    refreshTable,
  }
}

// 培训通知查询按钮
export const refreshInfoTrainTableHook = (queryParam) => {
  const InfoTrainCom = ref()
  const refreshTable = () => {
    InfoTrainCom.value.$refs.trainTable.refresh(true)
  }
  const resetForm = () => {
    queryParam.trainTitle = ''
    refreshTable()
  }
  const searchForm = () => {
    refreshTable()
  }

  return {
    InfoTrainCom,
    resetForm,
    searchForm,
    refreshTable,
  }
}

// 我的评价查询按钮
export const refreshInfoEvluaTableHook = (queryParam) => {
  const InfoEvluaTableCom = ref()
  const refreshTable = () => {
    InfoEvluaTableCom.value.$refs.evaluTable.refresh(true)
  }
  const resetForm = () => {
    queryParam.volName = ''
    refreshTable()
  }
  const searchForm = () => {
    refreshTable()
  }
  return {
    InfoEvluaTableCom,
    resetForm,
    searchForm,
    refreshTable,
  }
}

// 表彰表查询按钮
export const refreshInfoCommendTableHook = (queryParam) => {
  const InfoCommendTable = ref()
  const refreshTable = () => {
    InfoCommendTable.value.$refs.commentTable.refresh(true)
  }
  const resetForm = () => {
    queryParam.commentName = ''
    queryParam.commentType = ''
    refreshTable()
  }
  const searchForm = () => {
    refreshTable()
  }
  return {
    InfoCommendTable,
    resetForm,
    searchForm,
    refreshTable,
  }
}

// 我的投诉表查询按钮
export const refreshInfoComplaintTableHook = (queryParam) => {
  const InfoComplaintCom = ref()
  const refreshTable = () => {
    InfoComplaintCom.value.$refs.complaintTable.refresh(true)
  }
  const resetForm = () => {
    queryParam.complaintName = ''
    queryParam.complaintType = ''
    refreshTable()
  }
  const searchForm = () => {
    refreshTable()
  }
  return {
    InfoComplaintCom,
    resetForm,
    searchForm,
    refreshTable,
  }
}

// 物资捐赠表查询按钮
export const refreshInfoGoodsTableHook = (queryParam) => {
  const InfoGoodsCom = ref()
  const refreshTable = () => {
    InfoGoodsCom.value.$refs.infoGoodsTable.refresh(true)
  }
  const resetForm = () => {
    queryParam.goodsName = ''
    refreshTable()
  }
  const searchForm = () => {
    refreshTable()
  }
  return {
    InfoGoodsCom,
    resetForm,
    searchForm,
    refreshTable,
  }
}

export const searchSelectOptionHook = () => {
  return reactive({
    noticeSelOption: [
      {
        label: '工作通知',
        value: '1',
      },
      {
        label: '会议通知',
        value: '2',
      },
      {
        label: '培训通知',
        value: '3',
      },
    ],
  })
}
