<template>
  <div>
    <a-drawer v-model:visible="props.visible" title="投诉详情" :maskClosable="false" placement="right" @close="onClose(false)" width="600">
      <a-form :label-col="labelCol" :wrapper-col="wrapperCol" ref="formRef" :model="form" :rules="rules">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item name="albx0356" label="投诉者">
              <a-input type="text" v-model:value="form.albx0356" placeholder="请输入投诉者名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="albx0357" label="投诉者身份证">
              <a-input type="text" v-model:value="form.albx0357" placeholder="请输入投诉者身份证" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="albx0338" label="区域">
              <a-input type="text" v-model:value="form.albx0338" placeholder="请选择区域" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="albx0355" label="被举报者">
              <a-input type="text" v-model:value="form.albx0355" placeholder="请输入被举报者名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="albx0346" label="举报类型">
              <a-radio-group v-model:value="form.albx0346" :options="optionsList.options1" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="albx0348" label="所属项目">
              <a-input type="text" v-model:value="form.albx0348" placeholder="请输入所属项目" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="albx0349" label="举报时间">
              <a-date-picker style="width:100%;" v-model:value="form.albx0349" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="albx0350" label="处理时间">
              <a-date-picker style="width:100%;" v-model:value="form.albx0350" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="albx0348" label="举报时长">
              <a-input type="text" v-model:value="form.albx0348" placeholder="请输入所属项目" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="albx0348" label="联系人">
              <a-input type="text" v-model:value="form.albx0348" placeholder="请输入所属项目" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="albx0351" label="联系方式">
              <a-input type="text" v-model:value="form.albx0351" placeholder="请输入所属项目" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="albx0348" label="是否已处理">
              <a-radio-group v-model:value="form.albx0348" :options="optionsList.options2" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="isdelete" label="是否已删除">
              <a-radio-group v-model:value="form.isdelete" :options="optionsList.options3" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <!-- <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button style="margin-right: 8px" @click="btnAgree(false)">确定</a-button>
        <a-button type="primary" @click="btnAgree(true)">缓存</a-button>
      </div> -->
    </a-drawer>
  </div>
</template>
<script>
import { defineComponent, ref, reactive, watch } from 'vue'
import { rpcPost } from '@/server/conf/index.js'
import moment from 'moment'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: {},
    },
    activeKey: {
      type: Number,
      default: 1,
    },
    queryParam: {
      type: Object,
      default: {},
    },
  },
  setup(props, text) {
    const formRef = ref()
    const form = reactive({
      albx0356: '', //投诉者名称 .
      albx0357: '', //投诉者身份证
      albx0338: '', //区域
      albx0355: '', //被举报者名称 .
      albx0346: '', //举报类型 .
      albx0353: '', //所属项目.
      albx0349: '', //举报时间 .
      albx0350: '', //处理时间
      albx0340: '', //举报时长.
      albx0351: '', //联系方式 .
      albx0352: '', //联系人.
      albx0354: '', //是否已处理.
      isdelete: '', //是否已删除.
    })
    const rules = reactive({})
    const optionsList = reactive({
      options1: [
        { label: '时长', value: '1' },
        { label: '新闻', value: '2' },
        { label: '动态', value: '3' },
      ],
      options2: [
        { label: '未处理', value: '0' },
        { label: '已处理', value: '1' },
      ],
      options3: [
        { label: '未删除', value: '0' },
        { label: '已删除', value: '1' },
      ],
    })
    const onClose = (bool) => {
      //关闭弹窗
      text.emit('child', bool)
    }

    watch(
      () => props.visible,
      (value) => {
        let bean = {
          id: props.item.id,
          albx0346: props.item.albx0346 == 1 ? 0 : null, //举报类型为时长时传0
        }
        rpcPost('complaintDetails2', { bean }).then((res) => {
          //查询投诉详情
          if (res && res.code === 0 && res.data) {
            form.albx0346 = res.data.albx0346
            form.albx0349 = moment(new Date(res.data.albx0349)).format('YYYY-MM-DD')
            form.albx0351 = res.data.albx0351
            form.albx0355 = res.data.albx0355
            form.albx0356 = res.data.albx0356
            form.albx0353 = res.data.albx0353
            form.albx0340 = res.data.albx0340
            form.albx0352 = res.data.albx0352
            form.albx0354 = res.data.albx0354
            form.isdelete = res.data.albx0354
            form.albx0350 = res.data.albx0350 ? moment(new Date(res.data.albx0350)).format('YYYY-MM-DD') : null
          } else {
            message.warning(res.message)
          }
        })
      }
    )

    return {
      props,
      formRef,
      form,
      rules,
      optionsList,
      onClose,
      labelCol: {
        span: 24,
      },
      wrapperCol: {
        span: 24,
      },
    }
  },
})
</script>
