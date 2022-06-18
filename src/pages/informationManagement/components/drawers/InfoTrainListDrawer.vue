<template>
  <!-- 培训名录弹窗 -->
  <a-drawer title="培训名录" placement="right" :visible="visible_trainDrawer" :maskClosable="false" @close="onCloseTrainDrawer" width="800">
    <a-row style="font-size: 18px; font-weight: 600; display: flex; justify-content: space-between">
      <div>
        已添加
        <span style="color: red; font-size: 22px">{{ volSum }}</span>
        人,参与培训
      </div>
      <div>
        <a-space>
          <a-button type="primary" @click.prevent="addOrgTeamPerson">添加下属队伍成员</a-button>
          <a-button type="primary" @click.prevent="addTrainPerson">添加本队伍成员</a-button>
          <a-button @click.prevent="batchDelTrainPerson">批量删除</a-button>
        </a-space>
      </div>
    </a-row>
    <a-row style="display: flex; flex-direction: column; margin-top: 10px">
      <IATable
        serviceName="TrainingNoticeVolListFortis"
        :searchParameter="searchFunc"
        ref="hasJionTrainTableRef"
        size="middle"
        :rowKey="(record) => record.id"
        :columns="columns"
        :showHeader="false"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
      >
        <template #action="{ record }">
          <a-popconfirm :title="'是否确定删除?'" @confirm="handleDelPerson(record)">
            <a-button size="small"> 删除 </a-button>
          </a-popconfirm>
        </template>
      </IATable>
    </a-row>

    <a-drawer title="下级团体列表" placement="right" :visible="visible_orgTeamDrawer" :maskClosable="false" @close="onCloseOrgTeamDrawer" width="800">
      <a-row> </a-row>
      <IATable
        serviceName="queryNextTeamPage"
        :searchParameter="searchOrgTeamFunc"
        ref="orgTeamTableRef"
        size="middle"
        :rowKey="(record) => record.id"
        :columns="columnTeamList"
        :showHeader="false"
      >
        <template #action="{ record }">
          <a-button type="primary" size="small" @click="handleSelectOrgTeam(record)"> 选择 </a-button>
        </template>
      </IATable>
    </a-drawer>

    <InfoTeamVolListModal
      ref="InfoTeamVolListModal"
      style="z-index: 1500"
      :teamQueryParam="teamQueryParam"
      :visible="visible_teamVolModal"
      @handleCancel="handleCancel"
      @handleSelectVol="handleSelectVol"
    ></InfoTeamVolListModal>
  </a-drawer>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, onBeforeUnmount } from 'vue'
