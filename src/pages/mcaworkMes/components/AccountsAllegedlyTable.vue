<template>
  <!-- 账号申诉表格 -->
  <IATable
    serviceName="getAccountAppealInfo"
    :searchParameter="searchFunc"
    ref="AuditTable"
    size="middle"
    :rowKey="(record) => record.id"
    :columns="AccountsAllegedlyColumns"
    :showHeader="true"
  >
    <template #total-title="{ totalData: total }">
      查询合计：志愿者人数
      <span>
        {{ total.totals }}
      </span>
      个
    </template>
    <!-- <template #albp1002="{ text, record }">
      <a href="javascript:void(0)" @click="toVolInfo(record)" :title="text">{{ text }}</a>
    </template> -->
    <template #albp1009="{ text }">
      {{ text == '1' ? '审核中' : text == '2' ? '审核通过' : text == '3' ? '审核未通过' : '-' }}
    </template>
    <template #action="record">
      <slot name="action" :record="record.record"> </slot>
    </template>
  </IATable>
</template>
<script>
import { defineComponent, reactive, ref, toRefs, onMounted, watch, nextTick } from 'vue'
import { LocalGetUserInfo, LocalSetVolunteerInfo } from '@/utils/localStorage.js'
import { AccountsAllegedlyColumns } from '../columns'
import { useRouter } from 'vue-router'
export default defineComponent({
  props: {
    activeKey: {
      type: String,
      default: '1',
    },
    queryParam: {
      type: Object,
      default: {},
    },
  },
  setup(props) {
    const router = useRouter()
    const userInfo = ref(LocalGetUserInfo())
    const AuditTable = ref()
    const searchFunc = () => {
      return {
        albp1010:
          props.queryParam.areaid.length > 0 && props.queryParam.areaid[props.queryParam.areaid.length - 1] == '100000000000000000'
            ? '000000000000000000'
            : props.queryParam.areaid.length > 0 && props.queryParam.areaid[props.queryParam.areaid.length - 1] != '100000000000000000'
            ? props.queryParam.areaid[props.queryParam.areaid.length - 1]
            : userInfo.value.areaLevel == '0'
            ? '000000000000000000'
            : userInfo.value.areaid,
        albp1002: props.queryParam.albp1002 ? props.queryParam.albp1002 : null, //姓名
        albp1003: props.queryParam.albp1003 ? props.queryParam.albp1003 : null, //身份证号
      }
    }

    const getList = (bool) => {
      AuditTable.value.refresh(bool)
    }

    const getheight = () => {
      AuditTable.value.getheight()
    }

    const toVolInfo = (record) => {
      LocalSetVolunteerInfo(record)
      router.push({ path: '/volunteerCmsDetails' })
    }

    return {
      props,
      AccountsAllegedlyColumns,
      getList,
      getheight,
      AuditTable,
      searchFunc,
      toVolInfo,
    }
  },
})
</script>
<style scoped></style>
