<!-- 时长录入 -->
<template>
  <PageFormTableWrapper>
    <template #searchForm>
      <a-form
        :label-col="{
          xs: { span: 24 },
          sm: { span: 6 },
        }"
        :wrapper-col="{
          xs: { span: 24 },
          sm: { span: 18 },
        }"
        ref="proRef"
        :model="queryParam"
      >
        <a-row :gutter="24">
          <a-col :md="6" :sm="24" v-if="areaLevel == 0">
            <a-form-item label="服务区域">
              <AreaDevNew ref="areaRef" :showAll="true" placeholder="请选择区域" v-model:value="queryParam.albx0021" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="项目搜索">
              <a-input v-model:value="queryParam.albx0002" placeholder="项目名称" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item>
              <a-space>
                <a-button type="primary" @click="search(1)">查询</a-button>
                <a-button @click="search(2)">重置</a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </template>
    <template #table>
      <a-tabs type="card" class="teamTabs" v-model:activeKey="activeKey" @change="(e) => (activeKey = e)">
        <a-tab-pane key="4">
          <template #tab>运行中项目</template>
          <TimeEntryDurationTable tabKey="4" :isshow="1" ref="entrytable1" :queryParam="queryParam"></TimeEntryDurationTable>
        </a-tab-pane>
        <a-tab-pane key="5">
          <template #tab>已结项项目</template>
          <TimeEntryDurationTable tabKey="5" :isshow="1" ref="entrytable2" :queryParam="queryParam"></TimeEntryDurationTable>
        </a-tab-pane>
        <a-tab-pane key="6">
          <template #tab>补录项目</template>
          <TimeEntryDurationTable tabKey="6" :isshow="1" ref="entrytable3" :queryParam="queryParam"></TimeEntryDurationTable>
        </a-tab-pane>
      </a-tabs>
    </template>
  </PageFormTableWrapper>
</template>

<script>
import { defineComponent, reactive, ref, toRef, onMounted, watch, nextTick } from 'vue'
import TimeEntryDurationTable from './common/tables/TimeEntryDurationTable'
import { LocalGetUserInfo, LocalSetProjectInfo } from '@/utils/localStorage.js'
export default defineComponent({
  components: {
    TimeEntryDurationTable,
  },
  setup({ emit }) {
    const queryParam = reactive({
      albx0002: '',
      albx0021: [],
    })
    const areaRef = ref()
    const userInfo = ref(LocalGetUserInfo())
    const areaLevel = userInfo.value.areaLevel
    const entrytable1 = ref()
    const entrytable2 = ref()
    const entrytable3 = ref()
    const activeKey = ref('4')
    const proRef = ref()
    const search = (val) => {
      if (val == 2) {
        // proRef.value.resetFields()
        queryParam.albx0002 = ''
        queryParam.albx0021 = []
      }
      entrytable1.value.getList()
      entrytable2.value.getList()
      entrytable3.value.getList()
    }
    return {
      queryParam,
      areaLevel,
      activeKey,
      proRef,
      search,
      entrytable1,
      entrytable2,
      entrytable3,
      areaRef,
    }
  },
})
</script>
<style scoped>
.teamTabs :deep(.ant-tabs-nav div) {
  padding-left: 10px !important;
}
</style>
