<!-- 发布项目分步表单 -->
<template>
  <!-- <div style="background:#fff;margin:12px;">
    <a-tabs v-model:activeKey="activeKey" @change="change" :tabBarStyle="{ position: 'sticky', top: 0, zIndex: 999 }">
      <a-tab-pane key="1" tab="基本信息"> <ProjectBasicEdit :type="type" :projectId="projectId" :areaId="areaId"></ProjectBasicEdit></a-tab-pane>
      <a-tab-pane key="2" tab="项目岗位"><ProjectPostTable :type="type" :projectId="projectId" :areaId="areaId"></ProjectPostTable></a-tab-pane>
      <a-tab-pane key="3" tab="签到地点"><ProjectSelPlace :type="type" :projectId="projectId" :areaId="areaId"></ProjectSelPlace></a-tab-pane>
    </a-tabs>
  </div> -->
  <div style="background:#fff;margin:12px;">
    <a-card
      :tab-list="tabList"
      :active-tab-key="tabkey"
      @tabChange="(key) => onTabChange(key)"
      :bordered="false"
      :headStyle="{
        height: '56px',
        border: 0,
        fontSize: '18px',
        color: '#333',
        fontWeight: 'bold',
      }"
      :bodyStyle="{
        background: '#fff',
        height: height2,
        boxSizing: 'border-box',
        paddingTop: '16px',
        overflowY: 'auto',
        overflowX: 'hidden',
      }"
    >
      <div v-if="tabkey == 'tab1'">
        <ProjectBasicEdit></ProjectBasicEdit>
      </div>
      <div v-if="tabkey == 'tab2'">
        <ProjectPostTable></ProjectPostTable>
      </div>
      <div v-if="tabkey == 'tab3'">
        <ProjectSelPlace></ProjectSelPlace>
      </div>
    </a-card>
  </div>
</template>

<script>
import ProjectBasicEdit from './components/ProjectBasicEdit.vue'
import ProjectPostTable from './components/ProjectPostTable.vue'
import ProjectSelPlace from './components/ProjectSelPlace.vue'
import { defineComponent, ref, onBeforeMount, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue/es'
import { LocalGetProjectInfo, LocalSetProjectInfo } from '@/utils/localStorage.js'
export default defineComponent({
  components: {
    ProjectBasicEdit,
    ProjectPostTable,
    ProjectSelPlace,
  },
  setup() {
    const activeKey = ref('1')
    const route = useRoute()
    const tabkey = ref('tab1')
    const height2 = ref()
    const tabList = ref([
      {
        key: 'tab1',
        tab: '基本信息',
        active: 1,
      },
      {
        key: 'tab2',
        tab: '项目岗位',
        active: 2,
      },
      {
        key: 'tab3',
        tab: '签到地点',
        active: 3,
      },
    ])
    const query = ref(LocalGetProjectInfo())
    onMounted(() => {
      query.value.isRepair == true ? tabList.value.pop() : '' //补录项目不显示岗位tab页
    })
    const onTabChange = (key) => {
      if (LocalGetProjectInfo() && LocalGetProjectInfo().projectId) {
        tabkey.value = key
      } else {
        tabkey.value = 'tab1'
        message.warning('请先创建项目')
      }
    }
    onBeforeMount(() => {
      if (!LocalGetProjectInfo()) {
        LocalSetProjectInfo({})
      }
      getheight()
    })

    const getheight = () => {
      //监听窗口改变
      window.addEventListener('resize', getheight)
      nextTick(() => {
        const height = document.documentElement.clientHeight
        height2.value = height - 112 - 56 - 25 + 'px'
      })
    }
    return {
      query,
      tabkey,
      tabList,
      height2,
      onTabChange,
      activeKey,
    }
  },
})
</script>
<style scoped>
.ant-tabs-top-content.ant-tabs-content.ant-tabs-content-animated {
  margin-left: 0% !important;
  overflow: scroll !important;
  max-height: 800px !important;
}
</style>
