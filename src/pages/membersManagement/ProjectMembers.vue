<!-- 项目成员 -->
<template>
  <PageFormTableWrapper>
    <template #searchForm>
      <a-form
        ref="searchFormRef"
        :model="queryParam"
        :label-col="{
          xs: { span: 24 },
          sm: { span: 6 },
        }"
        :wrapper-col="{
          xs: { span: 24 },
          sm: { span: 18 },
        }"
      >
        <a-row :gutter="24">
          <a-col :md="6" :sm="24" v-if="userInfo.areaLevel == 0">
            <a-form-item label="服务区域">
              <AreaDevNew ref="areaRef" :showAll="true" placeholder="请选择区域" v-model:value="queryParam.albx0021" />
            </a-form-item>
          </a-col>
          <a-col :sm="24" :md="6">
            <a-form-item label="项目搜索" name="albx0002">
              <a-input v-model:value="queryParam.albx0002" placeholder="项目名称" />
            </a-form-item>
          </a-col>
          <a-col :sm="24" :md="6">
            <a-form-item>
              <a-space>
                <a-button type="primary" @click="search(1)"> 查询 </a-button>
                <a-button @click="search(2)"> 重置 </a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </template>
    <template #table>
      <a-tabs type="card" class="teamTabs" v-model:value="activeKey" @change="(e) => (activeKey = e)">
        <a-tab-pane key="3">
          <template #tab>待启动项目</template>
          <TimeEntryDurationTable tabKey="3" :isshow="2" ref="proMemberTable4" :queryParam="queryParam"></TimeEntryDurationTable>
        </a-tab-pane>
        <a-tab-pane key="4">
          <template #tab>运行中项目</template>
          <TimeEntryDurationTable tabKey="4" :isshow="2" ref="proMemberTable1" :queryParam="queryParam"></TimeEntryDurationTable>
        </a-tab-pane>
        <a-tab-pane key="5">
          <template #tab>已结项项目</template>
          <TimeEntryDurationTable tabKey="5" :isshow="4" ref="proMemberTable2" :queryParam="queryParam"></TimeEntryDurationTable>
        </a-tab-pane>
        <a-tab-pane key="6">
          <template #tab>补录项目</template>
          <TimeEntryDurationTable tabKey="6" :isshow="5" ref="proMemberTable3" :queryParam="queryParam"></TimeEntryDurationTable>
        </a-tab-pane>
      </a-tabs>
    </template>
  </PageFormTableWrapper>
</template>

<script>
// import { message } from 'ant-design-vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
// import { useRouter } from 'vue-router'
import { defineComponent, reactive, ref, toRefs, onMounted } from 'vue'
import apis from '@/server/request'
import TimeEntryDurationTable from '../timeManagement/common/tables/TimeEntryDurationTable'
export default defineComponent({
  components: {
    TimeEntryDurationTable,
  },
  setup() {
    const state = reactive({
      userInfo: ref(LocalGetUserInfo()),
      activeKey: '3',
      searchFormRef: ref(),
      proMemberTable4: ref(),
      proMemberTable1: ref(),
      proMemberTable2: ref(),
      proMemberTable3: ref(),
      queryParam: {
        albx0002: '',
        albx0021: [],
      },
    })

    const areaRef = ref()
    const searchParameter = () => {
      return {
        teamId: state.userInfo.team.groupid,
        albx0021:
          state.userInfo.areaLevel == 0
            ? state.queryParam.albx0021.length > 0
              ? state.queryParam.albx0021[state.queryParam.albx0021.length - 1]
              : '100000000000000000'
            : state.userInfo.areaid,
        albx0072: props.tabKey, //3待启动 4 运行中 5已结项 6 补录
        albx0002: state.queryParam.albx0002,
      }
    }
    const search = (val) => {
      if (val == 2) {
        // searchFormRef.value.resetFields()
        state.queryParam.albx0002 = ''
        state.queryParam.albx0021 = []
      }
      state.activeKey == '3'
        ? state.proMemberTable4.getList()
        : state.activeKey == '4'
        ? state.proMemberTable1.getList()
        : state.activeKey == '5'
        ? state.proMemberTable2.getList()
        : state.proMemberTable3.getList()
    }

    return {
      ...toRefs(state),
      searchParameter,
      search,
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
