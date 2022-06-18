<template>
  <!-- 推送计划 -->
  <PageFormTableWrapper>
    <template #searchForm>
      <a-form :model="queryParam" class="nv-form">
        <a-row :gutter="24">
          <a-col :md="6" :sm="24">
            <a-form-item label="计划名称">
              <a-input placeholder="请输入计划名称" v-model:value="queryParam.planname" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="从业状态">
              <a-select v-model:value="queryParam.employment" :options="codeValue.nvsiInsWork" />
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
      <a-tabs v-model:activeKey="activeKey" type="card">
        <template #tabBarExtraContent>
          <a-button type="primary" style="margin-right:8px;" @click="handleCreatePlan">创建计划</a-button>
        </template>
        <a-tab-pane key="planList" tab="计划列表">
          <PropellingPlanTable ref="propellingPlanTableRef" :queryParam="queryParam">
            <template #action="{record}">
              <a-space>
                <a-button type="primary" size="small" @click="handleView(record)">
                  查看
                </a-button>
                <a-popconfirm :title="'是否确定删除?'" @confirm="handleDelete(record)">
                  <a-button size="small">
                    删除
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </PropellingPlanTable>
        </a-tab-pane>
      </a-tabs>
    </template>
  </PageFormTableWrapper>
  <CreatePlanDrawer
    :visible="createPlanVisible"
    :editType="editType"
    :viewRecord="viewRecord"
    @drawerClose="drawerClose"
    @refreshPropellingPlanTable="refreshPropellingPlanTable"
  ></CreatePlanDrawer>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, onBeforeUnmount } from 'vue'
import PropellingPlanTable from './components/table/PropellingPlanTable.vue'
import CreatePlanDrawer from './components/drawer/CreatePlanDrawer.vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import apis from '@/server/request'
import { message } from 'ant-design-vue'
import { getCodeValue } from './Hooks/useInsurTableHook'
export default defineComponent({
  components: {
    PropellingPlanTable,
    CreatePlanDrawer,
  },
  setup() {
    const activeKey = ref('planList')
    const editType = ref('none')
    const createPlanVisible = ref(false)
    const propellingPlanTableRef = ref()
    const codeValue = getCodeValue()
    const userInfo = reactive(LocalGetUserInfo())
    const viewRecord = ref({})
    const queryParam = reactive({
      planname: '',
      employment: '',
    })
    const handleCreatePlan = () => {
      createPlanVisible.value = true
      editType.value = 'add'
    }
    const handleView = async (record) => {
      editType.value = 'view'
      createPlanVisible.value = true
      viewRecord.value = record
    }
    const handleDelete = async (record) => {
      const params = { id: record.id }
      const res = await apis.deletePushPlan(params)
      if (res.code == '0') {
        refreshTable()
        message.success(res.message)
      } else {
        message.warning(res.message)
      }
      console.log(res, '+++res')
    }
    const drawerClose = () => {
      createPlanVisible.value = false
      editType.value = 'none'
    }
    const refreshTable = () => {
      propellingPlanTableRef.value.$refs.propellingPlanTable.refresh()
    }
    const refreshPropellingPlanTable = () => {
      refreshTable()
    }
    const searchForm = () => {
      refreshTable()
    }
    const resetForm = () => {
      queryParam.planname = ''
      queryParam.employment = ''
      refreshTable()
    }
    onMounted(() => {
      console.log(userInfo, 'log-----userInfo')
    })
    return {
      activeKey,
      codeValue,
      queryParam,
      handleCreatePlan,
      createPlanVisible,
      drawerClose,
      handleView,
      handleDelete,
      editType,
      propellingPlanTableRef,
      refreshPropellingPlanTable,
      viewRecord,
      searchForm,
      resetForm,
    }
  },
})
</script>

<style scoped lang="less"></style>
