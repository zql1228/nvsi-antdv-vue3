<template>
  <PageFormTableWrapper>
    <template #searchForm>
      <a-form ref="searchFormRef" :model="queryParam">
        <a-row :gutter="24">
          <a-col :md="5" :sm="24">
            <a-form-item label="项目名称">
              <a-input v-model:value="queryParam.proName" placeholder="" />
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
      <a-tabs type="card" @change="(e) => (activeTabKey = e)" class="teamTabs" :activeKey="activeTabKey">
        <a-tab-pane key="direGroup">
          <template #tab>
            <span>直属团体</span>
          </template>
          <ProjectReviewTable tabsKey="direGroup" :totalNum="total_direGroup" :queryParam="queryParam" ref="ProjectReviewTable1"></ProjectReviewTable>
        </a-tab-pane>
        <a-tab-pane key="subGroup">
          <template #tab>
            <span>下级团体</span>
          </template>
          <ProjectReviewTable tabsKey="subGroup" :totalNum="total_subGroup" :queryParam="queryParam" ref="ProjectReviewTable2"></ProjectReviewTable>
        </a-tab-pane>
      </a-tabs>
      <ProjectReviewDrawer></ProjectReviewDrawer>
    </template>
  </PageFormTableWrapper>
</template>

<script>
import { defineComponent, reactive, toRefs, ref, onMounted } from 'vue'
import ProjectReviewTable from './common/tables/ProjectReviewTable'
import ProjectReviewDrawer from './common/drawers/ProjectReviewDrawer.vue'
import SearchFrom from './common/SearchFrom.vue'
import apis from '@/server/request'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { refreshProReviewTableHook } from './Hooks/refreshTableHooks'
import EventBus from '@/utils/bus'
export default defineComponent({
  components: {
    ProjectReviewTable,
    ProjectReviewDrawer,
    SearchFrom,
  },
  setup() {
    const userInfo = ref(LocalGetUserInfo())
    const activeTabKey = ref('direGroup')
    const totalGroup = reactive({
      total_direGroup: '0',
      total_subGroup: '0',
    })
    const queryParam = reactive({
      proName: '',
    })
    const { ProjectReviewTable1, ProjectReviewTable2, resetForm, searchForm } = refreshProReviewTableHook(queryParam)
    const getPublishProList = async () => {
      const params = {
        teamId: userInfo.value.team.groupid, // 团体id
        ProName: '', //项目名称(非必)
        albx7310: '1',
      }
      if (queryParam.proName) {
        params.ProName = queryParam.proName
      } else {
        params.ProName = ''
      }
      const res = await apis.getPublishProList(params)
      if (res.code == '0' && res.data) {
        totalGroup.total_direGroup = res.data.sumproteam
        totalGroup.total_subGroup = res.data.sumpro
      }
    }
    onMounted(() => {
      getPublishProList()
      EventBus.on('refreshProReviewTable', () => {
        getPublishProList()
      })
    })
    return {
      ...toRefs(totalGroup),
      activeTabKey,
      queryParam,
      ProjectReviewTable1,
      ProjectReviewTable2,
      resetForm,
      searchForm,
    }
  },
})
</script>

<style scoped lang="less"></style>
