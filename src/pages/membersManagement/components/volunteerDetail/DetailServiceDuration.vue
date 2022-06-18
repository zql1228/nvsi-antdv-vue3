<template>
  <!-- 5- 服务时长 
  1,加  队伍名称查询
  2, 列表加  队伍名称（albe0002）
  -->
  <div class="table-page-search-wrapper">
    <a-form ref="searchFormRef" :model="queryParam">
      <a-row :gutter="24">
        <a-col :md="5" :sm="24">
          <a-form-item label="项目名称">
            <a-input v-model:value="queryParam.proName" placeholder="" />
          </a-form-item>
        </a-col>
        <a-col :md="5" :sm="24">
          <a-form-item label="队伍名称">
            <a-input v-model:value="queryParam.teamName" placeholder="" />
          </a-form-item>
        </a-col>
        <a-col :md="5" :sm="24">
          <a-form-item label="时长录入方式">
            <a-select ref="select" v-model:value="queryParam.albx0173">
              <a-select-option value="-1">全部</a-select-option>
              <a-select-option value="1">手动录入</a-select-option>
              <a-select-option value="2">申请录入</a-select-option>
              <a-select-option value="4">签到录入</a-select-option>
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
  </div>
  <IATable
    serviceName="timeFortis"
    :searchParameter="searchFunc"
    ref="volServiceDurationRef"
    size="middle"
    :rowKey="(record) => record.id"
    :columns="columns"
  >
    <template #total-title="{ totalData: total }">
      <a-row class="header-bar">
        <div class="header-title table-total">
          <!-- (total.sum * 1).toFixed(2) || 0 -->
          查询合计：总数共 <span>{{ total.totals }}</span> 个,总时长 <span>{{ total.sum ? (total.sum * 1).toFixed(2) : 0 }} </span>小时
        </div>
      </a-row>
    </template>
  </IATable>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs } from 'vue'
import { VolDurationTable } from './table'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { refreshTableHook } from './useVolDetailsHook'
export default defineComponent({
  props: {
    volunteerInfo: {
      type: Object,
    },
    volListRecord: {
      type: Object,
    },
  },
  setup(props) {
    const columns = reactive(VolDurationTable.columns)
    const userInfo = reactive(LocalGetUserInfo())
    const { queryParam, volServiceDurationRef, refreshTable, searchForm, resetForm } = refreshTableHook('volServiceDurationRef')
    const searchFunc = () => {
      const { volListRecord } = props
      console.log(volListRecord, '+++')
      return {
        cardno: props.volunteerInfo.albp0005,
        volid: props.volunteerInfo.albp0029, // 志愿者编号
        groupid: userInfo.team.groupid, // 队伍id
        proname: queryParam.proName, // 项目名称
        albe0002: queryParam.teamName, // 队伍名称
        albx0173: queryParam.albx0173, // 录入方式 1：	团体录入 2：手动录入 4：App录入
      }
    }

    return {
      columns,
      searchFunc,
      queryParam,
      volServiceDurationRef,
      refreshTable,
      searchForm,
      resetForm,
    }
  },
})
</script>

<style scoped lang="less"></style>
