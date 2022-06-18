<template>
  <div>
    <!-- 下属队伍管理 -->
    <PageFormTableWrapper>
      <template #searchForm>
        <a-form ref="searchFormRef" :model="queryParam">
          <a-row :gutter="24">
            <a-col :md="5" :sm="24">
              <a-form-item label="队伍名称">
                <a-input v-model:value="queryParam.teamName" placeholder="请输入队伍名称" />
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-space>
                  <a-button type="primary" size="large" @click="searchFrom">
                    查询
                  </a-button>
                  <a-button @click="resetForm" size="large">重置</a-button>
                </a-space>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </template>
      <template #table>
        <a-tabs type="card" class="teamTabs" @change="(e) => (activeTabKey = e)" :activeKey="activeTabKey">
          <!-- <a-tab-pane key="3">
            <template #tab>
              <span>正式队伍</span>
            </template>
            <SubTeamTable type="3" ref="subTeamTable1Ref" :queryParam="queryParam"></SubTeamTable>
          </a-tab-pane> -->
          <a-tab-pane key="1">
            <template #tab>
              <span>注册审核</span>
            </template>
            <SubTeamTable type="1" ref="subTeamTable2Ref" :queryParam="queryParam"></SubTeamTable>
          </a-tab-pane>
          <a-tab-pane key="2">
            <template #tab>
              <span>变更审核</span>
            </template>
            <SubTeamTable type="2" ref="subTeamTable3Ref" :queryParam="queryParam"></SubTeamTable>
          </a-tab-pane>
        </a-tabs>
      </template>
    </PageFormTableWrapper>
    <TeamReviewDrawer></TeamReviewDrawer>
    <TeamUpdateDrawer></TeamUpdateDrawer>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs } from 'vue'
import SubTeamTable from './table/SubTeamTable.vue'
import TeamReviewDrawer from './drawer/TeamReviewDrawer.vue'
import TeamUpdateDrawer from '@/pages/subteamManagement/common/drawers/TeamInfoUpdateDrawer.vue'
export default defineComponent({
  components: {
    SubTeamTable,
    TeamReviewDrawer,
    TeamUpdateDrawer,
  },
  setup() {
    const queryParam = reactive({
      teamName: '',
    })
    // const subTeamTable1Ref = ref()
    const subTeamTable2Ref = ref()
    const subTeamTable3Ref = ref()
    const activeTabKey = ref('1')
    const refreshTable = () => {
      // subTeamTable1Ref.value.$refs.reviewTable.refresh()
      subTeamTable2Ref.value.$refs.reviewTable.refresh()
      subTeamTable3Ref.value.$refs.reviewTable.refresh()
    }
    const searchFrom = () => {
      refreshTable()
    }
    const resetForm = () => {
      queryParam.teamName = ''
      refreshTable()
    }

    return {
      queryParam,
      searchFrom,
      resetForm,
      activeTabKey,
      // subTeamTable1Ref,
      subTeamTable2Ref,
      subTeamTable3Ref,
    }
  },
})
</script>

<style scoped lang="less"></style>
