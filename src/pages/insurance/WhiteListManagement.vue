<template>
  <!-- 白名单管理 -->
  <PageFormTableWrapper>
    <template #searchForm>
      <div class="table-page-search-wrapper">
        <a-form
          ref="searchFormRef"
          :model="queryParam"
          :rules="rules"
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
            <a-col :md="6" :sm="24">
              <a-form-item label="服务区域" name="quAreaid">
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
              <a-form-item label="是否实名" name="quIsRealName">
                <a-select v-model:value="queryParam.quIsRealName" :options="codeValue.nvsiAlbe0036"></a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="activeKey == 'activity'">
              <a-form-item label="活动名称" name="quProName">
                <a-input placeholder="请输入活动名称" v-model:value="queryParam.quProName" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="activeKey == 'activity'">
              <a-form-item label="活动编号" name="quProNum">
                <a-input placeholder="请输入活动编号" v-model:value="queryParam.quProNum" />
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
          </a-row>
        </a-form>
      </div>
    </template>
    <template #table>
      <a-tabs v-model:activeKey="activeKey" type="card" @change="changeTabKey">
        <template #tabBarExtraContent>
          <!-- <a-button type="primary" style="margin-right:8px;" @click="batchAddWhiteList">批量加入白名单</a-button> -->
        </template>
        <!-- 
        queryVolunteerInfor
         -->
        <a-tab-pane key="person" tab="人员">
          <WhiteListTable
            ref="whiteListTableRef"
            :queryParam="queryParam"
            serviceName="queryWhiteVolunteerInfor"
            tableType="whiteListManage"
            @onSelectChangePerList="onSelectChangePerList"
          >
            <template #action="{record}">
              <a-space>
                <a-button type="primary" size="small" @click="handleAddVolToWhiteList(record)">
                  加入白名单
                </a-button>
                <a-button type="primary" size="small" @click="handleViewVolInfo(record)">
                  查看
                </a-button>
              </a-space>
            </template>
          </WhiteListTable>
        </a-tab-pane>
        <a-tab-pane key="activity" tab="活动">
          <WhiteProjectListTable
            ref="whiteProjectListTableRef"
            :queryParam="queryParam"
            serviceName="managementDepartmentSelProjectFortis"
            @onSelectChangeProjList="onSelectChangeProjList"
          >
            <template #action="{record}">
              <a-space>
                <a-button type="primary" size="small" @click="handleAddProWhiteList(record)">
                  加入白名单
                </a-button>
                <a-button type="primary" size="small" @click="handleViewProject(record)">
                  查看
                </a-button>
              </a-space>
            </template>
          </WhiteProjectListTable>
        </a-tab-pane>
      </a-tabs>
      <ViewVolInfoDrawer :visible="visible" @drawerClose="drawerClose"></ViewVolInfoDrawer>
    </template>
  </PageFormTableWrapper>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, watch, toRefs, onBeforeUnmount, nextTick } from 'vue'
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import { LocalGetUserInfo, LocalSetProjectInfo } from '@/utils/localStorage.js'
import { useRouter } from 'vue-router'
import WhiteListTable from './components/table/WhiteListTable'
import WhiteProjectListTable from './components/table/WhiteProjectListTable'
import ViewVolInfoDrawer from './components/drawer/ViewVolInfoDrawer'
import { getCodeValue } from './Hooks/useInsurTableHook'
import apis from '@/server/request'
import { message } from 'ant-design-vue'
const { addVolunteerWhite } = apis
export default defineComponent({
  components: {
    DownOutlined,
    UpOutlined,
    WhiteListTable,
    WhiteProjectListTable,
    ViewVolInfoDrawer,
  },
  setup(props) {
    const queryParam = reactive({
      quAreaid: [], // 区域
      quUsername: '', // 姓名
      quIsRealName: '1', // 是否实名
      quProName: '', // 活动名称
      quProNum: '', // 项目编号
    })
    const router = useRouter()
    const userInfo = reactive(LocalGetUserInfo())
    const serAreaRef = ref()
    const whiteListTableRef = ref()
    const whiteProjectListTableRef = ref()
    const searchFormRef = ref()
    const advanced = ref(false)
    const visible = ref(false)
    const activeKey = ref('person')
    const codeValue = getCodeValue()

    const selectChangePerList = ref([])
    const selectChangeProjList = ref([])
    const rules = reactive({
      quAreaid: [
        {
          required: false,
          validator: async (rules, value) => {
            if (value.length >= 2) {
              return Promise.resolve()
            } else {
              return Promise.reject('区域选择必须选择到市级或者区级')
            }
          },
          trigger: 'change',
        },
      ],
    })
    const showExpand = () => {
      //展开或收起筛选区域 调用表格高度自适应方法
      advanced.value = !advanced.value
    }
    const changeTabKey = (e) => {
      activeKey.value = e
    }
    const onSelectChangePerList = (selectedRows) => {
      selectChangePerList.value = selectedRows
    }
    const onSelectChangeProjList = (selectedRows) => {
      selectChangeProjList.value = selectedRows
    }
    const batchAddWhiteList = () => {
      console.log('batchAddWhiteList', selectChangePerList, selectChangeProjList)
    }
    const searchForm = () => {
      if (activeKey.value == 'person') {
        searchFormRef.value
          .validate()
          .then((values) => {
            refreshTable()
          })
          .catch((e) => {
            console.log(e)
          })
      } else {
        refreshTable()
      }
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
    const handleAddProWhiteList = async (record) => {}
    const handleViewProject = (proInfo) => {
      let obj = {
        type: 'view', //查看
        isRepair: proInfo.albx0024 == 6 ? true : false, //是否是补录项目
        projectId: proInfo.id,
        areaId: proInfo.albx0021,
      }
      LocalSetProjectInfo(obj)
      router.push({
        path: '/publishInsProject',
      })
    }
    const handleAddVolToWhiteList = async (record) => {
      const { albp0003, albp0010, albp0081, albp0006, albp0020, albp0029, albp0005, albp0014, albp0034 } = record
      const params = {
        albp0003, //	姓名
        albp0010, //	手机号码
        albp0081, //	邮箱
        albp0006, //	性别
        albp0020, //	服务区域
        albp0029, //	志愿者编号
        albp0005, //	证件号码
        albp0014, //	出生日期
        albp0034, //	注册时间
      }
      const res = await addVolunteerWhite(params)
      if (res.code == '0') {
        refreshTable()
        message.success(res.message)
      } else {
        message.warning(res.message)
      }
      console.log(res, 'res')
      // console.log(record, 'record')
    }
    const handleViewVolInfo = (volInfo) => {
      visible.value = true
    }
    const drawerClose = () => {
      visible.value = false
    }
    watch(
      () => props.quAreaid,
      () => {
        // 这里监听
        console.log(props.quAreaid)
      }
    )
    onMounted(() => {
      nextTick(() => {
        serAreaRef.value.defaultInitArea([])
      })
    })
    return {
      queryParam,
      codeValue,
      advanced,
      visible,
      activeKey,
      showExpand,
      batchAddWhiteList,
      serAreaRef,
      whiteListTableRef,
      whiteProjectListTableRef,
      searchForm,
      resetForm,
      changeTabKey,
      handleAddProWhiteList,
      handleViewProject,
      rules,
      searchFormRef,
      onSelectChangePerList,
      onSelectChangeProjList,
      handleAddVolToWhiteList,
      handleViewVolInfo,
      drawerClose,
    }
  },
})
</script>

<style scoped lang="less"></style>
