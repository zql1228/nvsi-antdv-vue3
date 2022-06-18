<template>
  <!-- 我的投诉 -->
  <PageFormTableWrapper>
    <template #searchForm>
      <a-form :model="queryParam">
        <a-row :gutter="24">
          <a-col :md="7" :sm="24">
            <a-form-item label="被投诉对象">
              <a-input placeholder="" v-model:value="queryParam.complaintName" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="投诉类型">
              <a-select v-model:value="queryParam.complaintType">
                <a-select-option value="0">时长</a-select-option>
                <a-select-option value="1">队伍</a-select-option>
                <a-select-option value="2">项目</a-select-option>
                <a-select-option value="3">人员</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchForm">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetForm">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </template>
    <template #table>
      <a-tabs type="card" class="teamTabs" @change="(e) => (activeTabKey = e)" :activeKey="activeTabKey">
        <a-tab-pane key="notDeal">
          <template #tab>未处理</template>
          <InfoComplaintTable tabKey="notDeal" ref="InfoComplaintCom" :queryParam="queryParam"></InfoComplaintTable>
        </a-tab-pane>
        <a-tab-pane key="hasBeenDeal">
          <template #tab>已处理</template>
          <InfoComplaintTable tabKey="hasBeenDeal" ref="InfoComplaintCom" :queryParam="queryParam"></InfoComplaintTable>
        </a-tab-pane>
        <template #tabBarExtraContent>
          <a-space>
            <a-button type="primary" @click.prevent="handleBatchDelCompaint">批量删除</a-button>
          </a-space>
        </template>
      </a-tabs>
    </template>
  </PageFormTableWrapper>
  <InfoComplaintDrawer></InfoComplaintDrawer>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs } from 'vue'
import SearchFrom from './components/common/SearchFrom.vue'
import InfoComplaintTable from './components/tables/InfoComplaintTable.vue'
import InfoComplaintDrawer from './components/drawers/InfoComplaintDrawer'
import { refreshInfoComplaintTableHook } from './Hooks/useSearchFormHook'
import { message } from 'ant-design-vue'
import apis from '@/server/request'
export default defineComponent({
  components: {
    SearchFrom,
    InfoComplaintTable,
    InfoComplaintDrawer,
  },
  setup() {
    const activeTabKey = ref('notDeal')
    const queryParam = reactive({
      complaintName: '',
      complaintType: '',
    })
    const { InfoComplaintCom, resetForm, searchForm, refreshTable } = refreshInfoComplaintTableHook(queryParam)
    const handleBatchDelCompaint = async () => {
      const selectedRowKeys = InfoComplaintCom.value.selectedRowKeys
      if (selectedRowKeys.length == 0) return message.warning('请先选择要删除投诉')
      let bean = []
      selectedRowKeys.forEach((element) => {
        let obj = { id: element }
        bean.push(obj)
      })
      const res = await apis.complaintDel(bean)
      if (res.code === 0 || res.code === '0') {
        message.success(res.message)
        refreshTable()
      } else {
        message.warning(res.message)
      }
    }

    return {
      queryParam,
      activeTabKey,
      handleBatchDelCompaint,
      InfoComplaintCom,
      resetForm,
      searchForm,
    }
  },
})
</script>

<style scoped lang="less">
.teamTabs :deep(.ant-tabs-nav div) {
  padding-left: 10px !important;
}
</style>
