<template>
  <!-- 新建或修改项目岗位 -->
  <a-modal title="岗位详情" :confirm-loading="loading" :maskClosable="false" :visible="props.visible" @ok="submit" @cancel="onClose(false)">
    <a-form ref="formRef" :model="formParam" layout="horizontal" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
      <a-form-item label="岗位名称" name="albx0072">
        <a-input v-model:value="formParam.albx0072" />
      </a-form-item>
      <a-form-item label="计划招募人数" name="albx0077">
        <a-input v-model:value="formParam.albx0077" onkeyup="value=value.replace(/[^\d]/g,'')" onafterpaste="value=value.replace(/[^\d]/g,'')" />
      </a-form-item>
      <a-form-item label="岗位描述" name="albx0074">
        <a-textarea v-model:value="formParam.albx0074" :rows="4" allow-clear />
      </a-form-item>
      <a-form-item label="岗位条件" name="albx0075">
        <a-textarea v-model:value="formParam.albx0075" :rows="4" allow-clear />
      </a-form-item>
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
      <a-button style="margin-right: 8px" @click="onClose(false)">拒绝</a-button>
      <a-button type="primary" @click="submit" :loading="loading">保存</a-button>
    </div> -->
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
// 表单字段
const fields = ['description', 'id']
import { message } from 'ant-design-vue'
import { defineComponent, ref, onMounted, reactive, watch } from 'vue'
import { rpcPost } from '@/server/conf/index.js'
import { LocalGetProjectInfo } from '@/utils/localStorage.js'
import { reg2 } from '@/utils/publicMethods/common'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    model: {
      //修改时传递的参数
      type: Object,
      default: () => null,
    },
  },
  setup(props, text) {
    const loading = ref(false)
    const formRef = ref()
    const query = ref({}) //路由带参
    const proInfo = ref() //当前项目信息
    const formParam = reactive({
      albx0072: '', //岗位名称
      albx0077: '', //计划招募人数
      albx0074: '', //岗位描述
      albx0075: '', //岗位条件
    })

    const checkAlbx0077 = async (rule, value) => {
      //招募人数
      if (!value) {
        return Promise.reject('请输入计划招募人数')
      } else if (value && !reg2(value)) {
        return Promise.reject('请输入大于或等于0的整数')
      } else {
        return Promise.resolve()
      }
    }

    const rules = reactive({
      albx0072: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }],
      albx0077: [{ required: true, validator: checkAlbx0077, trigger: 'blur' }],
      albx0074: [{ required: true, message: '请输入岗位描述', trigger: 'blur' }],
      albx0075: [{ required: true, message: '请输入岗位条件', trigger: 'blur' }],
    })

    onMounted(() => {
      query.value = LocalGetProjectInfo()
    })

    watch(
      () => props.visible,
      (value) => {
        if (value && props.model.operation === 'modify') {
          formParam.albx0072 = props.model.record.albx0072
          formParam.albx0077 = props.model.record.albx0077
          formParam.albx0074 = props.model.record.albx0074
          formParam.albx0075 = props.model.record.albx0075
          formParam.gwid = props.model.record.id //	岗位人员信息表id
        }
      }
    )

    const create = () => {
      //新建岗位
      let bean = JSON.parse(JSON.stringify(formParam))
      bean.albx0021 = query.value.areaId
      bean.proId = query.value.projectId
      loading.value = true
      rpcPost('groupProjectAddPostFortis', { bean: bean })
        .then((res) => {
          if (res && res.code === 0) {
            onClose(true)
            message.success('岗位新增成功')
          } else {
            message.warning(res.message)
          }
        })
        .finally(() => {
          loading.value = false
        })
    }
    const modify = () => {
      //修改岗位
      let bean = JSON.parse(JSON.stringify(formParam))
      bean.albx0021 = query.value.areaId
      bean.proId = query.value.projectId
      loading.value = true
      rpcPost('groupProjectUpdatePostFortis', { bean }).then((res) => {
        loading.value = false
        if (res && res.code === 0) {
          onClose(true)
          message.success('岗位修改成功')
        } else {
          message.warning(res.message)
        }
      })
    }
    const submit = () => {
      //  确定按钮
      formRef.value
        .validate()
        .then(() => {
          if (props.model.operation === 'create') {
            //  新增
            create()
          } else if (props.model.operation === 'modify') {
            // 修改
            modify()
          }
        })
        .catch((error) => {})
    }
    const onClose = (bool) => {
      //关闭弹窗
      loading.value = false
      formRef.value.resetFields()
      text.emit('child', bool)
    }
    return {
      props,
      loading,
      formRef,
      proInfo, //当前项目信息
      formParam,
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 16,
      },
      rules,
      create,
      modify,
      submit,
      onClose,
    }
  },
})
</script>
