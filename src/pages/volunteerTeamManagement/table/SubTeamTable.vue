<template>
  <!-- 队伍审核表格 -->
  <div>
    <IATable
      serviceName="deptQueryNextTeamPageFortis"
      :searchParameter="searchFunc"
      ref="reviewTable"
      size="middle"
      :rowKey="(record) => record.id"
      :columns="columns"
      :showHeader="false"
    >
      <template #albe0002="{ text, record }">
        <a @click="heanViewTeamInfo(record)">{{ text }}</a>
      </template>
      <template #action="{ record }" v-if="type == '1' || type == '2'">
        <a-space>
          <a-button type="primary" size="small" @click="handleReview(record)"> 审核 </a-button>
        </a-space>
      </template>
      <template #action="{ record }">
        <slot name="action" :record="record"> </slot>
      </template>
    </IATable>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, watch } from 'vue'
import { useSubTeamTable } from './table'
import { LocalGetUserInfo, LocalSetTeamViewInfo } from '@/utils/localStorage.js'
import EventBus from '@/utils/bus'
import { useRouter } from 'vue-router'
export default defineComponent({
  components: {},
  props: {
    queryParam: {
      type: Object,
    },
    type: {
      type: String,
    },
  },
  setup(props) {
    const router = useRouter()
    const userInfo = ref(LocalGetUserInfo())
    const columns = ref()
    const reviewTable = ref()
    const searchFunc = () => {
      return {
        areaid: userInfo.value.areaLevel == '0' ? '100000000000000000' : userInfo.value.areaid,
        type: props.type, //1注册审核 2变更审核 3本级队伍
        albe0002: props.queryParam.teamName,
      }
    }
    const heanViewTeamInfo = (record) => {
      // 查看详情
      LocalSetTeamViewInfo(record)
      router.push({ path: '/teamCmsDetails' })
    }

    const handleReview = (record) => {
      const { type } = props
      EventBus.emit('handleReview', { record, type })
    }

    const getList = () => {
      reviewTable.value && reviewTable.value.refresh()
    }

    onMounted(() => {
      EventBus.on('refreshTable', () => {
        getList()
      })
    })

    watch(
      () => props.type,
      () => {
        columns.value = useSubTeamTable(props.type)
      },
      {
        immediate: true,
      }
    )
    return {
      columns,
      searchFunc,
      reviewTable,
      ...toRefs(props),
      getList,
      handleReview,
      heanViewTeamInfo,
    }
  },
})
</script>

<style scoped lang="less"></style>
