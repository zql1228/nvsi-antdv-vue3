<template>
  <a-drawer title="队伍变更审核" placement="right" :visible="visible" :maskClosable="false" @close="onClose" width="1000">
    <a-row>
      <a-card style="width: 100%">
        <a-form ref="form_review" :model="formParam" layout="vertical" :rules="rules" class="nv-form" :style="{ padding: ' 0 24px' }">
          <a-row>
            <!-- 若变更的信息涉及直属组织、联络组织、登记机关（即变更了它的上级单位） -->
            <!-- <div>此队伍变更了队伍资料，选择了{{ ('直属组织', '联络组织') }}为您的队伍，请审核此队伍信息，并选择是否同意此队伍的信息变更</div> -->
            <!-- 若变更的信息不涉及直属组织、联络组织、登记机关（即没有变更它的上级单位） -->
            <div>
              此队伍变更了队伍资料，您作为此队伍的{{
                tabkey == 'direGroup' ? '直属组织' : tabkey == 'subGroup' ? '联络组织' : '上级组织'
              }}，请审核此队伍信息，并选择是否同意此队伍的信息变更
            </div>
          </a-row>
          <a-row style="margin-top: 10px">
            <a-form-item label="审核结果：">
              <a-radio-group name="ispass" v-model:value="formParam.ispass">
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
                v-model:value="formParam.option"
                :auto-size="{ minRows: 4, maxRows: 8 }"
                maxLength="25"
              />
            </a-form-item>
          </a-row>
          <a-row style="margin-top: 10px; display: flex; justify-content: space-around">
            <a-button type="primary" @click="confirmReview(false)">取消</a-button>
            <a-button type="primary" @click="confirmReview(true)" :loading="loadingBtn" :disabled="btnDisabled">确认审核</a-button>
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
import { defineComponent, reactive, ref, onMounted, toRefs } from 'vue'
import EventBus from '@/utils/bus'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import apis from '@/server/request'
import { message } from 'ant-design-vue'
import { TeamReviewDrawerHook } from '../../Hooks/useRulesHook'
import FormTeamInfo from '../formInfo/FormTeamInfo'
import FormTeamType from '../formInfo/FormTeamType'
import FormChargeInfo from '../formInfo/FormChargeInfo.vue'
export default defineComponent({
  components: {
    FormTeamInfo,
    FormTeamType,
    FormChargeInfo,
  },
  emits: ['refreshReviewTable'],
  setup(props, ctx) {
    const visible = ref(false)
    const userInfo = ref(LocalGetUserInfo())
    const teamInfo = ref({})
    const loadingBtn = ref(false)
    const btnDisabled = ref(false)
    const tabkey = ref('') // 提示判断类型
    const type = ref('') // 列表类型(1 注册审核 2 变更审核 3.正式队伍)
    const category = ref('') // tab类型（1 直属团体 2 下级团体 3 下级组织）
    const formParam = reactive({
      ispass: '1',
      option: '',
    })
    const rules = TeamReviewDrawerHook(formParam)
    const form_review = ref()
    const queryTeamParam = reactive({
      teamId: '',
      areaId: '',
    })
    const onClose = () => {
      init()
      // visible.value = false
    }
    const init = () => {
      visible.value = false
      formParam.ispass = '1'
      formParam.option = ''
    }
    onMounted(() => {
      EventBusListener()
    })
    // 处理eventBus传参
    const dealParams = (tableType, tabsKey) => {
      // console.log(tableType, tabsKey)
      // tableType // 列表类型(1 注册审核 2 变更审核 3.正式队伍)
      //regirst(注册审核) change(变更审核) formal(正式队伍)
      //tabsKey tab类型（1 直属团体 2 下级团体 3 下级组织）
      // direGroup(直属团体) subGroup(下级团体) subOrgGroup(下级组织)
      switch (tableType) {
        case 'regirst':
          type.value = '1'
          break
        case 'change':
          type.value = '2'
          break
        case 'formal':
          type.value = '3'
          break
        default:
          break
      }
      switch (tabsKey) {
        case 'direGroup':
          category.value = '1'
          break
        case 'subGroup':
          category.value = '2'
          break
        case 'subOrgGroup':
          category.value = '3'
          break
        default:
          break
      }
    }
    // 获取队伍详情
    const getTeamInfo = async (record) => {
      loadingBtn.value = true
      const { id: id, albe0012: areaId } = record
      queryTeamParam.teamId = record.id
      queryTeamParam.areaId = record.albe0012
      const res = await apis.getTeamInfoFortis({ id, areaId })
      if (res.code == '0' && res.data) {
        teamInfo.value = res.data
        loadingBtn.value = false
      } else {
        btnDisabled.value = true
        loadingBtn.value = false
        message.warning(res.message)
      }
    }
    const confirmReview = (flag) => {
      // console.log(userInfo)
      // 取消按钮
      if (!flag) {
        init()
      } else {
        form_review.value
          .validate()
          .then(async () => {
            if (category.value == '3') {
              //调用另外的接口
              let params = {
                ...formParam,
                id: teamInfo.value.id, //  // 队伍id
                areaId: teamInfo.value.albe0012, // // 队伍区划
                userFlag: userInfo.value.userflag, //当前登录用户名
              }
              const res = await apis.updateTeamStateFortis2(params)
              if (res.code == '0') {
                EventBus.emit('refreshReviewTable')
                ctx.emit('refreshReviewTable')
                message.success(res.message)
                init()
              } else {
                message.warning(res.message)
              }
            } else {
              let params = {
                ...formParam,
                id: teamInfo.value.id, //  // 队伍id
                areaId: teamInfo.value.albe0012, // // 队伍区划
                albp0052: teamInfo.value.albp0052, // // 队伍用户名
                userFlag: userInfo.value.userflag, //当前登录用户名
              }
              console.log(params, category.value, 'params....review')
              const res = await apis.updateTeamStateFortis(params)
              if (res.code == '0') {
                EventBus.emit('refreshReviewTable')
                ctx.emit('refreshReviewTable')
                message.success(res.message)
                init()
              } else {
                message.warning(res.message)
              }
              init()
            }
          })
          .catch((e) => {
            // console.log(e, '++')
          })
      }
    }
    const EventBusListener = () => {
      EventBus.on('teamReview', (params) => {
        visible.value = true
        const { record, tableType, tabsKey } = params
        tabkey.value = tabsKey
        dealParams(tableType, tabsKey)
        getTeamInfo(record)
      })
    }
    return {
      visible,
      tabkey,
      rules,
      formParam,
      form_review,
      loadingBtn,
      btnDisabled,
      onClose,
      confirmReview,
      teamInfo,
      queryTeamParam,
    }
  },
})
</script>

<style scoped lang="less"></style>
