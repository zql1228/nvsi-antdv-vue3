<template>
  <div>
    <PageFormTableWrapper :showSearchForm="false">
      <template #table>
        <a-spin :spinning="spinning">
          <a-tabs type="card" class="teamTabs" @change="(e) => (activeTabKey = e)" :activeKey="activeTabKey">
            <a-tab-pane key="teamInfo">
              <template #tab>基本信息</template>
              <a-row :gutter="24" style="max-height: 75vh; overflow-y: scroll">
                <a-col :md="24">
                  <FormTeamInfo :updateState="'notAllowUpdate'" comType="view" :queryTeamParam="queryTeamParam"></FormTeamInfo>
                </a-col>
                <a-col :md="24">
                  <FormTeamType :updateState="'notAllowUpdate'" comType="view" :queryTeamParam="queryTeamParam"></FormTeamType>
                </a-col>
                <a-col :md="24">
                  <FormChargeInfo :updateState="'notAllowUpdate'" comType="view" :queryTeamParam="queryTeamParam"></FormChargeInfo>
                </a-col>
              </a-row>
            </a-tab-pane>
            <a-tab-pane key="publishedProject">
              <template #tab>发布的项目</template>
              <TeamPublishProjectTable :baseTeamInfo="baseTeamInfo"></TeamPublishProjectTable>
            </a-tab-pane>
            <a-tab-pane key="teamMembers">
              <template #tab>队伍成员</template>
              <TeamMemberTable :baseTeamInfo="baseTeamInfo"></TeamMemberTable>
            </a-tab-pane>
          </a-tabs>
        </a-spin>
      </template>
    </PageFormTableWrapper>
    <ProjectInfoAction></ProjectInfoAction>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs } from 'vue'
import FormChargeInfo from './common/formInfo/FormChargeInfo.vue'
import FormTeamInfo from './common/formInfo/FormTeamInfo.vue'
import FormTeamType from './common/formInfo/FormTeamType.vue'
import TeamMemberTable from './common/tables/TeamMemberTable.vue'
import TeamPublishProjectTable from './common/TeamPublishProjectTable'
import ProjectInfoAction from './common/drawers/ProjectInfoAction.vue'
import { useRouter } from 'vue-router'
import { LocalGetTeamViewInfo } from '@/utils/localStorage'
import apis from '@/server/request'
export default defineComponent({
  components: {
    FormChargeInfo,
    FormTeamInfo,
    FormTeamType,
    TeamMemberTable,
    TeamPublishProjectTable,
    ProjectInfoAction,
  },
  setup() {
    const activeTabKey = ref('teamInfo')
    const router = useRouter()
    let teamListRecord = reactive(LocalGetTeamViewInfo())
    const baseTeamInfo = ref({})
    const spinning = ref(true)
    const queryTeamParam = reactive({
      teamId: '',
      areaId: '',
    })
    const getTeamInfo = () => {
      queryTeamParam.teamId = teamListRecord.id
      queryTeamParam.areaId = teamListRecord.albe0012

      const params = {
        id: teamListRecord.id,
        areaid: teamListRecord.albe0012,
      }

      apis
        .getTeamInfoFortis(params)
        .then((res) => {
          if (res.code === '0' || res.code === 0) {
            if (res.data) {
              baseTeamInfo.value = res.data
            }
          }
        })
        .catch((e) => {
          console.log(e, '+++')
        })
        .finally(() => {
          spinning.value = false
        })
    }
    onMounted(() => {
      getTeamRecord()
    })
    const getTeamRecord = () => {
      // 这里边要做判断,没有 teamInfo的话,进不去详情
      if (!LocalGetTeamViewInfo()) {
        router.push('/404')
      } else {
        getTeamInfo()
      }
    }
    return {
      spinning,
      activeTabKey,
      baseTeamInfo,
      queryTeamParam,
    }
  },
})
</script>

<style scoped lang="less">
.teamTabs {
  height: 100%;
}
.teamTabs {
  :deep(.ant-tabs-tabpane-active) {
    height: 100%;
  }
}
.teamTabs {
  :deep(.ant-tabs-tabpane-active .ant-table-wrapper) {
    height: 70%;
  }
}

.teamTabs :deep(.ant-tabs-nav div) {
  padding-left: 10px !important;
}
.teamTabs :deep(.ant-tabs-top-content) {
  height: 100%;
}
</style>
