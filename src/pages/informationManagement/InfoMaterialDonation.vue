<template>
  <!-- 物资捐赠 -->
  <PageFormTableWrapper>
    <template #searchForm>
      <a-form :model="queryParam">
        <a-row :gutter="24">
          <a-col :md="6" :sm="24">
            <a-form-item label="物资名称">
              <a-input placeholder="请输入物资名称" v-model:value="queryParam.goodsName" />
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
        <a-tab-pane key="dispGoods">
          <template #tab>一次性物资</template>
          <InfoGoodsTable tabKey="1" ref="InfoGoodsCom" :queryParam="queryParam"> </InfoGoodsTable>
        </a-tab-pane>
        <a-tab-pane key="sustGoods">
          <template #tab>持续性物资</template>
          <InfoGoodsTable tabKey="2" ref="InfoGoodsCom" :queryParam="queryParam"></InfoGoodsTable>
        </a-tab-pane>
        <template #tabBarExtraContent>
          <a-button type="primary" @click.prevent="handleBatchAddGoods">新增物资</a-button>
        </template>
      </a-tabs>
    </template>
  </PageFormTableWrapper>
  <InfoMaterialDonationDrawer></InfoMaterialDonationDrawer>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs } from 'vue'
import SearchFrom from './components/common/SearchFrom.vue'
import InfoGoodsTable from './components/tables/InfoGoodsTable.vue'
import InfoMaterialDonationDrawer from './components/drawers/InfoMaterialDonationDrawer.vue'
import EventBus from '@/utils/bus'
import { refreshInfoGoodsTableHook } from './Hooks/useSearchFormHook'
export default defineComponent({
  components: {
    SearchFrom,
    InfoGoodsTable,
    InfoMaterialDonationDrawer,
  },
  setup() {
    const activeTabKey = ref('dispGoods')
    const queryParam = reactive({
      goodsName: '',
    })
    const handleBatchAddGoods = () => {
      EventBus.emit('handleBatchAddGoods')
    }
    const { InfoGoodsCom, resetForm, searchForm } = refreshInfoGoodsTableHook(queryParam)
    return {
      queryParam,
      activeTabKey,
      handleBatchAddGoods,
      InfoGoodsCom,
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
