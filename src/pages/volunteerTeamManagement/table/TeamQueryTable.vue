<template>
  <div>
    <IATable
      serviceName="deptQueryTeamPageFortis"
      :searchParameter="searchFunc"
      ref="reviewTable"
      size="middle"
      :rowKey="(record) => record.id"
      :columns="columns"
      :showHeader="false"
    >
      <!-- <template #total-title="{totalData:total}">
        查询合计：队伍数
        <span>
          {{ total.count }}
        </span>
        个
        <span v-show="total && total.time" style="color:#000;">
          ，总服务时长
        </span>
        <span>
          {{ total.time ? total.time : '' }}
        </span>
        <span v-show="total && total.time" style="color:#000;">
          小时
        </span>
      </template> -->
      <template #albe0002="{ text, record }">
        <a @click="heanViewTeamInfo(record)" :title="text">{{ text }}</a>
      </template>
      <template #albe0003="{ text: albe0003 }">
        {{ albe0003 == 1 ? '志愿服务团体' : albe0003 == 2 ? '志愿服务组织' : albe0003 == 3 ? '其它开展志愿服务活动的法人组织' : '-' }}
      </template>
      <template #action="record">
        <slot name="action" :record="record.record"> </slot>
      </template>
    </IATable>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs } from 'vue'
import { TeamQueryTable } from './table'
import { LocalGetUserInfo, LocalSetTeamViewInfo } from '@/utils/localStorage.js'
import moment from 'moment'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import apis from '@/server/request'
export default defineComponent({
  components: {},
  props: {
    queryParam: {
      type: Object,
      default: {},
    },
    activeKey: {
      type: String,
      default: '1',
    },
  },
  setup(props) {
    const router = useRouter()
    const userInfo = ref(LocalGetUserInfo())
    const searchFunc = () => {
      return {
        areaid:
          props.queryParam.areaid.length > 0
            ? props.queryParam.areaid[props.queryParam.areaid.length - 1]
            : userInfo.value.areaLevel == '0'
            ? '110000000000000000'
            : userInfo.value.areaid, //无全国
        albe0002: props.queryParam.albe0002 ? props.queryParam.albe0002 : null,
        albe0041: props.queryParam.albe0041 ? props.queryParam.albe0041 : null,
        albe0017: props.queryParam.albe0017 ? props.queryParam.albe0017 : null,
        albe0003: props.queryParam.albe0003 ? props.queryParam.albe0003 : null,
        albe0026: props.activeKey == 1 ? 1 : props.activeKey == 2 ? 2 : 3, //1启用 2未审核 3停用
        albe0069: props.queryParam.albe0069 ? props.queryParam.albe0069 : null,
        albe0056Start: props.queryParam.albe0056Start ? props.queryParam.albe0056Start : null,
        albe0056End: props.queryParam.albe0056End ? props.queryParam.albe0056End : null,
        albe0069Start: props.queryParam.albe0069Start ? props.queryParam.albe0069Start : null,
        albe0069End: props.queryParam.albe0069End ? props.queryParam.albe0069End : null,
        albe0046Start: props.queryParam.albe0046Start ? moment(new Date(props.queryParam.albe0046Start)).format('YYYY-MM-DD') : null,
        albe0046End: props.queryParam.albe0046End ? moment(new Date(props.queryParam.albe0046End)).format('YYYY-MM-DD') : null,
      }
    }
    const columns = ref(TeamQueryTable.columns)
    const reviewTable = ref() //表格

    const getList = (bool) => {
      reviewTable.value.refresh(bool)
    }

    const getheight = () => {
      reviewTable.value.getheight()
    }

    const heanViewTeamInfo = (record) => {
      // 查看详情
      let obj = JSON.parse(JSON.stringify(record))
      obj.id = record.id
      obj.albe0012 = record.albe0012
      LocalSetTeamViewInfo(obj)
      router.push({ path: '/teamCmsDetails' })
    }

    return {
      props,
      columns,
      reviewTable,
      searchFunc,
      getheight,
      getList,
      heanViewTeamInfo,
    }
  },
})
</script>

<style scoped lang="less"></style>
