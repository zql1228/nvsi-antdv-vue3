<template>
  <!-- 我的评价 -->
  <PageFormTableWrapper>
    <template #searchForm>
      <a-form :model="queryParam">
        <a-row :gutter="24">
          <a-col :md="8" :sm="24">
            <a-form-item label="志愿者姓名">
              <a-input placeholder="请输入志愿者姓名" v-model:value="queryParam.volName" />
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
        <a-tab-pane key="evaluated">
          <template #tab>被评价</template>
          <InfoEvluaTable tabKey="evaluated" ref="InfoEvluaTableCom" :queryParam="queryParam"></InfoEvluaTable>
        </a-tab-pane>
        <a-tab-pane key="evaluateVolunteers">
          <template #tab>评价志愿者</template>
          <InfoEvluaTable tabKey="evaluateVolunteers" ref="InfoEvluaTableCom" :queryParam="queryParam"></InfoEvluaTable>
        </a-tab-pane>
      </a-tabs>
      <InfoEvluaDrawer></InfoEvluaDrawer>
    </template>
  </PageFormTableWrapper>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs } from 'vue'
import SearchFrom from './components/common/SearchFrom.vue'
import InfoEvluaTable from './components/tables/InfoEvluaTable.vue'
import InfoEvluaDrawer from './components/drawers/InfoEvluaDrawer.vue'
import { refreshInfoEvluaTableHook } from './Hooks/useSearchFormHook'
export default defineComponent({
  components: {
    SearchFrom,
    InfoEvluaTable,
    InfoEvluaDrawer,
  },
  setup() {
    const queryParam = reactive({
      volName: '',
    })
    const activeTabKey = ref('evaluated')
    const { InfoEvluaTableCom, resetForm, searchForm } = refreshInfoEvluaTableHook(queryParam)
    return {
      activeTabKey,
      queryParam,
      InfoEvluaTableCom,
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
