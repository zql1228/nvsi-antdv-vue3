<template>
  <!-- <PageFormTableWrapper :showSearchForm="false" :cus_search_Style="cus_search_Style" :cus_searchTable_Style="cus_searchTable_Style">
    <template #searchForm :style="{ padding: '0px' }"> -->
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
      <a-col :md="5" :sm="24">
        <a-form-item label="项目名称">
          <a-input v-model:value="queryParam.proName" placeholder="" />
        </a-form-item>
      </a-col>
      <a-col :md="5" :sm="24">
        <a-form-item label="项目类型">
          <a-select v-model:value="queryParam.selValue" @change="handleChange">
            <a-select-option value="4">运行中项目</a-select-option>
            <a-select-option value="5">已结项项目</a-select-option>
            <a-select-option value="6">补录项目</a-select-option>
            <a-select-option value="7">停用项目</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="5" :sm="24">
        <span class="table-page-search-submitButtons">
          <a-space>
            <a-button type="primary" @click="searchForm">查询</a-button>
            <a-button @click="resetForm">重置</a-button>
          </a-space>
        </span>
      </a-col>
    </a-row>
  </a-form>
  <!-- </template>
    <template #table> -->
  <IATable
    serviceName="listGroupPublishProjectFortis"
    :searchParameter="searchFunc"
    ref="publishProTable"
    size="middle"
    :rowKey="(record) => record.id"
    :columns="columns"
  >
    <template #total-title="{ totalData: total }">
      查询合计：项目数
      <span style="margin: 0 5px">
        {{ total.sumpro }}
      </span>
      个。
      <!-- 总服务时长
      <span>
        {{ total.sumtime }}
      </span>
      小时， 项目人数
      <span>
        {{ total.sumvol }}
      </span>
      人。 -->
    </template>
    <template #areanames="{ text: areanames }">
      {{ areanames ? areanames.join('>') : '-' }}
    </template>
    <template #time="{ record: data }">
      {{ moment(data.albx0004).format('YYYY-MM-DD') + ' ~ ' + moment(data.albx0005).format('YYYY-MM-DD') }}
    </template>
    <template #description="{ text: description }">
      {{ description }}
    </template>
    <template #action="{ record }">
      <!-- 状态(1 停用 2 启用 ) -->
      <a-space>
        <a-button type="primary" size="small" v-if="record.albx0073 == '21'" @click="handleSetProjectState(record, '2')"> 启用 </a-button>
        <a-button type="primary" size="small" v-else @click="handleSetProjectState(record, '1')"> 停用 </a-button>
        <a-button type="primary" size="small" @click="handleViewOperation(record)"> 操作记录 </a-button>
      </a-space>
    </template>
  </IATable>
  <!-- </template>
  </PageFormTableWrapper> -->

  <a-modal v-model:visible="modalVisible" title="停用/启用账户" @ok="handleSubDeactPro" @cancel="cancel">
    <div>
      <div style="font-size: 16px; font-weight: 600; margin-bottom: 10px">请输入原因：</div>
      <a-input v-model:value="reason" @change="changeMessage"></a-input>
      <span style="color: red" v-show="isShowMessage">请先先写原因</span>
    </div>
  </a-modal>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, provide } from 'vue'

import moment from 'moment'
import { PublishedProTable } from './tables/table'
import apis from '@/server/request'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import EventBus from '@/utils/bus'
import { message } from 'ant-design-vue'
export default defineComponent({
  props: {
    baseTeamInfo: {
      type: Object,
    },
  },
  components: {},
  setup(props) {
    const queryParam = reactive({
      proName: '',
      selValue: '4',
    })
    const userInfo = reactive(LocalGetUserInfo())
    const publishProTable = ref()
    const columns = ref(PublishedProTable.columns)
    const modalState = reactive({
      modalVisible: false,
      reason: '',
      proState: '',
      isShowMessage: false,
    })
    const currentRecord = ref()
    const cus_search_Style = reactive({
      padding: '0px',
    })
    const cus_searchTable_Style = reactive({
      padding: '0px',
    })

    // provide('searchForm_cus', {
    //   padding: '0px',
    // })
    // provide('searchForm_table_cus', {
    //   padding: '0px',
    // })

    const searchForm = () => {
      refreshTable()
    }
    const resetForm = () => {
      queryParam.proName = ''
      refreshTable()
    }
    const initModalState = () => {
      modalState.modalVisible = false
      modalState.reason = ''
      modalState.proState = ''
      modalState.isShowMessage = false
    }
    const refreshTable = () => {
      publishProTable.value.refresh(true)
    }

    // 停用
    const handleSetProjectState = async (record, proState) => {
      currentRecord.value = record
      modalState.type = proState
      modalState.modalVisible = true
    }
    const handleSubDeactPro = async () => {
      if (!modalState.reason) {
        modalState.isShowMessage = true
        return
      }
      const params = {
        areaid: currentRecord.value.albx0021, //	是	队伍区划
        type: modalState.type, //	是	状态（1 停用 2 启用 )
        id: currentRecord.value.id, //	是	项目id
        userFlag: userInfo.fullName, //	是	当前部门或队伍用户名
        albx5404: modalState.reason, // 原因
      }
      console.log(params)
      const res = await apis.setProjectFortis(params)
      if (res.code === '0' || res.code === 0) {
        refreshTable()
        message.success(res.message)
      } else {
        message.warning(res.message)
      }
      initModalState()
    }
    const cancel = () => {
      initModalState()
    }
    // 操作记录
    const handleViewOperation = (record) => {
      EventBus.emit('handleViewProOperation', { record })
    }
    const searchFunc = () => {
      const { baseTeamInfo } = props
      return {
        teamId: baseTeamInfo.id,
        albx0021: baseTeamInfo.areaid,
        albx0072: queryParam.selValue,
        // 查询字段
        albx0002: queryParam.proName,
      }
    }
    const handleChange = (value) => {
      refreshTable()
    }
    const changeMessage = (e) => {
      if (e.target.value) {
        modalState.isShowMessage = false
      } else {
        modalState.isShowMessage = true
      }
    }
    return {
      moment,
      columns,
      publishProTable,
      queryParam,
      handleChange,
      handleSetProjectState,
      handleViewOperation,
      searchFunc,
      searchForm,
      resetForm,
      ...toRefs(modalState),
      handleSubDeactPro,
      cancel,
      changeMessage,
      cus_search_Style,
      cus_searchTable_Style,
    }
  },
})
</script>

<style scoped lang="less"></style>
