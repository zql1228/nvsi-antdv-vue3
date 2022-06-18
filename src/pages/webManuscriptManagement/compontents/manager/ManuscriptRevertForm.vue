<template>
  <div>
    <a-drawer
      v-model:visible="props.visible"
      title="选择稿件资源"
      :maskClosable="false"
      placement="right"
      @close="onClose(false)"
      width="800"
      :body-style="{ paddingBottom: '80px' }"
    >
      <a-form :label-col="labelCol" :wrapper-col="wrapperCol" ref="formRef" :model="form" :rules="rules">
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item
              name="title"
              label="稿件标题"
              :wrapper-col="{
                span: 10,
              }"
            >
              <a-input v-model:value="form.title" type="text" placeholder="请输入稿件标题" />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item
              name="reason"
              label="退回理由"
              :wrapper-col="{
                span: 10,
              }"
            >
              <a-input v-model:value="form.reason" type="textarea" placeholder="请输入稿件退回理由" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div
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
        v-show="props.type != 'view'"
      >
        <a-button style="margin-right: 8px" @click="submit(3)" :loading="loading1">退回</a-button>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import { defineComponent, ref, reactive, watch } from 'vue'
import { uploadHandle, checkFileType } from '@/utils/upload'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { PlusOutlined } from '@ant-design/icons-vue'
import { rpcPost } from '@/server/conf/index.js'
import { message } from 'ant-design-vue/es'
import seaResource from '../../compontents/seaResource'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: '', //create创建 modify修改 view查看
    },
    item: {
      type: Object,
      default: {},
    },
  },

  components: {
    PlusOutlined,
    seaResource,
  },
  setup(props, text) {
    const download = ref()
    const imageUrl = ref('') // 封面图片地址
    const formRef = ref()
    const userInfo = ref(LocalGetUserInfo())
    const form = reactive({
      title: '', //标题
      resourcecode: [], //区划
    })

    const QuillEditor = ref() //富文本对象form.content = QuillEditor.value.getHTML()
    const fileList = ref([]) //上传文件组件按钮的文件列表
    const confirmLoading = ref(false) //确定按钮loading
    const visible = reactive({
      //队伍和人员选择弹窗
      personnelVisable: false,
      teamVisable: false,
    })
    const loading1 = ref(false)
    const loading2 = ref(false)
    const optionsList = reactive({
      options1: [
        {
          label: '是',
          value: '1',
        },
        {
          label: '否',
          value: '0',
        },
      ],
    })
    const handleOk = (e) => {
      //确定按钮
      onClose(true)
    }
    const onClose = (bool) => {
      //叉号 关闭弹窗
      formRef.value.resetFields()
      text.emit('child', bool)
    }

    //把稿件的所有字段写出来
    const beanObj = () => {
      //表单字段集合
      return {
        reason: form.reason,
      }
    }

    const submit = (operateType) => {
      formRef.value.validate().then(() => {
        let pushto = 0
        if (userInfo.value.areaLevel == 0) {
          //如果市全国退回
          pushto = 8
        } else if (userInfo.value.areaLevel == 1) {
          //省级
          pushto = 6
        } else if (userInfo.value.areaLevel == 2) {
          //市级
          pushto = 4
        } else if (userInfo.value.areaLevel == 3) {
          //区级
          pushto = 2
        }

        let bean = {
          ...beanObj(),
          operator: userInfo.value.fullName,
          type: operateType,
          areaid: userInfo.value.areaid,
          pushto: pushto,
          areaid: userInfo.value.areaid,
        }
        staging(bean) //暂存稿件
      })
    }

    const staging = (bean) => {
      loading1.value = true
      if (props.type == 'modify') {
        //修改暂存s
        bean.logid = props.item.logid
        bean.articleid = props.item.articleid
        rpcPost('updateManuscriptPushto', { bean }).then((res) => {
          if (res && res.code === 0) {
            message.success('已退回')
            onClose(1)
          } else {
            message.warning(res.message)
          }
        })
      }
    }

    //监听修改页面，赋值
    watch(
      () => props.visible,
      (visible) => {
        if (visible) {
          Object.keys(form).forEach((name) => {
            if (props.item[name]) {
              form[name] = props.item[name]
            }
          })
        }
      }
    )

    const onEditorFocus = (event) => {
      // 富文本获得焦点时的事件
      // console.log(val); // 富文本获得焦点时的内容
      // if (props.type == 'view') {
      //   QuillEditor.value.enable(false) //查看状态禁用富文本 在获取焦点的时候禁用
      // }
    }

    const rules = reactive({
      title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
      reason: [{ required: true, message: '请输入退回理由', trigger: 'blur' }],
    })

    return {
      download,
      QuillEditor,
      loading2,
      loading1,
      fileList,
      props,
      visible,
      formRef,
      form,
      rules,
      confirmLoading,
      optionsList,
      handleOk,
      onClose,
      staging,
      submit,
      onEditorFocus,
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 21,
      },
    }
  },
})
</script>
<style scoped>
.nowrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
