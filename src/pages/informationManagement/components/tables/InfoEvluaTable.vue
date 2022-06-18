<template>
  <!-- 我的评价表 -->
  <IATable
    serviceName="teamEvaluationListFortis"
    :searchParameter="searchFunc"
    ref="evaluTable"
    size="middle"
    :rowKey="(record) => record.id"
    :columns="columns"
    :showHeader="false"
  >
    <!--  被评价 -->
    <template #action="{record}" v-if="tabKey == 'evaluated'">
      <a-button type="primary" size="small" @click="handleViewEvlua(record)">
        查看
      </a-button>
    </template>
    <template #action="{record}" v-else>
      <a-space>
        <a-button type="primary" size="small" @click="handleUpdateEvlua(record)">
          修改
        </a-button>
        <a-popconfirm :title="'确定删除吗?'" @confirm="handleDeleteEvlua(record)">
          <a-button size="small">
            删除
          </a-button>
        </a-popconfirm>
      </a-space>
    </template>
  </IATable>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs } from 'vue'
import { InfoEvluaTable } from './table'
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
    const userInfo = ref(LocalGetUserInfo())
    const columns = ref()
    const evaluTable = ref()
    props.tabKey === 'evaluated' ? (columns.value = InfoEvluaTable.columns_evaluated) : (columns.value = InfoEvluaTable.columns_volunteers)
    const searchFunc = () => {
      const { tabKey } = props
      return {
        pageNum: 1,
        pageSize: 12,
        type: tabKey == 'evaluated' ? '1' : '2',
        teamid: userInfo.value.team.groupid,
        // 查询条件——————  props.queryParam.volName
        albp0003: props.queryParam.volName,
      }
    }

    const refreshEvluaTable = () => {
      evaluTable.value.refresh(true)
    }
    // 查看评价
    const handleViewEvlua = (record) => {
      const { tabKey } = props
      EventBus.emit('handleViewEvlua', { record, type: tabKey })
    }
    const handleUpdateEvlua = (record) => {
      const { tabKey } = props
      EventBus.emit('handleUpdateEvlua', { record, type: tabKey })
    }
    const handleDeleteEvlua = async (record) => {
      const res = await apis.delTeamEvaluationVolFortis({ id: record.id })
      if (res.code == '0') {
        refreshEvluaTable()
        message.success(res.message)
      } else {
        message.warning(res.message)
      }
    }

    onMounted(() => {
      EventBus.on('refreshEvluaTable', () => {
        refreshEvluaTable()
      })
    })
    return {
      ...toRefs(props),
      evaluTable,
      columns,
      searchFunc,
      handleViewEvlua,
      handleUpdateEvlua,
      handleDeleteEvlua,
    }
  },
})
</script>

<style scoped lang="less"></style>
