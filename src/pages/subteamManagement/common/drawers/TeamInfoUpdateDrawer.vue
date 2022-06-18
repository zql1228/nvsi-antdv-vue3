<template>
  <a-drawer title="修改队伍信息" :visible="visible" :maskClosable="false" @close="onClose" width="800" class="drawerContent" placement="right">
    <a-spin :spinning="loading">
      <a-tabs class="teamTabs" :tabBarGutter="8" @change="(e) => (activeTabKey = e)" :activeKey="activeTabKey">
        <a-tab-pane key="1">
          <template #tab>
            <span>修改信息</span>
          </template>
          <a-form ref="form_updateTeamInfo" :model="formParam" :rules="rules" class="nv-form" :style="{ padding: ' 0 24px', height: '100%' }">
            <a-row :gutter="24">
              <a-col :md="24" :sm="24">
                <a-form-item label="队伍名称" name="albe0002" :labelCol="{ span: 4 }">
                  <a-input placeholder="队伍名称" v-model:value="formParam.albe0002" :disabled="teamInfo.albe0003 == '1' ? false : true" />
                </a-form-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-item label="负责人姓名" name="albe0022" :labelCol="{ span: 4 }">
                  <a-input placeholder="负责人姓名" v-model:value="formParam.albe0022" />
                </a-form-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-item label="负责人手机" name="albe0024" :labelCol="{ span: 4 }">
                  <a-input placeholder="负责人手机" v-model:value="formParam.albe0024" />
                </a-form-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-item label="联系人姓名" name="albe0018" :labelCol="{ span: 4 }">
                  <a-input placeholder="联系人姓名" v-model:value="formParam.albe0018" />
                </a-form-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-item label="联系人手机号" name="albe0019" :labelCol="{ span: 4 }">
                  <a-input placeholder="联系人手机号" v-model:value="formParam.albe0019" />
                </a-form-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-item label="联系人邮箱" name="albe0049" :labelCol="{ span: 4 }">
                  <a-input placeholder="联系人邮箱" v-model:value="formParam.albe0049" />
                </a-form-item>
              </a-col>
              <a-col :md="24" :sm="24">
                <a-form-item label="修改证明" name="albe2508" :labelCol="{ span: 4 }">
                  <div class="img_list" v-show="fileList.length > 0">
                    <div v-for="(item, index) in fileList" class="listItem">
                      <div style="width: 90%; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ item.showname }}</div>
                      <div style="text-align: right; cursor: pointer; color: red" @click="delImg(index)">删除</div>
                    </div>
                  </div>
                  <a-upload :file-list="fileList" name="file" :showUploadList="false" :beforeUpload="beforeUpload" :customRequest="handleFileUpload">
                    <a-button v-show="fileList.length <= 0" :style="fileList.length > 0 ? 'margin-top:8px;' : ''">
                      <template #icon><PlusOutlined /> </template>
                      上传
                    </a-button>
                  </a-upload>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="2">
          <template #tab>
            <span>操作记录</span>
          </template>
          <UpdateTeamInfoAction ref="teamInfoActionRef" :teamId="teamId"></UpdateTeamInfoAction>
        </a-tab-pane>
      </a-tabs>
    </a-spin>
    <div class="FooterBtn" v-show="activeTabKey == '1'">
      <a-space>
        <a-button style="margin-right: 8px" @click.prevent="centerSave">取消</a-button>
        <a-button type="primary" @click.prevent="headleSave">确认修改</a-button>
      </a-space>
    </div>
  </a-drawer>
</template>

