<template>
  <!-- 队伍注册审核 -->
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
          <a-col :md="5" :sm="24">
            <a-form-item label="队伍名称">
              <a-input v-model:value="queryParam.teamName" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-space>
                <a-button type="primary" size="large" @click="searchForm">
                  查询
                </a-button>
                <a-button size="large" @click="resetForm">重置</a-button>
              </a-space>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </template>
    <template #table>
      <a-tabs type="card" class="teamTabs" @change="(e) => (activeTabKey = e)" :activeKey="activeTabKey">
        <a-tab-pane key="direGroup">
          <template #tab>
            <span>直属团体 </span>
          </template>
          <TeamReviewTable
            tabsKey="direGroup"
            tableType="regirst"
            :totalNum="total_direGroup"
            :queryParam="queryParam"
            ref="TeamReviewTable1"
            @refreshReviewTable="refreshReviewTable"
          ></TeamReviewTable>
        </a-tab-pane>
        <a-tab-pane key="subGroup">
          <template #tab>
            <span>下级团体</span>
          </template>
          <TeamReviewTable
            tabsKey="subGroup"
            tableType="regirst"
            :totalNum="total_subGroup"
            :queryParam="queryParam"
            ref="TeamReviewTable2"
            @refreshReviewTable="refreshReviewTable"
          ></TeamReviewTable>
        </a-tab-pane>
        <a-tab-pane key="subOrgGroup">
          <template #tab>
            <span>下级组织</span>
          </template>
          <TeamReviewTable
            tabsKey="subOrgGroup"
            tableType="regirst"
            :totalNum="total_subOrgGroup"
            :queryParam="queryParam"
            ref="TeamReviewTable3"
            @refreshReviewTable="refreshReviewTable"
          ></TeamReviewTable>
        </a-tab-pane>
      </a-tabs>
      <TeamReviewDrawer></TeamReviewDrawer>
    </template>
  </PageFormTableWrapper>
</template>

<script>
import { defineComponent, reactive, toRefs, onMounted, ref } from 'vue'
import TeamReviewTable from './common/tables/TeamReviewTable.vue'
import TeamReviewDrawer from './common/drawers/TeamReviewDrawer.vue'
import SearchFrom from './common/SearchFrom.vue'
import apis from '@/server/request'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { refreshReviewTableHook } from './Hooks/refreshTableHooks'
export default defineComponent({
  components: {
    TeamReviewTable,
    SearchFrom,
    TeamReviewDrawer,
  },
  setup() {
    const userInfo = reactive(LocalGetUserInfo())
    const activeTabKey = ref('direGroup')
    const queryParam = reactive({
      teamName: '',
    })
    const totalGroup = reactive({
      total_direGroup: '',
      total_subGroup: '',
      total_subOrgGroup: '',
    })
    const { TeamReviewTable1, TeamReviewTable2, TeamReviewTable3, resetForm, searchForm } = refreshReviewTableHook(queryParam)
    const getTeamPageNumFortis = async () => {
      const params = {
        id: userInfo.team.groupid, // 'a6124ab7ced64a13b806c9418da42d84', // 队伍id
        type: '1', // 1 注册审核 2 变更审核 3.正式队伍
        areaId: userInfo.areaid, // '110101000000000000' //	服务区域
      }
      const res = await apis.getTeamPageNumFortis(params)
      if (res && res.data) {
        totalGroup.total_direGroup = res.data.zhishunum
        totalGroup.total_subGroup = res.data.xiajinum
        totalGroup.total_subOrgGroup = res.data.zuzhinum
      }
      console.log(res, '查询统计')
    }
    onMounted(() => {
      getTeamPageNumFortis()
    })
    const refreshReviewTable = () => {
      getTeamPageNumFortis()
    }
    return {
      ...toRefs(totalGroup),
      activeTabKey,
      queryParam,
      resetForm,
      searchForm,
      refreshReviewTable,
      TeamReviewTable1,
      TeamReviewTable2,
      TeamReviewTable3,
    }
  },
})
</script>

<style scoped lang="less">
.teamTabs :deep(.ant-tabs-nav div) {
  padding-left: 10px !important;
}
</style>
