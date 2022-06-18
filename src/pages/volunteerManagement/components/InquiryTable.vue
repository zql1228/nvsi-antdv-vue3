<template>
  <IATable
    :serviceName="level == '全国' || level == '省' ? 'queryVolunteerInforOnCountry' : 'queryVolunteerInfor'"
    :searchParameter="searchFunc"
    ref="VolunteerInquiryTable"
    size="middle"
    :isMc="false"
    :rowKey="(record) => record.id"
    :columns="
      (level == '全国' || level == '省') && props.activeKey == 3
        ? InquiryTableColumns
        : level == '全国' || level == '省'
        ? InquiryTableColumns2
        : InquiryTableColumns
    "
    :showHeader="true"
    class="teamTabs"
  >
    <template #total-title="{ totalData: total }">
      查询合计：志愿者人数
      <span>
        {{ total.totals }}
      </span>
      个
      <!-- <span v-show="total && total.time" style="color:#000;">
        ，总服务时长
      </span>
      <span>
        {{ total.time ? total.time : '' }}
      </span>
      <span v-show="total && total.time" style="color:#000;">
        小时
      </span> -->
    </template>
    <template #name="{ text, record }">
      <a href="javascript:void(0)" @click="toVolInfo(record)" :title="text" v-show="level != '全国' && level != '省'">{{ text }}</a>
      <span v-show="level == '全国' || level == '省'">{{ text }}</span>
    </template>
    <template #sex="{ text }">
      {{ text == '1' ? '男' : '女' }}
    </template>
    <template #age="{ text }">
      {{ text }}
    </template>
    <!-- <template #accountState="{text}">
      {{ text == '0' ? '停用' : text == '1' ? '启用' : '-' }}
    </template> -->
    <template #action="record">
      <slot name="action" :record="record.record"> </slot>
    </template>
  </IATable>
