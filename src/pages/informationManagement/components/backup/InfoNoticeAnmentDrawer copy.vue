<template>
  <!-- 通知公告 -->
  <a-drawer title="新增通知公告" placement="right" :visible="visible" @close="onClose" width="800">
    <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 21 }" ref="formRef" :model="formParam" :rules="rules">
      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-item name="title" label="标题" :wrapper-col="{ span: 10 }">
            <a-input v-model:value="formParam.title" type="text" placeholder="请输入公告标题" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item name="urgentlevel" label="紧急程度">
            <a-radio-group v-model:value="formParam.urgentlevel" :options="optionsList.levelOption" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item name="sort" label="通知类别">
            <a-radio-group :options="optionsList.noticeTypeOption" v-model:value="formParam.sort" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item name="unit" label="接收单位">
            <a-checkbox-group :options="optionsList.unitOption" v-model:value="formParam.unit" />
          </a-form-item>
        </a-col>
        <a-col :span="24" v-show="formParam.unit.indexOf('3') != -1">
          <a-form-item name="personnelList" :label-col="{ span: 0 }" :wrapper-col="{ span: 16, offset: 4 }">
            <a-select mode="multiple" v-model:value="formParam.personnelList" placeholder="请点击右侧按钮选择人员">
              <a-select-option v-for="(item, index) in options.personnelList" :key="index" :value="item.id">{{ item.name }} </a-select-option>
            </a-select>
            <a-button type="primary" style="position: absolute; padding: 0 18px" @click="openModel('personnel')">选择人员</a-button>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="接收志愿队伍" name="team">
            <a-radio-group v-model:value="formParam.team" :options="optionsList.teamOption" />
          </a-form-item>
        </a-col>
        <a-col :span="24" v-show="formParam.team.indexOf('1') != -1">
          <a-form-item name="teamList" :label-col="{ span: 0 }" :wrapper-col="{ span: 16, offset: 4 }">
            <a-select mode="multiple" v-model:value="formParam.teamList" placeholder="请点击右侧按钮选择队伍">
              <a-select-option v-for="(item, index) in options.teamList" :key="index" :value="item.id">{{ item.name }} </a-select-option>
            </a-select>
            <a-button type="primary" style="position: absolute; padding: 0 18px" @click="openModel('team')">选择队伍</a-button>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item name="content" label="通知内容">
            <QuillEditor v-model:value="formParam.content" theme="snow" toolbar="full" ref="QuillEditor" maxlength="15000" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item name="file" label="附件">
            <a-row v-for="(item, index) in fileList" :key="index" justify="end" style="border-bottom: 1px solid#666; margin-top: 5px">
              <a-col span="18">
                <a-col span="22" class="white">{{ item.showname }}</a-col>
              </a-col>
              <a-col span="6">
                <a-row justify="end">
                  <a-col span="12" style="text-align: right">
                    <a style="border-bottom: 1px solid red" :href="urllist[index]" v-if="urllist[index]">下载</a>
                  </a-col>
                  <a-col span="12" style="text-align: right">
                    <a :class="currentPanelState == 'edit' ? 'border_aaa' : 'border_red'" @click="delUploadFile(index)">删除</a>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
            <a-upload :file-list="fileList" name="file" :showUploadList="false" :beforeUpload="beforeUpload" :customRequest="handleFileUpload">
              <a-button :style="fileList.length > 0 ? 'margin-top:8px;' : ''">
                <template #icon><PlusOutlined /> </template>
                上传</a-button
              >
            </a-upload>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div class="btnContainer" v-if="currentPanelState == 'view'">
      <a-button style="margin-right: 8px" @click="submit('save')" :loading="loading_btnSava" :disabled="loading_btnSend">暂存</a-button>
      <a-button type="primary" @click="submit('send')" :loading="loading_btnSend" :disabled="loading_btnSava">发送</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, onBeforeUnmount, toRefs } from 'vue'
