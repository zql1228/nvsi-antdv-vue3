<template>
  <!-- 培训通知表 -->
  <IATable
    serviceName="teamTrainingNoticeFortis"
    :searchParameter="searchFunc"
    ref="trainTable"
    size="middle"
    :rowKey="(record) => record.id"
    :columns="columns"
    :showHeader="false"
  >
    <template #time="{record: data}">
      {{ moment(data.albx0284).format('YYYY-MM-DD') }}
    </template>
    <template #action="{record}">
      <a-space>
        <a-button type="primary" size="small" @click="handlePublishTrain(record)" v-if="tabKey == 'notStarted'">
          发布
        </a-button>
        <a-button type="primary" size="small" @click="handleEditTrain(record)">
          编辑
        </a-button>
        <a-button type="primary" size="small" @click="handleAddTrainPerson(record)">
          培训人员
        </a-button>
        <a-popconfirm :title="'是否确定删除?'" @confirm="handleDeleteTrain(record)">
          <a-button size="small">
            删除
          </a-button>
        </a-popconfirm>
      </a-space>
    </template>
  </IATable>
</template>

<script>
import moment from 'moment'
import { defineComponent, reactive, ref, onMounted, toRefs, onBeforeUnmount } from 'vue'
import { InfoTrainTable } from './table'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import apis from '@/server/request'
import { message } from 'ant-design-vue'
import EventBus from '@/utils/bus'
export default defineComponent({
  props: {
    tabKey: {
      type: String,
    },
    queryParam: {
      type: Object,
    },
  },
  setup(props) {
    const userInfo = ref(LocalGetUserInfo())
    const columns = ref(InfoTrainTable.columns)
    const trainTable = ref()
    const searchFunc = () => {
      const { tabKey } = props
      return {
        pageNum: 1,
        pageSize: 12,
        teamId: userInfo.value.team.groupid,
        albx0297: tabKey, // 类型 1 未开始 2 进行中 3 已结束
        // 查询条件 props.queryParam.trainTitle
        albx0282: props.queryParam.trainTitle,
      }
    }

    // 发布
    const handlePublishTrain = async (record) => {
      let startTime = new Date(record.albx0284.replace(/-/g, '/'))
      let curDate = new Date()
      // 时间早于当前时间
      if (startTime < curDate) {
        message.warning({ title: '此培训的培训时间已早于今日，请重新填写' })
      } else {
        console.log(record)
        const params = {
          lbx16id: record.id,
          albx0284: record.albx0284,
        }
        const res = await apis.releaseTeamTrainingNoticeFortis(params)
        if (res.code === '0') {
          message.success('发布成功')
        } else {
          message.warning('发布失败')
        }
      }
    }
    // 编辑
    const handleEditTrain = (record) => {
      EventBus.emit('handleEditTrain', record)
    }
    // 培训人员
    const handleAddTrainPerson = (record) => {
      EventBus.emit('handleAddTrainPerson', record)
    }
    // 删除
    const handleDeleteTrain = async (record) => {
      const params = {
        lbx16id: record.id,
      }
      const res = await apis.delTeamTrainingNoticeFortis(params)
      if (res.code == '0') {
        message.success(res.message)
        trainTable.value.refresh(true)
      } else {
        message.warning(res.message)
      }
    }
    onBeforeUnmount(() => {
      EventBus.off('refreshTrainTable')
    })
    onMounted(() => {
      EventBus.on('refreshTrainTable', () => {
        trainTable.value.refresh(true)
      })
    })
    return {
      trainTable,
      moment,
      columns,
      searchFunc,
      handlePublishTrain,
      handleEditTrain,
      handleAddTrainPerson,
      handleDeleteTrain,
    }
  },
})
</script>

<style scoped lang="less"></style>
