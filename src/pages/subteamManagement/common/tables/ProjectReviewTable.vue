<template>
  <IATable
    serviceName="superiorOrganizationReviewsGroupProjectsFortis"
    :searchParameter="searchFunc"
    ref="ProReviewTable"
    size="middle"
    :rowKey="(record) => record.id"
    :columns="columns"
  >
    <template #total-title>
      <a-row class="header-bar">
        <div class="header-title table-total">
          查询合计：{{ tabsKey == 'direGroup' ? '直属团体' : '下级组织' }}总数共 <span>{{ totalNum }}</span> 个。
        </div>
      </a-row>
    </template>
    <template #action="{record}">
      <a-space>
        <a-button type="primary" size="small" @click="handleProjectReview(record)">
          审核
        </a-button>
      </a-space>
    </template>
  </IATable>
</template>

<script>
import moment from 'moment'
import { defineComponent, reactive, ref, toRefs, onMounted, onBeforeUnmount } from 'vue'
import { ProjectReviewTable } from './table'
import apis from '@/server/request'
import EventBus from '@/utils/bus'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
export default defineComponent({
  props: {
    tabsKey: {
      type: String,
    },
    tableType: {
      type: String,
    },
    totalNum: {
      type: String,
    },
    queryParam: {
      type: Object,
    },
  },
  setup(props) {
    const columns = ref(ProjectReviewTable.columns)
    const userInfo = ref(LocalGetUserInfo())
    const searchFunc = () => {
      const { tabsKey } = props
      return {
        teamId: userInfo.value.team.groupid, //'a6124ab7ced64a13b806c9418da42d84', // 团体id
        ProName: props.queryParam.proName, //项目名称(非必)
        albx7310: tabsKey == 'direGroup' ? '1' : '0',
      }
    }
    const ProReviewTable = ref()
    // 审核
    const handleProjectReview = async (record) => {
      const { tableType, tabsKey } = props
      EventBus.emit('handleProjectReview', {
        record,
        tableType,
        tabsKey,
      })
      // 给项目添加已读标识
      const params = {
        albx0021: record.albx7308, // 项目服务区域
        proId: record.albx7302, // 项目id
      }
      const res = await apis.whetherTheItemWasViewedFortis(params)
    }
    onBeforeUnmount(() => {
      EventBus.off('refreshProReviewTable')
    })
    onMounted(() => {
      EventBus.on('refreshProReviewTable', () => {
        refreshReviewTable()
      })
    })
    // 刷新表格
    const refreshReviewTable = () => {
      // 刷新表格
      ProReviewTable.value.refresh(true)
    }
    return {
      moment,
      columns,
      ProReviewTable,
      ...toRefs(props),
      handleProjectReview,
      searchFunc,
    }
  },
})
</script>

<style scoped lang="less"></style>
