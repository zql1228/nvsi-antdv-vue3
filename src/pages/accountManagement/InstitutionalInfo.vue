<!-- 管理部门 账户管理→机构信息 -->
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
              <a-form-item :label="activeKey == 3 ? '队伍名称' : '单位名称'" name="name">
                <a-input v-model:value="queryParam.name" :placeholder="activeKey == 3 ? '请输入队伍名称' : '请输入单位名称'"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="联系人姓名" name="personname">
                <a-input v-model:value="queryParam.personname" placeholder="请输入联系人姓名"></a-input>
              </a-form-item>
            </a-col>
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
            <InstitutionalInfoTable :activeKey="1" ref="InstitutionalInfoTable1" :queryParam="queryParam"></InstitutionalInfoTable>
          </a-tab-pane>
          <a-tab-pane
            key="2"
            tab="文明办管理部门"
            force-render
            v-if="userInfo.positionCNName == '民政部门管理员' || userInfo.positionCNName == '文明办'"
          >
            <InstitutionalInfoTable :activeKey="2" ref="InstitutionalInfoTable2" :queryParam="queryParam"></InstitutionalInfoTable>
          </a-tab-pane>
          <a-tab-pane key="3" tab="税务管理部门" v-if="userInfo.positionCNName == '民政部门管理员' || userInfo.positionCNName == '税务'">
            <InstitutionalInfoTable2 :activeKey="3" ref="InstitutionalInfoTable3" :queryParam="queryParam"></InstitutionalInfoTable2>
          </a-tab-pane>
        </a-tabs>
      </template>
    </PageFormTableWrapper>
  </div>
</template>

<script>
import moment from 'moment'
import { defineComponent, reactive, ref, watch, nextTick } from 'vue'
import InstitutionalInfoTable from './components/InstitutionalInfoTable.vue'
import InstitutionalInfoTable2 from './components/InstitutionalInfoTable2.vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
export default defineComponent({
  props: {
    projectType: {
      type: String,
      default: '0',
    },
  },
  components: {
    PlusOutlined,
    // pagination,
    InstitutionalInfoTable,
    InstitutionalInfoTable2,
  },
  setup(props) {
    const userInfo = ref(LocalGetUserInfo())
    const userFlag = ref(LocalGetUserInfo().userflag.substr(0, 3))
    const InstitutionalInfoTable1 = ref()
    const InstitutionalInfoTable2 = ref()
    const InstitutionalInfoTable3 = ref()
    const activeKey = ref('1') //tab页
    const searchFormRef = ref(null)
    const queryParam = reactive({
      areaid: [], //区划
      name: '', //单位名称
      personname: '', //负责人姓名
    })

    //重置
    const resetForm = (activeKey) => {
      searchFormRef.value.resetFields()
      activeKey == 1
        ? InstitutionalInfoTable1.value.getList(true)
        : activeKey == 2
        ? InstitutionalInfoTable2.value.getList(true)
        : InstitutionalInfoTable3.value.getList(true)
    }
    const refresh = (activeKey) => {
      //查询按钮
      activeKey == 1
        ? InstitutionalInfoTable1.value.getList(true)
        : activeKey == 2
        ? InstitutionalInfoTable2.value.getList(true)
        : InstitutionalInfoTable3.value.getList(true)
    }

    return {
      userInfo,
      userFlag,
      activeKey,
      InstitutionalInfoTable1,
      InstitutionalInfoTable2,
      InstitutionalInfoTable3,
      moment,
      // 查询条件参数
      queryParam,
      // mode, // recombination monomer
      searchFormRef,
      refresh,
      resetForm,
    }
  },
})
</script>
<style lang="scss" scoped></style>
