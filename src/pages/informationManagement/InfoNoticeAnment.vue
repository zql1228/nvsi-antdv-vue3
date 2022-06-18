<template>
  <!-- 通知公告 -->
  <PageFormTableWrapper>
    <template #searchForm>
      <a-form :model="queryParam">
        <a-row :gutter="24">
          <a-col :md="6" :sm="24">
            <a-form-item label="公告标题">
              <a-input placeholder="请输入公告标题" v-model:value="queryParam.noticeTitle" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="通知类型">
              <a-select v-model:value="queryParam.sort">
                <a-select-option :value="item.value" v-for="item in optionList.noticeSelOption">{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchForm">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetForm">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </template>
    <template #table>
      <a-tabs
        type="card"
        class="teamTabs"
        @change="
          (e) => {
            activeTabKey = e
            refreshTable()
          }
        "
        :activeKey="activeTabKey"
      >
        <a-tab-pane key="unRead">
          <template #tab>未读通知</template>
          <InfoNoticeAnmentTable tabKey="unRead" ref="InfoNoticeAnmentComUnread" :queryParam="queryParam"></InfoNoticeAnmentTable>
        </a-tab-pane>
        <a-tab-pane key="read">
          <template #tab>已读通知</template>
          <InfoNoticeAnmentTable tabKey="read" ref="InfoNoticeAnmentComRead" :queryParam="queryParam"></InfoNoticeAnmentTable>
        </a-tab-pane>
        <template #tabBarExtraContent>
          <a-space v-show="activeTabKey == 'unRead'">
            <a-button type="primary" @click.prevent="handleBatchView">批量标为已读</a-button>
          </a-space>
          <a-space v-show="activeTabKey == 'read'">
            <a-button type="primary" @click.prevent="handleBatchDelete">批量删除</a-button>
          </a-space>
        </template>
      </a-tabs>
      <InfoNoticeAnmentDrawer></InfoNoticeAnmentDrawer>
    </template>
  </PageFormTableWrapper>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs } from 'vue'
import SearchFrom from './components/common/SearchFrom.vue'
import InfoNoticeAnmentTable from './components/tables/InfoNoticeAnmentTable.vue'
import InfoNoticeAnmentDrawer from './components/drawers/InfoNoticeAnmentDrawer.vue'
import { refreshInfoNoticeTableHook, searchSelectOptionHook } from './Hooks/useSearchFormHook'
import { message } from 'ant-design-vue'
import apis from '@/server/request'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
export default defineComponent({
  components: {
    SearchFrom,
    InfoNoticeAnmentTable,
    InfoNoticeAnmentDrawer,
  },
  setup() {
    const activeTabKey = ref('unRead')
    const queryParam = reactive({
      noticeTitle: '',
      sort: '',
    })

    const { InfoNoticeAnmentComUnread, InfoNoticeAnmentComRead, resetForm, searchForm, refreshTable } = refreshInfoNoticeTableHook(queryParam)
    const optionList = searchSelectOptionHook()
    const userInfo = ref(LocalGetUserInfo())
    // 批量标为已读
    const handleBatchView = async () => {
      let selectedRowKeys = InfoNoticeAnmentComUnread.value.selectedRowKeys
      if (selectedRowKeys.length == 0) {
        return message.warning('请先选择要标记的公告')
      }
      const bean = []
      selectedRowKeys.forEach((selId) => {
        let obj = {
          bulletinid: selId,
          userid: userInfo.value.userid,
        }
        bean.push(obj)
      })
      console.log(bean, 'bean.....通知公告')
      const res = await apis.updateManyBulletinOnRead(bean)
      // const res = await apis.deleteManyBulletin(bean)
      console.log(res, 'res.....')
      if (res && res.code === 0) {
        refreshTable()
        message.success(res.message)
      } else {
        message.warning(res.message)
      }
    }
    const handleBatchDelete = async () => {
      let selectedRowKeys = InfoNoticeAnmentComRead.value.selectedRowKeys
      if (selectedRowKeys.length == 0) {
        return message.warning('请先选择要删除的公告')
      }
      const bean = []
      selectedRowKeys.forEach((selId) => {
        let obj = {
          bulletinid: selId,
          userid: userInfo.value.userid,
        }
        bean.push(obj)
      })
      console.log(bean, 'bean.....删除通知公告')
      const res = await apis.deleteManyBulletin(bean)
      console.log(res, 'res.....')
      if (res && res.code === 0) {
        refreshTable()
        message.success(res.message)
      } else {
        message.warning(res.message)
      }
    }
    return {
      queryParam,
      InfoNoticeAnmentComUnread,
      InfoNoticeAnmentComRead,
      resetForm,
      searchForm,
      activeTabKey,
      handleBatchView,
      handleBatchDelete,
      optionList,
      refreshTable,
    }
  },
})
</script>

<style scoped lang="less">
.teamTabs :deep(.ant-tabs-nav div) {
  padding-left: 10px !important;
}
</style>
