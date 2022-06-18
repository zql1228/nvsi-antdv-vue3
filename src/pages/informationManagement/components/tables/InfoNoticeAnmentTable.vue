<template>
  <!-- 通知公告表 -->
  <IATable
    serviceName="getAllBulletinNoReadOrReadOnTeam"
    :searchParameter="searchFunc"
    ref="noticeTable"
    size="middle"
    :rowKey="(record) => record.id"
    :columns="columns"
    :showHeader="false"
    :row-selection="{
      selectedRowKeys: selectedRowKeys,
      onChange: onSelectChange,
    }"
  >
    <!-- 
     :row-selection="
      tabKey == 'unRead'
        ? {
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }
        : false
    "
   -->
    <template #action="{record}">
      <slot name="action" :record="record">
        <a-space>
          <a-button type="primary" size="small" @click="handleViewNotice(record)"> 查看</a-button>
          <a-button v-if="tabKey == 'unRead'" size="small" @click="handleReadNotice(record)">标为已读</a-button>
          <a-popconfirm :title="'确定删除吗?'" v-else @confirm="handleDeleteNotice(record)">
            <a-button size="small">
              删除
            </a-button>
          </a-popconfirm>
        </a-space>
      </slot>
    </template>
  </IATable>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, watch } from 'vue'
import { InfoNoticeAnmentTable } from './table'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import EventBus from '@/utils/bus'
import apis from '@/server/request'
import { message } from 'ant-design-vue'
export default defineComponent({
  props: {
    tabKey: {
      type: String,
    },
    queryParam: {
      type: Object,
    },
  },
  setup(props) {
    const userInfo = reactive(LocalGetUserInfo())
    const columns = ref(InfoNoticeAnmentTable.columns)
    const noticeTable = ref()

    const batchSelect = reactive({
      selectedRowKeys: [],
    })

    const onSelectChange = (selectedKeys, selectedRows) => {
      batchSelect.selectedRowKeys = selectedKeys
    }

    const searchFunc = () => {
      const { tabKey } = props

      const params = {
        areaid: userInfo.areaid,
        level: userInfo.areaLevel,
        userid: userInfo.userid,
        read: tabKey == 'unRead' ? '0' : '1',
        // 通知公告表的查询参数 props.queryParam.noticeTitle
        title: props.queryParam.noticeTitle,
        sort: props.queryParam.sort,
      }
      console.log(params, '查询通知公告列表的params')
      return params
    }
    const handleViewNotice = (record) => {
      EventBus.emit('handleViewNotice', record)
    }
    const refreshNoticeTable = () => {
      noticeTable.value.refresh(true)
    }
    const handleReadNotice = async (record) => {
      const params = {
        userid: userInfo.userid,
        bulletinid: record.id,
      }
      const res = await apis.updateSingleBulletinOnRead(params)
      if (res && res.code === 0) {
        refreshNoticeTable()
        message.success(res.message)
      } else {
        message.warning(res.message)
      }
    }

    const handleDeleteNotice = async (record) => {
      const params = {
        bulletinid: record.id,
        userid: userInfo.userid,
      }
      const res = await apis.deleteBulletin(params)
      if (res && res.code === 0) {
        refreshNoticeTable()
        message.success(res.message)
      } else {
        message.warning(res.message)
      }
    }
    watch(
      () => props.tabKey,
      () => {
        batchSelect.selectedRowKeys = []
      },
      {
        immediate: true,
        deep: true,
      }
    )
    return {
      columns,
      searchFunc,
      noticeTable,
      handleViewNotice,
      handleReadNotice,
      ...toRefs(props),
      handleDeleteNotice,
      onSelectChange,
      ...toRefs(batchSelect),
    }
  },
})
</script>

<style scoped lang="less"></style>
