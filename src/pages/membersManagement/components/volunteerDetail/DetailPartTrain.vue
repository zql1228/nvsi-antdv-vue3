<template>
  <!-- 7- 参与培训 -->
  <div class="table-page-search-wrapper">
    <a-form ref="searchFormRef" :model="queryParam">
      <a-row :gutter="24">
        <a-col :md="5" :sm="24">
          <a-form-item label="培训名称">
            <a-input v-model:value="queryParam.proName" placeholder="" />
          </a-form-item>
        </a-col>
        <a-col :md="5" :sm="24">
          <span class="table-page-search-submitButtons">
            <a-space>
              <a-button type="primary" size="large" @click="searchForm">
                查询
              </a-button>
              <a-button size="large" @click="resetForm">重置</a-button>
            </a-space>
          </span>
        </a-col>
      </a-row>
    </a-form>
  </div>
  <IATable
    serviceName="getVolunteerTrain"
    :searchParameter="searchFunc"
    ref="volJoinTrainRef"
    size="middle"
    :rowKey="(record) => record.id"
    :columns="columns"
  >
    <template #total-title="{totalData:total}">
      <a-row class="header-bar">
        <div class="header-title table-total">
          查询合计：总数共 <span>{{ total.totals || 0 }}</span> 个。
        </div>
      </a-row>
    </template>
  </IATable>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs } from 'vue'
import { VolJsonTrainTable } from './table'
import { rpcPost } from '@/server/conf/index.js'
import { refreshTableHook } from './useVolDetailsHook'
export default defineComponent({
  props: {
    volunteerInfo: {
      type: Object,
    },
  },
  setup(props) {
    const columns = reactive(VolJsonTrainTable.columns)

    const searchFunc = () => {
      const params = {
        albp0029: props.volunteerInfo.albp0029, // props.volunteerInfo.albp0029,
        proname: queryParam.proName,
      }
      if (!queryParam.proName) {
        delete params.proname
      }
      return params
    }
    const { queryParam, volJoinTrainRef, refreshTable, searchForm, resetForm } = refreshTableHook('volJoinTrainRef')
    return {
      columns,
      searchFunc,
      queryParam,
      volJoinTrainRef,
      refreshTable,
      searchForm,
      resetForm,
    }
  },
})
</script>

<style scoped lang="less"></style>
