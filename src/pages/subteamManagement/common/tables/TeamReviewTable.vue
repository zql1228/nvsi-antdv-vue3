<template>
  <IATable
    serviceName="queryPendingTeamPageFortis"
    :searchParameter="searchFunc"
    ref="reviewTable"
    size="middle"
    :rowKey="(record) => record.id"
    :columns="columns"
  >
    <!-- v-if="tableType === 'formal'" -->
    <template #name="{ text, record }">
      <a @click="heanViewTeamInfo(record)">{{ text }}</a>
    </template>

    <template #teamState="{ record }">
      {{ record.albe0026 == '1' ? '启用' : '停用' }}
    </template>
    <template #total-title="{ totalData: total }">
      <a-row class="header-bar">
        <div class="header-title table-total">
          <!-- totalNum -->
          查询合计：{{ tabsKey == 'direGroup' ? '直属团体' : tabsKey == 'subGroup' ? '下级团体' : '下级组织' }}总数共
          <span>{{ total.totals }}</span> 个。
        </div>
      </a-row>
    </template>

    <template #action="{ record }">
      <a-space>
        <template v-if="tableType !== 'formal'">
          <a-button type="primary" size="small" @click="handleTeamReview(record)"> 审核 </a-button>
        </template>
        <template v-if="tableType == 'formal'">
          <a-space>
            <a-button type="primary" size="small" @click="handleModifyInfo(record)"> 修改信息 </a-button>
            <template v-if="record.albe0026 == '1'">
              <a-button type="primary" size="small" @click="updatePassword(record)"> 重置密码 </a-button>
              <a-button type="primary" size="small" @click="handleDeactTeam(record, 'disable')"> 停用队伍 </a-button>
            </template>
            <template v-else>
              <a-space>
                <a-button type="primary" size="small" @click="handleDeactTeam(record, 'enable')"> 启用队伍 </a-button>
                <a-button type="primary" size="small" @click="handleDeactTeamAndProject(record, 'enable')"> 启用队伍和项目 </a-button>
              </a-space>
            </template>
          </a-space>
        </template>
      </a-space>
    </template>
  </IATable>
  <a-modal v-model:visible="modalVisible" title="停用/启用账户" @ok="handleSubDeactTeam" @cancel="cancel">
    <p style="font-size: 16px">{{ modalContent }}</p>
    <div>
      <div style="font-size: 16px; font-weight: 600; margin-bottom: 10px">请输入原因：</div>
      <a-input v-model:value="reason" @change="changeMessage"></a-input>
      <span style="color: red" v-show="isShowMessage">请先填写原因</span>
    </div>
  </a-modal>
  <updatePasswordModal :visible="updatePass.visible" :item="updatePass.item" :type="updatePass.type" @child="onClose3"></updatePasswordModal>
</template>

