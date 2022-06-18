import { defineComponent, reactive, ref, onMounted, toRefs } from 'vue'
import { message } from 'ant-design-vue'
import { refresh } from 'less'

// 审核表查询按钮
export const refreshReviewTableHook = (queryParam, activeTabKey) => {
  const TeamReviewTable1 = ref()
  const TeamReviewTable2 = ref()
  const TeamReviewTable3 = ref()
  const resetForm = () => {
    queryParam.teamName = ''
    queryParam.teamStatus = '1'
    TeamReviewTable1.value && TeamReviewTable1.value.$refs.reviewTable.refresh()
    TeamReviewTable2.value && TeamReviewTable2.value.$refs.reviewTable.refresh()
    TeamReviewTable3.value && TeamReviewTable3.value.$refs.reviewTable.refresh()
  }
  const searchForm = () => {
    TeamReviewTable1.value && TeamReviewTable1.value.$refs.reviewTable.refresh()
    TeamReviewTable2.value && TeamReviewTable2.value.$refs.reviewTable.refresh()
    TeamReviewTable3.value && TeamReviewTable3.value.$refs.reviewTable.refresh()
  }

  return {
    TeamReviewTable1,
    TeamReviewTable2,
    TeamReviewTable3,
    resetForm,
    searchForm,
  }
}

// 审核项目查询按钮
export const refreshProReviewTableHook = (queryParam) => {
  const ProjectReviewTable1 = ref()
  const ProjectReviewTable2 = ref()
  const refresh = () => {
    ProjectReviewTable1.value && ProjectReviewTable1.value.$refs.ProReviewTable.refresh()
    ProjectReviewTable2.value && ProjectReviewTable2.value.$refs.ProReviewTable.refresh()
  }
  const resetForm = () => {
    queryParam.proName = ''
    refresh()
  }
  const searchForm = () => {
    refresh()
  }
  return {
    ProjectReviewTable1,
    ProjectReviewTable2,
    resetForm,
    searchForm,
  }
}
