<template>
  <IATable
    :serviceName="serviceName"
    :searchParameter="searchFunc"
    ref="whiteProjectListTable"
    size="middle"
    :defaultDataSource="dataSource"
    :rowKey="(record) => record.id"
    :columns="columns"
    :row-selection="{
      selectedRowKeys: selectedRowKeys,
      onChange: onSelectChange,
    }"
  >
    <template #total-title="{totalData:total}">
      查询合计：计划列表共
      <span style="margin:0 5px">
        {{ total.totals }}
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
import { getWhiteProjectList } from './columns'
import VueTypes from 'vue-types'
import { LocalGetUserInfo } from '@/utils/localStorage.js'

export default defineComponent({
  props: {
    queryParam: {
      type: Object,
    },
    serviceName: VueTypes.string.required,
  },
  emits: ['onSelectChange'],

  setup(props, { emit }) {
    const { columns, dataSource } = getWhiteProjectList()
    const userInfo = reactive(LocalGetUserInfo())
    const selectedRowKeys = ref([])
    const selectedRows = ref([])
    const whiteProjectListTable = ref()
    const onSelectChange = (selectedKeys, Rows) => {
      selectedRowKeys.value = selectedKeys
      selectedRows.value = Rows
      emit('onSelectChangeProjList', Rows)
    }
    const searchFunc = () => {
      const { quAreaid, quProName, quProNum } = props.queryParam
      console.log(props.queryParam, 'props.queryParam')
      return {
        areaid: quAreaid[quAreaid.length - 1] || userInfo.areaid, // 区域id
        type: quAreaid.length, // 省市区
        albx0002: quProName, // 项目名称
        albx0013: quProNum, // 项目编号
      }
    }
    return {
      columns,
      dataSource,
      searchFunc,
      selectedRowKeys,
      onSelectChange,
      whiteProjectListTable,
    }
  },
})
</script>

<style scoped lang="less"></style>
