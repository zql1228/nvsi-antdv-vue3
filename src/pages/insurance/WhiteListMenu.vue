<template>
  <!-- 白名单管理 -->
  <PageFormTableWrapper>
    <template #searchForm>
      <div class="table-page-search-wrapper">
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
            <a-col :md="6" :sm="24" v-show="activeKey == 'person'">
              <a-form-item label="姓名" name="quName">
                <a-input placeholder="请输入姓名" v-model:value="queryParam.quName" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="activeKey == 'activity'">
              <a-form-item label="活动名称" name="quName">
                <a-input placeholder="请输入活动名称" v-model:value="queryParam.quName" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item>
                <a-space>
                  <a-button type="primary" @click="searchForm">查询</a-button>
                  <a-button @click="resetForm">重置</a-button>
                </a-space>
              </a-form-item>
            </a-col>
            <!-- <a-col :md="6" :sm="24">
              <a-form-item label="服务区域">
                <AreaDevNew
                  placeholder="请选择服务区域"
                  style="width:100%"
                  :showAll="true"
                  :type="false"
                  v-model:value="queryParam.quAreaid"
                  ref="serAreaRef"
                ></AreaDevNew>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="activeKey == 'person'">
              <a-form-item label="用户名" name="quUsername">
                <a-input placeholder="请输入用户名" v-model:value="queryParam.quUsername" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="activeKey == 'person'">
              <a-form-item label="从业状况" name="quWork">
                <a-select v-model:value="queryParam.quWork" :options="codeValue.nvsiInsWork"></a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="activeKey == 'activity'">
              <a-form-item label="活动名称" name="quProName">
                <a-input placeholder="请输入活动名称" v-model:value="queryParam.quProName" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="advanced && activeKey == 'activity'">
              <a-form-item label="负责人" name="quDutyPerson">
                <a-input placeholder="请输入负责人" v-model:value="queryParam.quDutyPerson" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="(advanced && activeKey == 'person') || activeKey == 'activity'">
              <a-form-item label="服务类别" name="quServerType">
                <a-select v-model:value="queryParam.quServerType" :options="codeValue.nvsiInserverType"></a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item>
                <a-space>
                  <a-button type="primary" @click="searchForm">查询</a-button>
                  <a-button @click="resetForm">重置</a-button>
                  <a style="margin-left: 8px" @click="showExpand">
                    {{ advanced ? '收起筛选' : '展开筛选' }}
                    <UpOutlined v-if="advanced" />
                    <DownOutlined v-if="!advanced" />
                  </a>
                </a-space>
              </a-form-item>
            </a-col> -->
          </a-row>
        </a-form>
      </div>
    </template>
    <template #table>
      <a-tabs v-model:activeKey="activeKey" type="card" @change="changeTabKey">
        <template #tabBarExtraContent>
          <!-- <a-button type="primary" style="margin-right:8px;" @click="batchAddWhiteList">批量加入白名单</a-button> -->
        </template>
        <a-tab-pane key="person" tab="人员">
          <WhiteListTable ref="whiteListTableRef" :queryParam="queryParam" serviceName="searchVolunteerWhite" tableType="whiteListMenu">
            <template #action="{record}">
              <a-space>
                <a-button type="primary" size="small" @click="handleRemoveVolWhite(record)">
                  移出白名单
                </a-button>
                <a-button type="primary" size="small" @click="handleViewVol(record)">
                  查看
                </a-button>
              </a-space>
            </template>
          </WhiteListTable>
        </a-tab-pane>
        <a-tab-pane key="activity" tab="活动">
          <WhiteProjectListTable ref="whiteProjectListTableRef" :queryParam="queryParam">
            <template #action="{record}">
              <a-space>
                <a-button type="primary" size="small">
                  移出白名单
                </a-button>
                <a-button type="primary" size="small">
                  查看
                </a-button>
              </a-space>
            </template>
          </WhiteProjectListTable>
        </a-tab-pane>
      </a-tabs>
    </template>
  </PageFormTableWrapper>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, onBeforeUnmount, nextTick } from 'vue'
import { getCodeValue } from './Hooks/useInsurTableHook'
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import WhiteListTable from './components/table/WhiteListTable'
import WhiteProjectListTable from './components/table/WhiteProjectListTable'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import apis from '@/server/request'
import { message } from 'ant-design-vue'
const { removeVolunteerWhite } = apis
export default defineComponent({
  components: {
    DownOutlined,
    UpOutlined,
    WhiteListTable,
    WhiteProjectListTable,
  },
  setup() {
    const queryParam = reactive({
      quAreaid: [], // 区域
      quServerType: '', // 服务类别

      quUsername: '', // 用户名
      quWork: '', // 从业状况

      quProName: '', // 活动名称
      quDutyPerson: '', // 负责人

      quName: '', // 姓名 或者项目名
    })
    const userInfo = reactive(LocalGetUserInfo())
    const serAreaRef = ref()
    const whiteListTableRef = ref()
    const whiteProjectListTableRef = ref()
    const advanced = ref(false)
    const activeKey = ref('person')
    const codeValue = getCodeValue()
    const showExpand = () => {
      //展开或收起筛选区域 调用表格高度自适应方法
      advanced.value = !advanced.value
    }
    const changeTabKey = (e) => {
      activeKey.value = e
    }
    const batchAddWhiteList = () => {}
    const searchForm = () => {
      refreshTable()
    }
    const resetForm = () => {}
    const refreshTable = () => {
      if (activeKey.value == 'person') {
        whiteListTableRef.value.$refs.whiteListTable.refresh()
      }
      if (activeKey.value == 'activity') {
        whiteProjectListTableRef.value.$refs.whiteProjectListTable.refresh()
      }
    }
    const handleRemoveVolWhite = async (record) => {
      console.log(record, 'uuuu')
      const res = await removeVolunteerWhite({ id: record.id })
      if (res.code == '0') {
        refreshTable()
        message.success(res.message)
      } else {
        message.warning(res.message)
      }
    }
    const handleViewVol = (record) => {}
    onMounted(() => {
      nextTick(() => {
        // serAreaRef.value.defaultInitArea([userInfo.areaid])
      })
    })
    return {
      queryParam,
      codeValue,
      advanced,
      activeKey,
      showExpand,
      batchAddWhiteList,
      serAreaRef,
      whiteListTableRef,
      whiteProjectListTableRef,
      searchForm,
      resetForm,
      changeTabKey,
      handleRemoveVolWhite,
      handleViewVol,
    }
  },
})
</script>

<style scoped lang="less"></style>
