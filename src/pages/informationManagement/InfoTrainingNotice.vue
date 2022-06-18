<template>
  <!-- 培训通知 -->
  <PageFormTableWrapper>
    <template #searchForm>
      <a-form :model="queryParam">
        <a-row :gutter="24">
          <a-col :md="6" :sm="24">
            <a-form-item label="培训标题">
              <a-input placeholder="请输入培训标题" v-model:value="queryParam.trainTitle" />
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
        <a-tab-pane key="1">
          <template #tab>未开始</template>
          <InfoTrainTable tabKey="1" ref="InfoTrainCom" :queryParam="queryParam"></InfoTrainTable>
        </a-tab-pane>
        <a-tab-pane key="2">
          <template #tab>进行中</template>
          <InfoTrainTable tabKey="2" ref="InfoTrainCom" :queryParam="queryParam"></InfoTrainTable>
        </a-tab-pane>
        <a-tab-pane key="3">
          <template #tab>已结束</template>
          <InfoTrainTable tabKey="3" ref="InfoTrainCom" :queryParam="queryParam"></InfoTrainTable>
        </a-tab-pane>
        <template #tabBarExtraContent>
          <a-space>
            <a-button type="primary" @click.prevent="handleAddTrain">新增培训</a-button>
          </a-space>
        </template>
      </a-tabs>
      <InfoTrainDrawer></InfoTrainDrawer>
      <InfoTrainListDrawer></InfoTrainListDrawer>
    </template>
  </PageFormTableWrapper>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs } from 'vue'
import SearchFrom from './components/common/SearchFrom.vue'
import InfoTrainTable from './components/tables/InfoTrainTable.vue'
import InfoTrainDrawer from './components/drawers/InfoTrainDrawer.vue'
import InfoTrainListDrawer from './components/drawers/InfoTrainListDrawer.vue'
import EventBus from '@/utils/bus'
import { refreshInfoTrainTableHook } from './Hooks/useSearchFormHook'
export default defineComponent({
  components: {
    SearchFrom,
    InfoTrainTable,
    InfoTrainDrawer,
    InfoTrainListDrawer,
  },
  setup() {
    const activeTabKey = ref('1')
    const queryParam = reactive({
      trainTitle: '',
    })
    const handleAddTrain = () => {
      EventBus.emit('handleAddTrain')
    }
    const { InfoTrainCom, resetForm, searchForm } = refreshInfoTrainTableHook(queryParam)
    return {
      InfoTrainCom,
      resetForm,
      searchForm,
      queryParam,
      activeTabKey,
      handleAddTrain,
    }
  },
})
</script>

<style scoped lang="less">
.teamTabs :deep(.ant-tabs-nav div) {
  padding-left: 10px !important;
}
</style>
