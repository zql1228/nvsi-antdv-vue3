<template>
  <!-- 4- 加入队伍 -->
  <div class="table-page-search-wrapper">
    <a-form ref="searchFormRef" :model="queryParam">
      <a-row :gutter="24">
        <a-col :md="5" :sm="24">
          <a-form-item label="队伍名称">
            <a-input v-model:value="queryParam.teamName" placeholder="" />
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
    serviceName="getVolunteerTeam"
    :searchParameter="searchFunc"
    ref="volJoinTeamTableRef"
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
import { VolJoinTeamTable } from './table'
import { refreshTableHook } from './useVolDetailsHook'
export default defineComponent({
  props: {
    volunteerInfo: {
      type: Object,
    },
  },
  setup(props) {
    const columns = reactive(VolJoinTeamTable.columns)
    const { queryParam, volJoinTeamTableRef, refreshTable, searchForm, resetForm } = refreshTableHook('volJoinTeamTableRef')

    const searchFunc = () => {
      const params = {
        teamname: queryParam.teamName,
        cardno: props.volunteerInfo.albp0005,
      }
      if (!queryParam.teamName) {
        delete params.teamname
      }
      return params
    }

    return {
      columns,
      searchFunc,
      queryParam,
      volJoinTeamTableRef,
      refreshTable,
      searchForm,
      resetForm,
    }
  },
})
</script>

<style scoped lang="less"></style>
