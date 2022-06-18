<template>
  <div class="teamMember">
    <a-form ref="searchFormRef" :model="queryParam">
      <a-row :gutter="24" style="margin-left: 0px">
        <a-col :md="5" :sm="24">
          <a-form-item label="姓名">
            <a-input v-model:value="queryParam.VolName" placeholder="" />
          </a-form-item>
        </a-col>
        <a-col :md="5" :sm="24" style="margin-left: 20px">
          <a-space>
            <a-button type="primary" @click="searchForm">查询</a-button>
            <a-button @click="resetForm">重置</a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-form>
    <IATable
      serviceName="queryTeamMemberPageFortis"
      :searchParameter="searchFunc"
      ref="memberTable"
      size="middle"
      :rowKey="(record) => record.id"
      :columns="columns"
    >
      <template #total-title="{ totalData: total }">
        <a-row class="header-bar">
          <div class="header-title table-total">
            查询合计：队伍人数共 <span>{{ total.totals }}</span> 个。
          </div>
        </a-row>
      </template>
    </IATable>
  </div>
  <!-- <PageFormTableWrapper>
    <template #searchForm :style="{ padding: '0px' }">
      <a-form ref="searchFormRef" :model="queryParam">
        <a-row :gutter="24" style="margin-left: 0px">
          <a-col :md="5" :sm="24">
            <a-form-item label="姓名">
              <a-input v-model:value="queryParam.VolName" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24" style="margin-left: 20px">
            <a-space>
              <a-button type="primary" @click="searchForm">查询</a-button>
              <a-button @click="resetForm">重置</a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
    </template>
    <template #table>
      <IATable
        serviceName="queryTeamMemberPageFortis"
        :searchParameter="searchFunc"
        ref="memberTable"
        size="middle"
        :rowKey="(record) => record.id"
        :columns="columns"
      >
        <template #total-title="{ totalData: total }">
          <a-row class="header-bar">
            <div class="header-title table-total">
              查询合计：队伍人数共 <span>{{ total.totals }}</span> 个。
            </div>
          </a-row>
        </template>
      </IATable>
    </template>
  </PageFormTableWrapper> -->
</template>

<script>
import { defineComponent, reactive, ref, toRefs, onMounted, provide } from 'vue'
import { TeamMemberTable } from './table'
// import apis from '@/server/request'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import SearchFrom from '../SearchFrom'
export default defineComponent({
  props: {
    totalNum: {
      type: String,
    },
    baseTeamInfo: {
      type: Object,
    },
  },
  components: {
    SearchFrom,
  },
  setup(props) {
    const userInfo = ref(LocalGetUserInfo())
    const columns = ref(TeamMemberTable.columns)

    provide('searchForm_cus', {
      padding: '0px',
    })
    provide('searchForm_table_cus', {
      padding: '0px',
    })
    const queryParam = reactive({
      VolName: '',
    })
    const memberTable = ref()

    const refreshTable = () => {
      memberTable.value.refresh(true)
    }
    const searchForm = () => {
      refreshTable()
    }
    const resetForm = () => {
      queryParam.VolName = ''
      refreshTable()
    }
    const searchFunc = () => {
      const { baseTeamInfo } = props
      return {
        id: baseTeamInfo.id,
        areaId: baseTeamInfo.areaid,
        //成员管理查询条件
        name: queryParam.VolName,
      }
    }
    return {
      columns,
      memberTable,
      queryParam,
      ...toRefs(props),
      searchFunc,
      searchForm,
      resetForm,
    }
  },
})
</script>

<style scoped lang="less">
.nvsi-header-wrapper div {
  padding: 0 !important;
}
.teamMenberTable {
  :deep(.table-page-search-wrapper) {
    .ant-card {
      .ant-card-body {
        padding: 0px !important;
      }
    }
  }
}
// .nvsi-header-wrapper {
//   .table-page-search-wrapper {
//     padding: 0;
//     :deep(.ant-card .ant-card-body) {
//       padding: 0;
//     }
//   }
// }
</style>
