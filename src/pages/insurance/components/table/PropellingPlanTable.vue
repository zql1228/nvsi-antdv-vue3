<template>
  <IATable
    serviceName="searchPushPlan"
    :searchParameter="searchFunc"
    ref="propellingPlanTable"
    size="middle"
    :rowKey="(record) => record.id"
    :columns="columns"
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
import { getPropellingPlanTable } from './columns'
export default defineComponent({
  props: {
    queryParam: {
      type: Object,
    },
  },
  setup(props) {
    const { columns, dataSource } = getPropellingPlanTable()
    const searchFunc = () => {
      const { queryParam } = props
      return {
        planname: queryParam.planname,
        employment: queryParam.employment,
      }
    }
    return {
      columns,
      searchFunc,
      dataSource,
    }
  },
})
</script>

<style scoped lang="less"></style>
