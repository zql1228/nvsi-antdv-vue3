<template>
  <!-- 志愿者评价项目 -->
  <a-drawer title="志愿者评价项目" placement="right" :visible="visible" @close="onClose" width="600">
    <a-form ref="form_Evlua" :model="formParamEvalua" layout="vertical" v-if="tabKey == 'evaluated'">
      <a-row :gutter="24">
        <a-col :md="24" :sm="24">
          <a-form-item label="评价人">
            <a-input placeholder="评价人" v-model:value="formParamEvalua.albp0003" :disabled="disabled" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :md="24" :sm="24">
          <a-form-item label="被评价的项目">
            <a-input placeholder="被评价的项目" v-model:value="formParamEvalua.albx0002" :disabled="disabled" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :md="24" :sm="24">
          <a-form-item label="培训质量">
            <a-rate v-model:value="formParamEvalua.albx0503" :disabled="disabled" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :md="24" :sm="24">
          <a-form-item label="团队合作">
            <a-rate v-model:value="formParamEvalua.albx0504" :disabled="disabled" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :md="24" :sm="24">
          <a-form-item label="执行能力">
            <a-rate v-model:value="formParamEvalua.albx0505" :disabled="disabled" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :md="24" :sm="24">
          <a-form-item label="评价内容">
            <a-textarea v-model:value="formParamEvalua.albx0508" :disabled="disabled" :auto-size="{ minRows: 4 }" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-form ref="form_Evlua2" :model="formParamVol" layout="vertical" v-else :rules="rules">
      <a-row :gutter="24">
        <a-col :md="24" :sm="24">
          <a-form-item label="评价人" name="albp0003">
            <a-input placeholder="评价人" v-model:value="formParamVol.albp0003" :disabled="disabled" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :md="24" :sm="24">
          <a-form-item label="被评价的项目" name="albx0002">
            <a-input placeholder="被评价的项目" v-model:value="formParamVol.albx0002" :disabled="disabled" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :md="24" :sm="24">
          <a-form-item label="守时程度" name="albx0463">
            <a-rate v-model:value="formParamVol.albx0463" :disabled="disabled" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :md="24" :sm="24">
          <a-form-item label="服务态度" name="albx0464">
            <a-rate v-model:value="formParamVol.albx0464" :disabled="disabled" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :md="24" :sm="24">
          <a-form-item label="专业水平" name="albx0465">
            <a-rate v-model:value="formParamVol.albx0465" :disabled="disabled" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :md="24" :sm="24">
          <a-form-item label="评价内容" name="albx0508">
            <a-textarea v-model:value="formParamVol.albx0508" :disabled="disabled" :auto-size="{ minRows: 4 }" />
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
import EventBus from '@/utils/bus'
import { useInfoUpdateEvluaHook } from './useRulesHook'
import apis from '@/server/request'
import { message } from 'ant-design-vue'
export default defineComponent({
  setup() {
    const visible = ref(false)
    const currentRecord = ref()
    const form_Evlua = ref()
    const form_Evlua2 = ref()
    const formParamEvalua = reactive({
      albp0003: '', // 评价人
      albx0002: '', // 被评价的项目
      albx0503: '', // 培训质量
      albx0504: '', // 团队合作
      albx0505: '', // 执行能力
      albx0508: '', // 评价内容
    })
    const formParamVol = reactive({
      albp0003: '', // 评价人
      albx0002: '', // 被评价的项目
      albx0463: '', // 守时程度
      albx0464: '', // 服务态度
      albx0465: '', // 专业水平
      albx0508: '', // 评价内容
    })
    const rules = useInfoUpdateEvluaHook()
    const disabled = ref(true)
    const tabKey = ref('')
    const onClose = () => {
      visible.value = false
      disabled.value = true
      currentRecord.value = {}
    }
    onBeforeUnmount(() => {
      EventBus.off('handleViewEvlua')
      EventBus.off('handleUpdateEvlua')
    })
    onMounted(() => {
      EventBusListener()
    })
    const EventBusListener = () => {
      EventBus.on('handleViewEvlua', ({ record, type }) => {
        tabKey.value = type
        currentRecord.value = record
        if (type == 'evaluated') {
          Object.keys(formParamEvalua).forEach((key) => {
            formParamEvalua[key] = currentRecord.value[key]
          })
        } else {
          Object.keys(formParamEvalua).forEach((key) => {
            formParamVol[key] = currentRecord.value[key]
          })
        }
        visible.value = true
      })
      EventBus.on('handleUpdateEvlua', ({ record, type }) => {
        tabKey.value = type
        currentRecord.value = record
        // console.log(currentRecord.value)
        Object.keys(formParamVol).forEach((key) => {
          formParamVol[key] = currentRecord.value[key]
        })
        // console.log(formParamVol)
        disabled.value = false
        visible.value = true
      })
    }
    const headleCanter = () => {}
    const updateEvluaInfo = async () => {
      const params = {
        id: currentRecord.value.id,
        ...formParamVol,
      }
      const res = await apis.updateTeamEvaluationVolFortis(params)
      if (res.code == '0') {
        EventBus.emit('refreshEvluaTable')
        message.success(res.message)
      } else {
        message.warning(res.message)
      }
      onClose()
    }
    const headleSave = () => {
      form_Evlua2.value
        .validate()
        .then(() => {
          updateEvluaInfo()
        })
        .catch((e) => {
          message.warning('请先完善修改信息')
        })
    }
    return {
      visible,
      onClose,
      rules,
      disabled,
      tabKey,
      formParamEvalua,
      formParamVol,
      form_Evlua,
      form_Evlua2,
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
