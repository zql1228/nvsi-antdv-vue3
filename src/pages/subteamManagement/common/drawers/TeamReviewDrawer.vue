<template>
  <!-- 队伍注册审核--drawer -->

  <a-drawer title="队伍注册审核" placement="right" :visible="visible" :maskClosable="false" @close="onClose" width="1000">
    <a-spin :spinning="spinning">
      <a-row>
        <a-card style="width: 100%">
          <a-form ref="form_review" :model="formParam" layout="vertical" :rules="rules" class="nv-form" :style="{ padding: ' 0 24px' }">
            <a-row>
              <!-- -注册为团体，选择了有直属组织的： albe0003 为1 0066 有值 -->
              <div v-if="tInfo.albe0003 == '1' && tInfo.albe0066">
                此队伍注册时将你的队伍选择为了直属组织，请审核此队伍信息，并选择是否同意此队伍注册通过
              </div>
              <!-- -注册为团体，选择了有联络组织的： // albe0003为1 0004 有值 -->
              <div v-if="tInfo.albe0003 == '1' && tInfo.albe0004">
                此队伍注册时将你的队伍选择为了联络组织，请审核此队伍信息，并选择是否同意此队伍注册通过
              </div>
              <!-- -注册为组织，选择了有联络组织的：  // albe0003 不为1  albe0004 有值 -->
              <div v-if="tInfo.albe0003 !== '1' && tInfo.albe0004">
                此队伍注册时将你的队伍选择为了联络组织挂靠，请审核此队伍信息，并选择是否同意此队伍挂靠你的队伍为联络组织
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
          <!-- :baseTeamInfo="teamInfo" -->
          <FormTeamInfo updateState="notAllowUpdate" :queryTeamParam="queryTeamParam" comType="review"></FormTeamInfo>
        </a-col>
        <a-col :md="24">
          <FormTeamType updateState="notAllowUpdate" :queryTeamParam="queryTeamParam" comType="review"></FormTeamType>
        </a-col>
        <a-col :md="24">
          <FormChargeInfo updateState="notAllowUpdate" :queryTeamParam="queryTeamParam" comType="review"></FormChargeInfo>
        </a-col>
      </a-row>
    </a-spin>
  </a-drawer>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, onBeforeUnmount, toRefs } from 'vue'
import FormTeamInfo from '../formInfo/FormTeamInfo'
import FormTeamType from '../formInfo/FormTeamType'
import FormChargeInfo from '../formInfo/FormChargeInfo.vue'
import EventBus from '@/utils/bus'
import apis from '@/server/request'
import { message } from 'ant-design-vue'
import { TeamReviewDrawerHook } from '../../Hooks/useRulesHook'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
export default defineComponent({
  components: {
    FormTeamInfo,
    FormTeamType,
    FormChargeInfo,
  },
  emits: ['refreshReviewTable'],
  setup(props, ctx) {
    const userInfo = reactive(LocalGetUserInfo())
    // 缓存的点击审核的队伍信息
    const teamInfo = ref({})
    const visible = ref(false)
    const loadingBtn = ref(false)
    const btnDisabled = ref(false)
    const spinning = ref(true)
    const queryTeamParam = reactive({
      teamId: '',
      areaId: '',
    })

    const tInfo = reactive({
      albe0003: '',
      albe0004: '',
      albe0066: '',
    })
    const formParam = reactive({
      ispass: '1',
      option: '',
    })
    const rules = TeamReviewDrawerHook(formParam)
    const form_review = ref()
    const type = ref('') // 列表类型(1 注册审核 2 变更审核 3.正式队伍)
    const category = ref('') // tab类型（1 直属团体 2 下级团体 3 下级组织）
    onBeforeUnmount(() => {
      EventBus.off('teamReview')
    })
    onMounted(() => {
      EventBusListener()
    })

    const onClose = () => {
      init()
    }
    const init = () => {
      visible.value = false
      loadingBtn.value = false
      btnDisabled.value = false
      formParam.option = ''
      formParam.ispass = '1'
      teamInfo.value = {}
    }
    // 处理eventBus传参
    const dealParams = (tableType, tabsKey) => {
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
      const params = {
        id: record.id,
        areaId: record.albe0012,
      }
      queryTeamParam.teamId = record.id
      queryTeamParam.areaId = record.albe0012
      const res = await apis.getTeamInfoFortis(params)
      spinning.value = false
      if (res.code === '0' || res.code === 0) {
        teamInfo.value = res.data
        // albe0003: 团体类型  | albe0066 直属上级法人组织ID  | albe0004 联络团体ID
        tInfo.albe0003 = res.data.albe0003
        tInfo.albe0004 = res.data.albe0004
        tInfo.albe0066 = res.data.albe0066
        loadingBtn.value = false
      } else {
        btnDisabled.value = true
        loadingBtn.value = false
        message.warning(res.message)
      }
    }

    const confirmReview = (flag) => {
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
                userFlag: userInfo.userflag, //当前登录用户名
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
                userFlag: userInfo.userflag, //当前登录用户名
              }

              const res = await apis.updateTeamStateFortis(params)
              if (res.code == '0') {
                EventBus.emit('refreshReviewTable')
                ctx.emit('refreshReviewTable')
                message.success(res.message)
                init()
              } else {
                message.warning(res.message)
              }
            }
          })
          .catch((e) => {})
      }
    }
    const EventBusListener = () => {
      EventBus.on('teamReview', async (params) => {
        visible.value = true
        const { record, tableType, tabsKey } = params
        dealParams(tableType, tabsKey)
        await getTeamInfo(record)
      })
    }
    return {
      form_review,
      visible,
      onClose,
      tInfo,
      loadingBtn,
      btnDisabled,
      formParam,
      rules,
      confirmReview,
      teamInfo,
      queryTeamParam,
      spinning,
    }
  },
})
</script>

<style scoped lang="less"></style>
