<template>
  <!-- 我的投诉表 -->
  <IATable
    serviceName="complaintList"
    :searchParameter="searchFunc"
    ref="complaintTable"
    size="middle"
    :rowKey="(record) => record.id"
    :columns="columns"
    :showHeader="false"
    :row-selection="{
      selectedRowKeys: selectedRowKeys,
      onChange: onSelectChange,
    }"
  >
    <template #action="{record}">
      <a-space>
        <a-button type="primary" size="small" @click="handleViewComplaint(record)">
          查看
        </a-button>
        <a-popconfirm :title="'是否确定删除?'" @confirm="handleDeleteComplaint(record)">
          <a-button size="small">
            删除
          </a-button>
        </a-popconfirm>
      </a-space>
    </template>
  </IATable>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, onBeforeUnmount } from 'vue'
import { InfoComplaintTable } from './table'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import apis from '@/server/request'
import EventBus from '@/utils/bus'
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
    const columns = ref(InfoComplaintTable.columns)
    const complaintTable = ref()
    const tableSelectKeys = reactive({
      selectedRowKeys: [], //选中的id列表
    })

    const refreshComplainTable = () => {
      complaintTable.value.refresh(true)
    }
    const onSelectChange = (selectedKeys, selectedRows) => {
      tableSelectKeys.selectedRowKeys = selectedKeys
    }
    const searchFunc = () => {
      const { tabKey } = props
      console.log(userInfo)
      return {
        pageNum: 1,
        pageSize: 12,
        teamid: userInfo.team.groupid,
        type: tabKey == 'notDeal' ? '0' : '1',
        // 查询条件
        albx0355: props.queryParam.complaintName, // 被投诉对象
        albx0346: props.queryParam.complaintType, // 投诉类型
      }
    }
    onBeforeUnmount(() => {
      EventBus.off('refreshComplaintTable')
    })
    onMounted(() => {
      EventBus.on('refreshComplaintTable', () => {
        refreshComplainTable()
      })
    })
    const handleViewComplaint = (record) => {
      const { tabKey } = props
      EventBus.emit('handleViewComplaint', {
        record,
        type: tabKey,
      })
    }
    const handleDeleteComplaint = async (record) => {
      const params = []
      params.push({
        id: record.id,
      })
      const res = await apis.complaintDel(params)
      if (res.code === 0 || res.code === '0') {
        message.success(res.message)
        refreshComplainTable()
      } else {
        message.warning(res.message)
      }
    }

    return {
      ...toRefs(tableSelectKeys),
      complaintTable,
      columns,
      searchFunc,
      onSelectChange,
      handleViewComplaint,
      handleDeleteComplaint,
    }
  },
})
</script>

<style scoped lang="less"></style>
