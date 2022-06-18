<template>
  <IATable
    :serviceName="serviceName"
    :searchParameter="searchFunc"
    ref="whiteListTable"
    size="middle"
    :defaultDataSource="dataSource"
    :rowKey="(record) => record.id"
    :columns="columns"
  >
    <!--  :row-selection="{
      selectedRowKeys: selectedRowKeys,
      onChange: onSelectChange,
    }" -->
    <template #total-title="{totalData:total}">
      查询合计：计划列表共
      <span style="margin:0 5px">
        {{ total.count }}
      </span>
      条
    </template>
    <template #action="{record}">
      <slot name="action" :record="record"> </slot>
    </template>
  </IATable>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, onBeforeUnmount } from 'vue'
import { getWhiteListTable } from './columns'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import VueTypes from 'vue-types'
export default defineComponent({
  props: {
    queryParam: {
      type: Object,
    },
    serviceName: VueTypes.string.required,
    tableType: VueTypes.string.required,
  },
  emits: ['onSelectChange'],
  setup(props, { emit }) {
    const { columns, dataSource } = getWhiteListTable(props.tableType)
    const selectedRowKeys = ref([])
    const selectedRows = ref([])
    const whiteListTable = ref()
    const userInfo = reactive(LocalGetUserInfo())
    const onSelectChange = (selectedKeys, Rows) => {
      selectedRowKeys.value = selectedKeys
      selectedRows.value = Rows
      emit('onSelectChangePerList', Rows)
    }
    const searchFunc = () => {
      const { queryParam, tableType } = props
      console.log(queryParam, tableType, 'queryParam, tableType')
      if (tableType == 'whiteListManage') {
      }
      const { quAreaid, quIsRealName } = props.queryParam
      return {
        albp0063: quIsRealName, //实名1 或者未实名0
        // albp0090: '1', // 启用1 停用
        areaid: quAreaid[quAreaid.length - 1] || userInfo.areaid,
      }
    }
    return {
      columns,
      ...toRefs(props),
      dataSource,
      searchFunc,
      whiteListTable,
      selectedRowKeys,
      onSelectChange,
    }
  },
})
</script>

<style scoped lang="less"></style>
