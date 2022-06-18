<template>
  <IATable
    :serviceName="level == '全国' || level == '省' ? 'queryRealNameOnCountry' : 'queryVolunteerInfor'"
    :searchParameter="searchFunc"
    :isMc="false"
    ref="AuditTable"
    size="middle"
    :rowKey="(record) => record.id"
    :columns="AuditTableColumns"
    :showHeader="true"
  >
    <template #total-title="{ totalData: total }">
      查询合计：志愿者人数
      <span>
        {{ total.count }}
      </span>
      个
    </template>
    <template #albp0003="{ text, record }">
      <a href="javascript:void(0)" @click="toVolInfo(record)" :title="text">{{ text }}</a>
    </template>
    <template #albp0006="{ text }">
      {{ text == '1' ? '男' : text == '2' ? '女' : '-' }}
    </template>
    <template #albp0004="{ text }">
      {{
        text == '01'
          ? '内地居民身份证'
          : text == '02'
          ? '香港居民身份证'
          : text == '03'
          ? '澳门居民身份证'
          : text == '04'
          ? '台湾居民身份证'
          : text == '05'
          ? '护照'
          : text == '06'
          ? '军官证'
          : text == '07'
          ? '士兵证'
          : text == '99'
          ? '其他有效国籍旅行证件'
          : '-'
      }}
    </template>
    <template #albp0063="{ text }">
      {{ text == '0' ? '认证未通过' : text == '1' ? '认证通过' : text == '2' ? '审核中' : '-' }}
    </template>
    <template #action="record">
      <slot name="action" :record="record.record"> </slot>
    </template>
  </IATable>
</template>
<script>
import { defineComponent, reactive, ref, toRefs, onMounted, watch, nextTick } from 'vue'
import { LocalGetUserInfo, LocalSetVolunteerInfo } from '@/utils/localStorage.js'
import { AuditTableColumns } from '../table'
import { getLevel } from '@/utils/publicMethods/common'
import { useRouter } from 'vue-router'
import moment from 'moment'
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
    const areaid = ref() //当前查询数据所用区划
    const level = ref() //当前查询数据所用区划级别 0全国 1省 2市 3区
    const searchFunc = () => {
      return {
        areaid: level.value != '全国' ? areaid.value : null,
        ALBP0004: 100, //证件类型  不是内陆传100
        ALBP0063: 2, // 实名传1  审核中传2   0就是实名未通过
        albp0003: props.queryParam.albp0003 ? props.queryParam.albp0003 : null, //姓名
        albp0005: props.queryParam.albp0005 ? props.queryParam.albp0005 : null, //身份证号
      }
    }

    const getList = (bool) => {
      areaid.value =
        props.queryParam.areaid.length > 0
          ? props.queryParam.areaid[props.queryParam.areaid.length - 1]
          : userInfo.value.areaLevel == '0'
          ? '100000000000000000'
          : userInfo.value.areaid
      level.value = getLevel(areaid.value)
      setTimeout(() => {
        AuditTable.value.refresh(bool)
      }, 200)
    }

    const getheight = () => {
      AuditTable.value.getheight()
    }

    const toVolInfo = (record) => {
      LocalSetVolunteerInfo(record)

      router.push({ path: '/volunteerCmsDetails' })
    }

    onMounted(() => {
      getList(true)
    })

    return {
      props,
      level,
      AuditTableColumns,
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