</template>
<script>
import { defineComponent, reactive, ref, toRefs, onMounted, watch, nextTick } from 'vue'
import { LocalGetUserInfo, LocalSetVolunteerInfo } from '@/utils/localStorage.js'
import { getLevel } from '@/utils/publicMethods/common'
import { InquiryTableColumns, InquiryTableColumns2 } from '../table'
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
    const areaid = ref() //当前查询数据所用区划
    const level = ref() //当前查询数据所用区划级别 0全国 1省 2市 3区
    const VolunteerInquiryTable = ref()
    const searchFunc = () => {
      if (level.value == '全国' || level.value == '省') {
        return {
          areaid: level.value == '省' ? areaid.value : null,
          albp0063: props.activeKey == 1 ? 1 : props.activeKey == 2 ? 0 : null, //是否实名 1已实名 0未实名
          albp0090: props.activeKey == 3 ? 0 : null, //是否停用 0停用 1启用
          albp0003: props.queryParam.albp0003 ? props.queryParam.albp0003 : null,
          albp0005: props.queryParam.albp0005 ? props.queryParam.albp0005 : null,
          albp0003: props.queryParam.albp0003 ? props.queryParam.albp0003 : null,
          albp0006: props.queryParam.albp0006 ? props.queryParam.albp0006 : null,
          albp0017: props.queryParam.albp0017 ? props.queryParam.albp0017 : null,
          albp0007: props.queryParam.albp0007 ? props.queryParam.albp0007 : null,
          albp0021: props.queryParam.albp0021 ? props.queryParam.albp0021 : null,
          albp0018: props.queryParam.albp0018 ? props.queryParam.albp0018 : null,
          albp0004: props.queryParam.albp0004 ? props.queryParam.albp0004 : null,
          albp0089: props.queryParam.albp0089 ? props.queryParam.albp0089 : null,
          albp0026: props.queryParam.albp0026 ? props.queryParam.albp0026 : null,
          minage: props.queryParam.minage ? props.queryParam.minage : null,
          maxage: props.queryParam.maxage ? props.queryParam.maxage : null,
          mintime: props.queryParam.mintime ? props.queryParam.mintime : null,
          maxtime: props.queryParam.maxtime ? props.queryParam.maxtime : null,
          registmindate: props.queryParam.registmindate ? moment(new Date(props.queryParam.registmindate)).format('YYYY-MM-DD') : null,
          registmaxdate: props.queryParam.registmaxdate ? moment(new Date(props.queryParam.registmaxdate)).format('YYYY-MM-DD') : null,
        }
      } else {
        return {
          areaid: areaid.value,
          albp0063: props.activeKey == 1 ? 1 : props.activeKey == 2 ? 0 : 1, //是否实名 1已实名 0未实名
          albp0090: props.activeKey == 1 ? 1 : props.activeKey == 3 ? 0 : null, //是否停用 0停用 1启用
          albp0003: props.queryParam.albp0003 ? props.queryParam.albp0003 : null,
          albp0005: props.queryParam.albp0005 ? props.queryParam.albp0005 : null,
          albp0003: props.queryParam.albp0003 ? props.queryParam.albp0003 : null,
          albp0006: props.queryParam.albp0006 ? props.queryParam.albp0006 : null,
          albp0017: props.queryParam.albp0017 ? props.queryParam.albp0017 : null,
          albp0007: props.queryParam.albp0007 ? props.queryParam.albp0007 : null,
          albp0021: props.queryParam.albp0021 ? props.queryParam.albp0021 : null,
          albp0018: props.queryParam.albp0018 ? props.queryParam.albp0018 : null,
          albp0004: props.queryParam.albp0004 ? props.queryParam.albp0004 : null,
          albp0089: props.queryParam.albp0089 ? props.queryParam.albp0089 : null,
          albp0026: props.queryParam.albp0026 ? props.queryParam.albp0026 : null,
          minage: props.queryParam.minage ? props.queryParam.minage : null,
          maxage: props.queryParam.maxage ? props.queryParam.maxage : null,
          mintime: props.queryParam.mintime ? props.queryParam.mintime : null,
          maxtime: props.queryParam.maxtime ? props.queryParam.maxtime : null,
          registmindate: props.queryParam.registmindate ? moment(new Date(props.queryParam.registmindate)).format('YYYY-MM-DD') : null,
          registmaxdate: props.queryParam.registmaxdate ? moment(new Date(props.queryParam.registmaxdate)).format('YYYY-MM-DD') : null,
        }
      }
    }

    const getList = (bool) => {
      // areaid.value =
      //   props.queryParam.areaid.length > 0
      //     ? props.queryParam.areaid[props.queryParam.areaid.length - 1]
      //     : userInfo.value.areaLevel == '0'
      //     ? '100000000000000000'
      //     : userInfo.value.areaid//有全国
      areaid.value =
        props.queryParam.areaid.length > 0
          ? props.queryParam.areaid[props.queryParam.areaid.length - 1]
          : userInfo.value.areaLevel == '0'
          ? '110101000000000000'
          : userInfo.value.areaid //无全国
      level.value = getLevel(areaid.value)
      setTimeout(() => {
        VolunteerInquiryTable.value.refresh(bool)
      }, 200)
    }

    const getheight = () => {
      VolunteerInquiryTable.value.getheight()
    }

    const toVolInfo = (record) => {
      LocalSetVolunteerInfo(record)
   
      router.push({ path: '/volunteerCmsDetails' })
    }

    const isStart = ref(true)

    watch(
      //第一次查数据时要等服务区域组件加载完成
      () => props.queryParam.areaid,
      (areaid) => {
        if (isStart.value) {
          isStart.value = false
          getList(true)
        }
      }
    )

    onMounted(() => {
      if (props.queryParam.areaid && props.queryParam.areaid.length > 0) {
        isStart.value = false
        getList(true)
      }
    })

    return {
      level,
      props,
      InquiryTableColumns,
      InquiryTableColumns2,
      getList,
      getheight,
      VolunteerInquiryTable,
      searchFunc,
      toVolInfo,
    }
  },
})
</script>
<style scoped></style>
