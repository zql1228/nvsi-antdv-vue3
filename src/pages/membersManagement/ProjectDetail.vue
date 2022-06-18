<template>
  <PageFormTableWrapper :showSearchForm="false">
    <template #table>
      <a-tabs type="card" class="teamTabs" @change="(e) => (activeTabKey = e)" :activeKey="activeTabKey">
        <a-tab-pane :key="tab.tabKey" v-for="tab in tabPanel">
          <template #tab>
            <span>{{ tab.name }} </span>
          </template>
          <keep-alive>
            <component :is="tab.component" :volunteerInfo="volunteerInfo"></component>
          </keep-alive>
        </a-tab-pane>
      </a-tabs>
    </template>
  </PageFormTableWrapper>
</template>
<script>
import { defineComponent, reactive, ref, toRefs, onMounted } from 'vue'
// import { LocalGetVolunteerInfo } from '@/utils/localStorage.js'
import DetailProjectInfo from './components/projectdetail/DetailProjectInfo'
import { useRouter } from 'vue-router'
import apis from '@/server/request'
export default defineComponent({
  component: { DetailProjectInfo },
  setup() {
    const activeTabKey = ref('1')
    const tabPanel = reactive([
      {
        tabKey: '1',
        name: '基本信息',
        icon: '',
        other: {
          auther: '李亚兵',
        },
        component: DetailProjectInfo,
      },
      {
        tabKey: '2',
        name: '岗位信息',
        icon: '',
        other: {
          desc: '可下载服务证明',
          auther: '李亚兵',
        },
        component: PositionInformation,
      },
      {
        tabKey: '3',
        name: '签到地点',
        icon: '',
        other: {
          auther: '李亚兵',
        },
        component: SignPlace,
      },
      {
        tabKey: '4',
        name: '经费信息',
        icon: '',
        other: {
          auther: '李亚兵',
        },
        component: FundInformation,
      },
      {
        tabKey: '5',
        name: '项目动态',
        icon: '',
        other: {
          auther: '胡圣峰',
        },
        component: ProjectDynamics,
      },
    ])
    const router = useRouter()
    const volunteerInfo = ref()

    onMounted(() => {})
    return {
      activeTabKey,
      tabPanel,
    }
  },
})
</script>
<style scoped lang="less">
.teamTabs :deep(.ant-tabs-nav div) {
  padding-left: 10px !important;
}
.teamTabs :deep(.ant-tabs-top-content) {
  max-height: 73vh;
  overflow-y: scroll;
}
</style>
