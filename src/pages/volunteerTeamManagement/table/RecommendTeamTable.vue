<template>
  <div>
    <IATable
      serviceName="deptQueryTeamPageFortis"
      :searchParameter="searchFunc"
      ref="reviewTable"
      size="middle"
      :rowKey="(record) => record.id"
      :columns="RecommendTeamTablColumns"
      :showHeader="false"
    >
      <template #total-title="{ totalData: total }">
        查询合计：队伍数
        <span>
          {{ total.totals }}
        </span>
        个
      </template>
      <template #albe0002="{ text, record }">
        <a @click="heanViewTeamInfo(record)" :title="text">{{ text }}</a>
      </template>
      <template #action="record">
        <slot name="action" :record="record.record"> </slot>
      </template>
    </IATable>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs } from 'vue'
import { RecommendTeamTablColumns } from './table'
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
            ? '100000000000000000'
            : userInfo.value.areaid,
        albe0036: props.activeKey == 1 ? 1 : 0, //是否推荐  1推荐 0不推荐
        albe0002: props.queryParam.albe0002 ? props.queryParam.albe0002 : null, //队伍名
      }
    }
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
      RecommendTeamTablColumns,
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
