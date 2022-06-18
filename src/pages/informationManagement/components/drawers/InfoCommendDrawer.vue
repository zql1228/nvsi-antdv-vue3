<template>
  <!-- 表彰详情  -->
  <a-drawer title="表彰详情" placement="right" :visible="visible" :maskClosable="false" @close="onClose" width="800">
    <a-form ref="form_Commend" :model="formParam" layout="vertical" :rules="rules">
      <a-row :gutter="24">
        <a-col :md="12" :sm="24">
          <a-form-item label="表彰名称" name="albx0352">
            <a-input v-model:value="formParam.albx0352" />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label="获奖日期" name="albx0353">
            <a-date-picker v-model:value="formParam.albx0353" style="width:100%" />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label="表彰颁发者" name="albx0354">
            <a-input v-model:value="formParam.albx0354" :disabled="true" />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label="奖励文书名称" name="albx0355">
            <a-input v-model:value="formParam.albx0355" />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label="奖励文书文号" name="albx0363">
            <a-input v-model:value="formParam.albx0363" />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label="表彰类型" name="albx0362">
            <a-select ref="select" v-model:value="formParam.albx0362">
              <a-select-option value="1">队伍</a-select-option>
              <a-select-option value="2">项目</a-select-option>
              <a-select-option value="3">志愿者</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item label="表彰内容" name="albx0356">
            <QuillEditor v-model:value="formParam.albx0356" theme="snow" toolbar="full" ref="QuillEditor" maxlength="15000" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div class="FooterBtn">
      <a-space>
        <a-button @click.prevent="headleCanter">
          取消
        </a-button>
        <a-button type="primary" style="margin-right: 8px" @click.prevent="headleSave">保存</a-button>
      </a-space>
    </div>
  </a-drawer>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, onBeforeUnmount, toRefs } from 'vue'

import { useInfoCommendDrawerHook } from './useRulesHook'

import { LocalGetUserInfo } from '@/utils/localStorage.js'
import EventBus from '@/utils/bus'
import apis from '@/server/request'
import { message } from 'ant-design-vue'
import moment from 'moment'
export default defineComponent({
  setup() {
    const visible = ref(false)
    const form_Commend = ref()
    const currentPanelType = ref('') // 当前面板的状态 edit add view
    const currentPanelRecord = ref({}) // 当前面板编辑状态的数据
    const userInfo = reactive(LocalGetUserInfo())
    const formParam = reactive({
      albx0352: '', //	是	表彰名称
      albx0353: null, //	是	获奖日期
      albx0354: userInfo.team.albe0002, //	是	颁发者id（队伍名称  直接获取）
      albx0355: '', //	是	奖励文书名称
      albx0363: '', //	是	奖励文书文号
      albx0356: '', //	是	表彰内容
      albx0362: '', //	是	表彰类型（1:队伍  2：项目  3：志愿者）
    })
    const QuillEditor = ref() //富文本对象form.content = QuillEditor.value.getHTML()

    const onClose = () => {
      visible.value = false
      currentPanelRecord.value = ''
      currentPanelType.value = ''
    }
    onBeforeUnmount(() => {
      EventBus.off('handleAddCommend')
      EventBus.off('editCommend')
    })
    onMounted(() => {
      EventBusListener()
    })
    const EventBusListener = () => {
      EventBus.on('handleAddCommend', ({ type }) => {
        visible.value = true
        currentPanelType.value = type
      })
      EventBus.on('editCommend', ({ record, type }) => {
        visible.value = true
        currentPanelType.value = type
        currentPanelRecord.value = record
        console.log(currentPanelRecord.value)
        Object.keys(formParam).forEach((key) => {
          if (key == 'albx0353') {
            formParam[key] = moment(currentPanelRecord.value[key]).format('YYYY-MM-DD')
          } else {
            formParam[key] = currentPanelRecord.value[key]
            QuillEditor.value.setHTML(currentPanelRecord.value['albx0356'])
          }
        })
      })
    }
    const headleCanter = () => {
      onClose()
    }
    const recognitionAdd = async () => {
      const params = {
        ...formParam,
        areaid: userInfo.team.groupid,
      }
      const res = await apis.recognitionAdd(params)
      if (res.code === 0 || res.code === '0') {
        EventBus.emit('refreshCommentTable')
        message.success(res.message)
      } else {
        message.warning(res.message)
      }
    }
    const recognitionUpdate = async () => {
      const params = {
        ...formParam,
        areaid: userInfo.team.groupid,
        id: currentPanelRecord.value.id,
      }
      const res = await apis.recognitionUpdate(params)
      if (res.code === 0 || res.code === '0') {
        EventBus.emit('refreshCommentTable')
        message.success(res.message)
      } else {
        message.warning(res.message)
      }
    }
    const headleSave = () => {
      form_Commend.value
        .validate()
        .then(() => {
          switch (currentPanelType.value) {
            case 'add':
              recognitionAdd()
            case 'edit':
              recognitionUpdate()
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
    const rules = useInfoCommendDrawerHook(formParam, QuillEditor)
    return {
      visible,
      onClose,
      form_Commend,
      formParam,
      QuillEditor,
      rules,
      headleCanter,
      headleSave,
    }
  },
})
</script>

<style scoped lang="less">
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
