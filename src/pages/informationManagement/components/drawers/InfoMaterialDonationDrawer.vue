<template>
  <a-drawer title="物资详情" placement="right" :visible="visible" :maskClosable="false" @close="onClose" width="700">
    <a-form ref="formRef" layout="vertical" class="nv-form" :model="formParam" :rules="rules">
      <a-row :gutter="24">
        <a-col :md="24" :sm="24">
          <a-form-item label="物资名称" name="albe1802">
            <a-input placeholder="请输入物资名称" v-model:value="formParam.albe1802" />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label="捐赠数量" name="albe1808">
            <a-input placeholder="请输入捐赠数量" v-model:value="formParam.albe1808" />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label="物资单位" name="albe1804">
            <a-input placeholder="请输入物资单位" v-model:value="formParam.albe1804" />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label="库存数量" name="albe1803">
            <a-input placeholder="请输入库存数量" v-model:value="formParam.albe1803" />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label="物资类型" name="albe1812">
            <a-select ref="select" v-model:value="formParam.albe1812">
              <a-select-option value="1">一次性物资</a-select-option>
              <a-select-option value="2">可持续物资</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item label="捐赠方名称" name="albe1805">
            <a-input placeholder="请输入捐赠方名称" v-model:value="formParam.albe1805" />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label="捐赠方电话" name="albe1806">
            <a-input placeholder="请输入捐赠方电话" v-model:value="formParam.albe1806" />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label="捐赠日期" name="albe1807">
            <a-date-picker v-model:value="formParam.albe1807" style="width:100%" />
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item label="物资图片">
            <a-input placeholder="请输入物资名称" v-model:value="formParam.albe1809" />
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item label="备注">
            <a-textarea v-model="formParam.albe1810" :rows="4" allow-clear />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24"> </a-row>
    </a-form>
    <div class="btnContainer">
      <a-button style="margin-right: 8px" @click="submitForm('back')">返回</a-button>
      <a-button type="primary" @click="submitForm('save')">保存</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, onBeforeUnmount } from 'vue'
import EventBus from '@/utils/bus'
import { message, Modal } from 'ant-design-vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import apis from '@/server/request'
import moment from 'moment'
import { useInfoMaterDrawerHook } from './useRulesHook'
export default defineComponent({
  setup() {
    const userInfo = reactive(LocalGetUserInfo())
    const visible = ref(false)
    const formRef = ref()
    const currentPanelState = ref('')
    const formParam = reactive({
      albe1802: '', //	是	物资名称
      albe1808: '', //	是	捐赠数量
      albe1804: '', //	是	物资单位
      albe1803: '', //	是	库存
      albe1812: '', //	是	物资类型（1：一次性物资  2：可持续物资）
      albe1805: '', //	是	物资捐赠者名称
      albe1806: '', //	是	捐赠者手机号
      albe1807: '', //	是	捐赠日期
      albe1809: '', //	否	图片
      albe1810: '', //	否	备注
      id: '', //	否	新增不传，更新传
    })
    const backUp = () => {
      init()
      // Modal.confirm({
      //   title: '退出将不会保存您填写的信息,是否确认退出',
      //   cancelText: '取消',
      //   okText: '确认',
      //   onOk: () => {
      //     formRef.value.resetFields()
      //     init()
      //   },
      // })
    }
    const onClose = () => {
      backUp()
    }
    const init = () => {
      visible.value = false
      currentPanelState.value = ''
    }
    const setFormParams = (record) => {
      Object.keys(formParam).forEach((key) => {
        formParam[key] = record[key]
      })
      console.log(record)
    }
    onBeforeUnmount(() => {
      EventBus.off('handleBatchAddGoods')
      EventBus.off('handleEditGoods')
    })
    onMounted(() => {
      EventBusListener()
    })
    const EventBusListener = () => {
      EventBus.on('handleBatchAddGoods', (params) => {
        currentPanelState.value = 'add'
        visible.value = true
      })
      EventBus.on('handleEditGoods', (record) => {
        currentPanelState.value = 'edit'
        // 给表单数据赋值
        setFormParams(record)
        visible.value = true
      })
    }

    const submitForm = (subState) => {
      if (subState == 'save') {
        formRef.value
          .validate()
          .then(async () => {
            const params = { ...formParam }
            params.albe1807 = moment(new Date(params.albe1807)).format('YYYY-MM-DD')
            params.albe1811 = userInfo.team.groupid
            if (currentPanelState.value == 'add') {
              delete params.id
            }
            console.log(params, '新增物资的params')
            const res = await apis.insertOrUpdateSuppliesFortis(params)
            if (res.code === '0' || res.code === 0) {
              EventBus.emit('refreshMaterTable')
              message.success(res.message)
            } else {
              message.warning(res.message)
            }
          })
          .catch((e) => {
            message.warning('请先完善信息')
          })
      } else {
        backUp()
      }
    }

    const rules = useInfoMaterDrawerHook()
    return {
      visible,
      onClose,
      formParam,
      submitForm,
      formRef,
      rules,
    }
  },
})
</script>

<style scoped lang="less">
.btnContainer {
  position: absolute;
  right: 0px;
  bottom: 10px;
  width: 100%;
  border-top: 1px solid #e9e9e9;
  padding: 10px 16px 0 0;
  background-color: #fff;
  text-align: right;
  z-index: 1;
}
</style>