import EventBus from '@/utils/bus'
import { useInfoNoticeDrawerHook, useInfoNoticeOptionHook } from './useRulesHook'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { uploadHandle, checkFileType } from '@/utils/upload'
import { message } from 'ant-design-vue/es'
import { rpcPost } from '@/server/conf'
import { PlusOutlined } from '@ant-design/icons-vue'
export default defineComponent({
  components: {
    PlusOutlined,
  },
  setup() {
    const userInfo = reactive(LocalGetUserInfo())
    const formRef = ref()
    const visible = ref(false)
    const currentPanelState = ref() // add 新增  edit 编辑修改  view 查看
    let currentRecord = reactive({})
    const loading_btnSava = ref(false)
    const loading_btnSend = ref(false)
    const formParam = reactive({
      title: '', // 通知公告标题
      urgentlevel: '', //紧急程度
      sort: '', //通知类别
      content: '', //通知内容
      unit: [], //接收单位
      team: '', //接收志愿队伍
      personnelList: [], //选中人员id数组
      teamList: [], //选中队伍id数组
    })
    const options = reactive({
      personnelList: [], //从弹窗传过来的人员对象数组
      teamList: [], //从弹窗传过来的队伍对象数组
    })
    const QuillEditor = ref() //富文本对象form.content = QuillEditor.value.getHTML()
    const fileList = ref([]) //上传文件组件按钮的文件列表
    const urllist = ref([]) //修改查看时返回的文件下载列表
    const onClose = () => {
      visible.value = false
    }
    onBeforeUnmount(() => {
      EventBus.off('handleAddNotice')
    })
    onMounted(() => {
      EventBusListener()
    })
    const optionsList = useInfoNoticeOptionHook(userInfo)
    const rules = useInfoNoticeDrawerHook(formParam, QuillEditor)
    const beforeUpload = (file) => {
      //文件格式校验
      const flag = checkFileType(file)
      if (!flag) {
        message.warning('上传文件格式错误，请重新上传')
        return false
      }
      return true
    }

    // 文件上传
    const handleFileUpload = async (options) => {
      const res = await uploadHandle(options)
      if (res) {
        message.success('上传成功')
        fileList.value.push(res)
      } else {
        message.warning('上传失败')
      }
    }

    const delUploadFile = (index) => {
      //文件上传 文件删除
      if (currentPanelState.value !== 'view') {
        fileList.value.splice(index, 1)
        if (urllist.value[index]) {
          urllist.value.splice(index, 1)
        }
      }
    }
    const EventBusListener = () => {
      EventBus.on('handleAddNotice', () => {
        currentPanelState.value = 'edit'
        visible.value = true
      })
    }
    const submit = (sendstatus) => {
      formRef.value.validate().then(() => {
        let bean = {
          bean: {
            creatorid: userInfo.userid,
            sendstatus: sendstatus == 'save' ? '2' : '1', //暂存2 修改1
            title: formParam.title,
            urgentlevel: formParam.urgentlevel,
            sort: formParam.sort,
            content: QuillEditor.value.getHTML(),
            provice: formParam.unit.indexOf('0') != -1 ? true : null,
            city: formParam.unit.indexOf('1') != -1 ? true : null,
            county: formParam.unit.indexOf('2') != -1 ? true : null,
            team: formParam.team == 0 ? true : null,
            annex: JSON.stringify(fileList.value), //附件
          },
          areaid: userInfo.areaid,
          level: userInfo.areaLevel,
        }
        let arr = []
        if (formParam.unit.indexOf('3') != -1) {
          formParam.personnelList.forEach((element1) => {
            options.personnelList.forEach((element2) => {
              element2.accounttype = 0 //0是人 1是队伍
              if (element2.id == element1) {
                arr.push(element2)
              }
            })
          })
        }
        if (formParam.team == 1) {
          formParam.teamList.forEach((element1) => {
            options.teamList.forEach((element2) => {
              element2.accounttype = 1 //0是人 1是队伍
              if (element2.id == element1) {
                arr.push(element2)
              }
            })
          })
        }
        bean.bean.userid = arr.length > 0 ? arr : null
        if (sendstatus == 'save') {
          stagingNotice(bean)
        } else {
          sendNotice(bean)
        }
      })
    }
    const stagingNotice = (bean) => {
      //暂存+
      loading_btnSava.value = true
      currentPanelState.value = 'edit' ? (bean.bean.id = currentRecord.id) : ''
      // 暂存
      rpcPost('InsertBulletin', { bean }).then((res) => {
        if (res && res.code === 0) {
          message.success('保存成功')
          onClose(1)
        } else {
          message.warning(res.message)
        }
        loading_btnSava.value = false
      })
    }
    const sendNotice = (bean) => {
      //发送
      loading_btnSend.value = true
      // 发送
      currentPanelState.value = 'edit' ? (bean.bean.id = currentRecord.id) : ''
      rpcPost('InsertBulletin', { bean }).then((res) => {
        if (res && res.code === 0) {
          message.success('发送成功')
          onClose(2)
        } else {
          message.warning(res.message)
        }
        loading_btnSend.value = false
      })
    }
    return {
      visible,
      onClose,
      rules,
      formRef,
      optionsList,
      currentPanelState,
      options,
      formParam,
      QuillEditor,
      fileList,
      urllist,
      beforeUpload,
      handleFileUpload,
      delUploadFile,
      loading_btnSava,
      loading_btnSend,
      submit,
    }
  },
})
</script>

<style scoped lang="less">
.btnContainer {
  position: absolute;
  right: 0px;
  bottom: 0px;
  width: 100%;
  border-top: 1px solid #e9e9e9;
  padding: 10px 16px 0 0;
  background-color: #fff;
  text-align: right;
  z-index: 1;
}
</style>