<script>
import { defineComponent, reactive, ref, toRefs, onMounted, onBeforeUnmount, watch } from 'vue'
import { TeamReviewTable, useTeamReviewTable } from './table'
import apis from '@/server/request'
import { LocalGetUserInfo, LocalSetTeamViewInfo } from '@/utils/localStorage.js'
import EventBus from '@/utils/bus'
import { message, Modal } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import updatePasswordModal from '@/pages/volunteerTeamManagement/modal/updatePasswordModal.vue'
export default defineComponent({
  components: { updatePasswordModal },
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
  emits: ['refreshReviewTable'],
  setup(props, { emit }) {
    const userInfo = reactive(LocalGetUserInfo())
    const modalState = reactive({
      modalVisible: false,
      modalContent: '',
      reason: '',
      albe0026: '', // 1 启用 3 停用
      type: '', // 启用时候传：1 启用队伍 2 启用队伍和项目
      isShowMessage: false,
    })
    const currentRecord = ref()
    const reviewTable = ref()
    const router = useRouter()
    const columns = ref()
    const updatePass = reactive({
      //修改密码弹窗参数
      type: 'team',
      visible: false,
      item: {},
    })
    const updatePassword = (record) => {
      //重置密码按钮
      updatePass.item = record
      updatePass.visible = true
    }

    const onClose3 = (bool) => {
      //重置密码弹窗关闭
      if (bool) {
        reviewTable.value.refresh(true)
      }
      updatePass.visible = false
    }
    const searchFunc = () => {
      const { type, category } = dealPropsKey()
      return {
        id: userInfo.team.groupid,
        type,
        category,
        areaId: userInfo.team.areaid,
        albe0002: props.queryParam.teamName,
        albe0026: props.queryParam.teamStatus,
      }
    }
    const initModalState = () => {
      modalState.modalVisible = false
      modalState.modalContent = ''
      modalState.reason = ''
      modalState.albe0026 = ''
      modalState.type = ''
      currentRecord.value = ''
      modalState.isShowMessage = false
    }
    onBeforeUnmount(() => {
      EventBus.off('refreshReviewTable')
    })
    onMounted(() => {
      EventBusListener()
    })
    const EventBusListener = () => {
      EventBus.on('refreshReviewTable', () => {
        emit('refreshReviewTable')
        refreshReviewTable()
      })
    }
    const getTeamInfo = async (record) => {
      const params = {
        id: record.id,
        areaid: record.albe0012,
      }
      const res = await apis.getTeamInfoFortis(params)
      if (res.code == '0' && res.data) {
        LocalSetTeamViewInfo(record)
        router.push({ path: '/teamDetails' })
      } else {
        message.warning(res.message)
      }
    }
    const heanViewTeamInfo = (record) => {
      console.log(record)
      // 这里要查询一下队伍详情,然后跳转
      getTeamInfo(record)
    }
    // 处理props传参
    const dealPropsKey = () => {
      const { tableType, tabsKey } = props
      let type
      if (tableType === 'regirst') {
        type = '1' // 列表类型（1 注册审核 2 变更审核 3.正式队伍）
      } else if (tableType === 'change') {
        type = '2'
      } else if (tableType === 'formal') {
        type = '3'
      }
      let category
      if (tabsKey === 'direGroup') {
        category = '1' // tab类型（1 直属团体 2 下级团体 3 下级组织）
      } else if (tabsKey === 'subGroup') {
        category = '2'
      } else if (tabsKey === 'subOrgGroup') {
        category = '3'
      }
      return {
        type,
        category,
      }
    }
    // 修改信息
    const handleModifyInfo = (record) => {
      const { tableType, tabsKey } = props
      EventBus.emit('updateTeamInfo', {
        record,
        tableType,
        tabsKey,
      })
    }
    // 停用队伍 (启用队伍)
    const handleDeactTeam = async (record, isEnabled) => {
      currentRecord.value = record
      if (isEnabled === 'disable') {
        // 停用
        modalState.albe0026 = '3'
        modalState.modalContent = '是否确认停用此队伍，停用后此队伍将不在前台显示，队伍账户无法登录，此队伍所有的项目也将全部停用，是否确认停用?'
      } else {
        // 启用队伍
        modalState.albe0026 = '1'
        modalState.type = '1'
        modalState.modalContent = '仅启用队伍，则该队伍恢复正常可继续开展志愿服务，已停用的项目仍处于停用状态。请确认是否启用?'
      }
      modalState.modalVisible = true
    }
    const handleDeactTeamAndProject = async (record, isEnabled) => {
      currentRecord.value = record
      modalState.albe0026 = '1'
      modalState.type = '2'
      modalState.modalContent = '启用队伍和项目后，该队伍以及关联的所有被停用的项目将全部启用恢复正常。请确认是否启用?'
      modalState.modalVisible = true
    }
    const handleSubDeactTeam = async () => {
      if (!modalState.reason) {
        modalState.isShowMessage = true
        return
      }
      const params = {
        type: modalState.type, // 启用队伍或者项目 (启用时候传)
        albe0026: modalState.albe0026, //是	状态（1 启用 3 停用）
        userId: userInfo.team.groupid, //是	当前登录用户id
        areaid: userInfo.team.areaid, //是	队伍区划
        id: currentRecord.value.id, //是	队伍id
        userFlag: userInfo.userflag, //是	当前登录用户名
        albe2509: modalState.reason, // 原因
      }

      const res = await apis.deactivateOrEnalbeTeamFortis(params)

      if (res.code == '0') {
        refreshReviewTable()
        initModalState()
        message.success(res.message)
      } else {
        message.warning(res.message)
      }
    }
    const cancel = () => {
      initModalState()
    }
    // 审核
    const handleTeamReview = (record) => {
      const { tableType, tabsKey } = props
      EventBus.emit('teamReview', {
        record,
        tableType,
        tabsKey,
      })
    }

    // 刷新表格
    const refreshReviewTable = () => {
      // 刷新表格
      reviewTable.value.refresh(true)
    }

    const changeMessage = (e) => {
      if (e.target.value) {
        modalState.isShowMessage = false
      } else {
        modalState.isShowMessage = true
      }
    }
    watch(
      () => props.tableType,
      () => {
        const { tableType } = props
        columns.value = useTeamReviewTable(tableType)
        console.log(columns)
      },
      {
        immediate: true,
      }
    )
    return {
      updatePass,
      reviewTable,
      // TeamReviewTable,
      ...toRefs(props),
      searchFunc,
      handleModifyInfo,
      handleDeactTeam,
      handleDeactTeamAndProject,
      handleTeamReview,
      heanViewTeamInfo,
      ...toRefs(modalState),
      handleSubDeactTeam,
      cancel,
      changeMessage,
      columns,
      updatePassword,
      onClose3,
    }
  },
})
</script>

<style scoped lang="less"></style>
