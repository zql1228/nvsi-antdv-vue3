<template>
  <!-- 我的表彰 -->
  <PageFormTableWrapper>
    <template #searchForm>
      <a-form :model="queryParam">
        <a-row :gutter="24">
          <a-col :md="6" :sm="24">
            <a-form-item label="表彰名称">
              <a-input placeholder="请输入表彰名称" v-model:value="queryParam.commentName" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="表彰类型">
              <a-select v-model:value="queryParam.commentType">
                <a-select-option value="1">队伍</a-select-option>
                <a-select-option value="2">项目</a-select-option>
                <a-select-option value="3">志愿者</a-select-option>
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
        <a-tab-pane key="notPublish">
          <template #tab>未发布</template>
          <InfoCommendTable ref="InfoCommendTable" tabKey="notPublish" :queryParam="queryParam"></InfoCommendTable>
        </a-tab-pane>
        <a-tab-pane key="published">
          <template #tab>已发布</template>
          <InfoCommendTable ref="InfoCommendTable" tabKey="published" :queryParam="queryParam"></InfoCommendTable>
        </a-tab-pane>
        <template #tabBarExtraContent>
          <a-space>
            <a-button type="primary" @click.prevent="handleAddCommend">新增表彰</a-button>
          </a-space>
        </template>
      </a-tabs>
    </template>
  </PageFormTableWrapper>
  <InfoCommendDrawer></InfoCommendDrawer>
  <InfoCommendListDrawer></InfoCommendListDrawer>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs } from 'vue'
import SearchFrom from './components/common/SearchFrom.vue'
import InfoCommendTable from './components/tables/InfoCommendTable.vue'
import InfoCommendDrawer from './components/drawers/InfoCommendDrawer'
import InfoCommendListDrawer from './components/drawers/InfoCommendListDrawer'
import EventBus from '@/utils/bus'
import { refreshInfoCommendTableHook } from './Hooks/useSearchFormHook'
export default defineComponent({
  components: {
    SearchFrom,
    InfoCommendTable,
    InfoCommendDrawer,
    InfoCommendListDrawer,
  },
  setup() {
    const activeTabKey = ref('notPublish')
    const queryParam = reactive({
      commentName: '',
      commentType: '',
    })
    const handleAddCommend = () => {
      EventBus.emit('handleAddCommend', { type: 'add' })
    }
    const { InfoCommendTable, resetForm, searchForm } = refreshInfoCommendTableHook(queryParam)
    return {
      activeTabKey,
      handleAddCommend,
      searchForm,
      resetForm,
      queryParam,
      InfoCommendTable,
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
