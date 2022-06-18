<template>
  <a-drawer title="项目发布审核" placement="right" :visible="visible" :maskClosable="false" @close="onClose" width="800">
    <a-row>
      <a-card style="width: 100%">
        <a-form ref="form_review" :model="formParam" layout="vertical" :rules="rules" class="nv-form" :style="{ padding: ' 0 24px' }">
          <a-row>
            <!-- 若你是此项目发布队伍的直属组织，提示语为 
             “此队伍发布了一个新项目，作为其直属组织，请审核此项目信息，并选择是否同意项目发布” -->
            <!-- 若你是此项目发布队伍的联络组织，提示语为
              “此队伍发布了一个新项目，作为其联络组织，请审核此项目信息，并选择是否同意项目发布” -->
            <div>此队伍发布了一个新项目，作为其{{ tabkey == 'direGroup' ? '直属组织' : '联络组织' }}，请审核此项目信息，并选择是否同意项目发布</div>
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
            <a-button type="primary" @click="confirmReview(true)">确认审核</a-button>
            <a-button @click="viewProjectDetails">查看项目详情</a-button>
          </a-row>
        </a-form>
      </a-card>
    </a-row>
  </a-drawer>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, onBeforeUnmount } from 'vue'
import EventBus from '@/utils/bus'
import apis from '@/server/request'
import { message } from 'ant-design-vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { TeamReviewDrawerHook } from '../../Hooks/useRulesHook'
import { LocalSetProjectInfo } from '@/utils/localStorage.js'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const userInfo = reactive(LocalGetUserInfo())

    const router = useRouter()
    const visible = ref(false)
    const tabkey = ref('') // 判断提示语
    const formParam = reactive({
      ispass: '1',
      option: '',
    })
    const rules = TeamReviewDrawerHook(formParam)
    const proInfo = ref({})
    const form_review = ref()
    const onClose = () => {
      init()
    }
    const init = () => {
      visible.value = false
      formParam.option = ''
      formParam.ispass = '1'
    }
    onBeforeUnmount(() => {
      EventBus.off('handleProjectReview')
    })
    onMounted(() => {
      EventBusListener()
    })
    const confirmReview = (flag) => {
      // 取消按钮
      if (!flag) {
        init()
      } else {
        form_review.value
          .validate()
          .then(async () => {
            const params = {
              albx0532: formParam.ispass, //	是	是否通过（0：不通过  1：通过）
              albx0533: formParam.option, //	是	审核意见
              proId: proInfo.value.albx7302, //	是	项目id
              albx0004: proInfo.value.albx0004,
              albx0005: proInfo.value.albx0005,
              areaId: userInfo.areaid, //	是	区域id
              userFlag: userInfo.userflag, //	是	审核队伍账号
            }
            console.log(proInfo, params, 'params...项目审核')
            const res = await apis.updateProStateFortis(params)
            console.log(res, 'res...项目审核')
            if (res.code == '0') {
              EventBus.emit('refreshProReviewTable')
              message.success(res.message)
            } else {
              message.warning(res.message)
            }
            init()
          })
          .catch((e) => {})
      }
    }
    const EventBusListener = () => {
      EventBus.on('handleProjectReview', (params) => {
        visible.value = true
        const { record, tableType, tabsKey } = params
        tabkey.value = tabsKey
        proInfo.value = record
      })
    }
    const viewProjectDetails = () => {
      let obj = {
        type: 'view', //查看
        isRepair: proInfo.value.albx0024 == 6 ? true : false, //是否是补录项目
        projectId: proInfo.value.albx7302,
        areaId: proInfo.value.albx7308,
      }
      LocalSetProjectInfo(obj)
      router.push({
        path: '/publishProject',
      })
      console.log(proInfo, 'proInfo')
    }
    return {
      visible,
      onClose,
      rules,
      tabkey,
      formParam,
      form_review,
      confirmReview,
      viewProjectDetails,
    }
  },
})
</script>

<style scoped lang="less"></style>
