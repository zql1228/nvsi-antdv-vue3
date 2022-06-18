<template>
  <PageFormTableWrapper :showSearchForm="false">
    <template #table>
      <a-tabs type="card" class="teamTabs" @change="(e) => (activeTabKey = e)" :activeKey="activeTabKey">
        <a-tab-pane :key="tab.tabKey" v-for="tab in tabPanel">
          <template #tab>
            <span>{{ tab.name }} </span>
          </template>
          <keep-alive>
            <component :is="tab.component" :volunteerInfo="volunteerInfo" :volListRecord="volRecordInfo"></component>
          </keep-alive>
        </a-tab-pane>
      </a-tabs>
    </template>
  </PageFormTableWrapper>
</template>
<script>
import { defineComponent, reactive, ref, toRefs, onMounted, shallowRef } from 'vue'
import DetailPartProject from './components/volunteerDetail/DetailPartProject.vue'
import DetailVolCard from './components/volunteerDetail/DetailVolCard.vue'
import DetailVolunteerInfo from './components/volunteerDetail/DetailVolunteerInfo.vue'
import DetailJoinTeam from './components/volunteerDetail/DetailJoinTeam.vue'
import DetailServiceDuration from './components/volunteerDetail/DetailServiceDuration.vue'
import DetailServiceEvaluation from './components/volunteerDetail/DetailServiceEvaluation.vue'
import DetailPartTrain from './components/volunteerDetail/DetailPartTrain.vue'
import DetailGetRecognition from './components/volunteerDetail/DetailGetRecognition.vue'
import { LocalGetVolunteerInfo } from '@/utils/localStorage.js'
import { useRouter } from 'vue-router'
import apis from '@/server/request'
export default defineComponent({
  component: {
    DetailPartProject,
    DetailVolCard,
    DetailVolunteerInfo,
    DetailJoinTeam,
    DetailServiceDuration,
    DetailServiceEvaluation,
    DetailPartTrain,
    DetailGetRecognition,
  },
  setup() {
    const activeTabKey = ref('1')
    const volRecordInfo = reactive(LocalGetVolunteerInfo())
    const tabPanel = shallowRef([
      {
        tabKey: '1',
        name: '基本信息',
        icon: '',
        other: {
          auther: '李亚兵',
        },
        component: DetailVolunteerInfo,
      },
      {
        tabKey: '2',
        name: '志愿者证',
        icon: '',
        other: {},
        component: DetailVolCard,
      },
      {
        tabKey: '3',
        name: '参与项目',
        icon: '',
        other: {
          desc: '可下载服务证明',
          auther: '李亚兵',
        },
        component: DetailPartProject,
      },
      {
        tabKey: '4',
        name: '加入队伍',
        icon: '',
        other: {
          auther: '李亚兵',
        },
        component: DetailJoinTeam,
      },
      // {
      //   tabKey: '6',
      //   name: '服务评价',
      //   icon: '',
      //   other: {
      //     auther: '李亚兵',
      //   },
      //   component: DetailServiceEvaluation,
      // },
      {
        tabKey: '5',
        name: '服务时长',
        icon: '',
        other: {
          auther: '胡圣峰',
        },
        component: DetailServiceDuration,
      },
      // {
      //   tabKey: '7',
      //   name: '参与培训',
      //   icon: '',
      //   other: {
      //     auther: '',
      //   },
      //   component: DetailPartTrain,
      // },
      // {
      //   tabKey: '8',
      //   name: '获得表彰',
      //   icon: '',
      //   other: {
      //     auther: '胡圣峰',
      //   },
      //   component: DetailGetRecognition,
      // },
    ])
    const router = useRouter()
    const volunteerInfo = ref()

    const getVolunteerInfo = async () => {
      const params = {
        cardno: volRecordInfo.albp0005,
      }
      volunteerInfo.value = await apis.getVolunteerInfo(params)
      console.log(volunteerInfo, 'volunteerInfo')
    }
    onMounted(() => {
      if (!volRecordInfo) {
        router.push('/404')
      } else {
        getVolunteerInfo()
      }
    })
    return {
      activeTabKey,
      tabPanel,
      volunteerInfo,
      volRecordInfo,
    }
  },
})
</script>
<style scoped lang="less">
.teamTabs {
  height: 110%;
}
.teamTabs :deep(.ant-tabs-nav div) {
  padding-left: 10px !important;
}
.teamTabs :deep(.ant-tabs-top-content) {
  overflow-y: scroll;
  overflow-x: hidden;
  height: 90%;
}
.teamTabs :deep(.ant-tabs-tabpane-active) {
  height: 90%;
}
</style>