<script>
import { defineComponent, reactive, ref, watch, onMounted, toRefs, onBeforeUnmount } from 'vue'
import EventBus from '@/utils/bus'
import { TeamInfoUpdateDrawerHook } from '../../Hooks/useRulesHook'
import { message, Modal } from 'ant-design-vue'
import apis from '@/server/request'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { uploadHandle, checkFileType } from '@/utils/upload'
import UpdateTeamInfoAction from './UpdateTeamInfoAction.vue'
import { PlusOutlined } from '@ant-design/icons-vue'
export default defineComponent({
  components: {
    UpdateTeamInfoAction,
    PlusOutlined,
  },
  setup() {
    const visible = ref(false)
    const activeTabKey = ref('1')
    const teamId = ref('')
    const userInfo = reactive(LocalGetUserInfo())
    const fileList = ref([]) //上传文件组件按钮的文件列表
    const urllist = ref([]) //修改查看时返回的文件下载列表
    const record = ref({})
    // 通过传过来的 id 和 areaId 查到的队伍详情
    const teamInfo = ref({})
    const teamInfoActionRef = ref()
    const currentState = ref('0')
    const loading = ref(true)
    // 表单绑定的数据
    const formParam = reactive({
      id: '',
      albe0002: '', // 队伍名称
      albe0022: '', // 负责人姓名
      albe0024: '', // 负责人手机
      albe0018: '', // 联系人姓名
      albe0019: '', // 联系人手机
      albe0049: '', // 联系人邮箱
      albe2508: '', // 修改证明
    })

    const form_updateTeamInfo = ref()
    const reset = () => {
      fileList.value = []
      activeTabKey.value = '1'
    }
    const onClose = () => {
      form_updateTeamInfo.value.resetFields()
      formParam.albe2508 = ''
      currentState.value = '0'
      reset()
      visible.value = false
    }
    const delImg = (index) => {
      //文件上传 文件删除
      fileList.value.splice(index, 1)
      if (urllist.value[index]) {
        urllist.value.splice(index, 1)
      }
      formParam.albe2508 = ''
    }

    const getTeamInfo = async (id, areaId) => {
      let params = { id, areaId }
      const res = await apis.getTeamInfoFortis(params)
      // setTimeout(() => {
      loading.value = false
      // }, 2000)
      if (res.code == '0' && res.data) {
        const { data } = res
        teamInfo.value = data
        formParam['id'] = data['id']
        formParam['albe0002'] = data['albe0002'] // 队伍名称
        formParam['albe0022'] = data['albe0022'] // 负责人姓名
        formParam['albe0024'] = data['albe0024'] // 负责人手机
        formParam['albe0018'] = data['albe0018'] // 联系人姓名
        formParam['albe0019'] = data['albe0019'] // 联系人手机
        formParam['albe0049'] = data['albe0049'] // 联系人邮箱
      } else {
        teamInfo.value = {}
      }
    }
    // 取消
    const centerSave = () => {
      onClose()
    }
    const repeatCheck = () => {
      // return true
      // 如果是团体类 可以修改名称 组织类就不能修改
      let tInfo = teamInfo.value
      if (teamInfo.value.albe0003 == '1') {
        if (
          formParam['albe0002'] == tInfo['albe0002'] &&
          formParam['albe0022'] == tInfo['albe0022'] &&
          formParam['albe0024'] == tInfo['albe0024'] &&
          formParam['albe0018'] == tInfo['albe0018'] &&
          formParam['albe0019'] == tInfo['albe0019'] &&
          formParam['albe0049'] == tInfo['albe0049']
        ) {
          return false
        } else {
          return true
        }
      } else {
        // 组织类不让修改队伍名称
        if (
          formParam['albe0022'] == tInfo['albe0022'] &&
          formParam['albe0024'] == tInfo['albe0024'] &&
          formParam['albe0018'] == tInfo['albe0018'] &&
          formParam['albe0019'] == tInfo['albe0019'] &&
          formParam['albe0049'] == tInfo['albe0049']
        ) {
          return false
        } else {
          return true
        }
      }
    }
    // 保存
    const headleSave = () => {
      form_updateTeamInfo.value
        .validate()
        .then(() => {
          // 这里做重复性校验
          // const { flag, msg } = repeatCheck()
          if (repeatCheck()) {
            Modal.confirm({
              title: '是否确认修改?',
              async onOk() {
                updateNextTeamInfoFortis()
                // onClose()
              },
            })
          } else {
            // '本次修改后信息与修改前一样，请重新修改提交'
            message.warning('本次修改后信息与修改前一样，请重新修改提交')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
    const updateNextTeamInfoFortis = async () => {
      /*
       id	是	队伍id
       albe0002	是	队伍名
       albe0019	是	联系人手机
       albe0022	是	负责人姓名
       albe0024	是	负责人手机
       albe0049	是	联系人邮箱

       userId	是	当前登录队伍用户id
       areaId	是	队伍区划
       albe0018	是	团体联系人
       userFlag	是	当前登录队伍队伍名
       */
      const params = {
        ...formParam,
        userId: userInfo.team.groupid,
        areaId: userInfo.areaid,
        // albe0018: userInfo.team.albe0018,
        userFlag: userInfo.userflag,
        fullName: userInfo.fullName,
      }
      const res = await apis.updateNextTeamInfoFortis(params)
      if (res.code == 0) {
        message.success(res.message)
        reset()
        // EventBus.emit('refreshReviewTable')
        refreshTeamInfoActionTable()
        // visible.value = false
      } else {
        message.warning(res.message)
      }
    }

    // 图片上传
    const handleFileUpload = async (options) => {
      const res = await uploadHandle(options)
      if (res) {
        fileList.value[0] = res
        formParam.albe2508 = res
        message.success('上传成功')
      } else {
        message.warning('上传失败')
      }
    }
    const beforeUpload = (file) => {
      const flag = checkFileType(file)
      if (!flag) {
        message.warning('上传文件格式错误，请重新上传')
        return false
      }
      return true
    }
    // 表单规则
    const rules = ref({})
    rules.value = TeamInfoUpdateDrawerHook(formParam, teamInfo)
    // watch(
    //   () => formParam.albe2508,
    //   () => {
    //     if ((currentState.value = 'update')) {
    //       rules.value = TeamInfoUpdateDrawerHook(formParam, teamInfo)
    //       if (!loading.value) {
    //         form_updateTeamInfo.value.validate()
    //       }
    //       // if (form_updateTeamInfo.value) {
    //       //   form_updateTeamInfo.value.validate()
    //       // }
    //     }
    //   },
    //   {
    //     immediate: true,
    //     deep: true,
    //   }
    // )
    // watch(
    //   () => visible,
    //   () => {
    //     if (!visible.value) {
    //       onClose()
    //     }
    //   }
    // )
    const refreshTeamInfoActionTable = () => {
      teamInfoActionRef.value.$refs.teamActionTable.refresh()
    }
    const EventBusListener = () => {
      EventBus.on('updateTeamInfo', (params) => {
        currentState.value = 'update'
        visible.value = true
        const { id, albe0012 } = params.record
        record.value = params.record
        teamId.value = params.record.id
        getTeamInfo(id, albe0012)
      })
    }
    onBeforeUnmount(() => {
      EventBus.off('updateTeamInfo')
    })
    onMounted(() => {
      EventBusListener()
    })
    return {
      visible,
      teamId,
      form_updateTeamInfo,
      activeTabKey,
      onClose,
      rules,
      formParam,
      centerSave,
      headleSave,
      handleFileUpload,
      beforeUpload,
      fileList,
      delImg,
      teamInfo,
      teamInfoActionRef,
      loading,
    }
  },
})
</script>

<style lang="less" scoped>
// width: 90%;
//     white-space: nowrap;
//     text-overflow: ellipsis;
//     overflow: hidden;
.img_list {
  height: 40px;
  display: flex;
  align-items: center;
  max-width: 580px;
  .listItem {
    width: 100%;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid;
  }
}
.drawerContent {
  .ant-drawer-content {
    :deep(.ant-drawer-body) {
      height: 94%;
    }
  }
}

.teamTabs {
  height: 100%;
}
.FooterBtn {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e9e9e9;
  padding: 10px 16px;
  background: #fff;
  text-align: right;
  z-index: 1;
}
</style>
