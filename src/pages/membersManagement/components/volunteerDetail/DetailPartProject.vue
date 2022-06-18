<template>
  <!-- 3- 参与项目 -->

  <div class="table-page-search-wrapper">
    <a-form ref="searchFormRef" :model="queryParam">
      <a-row :gutter="24">
        <a-col :md="5" :sm="24">
          <a-form-item label="项目名称">
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
    serviceName="getVolunteerProject"
    :searchParameter="searchFunc"
    ref="volJoinProTableRef"
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
import { VolJoinProjectTable } from './table'
import { refreshTableHook } from './useVolDetailsHook'
export default defineComponent({
  props: {
    volunteerInfo: {
      type: Object,
    },
  },
  setup(props) {
    const columns = reactive(VolJoinProjectTable.columns)
    const { queryParam, volJoinProTableRef, refreshTable, searchForm, resetForm } = refreshTableHook('volJoinProTableRef')
    const searchFunc = () => {
      const params = {
        proname: queryParam.proName,
        cardno: props.volunteerInfo.albp0005,
      }
      if (!queryParam.proName) {
        delete params.proname
      }
      return params
    }

    return {
      columns,
      searchFunc,
      queryParam,
      volJoinProTableRef,
      refreshTable,
      searchForm,
      resetForm,
    }
  },
})
</script>

<style scoped lang="less"></style>
