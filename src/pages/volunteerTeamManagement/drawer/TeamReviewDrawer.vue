<template>
  <a-drawer title="队伍审核" placement="right" :maskClosable="false" :visible="visible" @close="onClose" width="1100">
    <a-row>
      <a-card style="width: 100%">
        <a-form ref="form_review" :model="formReviewParam" layout="vertical" :rules="rules" class="nv-form" :style="{ padding: ' 0 24px' }">
          <a-row style="margin-top: 10px">
            <a-form-item label="审核结果：">
              <a-radio-group name="ispass" v-model:value="formReviewParam.ispass">
                <a-radio value="1"> 通过 </a-radio>
                <a-radio value="0"> 不通过 </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-row>
          <a-row style="margin-top: 10px" :gutter="24">
            <a-form-item label="审核意见：（不超过25个字）" name="option" style="width: 100%">
              <a-textarea
                style="margin-top: 10px"
                placeholder="请输入审核意见"
                v-model:value="formReviewParam.option"
                :auto-size="{ minRows: 4, maxRows: 8 }"
                maxLength="25"
              />
            </a-form-item>
          </a-row>
          <a-row style="margin-top: 10px; display: flex; justify-content: space-around">
            <a-button type="primary" @click="confirmReviewCencer()">取消</a-button>
            <a-button type="primary" :loading="loadingBtn" @click="confirmReview()">确认审核</a-button>
          </a-row>
        </a-form>
      </a-card>
    </a-row>
    <a-row :gutter="24">
      <a-col :md="24">
        <FormTeamInfo updateState="notAllowUpdate" :queryTeamParam="queryTeamParam" comType="review"></FormTeamInfo>
      </a-col>
      <a-col :md="24">
        <FormTeamType updateState="notAllowUpdate" :queryTeamParam="queryTeamParam" comType="review"></FormTeamType>
      </a-col>
      <a-col :md="24">
        <FormChargeInfo updateState="notAllowUpdate" :queryTeamParam="queryTeamParam" comType="review"></FormChargeInfo>
      </a-col>
    </a-row>
  </a-drawer>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, onBeforeUnmount } from 'vue'
import EventBus from '@/utils/bus'
import { LocalGetUserInfo, localRemoveItem } from '@/utils/localStorage.js'
import { TeamReviewDrawerHook } from '../../subteamManagement/Hooks/useRulesHook'
import apis from '@/server/request'
import { message } from 'ant-design-vue'
import FormTeamInfo from '@/pages/subteamManagement/common/formInfo/FormTeamInfo.vue'
import FormTeamType from '@/pages/subteamManagement/common/formInfo/FormTeamType.vue'
import FormChargeInfo from '@/pages/subteamManagement/common/formInfo/FormChargeInfo.vue'

export default defineComponent({
  components: {
    FormTeamInfo,
    FormTeamType,
    FormChargeInfo,
  },
  setup() {
    const visible = ref(false)
    const form_review = ref()
    const loadingBtn = ref(false)
    const userInfo = reactive(LocalGetUserInfo())

    // 缓存的点击审核的队伍信息
    const teamInfo = ref({})
    const formReviewParam = reactive({
      ispass: '1',
      option: '',
    })
    const queryTeamParam = reactive({
      teamId: '',
      areaId: '',
    })
    const rules = TeamReviewDrawerHook(formReviewParam)
    let currentReviewRecord = reactive({})
    const onClose = () => {
      init()
    }
    const init = () => {
      teamInfo.value = {}
      formReviewParam.ispass = '1'
      formReviewParam.option = ''
      visible.value = false
    }
    onBeforeUnmount(() => {
      EventBus.off('handleReview')
    })
    onMounted(() => {
      EventBusListener()
    })
    // 获取队伍详情
    const getTeamInfo = async (record) => {
      loadingBtn.value = true
      const params = {
        id: record.id,
        areaId: record.albe0012,
      }
      const res = await apis.getTeamInfoFortis(params)
      // console.log(res, '队伍审核的队伍详情')
      if (res.code === '0' || res.code === 0) {
        teamInfo.value = res.data
        loadingBtn.value = false
      } else {
        btnDisabled.value = true
        loadingBtn.value = false
        message.warning(res.message)
      }
    }
    const EventBusListener = () => {
      EventBus.on('handleReview', async ({ record, type }) => {
        visible.value = true
        currentReviewRecord = record
        queryTeamParam.teamId = record.id
        queryTeamParam.areaId = record.albe0012
        // await getTeamInfo(record)
      })
    }
    const confirmReviewCencer = () => {
      init()
    }
    const confirmReview = () => {
      form_review.value
        .validate()
        .then(async () => {
          let params = {
            ...formReviewParam,
            id: currentReviewRecord.id, //  // 队伍id
            areaId: userInfo.areaid == '000000000000000000' ? '100000000000000000' : userInfo.areaid, // // 队伍区划
            userFlag: userInfo.userflag, //当前登录用户名
            albp0052: currentReviewRecord.albp0052, // 待审队伍用户名
          }
          console.log(params, 'params....')
          console.log(userInfo, 'userInfo....')
          const res = await apis.updateTeamStateFortis(params)
          console.log(res, '民政审核......res')
          if (res.code == 0) {
            message.success(res.message)
            EventBus.emit('refreshTable')
            init()
          } else {
            message.warning(res.message)
          }
          console.log(res)
        })
        .catch((e) => {
          console.log(e)
        })
    }
    return {
      visible,
      loadingBtn,
      onClose,
      form_review,
      rules,
      formReviewParam,
      confirmReview,
      // 缓存的点击审核的队伍信息
      teamInfo,
      queryTeamParam,
      confirmReviewCencer,
    }
  },
})
</script>

<style scoped lang="less"></style>
