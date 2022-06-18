<template>
  <div>
    <PageFormTableWrapper :showSearchForm="false">
      <template #table>
        <a-spin :spinning="spinningLoading">
          <a-row :gutter="24" style="max-height: 85vh; overflow-y: scroll; padding-bottom: 6vh">
            <a-col :md="24">
              <FormTeamInfo ref="FormTeamInfo" :comType="comType" :updateState="updateState" :queryTeamParam="queryTeamParam"></FormTeamInfo>
            </a-col>
            <a-col :md="24">
              <FormTeamType ref="FormTeamType" :comType="comType" :updateState="updateState" :queryTeamParam="queryTeamParam"></FormTeamType>
            </a-col>
            <a-col :md="24">
              <FormChargeInfo ref="FormChargeInfo" :comType="comType" :updateState="updateState" :queryTeamParam="queryTeamParam"></FormChargeInfo>
            </a-col>

            <a-col :md="24" style="height: 40px"> </a-col>

            <div class="btnContainer" v-if="baseTeamInfo.albe0026 == '0'" style="align-items: center; justify-content: center">
              <div v-if="!isClickUpBtn" style="width: 50%">
                <div class="footerBtn" style="width: 100%; align-items: center; justify-content: space-between">
                  <div class="msgContent">
                    当前审核不通过，需要重新提交资料再审核。
                    <span v-show="baseTeamInfo.notpassreason">原因：{{ baseTeamInfo.notpassreason }}</span>
                  </div>

                  <a-button type="primary" size="large" @click="handleUpdateTeamInfo('change')">{{
                    baseTeamInfo.albe0091 == '0' ? '修改信息' : '变更信息'
                  }}</a-button>
                </div>
              </div>
              <div v-else class="threeBtnContent">
                <a-space>
                  <a-button type="primary" @click="handleSubmit('reset')">重置</a-button>
                  <a-button @click="handleSubmit('submit')">保存</a-button>
                  <a-button @click="handleSubmit('back')">返回</a-button>
                </a-space>
              </div>
            </div>

            <div class="btnContainer" v-if="baseTeamInfo.albe0026 == '1'" style="justify-content: center">
              <div v-if="!isClickUpBtn" style="width: 100%; display: flex; justify-content: space-between">
                <div class="footerBtn">
                  <a-button type="primary" size="large" @click="handleUpdateTeamInfo('normalUpdate')">修改信息</a-button>
                  <div class="msgContent">适用于修改负责人/联系人信息,队伍简介,队伍图片,队伍网站等次要信息,无需审核</div>
                </div>
                <div class="footerBtn">
                  <a-button type="primary" size="large" @click="handleUpdateTeamInfo('change')">变更信息</a-button>
                  <div class="msgContent">除用户名/队伍编号外,所有信息均可修改,修改后需要审核,审核期间队伍无法进行其他操作,请谨慎使用此功能</div>
                </div>
              </div>
              <div v-else class="threeBtnContent">
                <a-space>
                  <a-button type="primary" @click="handleSubmit('reset')">重置</a-button>
                  <a-button type="primary" @click="handleSubmit('submit')">保存</a-button>
                  <a-button @click="handleSubmit('back')">返回</a-button>
                </a-space>
              </div>
            </div>

            <div class="btnContainer" v-if="baseTeamInfo.albe0026 == '2'" style="justify-content: center">
              <div class="footerBtn">
                <div class="msgContent">
                  {{ baseTeamInfo.albe0091 == '0' ? '注册审核' : '变更审核' }}已提交，审核过程中队伍不能进行其他操作，请耐心等待审核完成！
                </div>
              </div>
            </div>
          </a-row>
        </a-spin>
      </template>
    </PageFormTableWrapper>
    <a-modal v-model:visible="dialogVisible" title="变更须知">
      <div class="modalBody">
        <div class="modaltitle">
          <span style="color: red; font-size: 18px">此队伍修改功能请慎用！修改完成后需重新走审核流程，但其它数据信息不会变动！！！</span>
        </div>
        <div style="margin-top: 10px; font-size: 16px">
          <p>1、需要修改队伍类型的可以使用。</p>
          <p>2、登记机关选择错误的可以使用。</p>
          <p>3、志愿服务团体需更换上级志愿服务组织时可以使用。</p>
          <p>4、队伍资料数据不完整影响后续操作的可以使用。</p>
        </div>
      </div>
      <template #footer>
        <a-button key="submit" type="primary" :disabled="btnDisabled.isDisabled" @click="handleModalSubmit()">
          <a-space>
            <span>确定</span>
            <span v-if="btnDisabled.timer > 0">{{ btnDisabled.timer }}S</span>
          </a-space>
        </a-button>
      </template>
    </a-modal>
    <a-modal v-model:visible="reviewMsgVisible" title="催促审核" @ok="reviewMsgVisible = false" @cancel="reviewMsgVisible = false">
      <div>当前队伍/管理部门，联系方式为 {{ upperteamphone }}，您可拨打电话联系队伍，尽快审核</div>
    </a-modal>
    <a-modal :closable="false" class="logoutModal" v-model:visible="logoutVisible">
      <div style="margin-top: 10px; font-size: 16px">您的变更申请已提交，请退出重新登录</div>
      <template #footer>
        <a-button key="submit" type="primary" @click="logout">
          <span>确定</span>
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, onBeforeMount, toRefs, provide } from 'vue'
import FormChargeInfo from '../subteamManagement/common/formInfo/FormChargeInfo.vue'
import FormTeamType from '../subteamManagement/common/formInfo/FormTeamType.vue'
import FormTeamInfo from '../subteamManagement/common/formInfo/FormTeamInfo.vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import apis from '@/server/request'
import { message, Modal } from 'ant-design-vue'
import moment from 'moment'
import { useRouter, useRoute } from 'vue-router'
import store from '@/store'
import { rpcPost } from '@/server/conf'
export default defineComponent({
  components: {
    FormChargeInfo,
    FormTeamType,
    FormTeamInfo,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const userInfo = reactive(LocalGetUserInfo())
    const dialogVisible = ref(false)
    const reviewMsgVisible = ref(false)
    const isClickUpBtn = ref(false)
    const showMsgDisabled = ref(false)
    const logoutVisible = ref(false)
    const spinningLoading = ref(true)
    const comType = ref('view')
    const btnDisabled = reactive({
      isDisabled: true,
      timer: 5,
    })
    const upperteamphone = ref('')
    const FormTeamInfo = ref()
    const FormTeamType = ref()
    const FormChargeInfo = ref()
    const currentUpdateState = ref()
    const updateState = ref('')
    const baseTeamInfo = ref({})
    const notpassreason = ref('')
    const queryTeamParam = reactive({
      teamId: '',
      areaId: '',
    })
    provide('baseTeamInfoPro', baseTeamInfo)

    const getTeamInfo = async () => {
      const bean = {
        userflag: userInfo.userflag,
        areaid: userInfo.areaid == '100000000000000000' || userInfo.areaid == '000000000000000000' ? '100000000000000000' : userInfo.areaid, //全国的队伍传100000000000000000,
      }
      const res = await rpcPost('getGroupInfoByUserFlagFortisLogic', { bean })
      let teamInfo = res.data
      if (!teamInfo) {
        return message.warning('队伍信息获取失败！')
      }
      if (teamInfo) {
        const params = {
          areaid: userInfo.areaid,
          id: teamInfo.groupid,
        }
        queryTeamParam.areaId = userInfo.areaid
        queryTeamParam.teamId = teamInfo.groupid
        updateState.value = 'none'
        const res = await apis.getTeamInfoFortis(params)
        if (res.code == '0') {
          if (res.data) {
            baseTeamInfo.value = res.data
            if (baseTeamInfo.value.albe0026 == '2') {
              comType.value = 'teamReviewIng'
            }
            upperteamphone.value = res.data.upperteamphone
          }
        } else {
          message.warning(res.message)
        }
      }
      spinningLoading.value = false
    }
    const showChangeModal = () => {
      dialogVisible.value = true
      btnDisabled.isDisabled = true
      btnDisabled.timer = 5
      for (let i = 0; i < btnDisabled.timer; i++) {
        ;(function () {
          setTimeout(() => {
            btnDisabled.timer--
            if (btnDisabled.timer == 0) {
              btnDisabled.isDisabled = false
            }
          }, i * 1000)
        })()
      }
    }
    const handleUpdateTeamInfo = (utstate) => {
      comType.value = utstate
      if (utstate == 'change') {
        // 注册审核不显示modal

        if (baseTeamInfo.value.albe0026 == '0' && baseTeamInfo.value.albe0091 == '0') {
          handleModalSubmit()
        } else {
          showChangeModal()
        }
      } else {
        isClickUpBtn.value = true
        updateState.value = utstate
        currentUpdateState.value = utstate
      }
    }
    const dealEmptyArrEle = (arr) => {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == undefined) {
          arr.splice(i, 1)
          i = i - 1
        }
      }
      return arr
    }
    const getTeamTypeParams = () => {
      const form = FormTeamType.value.formTeamTypeOwnParam
      const params = {
        albe0003: form.albe0003,
      }
      Object.keys(form).forEach((key) => {
        if (form[key]) {
          params[key] = form[key]
        }
      })

      if (!form.albe0003) {
        return message.warning('队伍类型必须选择')
      } else {
        if (form.albe0003 == '1') {
          if (form.albe0063 == '0' && form.albe0065 == '0') {
            params.albe0066 = null
            params.topname = null
            params.albe0004 = null
            params.orgname = null
          } else if (form.albe0065 == '1' && form.albe0063 == '0') {
            params.albe0004 = null
            params.orgname = null
          } else if (form.albe0065 == '0' && form.albe0063 == '1') {
            params.albe0066 = null
            params.topname = null
          } else if (form.albe0065 == '1' && form.albe0063 == '1') {
            return message.warning('直属组织和联络组织只能选择一个')
          }
        } else {
          params.albe0065 = '0'
          params.albe0066 = ''
          params.topname = ''
          if (params.albe0063 == '0') {
            params.albe0004 = ''
            params.orgname = ''
          }
        }
      }
      params['albe0009'] = dealEmptyArrEle(params['albe0009'])
      if (form.albe0003 == '1') {
        if (form.albe0063 == '0' && form.albe0065 == '0') {
          params.albe0009 = params['albe0009'].slice(-1)[0]
        } else {
          delete params.albe0009
        }
        delete params.albe0067
      } else {
        params.albe0009 = params['albe0009'].slice(-1)[0]
        delete params.albe0044
      }
      params.albe0045 && delete params.albe0045
      return params
    }

    const updateTeamInfo = async () => {
      let params = null
      let type = null
      const { albe0002, albe0012, albe0015, albe0013, albe0017, albe0042, albe0043, albe0040, albe0032 } =
        FormTeamInfo.value.$refs.form_teamInfo.getFieldsValue()
      const { albe0018, albe0019, albe0020, albe0021, albe0022, albe0023, albe0024, albe0049 } =
        FormChargeInfo.value.$refs.form_conTactInfo.getFieldsValue()

      if (updateState.value == 'normalUpdate') {
        type = '1'
        params = {
          albe0050: FormTeamInfo.value.formParam['albe0050'] || null,
          albe0051: FormTeamInfo.value.formParam['albe0051'] || null,
          albe0025: FormTeamInfo.value.formParam['albe0025'] || null,
          albe0017: albe0017.join(',') || null,
          albe0042: albe0042.join(',') || null,
          albe0043: albe0043.join(',') || null,
          albe0013: albe0013 || null,
          albe0032: albe0032 || null,
          albe0040: albe0040 || null,

          albe0018: albe0018 || null,
          albe0019: albe0019 || null,
          albe0020: albe0020 || null,
          albe0021: albe0021 || null,
          albe0022: albe0022 || null,
          albe0023: albe0023 || null,
          albe0024: albe0024 || null,
          albe0049: albe0049 || null,
          albe0047: FormChargeInfo.value.isOpenPhone['isPhoneOpen'] === true ? '1' : '0',
          albe0048: FormChargeInfo.value.isOpenPhone['isTelOpen'] === true ? '1' : '0',
        }
      } else {
        type = '2'
        const teamTypeParams = getTeamTypeParams()
        const _albe0012 = dealEmptyArrEle(albe0012)

        params = {
          albe0002: albe0002 || null,
          albe0012: _albe0012.slice(-1)[0],
          albe0015: moment(albe0015).format('YYYY-MM-DD') || null,
          albe0013: albe0013 || null,
          albe0050: FormTeamInfo.value.formParam['albe0050'] || null,
          albe0051: FormTeamInfo.value.formParam['albe0051'] || null,
          albe0025: FormTeamInfo.value.formParam['albe0025'] || null,
          albe0017: albe0017.join(',') || null,
          albe0042: albe0042.join(',') || null,
          albe0043: albe0043.join(',') || null,
          albe0032: albe0032 || null,
          albe0040: albe0040 || null,

          albe0018: albe0018 || null,
          albe0019: albe0019 || null,
          albe0020: albe0020 || null,
          albe0021: albe0021 || null,
          albe0022: albe0022 || null,
          albe0023: albe0023 || null,
          albe0024: albe0024 || null,
          albe0049: albe0049 || null,
          albe0047: FormChargeInfo.value.isOpenPhone['isPhoneOpen'] === true ? '1' : '0',
          albe0048: FormChargeInfo.value.isOpenPhone['isTelOpen'] === true ? '1' : '0',

          ...teamTypeParams,
        }
      }

      const subParams = {
        ...params,
        id: queryTeamParam.teamId,
        type,
        areaId: userInfo.areaid,
        albp0052: userInfo.userflag,
        oldTeamType: userInfo.team.albe0003,
      }

      let res = {}

      if (baseTeamInfo.value.albe0026 == '0' && baseTeamInfo.value.albe0091 == '0') {
        subParams.id = baseTeamInfo.value.id

        res = await apis.submitAgainFortis(subParams)
      } else {
        res = await apis.updateOrChangeTeamFortis(subParams)
      }
      if (res.code == 0) {
        if (updateState.value == 'change') {
          showLogoutModal()
        }
        getTeamInfo()
        updateState.value = 'none'
        isClickUpBtn.value = false
        message.success(res.message)
      } else {
        message.warning(res.message)
      }
    }
    const validateInfoAndSubmit = async () => {
      const form_teamInfo = FormTeamInfo.value.$refs.form_teamInfo
      const form_conTactInfo = FormChargeInfo.value.$refs.form_conTactInfo
      const form_teamType = FormTeamType.value.$refs.formTeamTypeOwnRef
      let asyncArr
      if (updateState.value == 'normalUpdate') {
        asyncArr = [form_teamInfo.validate(), form_conTactInfo.validate()]
      } else {
        asyncArr = [form_teamInfo.validate(), form_conTactInfo.validate(), form_teamType.validate()]
      }
      Promise.all([...asyncArr])
        .then((res) => {
          updateTeamInfo()
        })
        .catch((e) => {
          message.warning(e.errorFields[0].errors[0])
        })
    }
    const showLogoutModal = () => {
      logoutVisible.value = true
    }
    const handleSubmit = (subState) => {
      if (subState == 'back') {
        updateState.value = 'none'
        isClickUpBtn.value = false
        getTeamInfo()
      } else if (subState == 'reset') {
        updateState.value = 'none'
        isClickUpBtn.value = false
        getTeamInfo()
      } else if (subState == 'submit') {
        if (updateState.value == 'normalUpdate') {
          validateInfoAndSubmit()
        } else {
          Modal.confirm({
            title: '确认变更后，信息将重新提交审核，在此期间其他信息无法查看处理。请再次确认是否变更',
            cancelText: '取消',
            okText: '确认',
            onOk: () => {
              validateInfoAndSubmit()
            },
          })
        }
      }
    }
    const handleModalSubmit = () => {
      dialogVisible.value = false
      isClickUpBtn.value = true
      updateState.value = 'change'
      currentUpdateState.value = 'change'
    }
    onMounted(async () => {
      await getTeamInfo()
    })

    const showReviewMsg = () => {
      reviewMsgVisible.value = true
    }

    const logout = () => {
      logoutVisible.value = false
      store.dispatch('Logout').then(() => {
        router.push({ path: '/login' })
      })
      console.log('退出成功')
    }
    return {
      baseTeamInfo,
      handleUpdateTeamInfo,
      dialogVisible,
      reviewMsgVisible,
      updateState,
      isClickUpBtn,
      handleSubmit,
      FormTeamInfo,
      FormTeamType,
      FormChargeInfo,
      btnDisabled,
      handleModalSubmit,
      userInfo,
      showReviewMsg,
      upperteamphone,
      logoutVisible,
      showMsgDisabled,
      notpassreason,
      logout,
      queryTeamParam,
      comType,
      spinningLoading,
    }
  },
})
</script>

<style scoped lang="less">
.btnContainer {
  width: 100%;
  bottom: 55px;
  // height: 8vh;
  position: absolute;
  display: flex;
  flex: 1;
  justify-content: space-between;
}
.footerBtn {
  width: 49%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  background-color: rgb(217, 217, 217, 0.4);
}
.msgContent {
  margin-left: 10px;
  font-size: 16px;
  font-weight: 600;
}
.savebtnContainer {
  width: 100%;
  bottom: 10px;
  height: 4vh;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background-color: rgb(217, 217, 217, 0.4);
}
.threeBtnContent {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  border-radius: 10px;
  background-color: #d9d9d9;
}
.logoutModal {
  :deep(.ant-modal-content .ant-modal-footer div .ant-btn) {
    display: none;
  }
}
</style>
