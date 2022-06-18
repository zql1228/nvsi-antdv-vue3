<template>
  <a-modal title="选择本队伍内志愿者" class="orgModal" :visible="visible" @cancel="handleCancel" @ok="handleConfirmSel" width="60vw">
    <div style="width: 100%; height:45px"><span style="font-size: 20px; color:red">请选择志愿者</span></div>
    <a-form ref="formQueryVolRef" :model="queryVolParam">
      <a-row :gutter="24">
        <a-col :span="9">
          <a-form-item label="志愿者姓名">
            <a-input v-model:value="queryVolParam.volName" placeholder="请输入志愿者姓名" />
          </a-form-item>
        </a-col>
        <a-col :span="9">
          <a-form-item label="身份证号">
            <a-input v-model:value="queryVolParam.volCard" placeholder="请输入志愿者身份证号" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <span>
            <a-button type="primary" @click="searchForm">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetForm">重置</a-button>
          </span>
        </a-col>
      </a-row>
    </a-form>
    <IATable
      serviceName="queryTeamMemberPageFortis"
      ref="teamMenberTable"
      size="middle"
      :rowKey="(record) => record.id"
      :columns="columns"
      :searchParameter="searchFunc"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
    >
      <template #action="{record}">
        <a-button type="primary" size="small" @click="handleSelectVol(record)">
          选择
        </a-button>
      </template>
    </IATable>
  </a-modal>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, watch, onBeforeUnmount, nextTick } from 'vue'
import { teamVolTable } from '../drawers/addTrainVolTable'
import { LocalGetUserInfo } from '@/utils/localStorage.js'

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    teamQueryParam: {
      type: Object,
    },
  },
  setup(props, { emit }) {
    const columns = ref(teamVolTable.columns)
    const queryVolParam = reactive({
      volName: null,
      volCard: null,
    })
    const userInfo = ref(LocalGetUserInfo())
    const formQueryVolRef = ref()
    const teamMenberTable = ref()
    const selectRecordList = reactive({
      selectedRowKeys: [],
      selectedRows: [],
    })
    const searchForm = () => {
      refreshTeamMemberTable()
    }
    const resetForm = () => {
      queryVolParam.volName = ''
      queryVolParam.volCard = ''
      refreshTeamMemberTable()
    }
    const clearSelectVol = () => {
      selectRecordList.selectedRowKeys = []
      selectRecordList.selectedRows = []
    }
    const handleCancel = () => {
      emit('handleCancel')
      clearSelectVol()
    }
    const searchFunc = () => {
      const { teamQueryParam } = props
      return {
        id: teamQueryParam.id,
        areaid: teamQueryParam.areaid,
        name: queryVolParam.volName,
        albp0005: queryVolParam.volCard,
      }
    }
    const refreshTeamMemberTable = () => {
      nextTick(() => {
        teamMenberTable.value.refresh()
      })
    }
    const onSelectChange = (selectedKeys, selectedRows) => {
      selectRecordList.selectedRowKeys = selectedKeys
      selectRecordList.selectedRows = selectedRows
    }
    const handleConfirmSel = () => {
      emit('handleSelectVol', { records: selectRecordList.selectedRows })
      emit('handleCancel')
      clearSelectVol()
    }
    const handleSelectVol = (record) => {
      emit('handleSelectVol', { records: [record] })
      emit('handleCancel')
    }
    watch(
      () => props.visible,
      () => {
        refreshTeamMemberTable()
      }
    )
    return {
      handleCancel,
      queryVolParam,
      formQueryVolRef,
      searchForm,
      resetForm,
      columns,
      teamMenberTable,
      searchFunc,
      ...toRefs(selectRecordList),
      onSelectChange,
      handleSelectVol,
      handleConfirmSel,
    }
  },
})
</script>

<style scoped lang="less">
.orgModal {
  z-index: 1500;
}
</style>