import EventBus from '@/utils/bus'
import apis from '@/server/request'
import { message } from 'ant-design-vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import InfoTeamVolListModal from '../modal/InfoTeamVolListModal'
import { addTrainVolTable, orgTeamListTable } from './addTrainVolTable'
export default defineComponent({
  components: {
    InfoTeamVolListModal,
  },
  setup() {
    const visibleDialog = reactive({
      visible_trainDrawer: false, // 大的培训名录弹窗
      visible_orgTeamDrawer: false, // 下级队伍列表弹窗
      visible_teamVolModal: false, // 队伍内志愿者modal
    })
    const columns = ref(addTrainVolTable.columns)
    const columnTeamList = ref(orgTeamListTable.columns)
    const currentTrainRecord = ref({})
    const volSum = ref('0')
    const userInfo = ref(LocalGetUserInfo())
    const teamQueryParam = reactive({
      id: userInfo.value.team.groupid,
      areaid: userInfo.value.areaid,
    })
    const hasJionTrainTableRef = ref()
    const selectDelList = reactive({
      selectedRowKeys: [],
      selectedRows: [],
    })

    const onCloseTrainDrawer = () => {
      visibleDialog.visible_trainDrawer = false
      currentTrainRecord.value = {}
    }
    const onCloseOrgTeamDrawer = () => {
      visibleDialog.visible_orgTeamDrawer = false
    }
    const handleCancel = () => {
      visibleDialog.visible_teamVolModal = false
    }
    const handleSelectVol = ({ records }) => {
      const params = {
        list: [],
      }
      records.forEach((item) => {
        let sex = item.albp0006 === '男' ? '1' : '2'
        params.list.push({
          lbx16id: currentTrainRecord.value.id, //培训id,
          albp0029: item.albe0133, // 志愿者编号
          volname: item.albp0003, // 志愿者姓名
          sex, // 性别
          areaid: item.albp0020, // 志愿者服务区域
        })
      })
      // 这里调用添加志愿者的接口
      apis.teamTrainingNoticeAddVol(params).then((res) => {
        if (res.code == '0') {
          refreshJionTrainTable()
          message.success(res.message)
        } else {
          message.warning(res.message)
        }
      })
    }
    const getVolSum = async () => {
      const params = {
        lbx16id: currentTrainRecord.value.id,
      }
      const res = await apis.TrainingNoticeVolListFortis(params)
      if (res.code == '0') {
        volSum.value = res.data.volsum
      }
    }

    const EventBusListener = () => {
      EventBus.on('handleAddTrainPerson', (trainRecord) => {
        currentTrainRecord.value = trainRecord
        if (hasJionTrainTableRef.value) {
          refreshJionTrainTable()
        }
        getVolSum()
        visibleDialog.visible_trainDrawer = true
      })
    }
    onBeforeUnmount(() => {
      EventBus.off('handleAddTrainPerson')
    })
    onMounted(() => {
      EventBusListener()
    })
    const addTrainPerson = () => {
      teamQueryParam.id = userInfo.value.team.groupid
      teamQueryParam.areaid = userInfo.value.areaid
      visibleDialog.visible_teamVolModal = true
    }
    const addOrgTeamPerson = () => {
      visibleDialog.visible_orgTeamDrawer = true
    }
    const refreshJionTrainTable = () => {
      hasJionTrainTableRef.value.refresh()
      getVolSum()
    }
    const searchFunc = () => {
      return {
        // 后边那个瞎鸡儿写的，别删除了,加载的时候会是undefined
        lbx16id: currentTrainRecord.value.id || '320333199809032111',
      }
    }
    const searchOrgTeamFunc = () => {
      return {
        id: userInfo.value.team.groupid,
      }
    }
    const handleSelectOrgTeam = (record) => {
      // 更改传给modal的参数
      teamQueryParam.id = record.id
      teamQueryParam.areaid = record.albe0012
      visibleDialog.visible_teamVolModal = true
    }

    const onSelectChange = (selectedKeys, selectedRows) => {
      selectDelList.selectedRowKeys = selectedKeys
      selectDelList.selectedRows = selectedRows
    }
    const batchDelTrainPerson = () => {
      console.log(selectDelList.selectedRowKeys)
      const ids = selectDelList.selectedRowKeys
      handleDelPerson(ids)
    }
    const handleDelPerson = async (record) => {
      const params = {
        id: '',
      }
      if (Array.isArray(record)) {
        params.id = record.join(',')
      } else {
        params.id = record.id
      }
      console.log(record, 'record。。。del')
      const res = await apis.TrainingNoticeDelVolListFortis(params)
      if (res.code == '0') {
        message.success(res.message)
      } else {
        message.warning(res.message)
      }
      refreshJionTrainTable()
    }
    return {
      ...toRefs(visibleDialog),
      ...toRefs(selectDelList),
      onCloseTrainDrawer,
      onCloseOrgTeamDrawer,
      handleCancel,
      addTrainPerson,
      columns,
      columnTeamList,
      searchFunc,
      searchOrgTeamFunc,
      hasJionTrainTableRef,
      handleSelectVol,
      teamQueryParam,
      addOrgTeamPerson,
      handleSelectOrgTeam,
      onSelectChange,
      batchDelTrainPerson,
      volSum,
      handleDelPerson,
    }
  },
})
</script>

<style scoped lang="less">
.ant-drawer {
  :deep(.nvsi-header-wrapper) {
    padding: 0 !important;
  }
}
</style>
