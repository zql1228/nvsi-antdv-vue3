<!-- 管理部门 账户管理→用户信息 -->
<template>
  <div>
    <!-- recombination monomer -->
    <PageFormTableWrapper>
      <template #searchForm>
        <a-form
          ref="searchFormRef"
          :model="queryParam"
          :label-col="{
            style: {
              width: '100px',
            },
          }"
          :wrapper-col="{
            xs: { span: 24 },
            sm: { span: 18 },
          }"
        >
          <a-row :gutter="24">
            <a-col :md="6" :sm="24">
              <a-form-item label="服务区域">
                <macArea placeholder="请选择区域" v-model:value="queryParam.areaid" :islevel="false"></macArea>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item :label="activeKey == 3 ? '队伍名称' : '管理员名称'" name="name">
                <a-input v-model:value="queryParam.name" :placeholder="activeKey == 3 ? '请输入队伍名称' : '请输入管理员名称'"></a-input>
              </a-form-item>
            </a-col>
            <!-- <a-col :md="6" :sm="24">
              <a-form-item label="信息是否完善" name="ttt">
                <a-select ref="select" v-model:value="queryParam.ttt">
                  <a-select-option value="2">已完善</a-select-option>
                  <a-select-option value="1">未完善</a-select-option>
                </a-select>
              </a-form-item>
            </a-col> -->
            <a-col :md="5" :sm="24">
              <a-form-item>
                <a-space>
                  <a-button type="primary" @click="refresh(activeKey)">
                    查询
                  </a-button>
                  <a-button @click="resetForm(activeKey)">
                    重置
                  </a-button>
                </a-space>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </template>
      <template #table>
        <a-tabs type="card" v-model:activeKey="activeKey">
          <!-- 民政部门管理员    文明办   税务  区分账号类型 民政部门管理员显示全部tab页 文明办只显示文明办 税务显示税务 -->
          <a-tab-pane key="1" tab="民政管理部门" v-if="userInfo.positionCNName == '民政部门管理员'">
            <UserInformationTable :activeKey="1" ref="UserInformationTab1" :queryParam="queryParam"></UserInformationTable>
          </a-tab-pane>
          <a-tab-pane
            key="2"
            tab="文明办管理部门"
            force-render
            v-if="userInfo.positionCNName == '民政部门管理员' || userInfo.positionCNName == '文明办'"
          >
            <UserInformationTable :activeKey="2" ref="UserInformationTab2" :queryParam="queryParam"></UserInformationTable>
          </a-tab-pane>
          <a-tab-pane key="3" tab="税务管理部门" v-if="userInfo.positionCNName == '民政部门管理员' || userInfo.positionCNName == '税务'">
            <UserInformationTable2 :activeKey="3" ref="UserInformationTab3" :queryParam="queryParam"></UserInformationTable2>
          </a-tab-pane>
        </a-tabs>
      </template>
    </PageFormTableWrapper>
  </div>
</template>

<script>
import moment from 'moment'
import { defineComponent, reactive, ref, watch, nextTick } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import UserInformationTable from './components/UserInformationTable'
import UserInformationTable2 from './components/UserInformationTable2'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
export default defineComponent({
  props: {},
  components: {
    PlusOutlined,
    UserInformationTable,
    UserInformationTable2,
  },
  setup() {
    const activeKey = ref('1') //tab页
    const userInfo = ref(LocalGetUserInfo())
    const searchFormRef = ref(null)
    const queryParam = reactive({
      areaid: [],
      name: '', //管理员名称
    })
    const confirmLoading = ref(false)
    const UserInformationTab1 = ref()
    const UserInformationTab2 = ref()
    const UserInformationTab3 = ref()

    //重置
    const resetForm = (activeKey) => {
      searchFormRef.value.resetFields()
      activeKey == 1
        ? UserInformationTab1.value.getList(true)
        : activeKey == 2
        ? UserInformationTab2.value.getList(true)
        : UserInformationTab3.value.getList(true)
    }

    const refresh = (activeKey) => {
      //查询按钮
      activeKey == 1
        ? UserInformationTab1.value.getList(true)
        : activeKey == 2
        ? UserInformationTab2.value.getList(true)
        : UserInformationTab3.value.getList(true)
    }

    return {
      userInfo,
      activeKey,
      UserInformationTab1,
      UserInformationTab2,
      UserInformationTab3,
      moment,
      queryParam,
      searchFormRef,
      confirmLoading,
      refresh,
      resetForm,
    }
  },
})
</script>
<style lang="scss" scoped></style>
