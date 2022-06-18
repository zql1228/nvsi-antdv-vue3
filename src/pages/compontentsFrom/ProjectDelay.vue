<template>
  <!--已结项项目 项目延期 -->
  <a-modal
    title="项目延期"
    :visible="props.visible"
    @ok="btnAgree"
    @cancel="onClose(false)"
    :okText="isTimeout == false ? '确认延期' : '确认'"
    :confirm-loading="confirmLoading"
    :maskClosable="false"
  >
    <a-form v-show="isTimeout == false" ref="formRef" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="项目名称" name="proName">
        <a-input v-model:value="form.proName" disabled />
      </a-form-item>
      <a-form-item label="结项时间" name="albx0005">
        <a-date-picker v-model:value="form.albx0005" style="width: 100%" disabled />
      </a-form-item>
      <a-form-item label="项目延期至" name="proTime">
        <a-date-picker v-model:value="form.proTime" style="width: 100%" :disabledDate="disabledDate" />
      </a-form-item>
      <a-form-item label="招募延期至" name="albx0007">
        <a-date-picker v-model:value="form.albx0007" :disabledDate="disabledDate2" style="width: 100%" />
      </a-form-item>
      <p class="p">
        <span class="span">注意事项：</span
        ><span>此项目自动结项日期为{{ item.albx0005 ? item.albx0005.slice(0, 11) : '' }},最多可延期至{{ time }}(30天)</span>
      </p>
    </a-form>
    <p v-show="isTimeout == true">
      <span
        >此项目自动结项日期为{{ item.albx0005 ? item.albx0005.slice(0, 11) : '' }},最多可延期至{{
          time
        }}(30天)!当前时间已超过项目最大延期时间,无法延期!</span
      >
    </p>
  </a-modal>
</template>
<script>
import { message } from 'ant-design-vue'
import { defineComponent, ref, onMounted, reactive, watch } from 'vue'
import moment from 'moment'
import { rpcPost } from '@/server/conf/index.js'
import { addDays, checktime2, checktime } from '@/utils/publicMethods/common.js'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: false,
    },
  },
  setup(props, text) {
    const loading = ref(false)
    const isTimeout = ref(false) //当天时间是否在项目结项时间后30天内,项目结项时间30天后不允许延期
    const form = reactive({
      albx0005: null, //结项时间
      proName: '', //申请类型
      proTime: null, //项目延期至
      albx0007: null, //招募延期至
    })
    const formRef = ref()
    const time = ref(null) //项目延期可选择的最大时间
    const confirmLoading = ref(false)
    const checkAlbx0007 = async (rule, value) => {
      //项目招募时间验证
      if (
        form.proTime &&
        form.albx0007 &&
        checktime2(moment(new Date(form.proTime)).format('YYYY-MM-DD'), moment(new Date(form.albx0007)).format('YYYY-MM-DD'))
      ) {
        return Promise.reject('招募时间不能比项目结束时间晚')
      } else {
        return Promise.resolve()
      }
    }
    const rules = {
      proName: [{ required: true, message: '请输入项目名称' }],
      albx0005: [{ required: true, message: '请选择结项日期', type: 'object' }],
      proTime: [
        {
          required: true,
          message: '请选择项目延期时间',
          trigger: 'change',
          type: 'object',
        },
      ],
      albx0007: [
        {
          required: false,
          validator: checkAlbx0007,
          trigger: 'change',
          type: 'object',
        },
      ],
    }
    watch(
      () => props.visible,
      (value) => {
        if (value) {
          form.proName = props.item.albx0002
          form.albx0005 = moment(new Date(props.item.albx0041))
          time.value = addDays(props.item.albx0005, 30)
          isTimeout.value = checktime(time.value) //项目延期最大日期比当天时间早true
        }
      }
    )
    const disabledDate = (current) => {
      //项目延期时间选择范围
      return (current && current > moment(new Date(addDays(props.item.albx0005, 31)))) || current <= moment(new Date(addDays(form.albx0005, 1)))
    }
    const disabledDate2 = (current) => {
      //项目延期时间选择范围
      return (current && current > moment(new Date(addDays(props.item.albx0005, 31)))) || current <= moment(new Date(addDays(props.item.albx0007, 1)))
    }
    const onClose = (bool) => {
      //bool为true时需要重新查询列表
      formRef.value.resetFields()
      text.emit('child', bool)
    }
    const btnRefused = () => {
      //拒绝
      onClose(true)
    }
    const btnAgree = () => {
      //同意
      if (isTimeout.value == false) {
        formRef.value
          .validate()
          .then(() => {
            let bean = {
              albx0021: props.item.albx0021, //区划
              proId: props.item.id, //项目id
              proTime: form.proTime, //项目延期日期
              albx0005: moment(new Date(form.albx0005)).format('YYYY-MM-DD'), //项目结项日期
              albx0007: form.albx0007 ? moment(new Date(form.albx0007)).format('YYYY-MM-DD') : null, //项目招募日期
            }
            confirmLoading.value = true
            rpcPost('groupDeferProjectFortis', { bean })
              .then((res) => {
                if (res && res.code === 0) {
                  onClose(true)
                  message.success('延期成功')
                } else {
                  message.warning(res.message)
                }
                confirmLoading.value = false
              })
              .catch((error) => {
                message.warning('延期失败')
                confirmLoading.value = false
              })
          })
          .catch(() => {})
      } else {
        onClose(false)
      }
    }
    return {
      isTimeout,
      props,
      formRef,
      loading,
      form,
      time,
      confirmLoading,
      rules,
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 16,
      },
      disabledDate,
      disabledDate2,
      onClose,
      btnRefused,
      btnAgree,
    }
  },
})
</script>
<style scoped>
.p {
  font-size: 16px;
  color: red;
  padding-left: 20px;
  padding-right: 60px;
}
.p .span {
  font-weight: bolder;
}
</style>
