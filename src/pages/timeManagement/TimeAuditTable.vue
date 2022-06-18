<!-- 时长审核 -->
<template>
  <PageFormTableWrapper>
    <template #searchForm>
      <a-form
        :label-col="{
          xs: { span: 24 },
          sm: { span: 6 },
        }"
        :wrapper-col="{
          xs: { span: 24 },
          sm: { span: 18 },
        }"
        ref="aduitRef"
        :model="queryParam"
      >
        <a-row :gutter="24">
          <a-col :md="6" :sm="24" v-if="areaLevel == 0">
            <a-form-item label="服务区域">
              <AreaDevNew :showAll="true" placeholder="请选择区域" v-model:value="queryParam.albx0021" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="姓名搜索" name="name">
              <a-input v-model:value="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="项目搜索" name="albp0002">
              <a-input v-model:value="queryParam.albp0002"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item>
              <a-space>
                <a-button type="primary" @click="search(1)">查询</a-button>
                <a-button @click="search(2)">重置</a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </template>
    <template #table>
      <IATable
        serviceName="timeDetailsFortisService"
        :searchParameter="getTimeAduit"
        ref="aduitTable"
        size="middle"
        :rowKey="(record) => record.id"
        :columns="columns"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
      >
        <template #total-title="{ totalData }">
          查询合计：志愿者人数
          <span>
            {{ totalData.person ? totalData.person : totalData.totals }}
          </span>
          人。
        </template>
        <template #total-action>
          <a-space>
            <a-button type="primary" @click="agree('')">
              <template #icon><PlusOutlined /></template>批量同意</a-button
            >
            <a-button type="primary" @click="refuse('')">
              <template #icon><MinusOutlined /></template>批量拒绝</a-button
            >
          </a-space>
        </template>
        <template #albx0172="{ record: val }"> {{ val.albx0172 }} 小时 </template>
        <template #action="{ record }">
          <a-space>
            <a-button size="small" type="primary" @click="toInfo(record)">详情</a-button>
            <a-button size="small" @click="agree(record)">同意</a-button>
            <a-button size="small" @click="refuse(record)">拒绝</a-button>
          </a-space>
        </template>
      </IATable>
      <TimeAuditDrawer :visible="visible" :item="item" @closeAuditDrawer="closeAuditDrawer"></TimeAuditDrawer>
    </template>
    <!-- 时长审核详情页 -->
  </PageFormTableWrapper>
