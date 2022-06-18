<!-- 待审核项目 -->
<template>
  <div>
    <ProjectSearchTable projectType="2" ref="ProjectSearchTable2">
      <template #action="record">
        <a-space>
          <a-popconfirm
            :title="record.record.record.albx0076 == 1 ? '项目已开始审核，无法撤回' : '撤回后，项目重新变为未发布状态，是否确认撤回'"
            :disabled="checktime(record.record.record.albx0005)"
            @confirm="handleWithdraw(record.record)"
          >
            <a-button type="primary" size="small" :disabled="checktime(record.record.record.albx0005)"> 撤回 </a-button>
          </a-popconfirm>
          <a-button size="small" :disabled="!checktime(record.record.record.albx0005)" @click="openModel(record.record)">
            审核超时,转为补录
          </a-button>
        </a-space>
      </template>
    </ProjectSearchTable>
    <a-modal v-model:visible="modelDate.visible" title="审核超时转补录" :confirmLoading="modelDate.confirmLoading" @ok="handleCollection">
      <p>因当前项目超时仍未被审核，可将项目转为补录项目，补录项目无需审核，确认转移后请在补录项目列表查看此项目</p>
    </a-modal>
  </div>
</template>

<script>
import { rpcPost } from '@/server/conf/index.js'
import { message } from 'ant-design-vue'
import { defineComponent, ref, reactive } from 'vue'
import ProjectSearchTable from './components/ProjectSearchTable.vue'
import { getDate, checktime, redDate } from '@/utils/publicMethods/common'
import moment from 'moment'
export default defineComponent({
  components: {
    ProjectSearchTable,
  },
  setup() {
    const ProjectSearchTable2 = ref(null)
    const modelDate = reactive({
      visible: false,
      confirmLoading: false,
      item: {},
    })
    const openModel = (record) => {
      //转补录按钮
      modelDate.item = record
      modelDate.visible = true
    }
    const handleWithdraw = (record) => {
      //撤回项目
      if (record.record.albx0076 != 1) {
        //审核中的项目不能撤回
        let bean = {
          albx0021: record.record.albx0021,
          proId: record.record.id,
        }
        rpcPost('reProjectToDependFortis', { bean }).then((res) => {
          if (res && res.code === 0) {
            ProjectSearchTable2.value.getList('delete')
            message.success('撤回成功')
          } else {
            message.warning(res.message)
          }
        })
      }
    }
    const handleCollection = () => {
      //项目转补录
      let bean = {
        albx0021: modelDate.item.record.albx0021,
        proId: modelDate.item.record.id,
      }
      modelDate.confirmLoading = true
      rpcPost('groupProjectChangeStateFortis', { bean }).then((res) => {
        if (res && res.code === 0) {
          modelDate.visible = false
          ProjectSearchTable2.value.getList('delete')
          message.success('补录成功')
        } else {
          message.warning(res.message)
        }
        modelDate.confirmLoading = false
      })
    }
    return {
      moment,
      redDate,
      modelDate,
      ProjectSearchTable2,
      handleWithdraw,
      handleCollection,
      getDate,
      checktime,
      openModel,
    }
  },
})
</script>
<style lang="scss" scoped></style>
