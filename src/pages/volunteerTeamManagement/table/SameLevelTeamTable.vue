<template>
  <!-- 本级队伍表格 -->
  <div>
    <IATable
      serviceName="deptQueryNextTeamPageFortis"
      :searchParameter="searchFunc"
      ref="reviewTable"
      size="middle"
      :rowKey="(record) => record.id"
      :columns="SameLevelTeamTableCloums"
      :showHeader="false"
    >
      <template #albe0002="{ text, record }">
        <a @click="heanViewTeamInfo(record)">{{ text }}</a>
      </template>
      <template #action="{ record }">
        <slot name="action" :record="record"> </slot>
      </template>
    </IATable>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, watch } from 'vue'
import { SameLevelTeamTableCloums } from './table'
import { LocalGetUserInfo, LocalSetTeamViewInfo } from '@/utils/localStorage.js'
import EventBus from '@/utils/bus'
import { useRouter } from 'vue-router'
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
    const reviewTable = ref()
    const searchFunc = () => {
      return {
        areaid: userInfo.value.areaLevel == '0' ? '100000000000000000' : userInfo.value.areaid,
        type: 3, //1注册审核 2变更审核 3本级队伍
        albe0002: props.queryParam.teamName ? props.queryParam.teamName : null, //队伍名称
        albe0026: props.activeKey == '1' ? '1' : '3', //1:启用  3：停用
      }
    }

    const getList = (bool) => {
      reviewTable.value.refresh(bool)
    }

    const heanViewTeamInfo = (record) => {
      // 查看详情
      LocalSetTeamViewInfo(record)
      router.push({ path: '/teamCmsDetails' })
    }

    return {
      SameLevelTeamTableCloums,
      searchFunc,
      reviewTable,
      ...toRefs(props),
      getList,
      heanViewTeamInfo,
    }
  },
})
</script>

<style scoped lang="less"></style>