</template>
<script>
import { Modal, message } from 'ant-design-vue'
import { defineComponent, reactive, ref, toRef, onMounted, watch, nextTick } from 'vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import apis from '@/server/request'
import TimeAuditDrawer from './common/drawers/TimeAuditDrawer'
import { AuditCom } from './common/tables/table.js'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons-vue'
import { hasSelected } from '@/pages/membersManagement/components/tables/hasSelected.js'
export default defineComponent({
  components: { TimeAuditDrawer, PlusOutlined, MinusOutlined, AuditCom },
  setup() {
    const userInfo = ref(LocalGetUserInfo())
    const areaLevel = userInfo.value.areaLevel
    const columns = ref(AuditCom.columns)
    const aduitRef = ref()
    const queryParam = reactive({
      name: '',
      albp0002: '',
      albx0021: [],
    })
    const aduitTable = ref()
    const selectedRowKeys = ref([]) // 批量选择
    const selectedRows = ref([])
    const visible = ref(false) //抽屉
    const item = ref() //抽屉传值
    onMounted(() => {})
    const onSelectChange = (RowKeys, Rows) => {
      // 批量选择
      selectedRowKeys.value = RowKeys
      selectedRows.value = Rows
    }
    const toInfo = (record) => {
      // 跳转审核详情
      selectedRowKeys.value = hasSelected(record, selectedRowKeys)
      const params = {
        areaid: record.albx0021, // ,
        id: record.id, // "111",时长表idTimeEntryDurationTable
        albx0057: record.albx0021, //项目id
        albx0053: record.albx0053, //志愿者编号,
      }
      // console.log(params, '志愿者详情入参')
      // timesFortisLogic
      apis.timesFortisService(params).then((res) => {
        if (res) {
          item.value = res
          item.value.id = record.id //时长表的id
          item.value.albx0021 = record.albx0021
          item.value.albx0057 = record.albx0057
          item.value.albx0053 = record.albx0053
          item.value.albp0005 = record.albp0005
          item.value.agree = agree
          item.value.refuse = refuse
          item.value.showbtn = 1
        }
        visible.value = true
      })
    }
    const closeAuditDrawer = () => {
      visible.value = false
      selectedRowKeys.value = []
    }
    // 点击同意的请求
    const agreedOrRefuseTimesFortisService = (params, val) => {
      // 同意
      if (val == 1) {
        console.log(params, 'params')
        apis.agreedTimesFortisService(params).then((res) => {
          console.log(res, 'res-----fo')
          if (res) {
            message.success(res)
            visible.value = false
            selectedRowKeys.value = []
            aduitTable.value.refresh(true)
          }
        })
      } else {
        // 拒绝
        apis.rejectTimesFortisService(params).then((res) => {
          if (res) {
            message.success(res)
            visible.value = false
            selectedRowKeys.value = []
            aduitTable.value.refresh(true)
          }
        })
      }
    }
    const search = (val) => {
      if (val == 2) {
        queryParam.name = ''
        queryParam.albp0002 = ''
        queryParam.albx0021 = []
      }
      aduitTable.value.refresh()
    }
    const agree = (record) => {
      // 同意
      const params = []
      if (record) {
        params.push({
          id: record.id, // 时长表id
          albx0021: record.albx0021,
          projectId: record.albx0057, // 项目id
          volunteerId: record.albx0053, // 志愿者id
          groupId: userInfo.value.team.groupid, // 队伍id
          albx0172: record.albx0172, // 服务时长
          albx181: record.albx0181,
          albx182: record.albx0182,
          cardno: record.albp0005,
        })
        agreedOrRefuseTimesFortisService(params, 1)
      } else {
        if (selectedRowKeys.value.length > 0) {
          Modal.confirm({
            title: '是否确认批量同意',
            cancelText: '取消',
            okText: '确认',
            onOk: () => {
              selectedRows.value.forEach((e) => {
                params.push({
                  id: e.id, // 时长表id
                  albx0021: e.albx0021, // this.userInfo.areaid
                  projectId: e.albx0057, // 项目id
                  volunteerId: e.albx0053, // 志愿者id
                  groupId: userInfo.value.team.groupid, // 队伍id
                  albx0172: e.albx0172, // 服务时长
                  albx181: e.albx0181,
                  albx182: e.albx0182,
                  cardno: e.albp0005,
                })
              })
              agreedOrRefuseTimesFortisService(params, 1)
            },
          })
        } else {
          Modal.info({
            title: '请勾选你需要批量同意的志愿者，点击志愿者名称左侧按钮即可勾选',
            oKtext: '关闭',
          })
        }
      }
      // console.log(params, '同意')
    }
    const refuse = (record) => {
      // 拒绝
      const params = []
      if (record) {
        params.push({
          id: record.id, // 时长表id
          albx0021: record.albx0021, // this.userInfo.areaid
          projectId: record.albx0057, // 项目id
          volunteerId: record.albx0053, // 志愿者id
          groupId: userInfo.value.team.groupid, // 队伍id
          albx0172: record.albx0172, // 服务时长
          albx181: record.albx0181,
          albx182: record.albx0182,
        })
        agreedOrRefuseTimesFortisService(params, 2)
      } else {
        if (selectedRowKeys.value.length > 0) {
          Modal.confirm({
            title: '是否确认批量拒绝',
            cancelText: '取消',
            okText: '确认',
            onOk: () => {
              selectedRows.value.forEach((e) => {
                params.push({
                  id: e.id, // 时长表id
                  albx0021: e.albx0021, // this.userInfo.areaid
                  projectId: e.albx0057, // 项目id
                  volunteerId: e.albx0053, // 志愿者id
                  groupId: userInfo.value.team.groupid, // 队伍id
                  albx0172: e.albx0172, // 服务时长
                  albx181: e.albx0181,
                  albx182: e.albx0182,
                })
              })
              agreedOrRefuseTimesFortisService(params, 2)
            },
          })
        } else {
          Modal.info({
            title: '请勾选你需要批量拒绝的志愿者，点击志愿者名称左侧按钮即可勾选',
            oKtext: '关闭',
          })
        }
      }
      console.log(params, '拒绝')
    }

    const reSet = () => {
      //重置
      searchFormRef.value.resetFields()
    }
    const getTimeAduit = () => {
      return {
        albx0021:
          userInfo.value.areaLevel == 0
            ? queryParam.albx0021.length > 0
              ? queryParam.albx0021[queryParam.albx0021.length - 1]
              : '100000000000000000'
            : userInfo.value.areaid, //区域
        albx0177: userInfo.value.team.groupid, //  // '队伍id'
        name: queryParam.name,
        albp0002: queryParam.albp0002,
      }
    }
    return {
      aduitRef,
      getTimeAduit,
      aduitTable,
      areaLevel,
      queryParam,
      columns,
      selectedRowKeys, // 批量选择
      onSelectChange,
      visible,
      item,
      toInfo,
      closeAuditDrawer,
      agree,
      refuse,
      search,
    }
  },
})
</script>
