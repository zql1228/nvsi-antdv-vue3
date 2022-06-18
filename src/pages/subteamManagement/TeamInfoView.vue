<template>
  <!-- 队伍信息查看 -->
  <PageFormTableWrapper>
    <template #searchForm>
      <a-form ref="searchFormRef" :model="queryParam">
        <a-row :gutter="24">
          <a-col :md="5" :sm="24">
            <a-form-item label="队伍名称">
              <a-input v-model:value="queryParam.teamName" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="队伍状态">
              <a-select v-model:value="queryParam.teamStatus" @change="changeTeamStatus">
                <a-select-option value="1">启用</a-select-option>
                <a-select-option value="3">停用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-space>
                <a-button type="primary" size="large" @click="searchForm"> 查询 </a-button>
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
            <span> 直属团体 </span>
          </template>
          <TeamReviewTable
            tabsKey="direGroup"
            tableType="formal"
            :totalNum="total_direGroup"
            :queryParam="queryParam"
            ref="TeamReviewTable1"
          ></TeamReviewTable>
        </a-tab-pane>
        <a-tab-pane key="subGroup">
          <template #tab>
            <span>下级团体</span>
          </template>
          <TeamReviewTable
            tabsKey="subGroup"
            tableType="formal"
            :totalNum="total_subGroup"
            :queryParam="queryParam"
            ref="TeamReviewTable2"
          ></TeamReviewTable>
        </a-tab-pane>
        <a-tab-pane key="subOrgGroup">
          <template #tab>
            <span>下级组织</span>
          </template>
          <TeamReviewTable
            tabsKey="subOrgGroup"
            tableType="formal"
            :totalNum="total_subOrgGroup"
            :queryParam="queryParam"
            ref="TeamReviewTable3"
          ></TeamReviewTable>
        </a-tab-pane>
      </a-tabs>
      <!-- <TeamInfoUpdateDrawer></TeamInfoUpdateDrawer> -->
      <TeamQueryDrawer :visible="drawerData.visible" :item="drawerData.item" :activeKey="activeTabKey" @child="onClose1"></TeamQueryDrawer>
    </template>
  </PageFormTableWrapper>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, onBeforeUnmount, toRefs } from 'vue'
import TeamReviewTable from './common/tables/TeamReviewTable.vue'
import TeamInfoUpdateDrawer from './common/drawers/TeamInfoUpdateDrawer.vue'
import SearchFrom from './common/SearchFrom.vue'
import apis from '@/server/request'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { refreshReviewTableHook } from './Hooks/refreshTableHooks'
import TeamQueryDrawer from '@/pages/volunteerTeamManagement/drawer/TeamQueryDrawer'
import EventBus from '@/utils/bus'
export default defineComponent({
  components: {
    TeamReviewTable,
    TeamInfoUpdateDrawer,
    SearchFrom,
    TeamQueryDrawer,
  },
  setup() {
    const activeTabKey = ref('direGroup')
    const userInfo = reactive(LocalGetUserInfo())
    const queryParam = reactive({
      teamName: '',
      teamStatus: '1',
    })
    const { TeamReviewTable1, TeamReviewTable2, TeamReviewTable3, resetForm, searchForm } = refreshReviewTableHook(queryParam, activeTabKey)
    const totalGroup = reactive({
      total_direGroup: '',
      total_subGroup: '',
      total_subOrgGroup: '',
    })

    const drawerData = reactive({
      //修改按钮弹窗参数
      visible: false,
      item: {},
    })

    const onClose1 = (bool, activeKey) => {
      //修改队伍信息弹窗关闭
      drawerData.visible = false
      if (bool) {
        //为true 说明有数据变化 需刷新列表
        activeKey == 'direGroup'
          ? direGroup.value.getList(false)
          : activeKey == 'subGroup'
          ? subGroup.value.getList(false)
          : subOrgGroup.value.getList(false)
      }
    }

    const EventBusListener = () => {
      //点击修改队伍信息按钮调用
      EventBus.on('updateTeamInfo', (params) => {
        drawerData.item = params.record
        drawerData.visible = true
      })
    }

    const getTeamPageNumFortis = async () => {
      const params = {
        id: userInfo.team.groupid, // 'a6124ab7ced64a13b806c9418da42d84', // 队伍id
        type: '3', // 1 注册审核 2 变更审核 3.正式队伍
        areaId: userInfo.areaid, // '110101000000000000' //	服务区域
      }
      const res = await apis.getTeamPageNumFortis(params)
      if (res && res.data) {
        totalGroup.total_direGroup = res.data.zhishunum
        totalGroup.total_subGroup = res.data.xiajinum
        totalGroup.total_subOrgGroup = res.data.zuzhinum
      }
    }
    const changeTeamStatus = () => {
      searchForm()
    }
    onBeforeUnmount(() => {
      EventBus.off('updateTeamInfo')
    })

    onMounted(() => {
      getTeamPageNumFortis()
      EventBusListener()
    })

    return {
      ...toRefs(totalGroup),
      // tab切换 激活的key
      drawerData,
      activeTabKey,
      queryParam,
      resetForm,
      searchForm,
      TeamReviewTable1,
      TeamReviewTable2,
      TeamReviewTable3,
      changeTeamStatus,
      onClose1,
    }
  },
})
</script>

<style scoped lang="less">
.teamTabs :deep(.ant-tabs-nav div) {
  padding-left: 10px !important;
}
</style>
