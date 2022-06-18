<template>
  <div>
    <a-drawer
      v-model:visible="props.visible"
      title="专题专栏"
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
              name="albx6202"
              label="专题专栏标题"
              :wrapper-col="{
                span: 10,
              }"
            >
              <a-input v-model:value="form.albx6202" type="text" />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item
              name="albx6203"
              label="专题专栏来源"
              :wrapper-col="{
                span: 10,
              }"
            >
              <a-input v-model:value="form.albx6203" type="text" />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item name="albx6206" label="跳转链接">
              <a-input v-model:value="form.albx6206" type="text" />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item name="albx6208" label="专题类型">
              <a-radio-group v-model:value="form.albx6208" :options="optionsList.typeOptions" :disabled="props.type == 'view'"></a-radio-group>
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item name="albx6204" label="专题图片web" v-show="form.albx6208 != 2">
              <a-upload
                name="avatar"
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                style="width: 100%"
                :customRequest="handleFileUpload"
                :beforeUpload="beforeUpload"
                :showUploadList="false"
                :disabled="props.type == 'view'"
              >
                <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                <div v-else>
                  <a-icon :type="loading ? 'loading' : 'plus'" />
                  <div class="ant-upload-text">上传图片</div>
                </div>
              </a-upload>
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item name="albx6213" label="专题图片app/h5" v-show="form.albx6208 == 1">
              <a-upload
                name="avatar"
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                style="width: 100%"
                :customRequest="handleFileUpload"
                :beforeUpload="beforeUpload"
                :showUploadList="false"
                :disabled="props.type == 'view'"
              >
                <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                <div v-else>
                  <a-icon :type="loading ? 'loading' : 'plus'" />
                  <div class="ant-upload-text">上传图片</div>
                </div>
              </a-upload>
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item name="albx6205" label="备注">
              <QuillEditor v-model:value="form.albx6205" theme="snow" toolbar="full" ref="QuillEditor" :options="editorOption" maxlength="15000" />
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
        <!-- 按钮消失 -->
        <a-button type="primary" @click="submit(1)" :loading="loading2" :disabled="props.type == 'view'">{{
          props.type == 'create' ? '创建' : props.type == 'view' ? '查看' : '修改'
        }}</a-button>
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
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'view', //create创建 modify修改 view查看
    },
    item: {
      type: String,
      default: '',
    },
  },
  components: {
    PlusOutlined,
  },
  setup(props, text) {
    //
    const formRef = ref(null)
    const userInfo = ref(LocalGetUserInfo())
    const form = reactive({})

    const QuillEditor = ref() //富文本对象form.content = QuillEditor.value.getHTML()
    const fileList = ref([]) //上传文件组件按钮的文件列表
    const urllist = ref([]) //修改查看时返回的文件下载列表
    const query = ref({}) //路由带的参数
    const confirmLoading = ref(false) //确定按钮loading
    const imageUrl = ref('') // 封面图片地址
    const visible = reactive({
      layoutVisable: false,
    })
    const loading1 = ref(false)
    const loading2 = ref(false)
    const optionsList = reactive({
      //1.图片专题2.文字专题 3普通专题 4轮播专题
      typeOptions: [
        { value: '1', label: '图片专题' },
        { value: '2', label: '文字专题' },
        { value: '3', label: '普通专题' },
      ],
    })

    const handleOk = (e) => {
      //确定按钮
      onClose(true)
    }
    const onClose = (bool) => {
      //叉号 关闭弹窗
      formRef.value.resetFields()
      fileList.value = []
      QuillEditor.value.setHTML('')
      text.emit('child', bool)
    }

    const onCloseModel1 = (arr1, arr2) => {
      //人员选择弹窗关闭所调用的方法
      form.layoutList = arr1
      options.layoutList = arr2
      visible.layoutVisable = false
    }

    const openModel = (str) => {
      if (str == 'layout') {
        visible.layoutVisable = true
      }
    }

    const beforeUpload = (file) => {
      //文件格式校验
      const flag = checkFileType(file)
      if (!flag) {
        message.error('上传文件格式错误，请重新上传')
        return false
      }
      return true
    }

    // 图片上传
    const handleFileUpload = async (options) => {
      const res = await uploadHandle(options)
      if (res) {
        rpcPost('downloadFortisLogic', { bean: res }).then((result) => {
          imageUrl.value = result.data
          message.success('上传成功')
        })
        form.imgtitle = res
      } else {
        message.warning('上传失败')
      }
    }

    const submit = (sendstatus) => {
      formRef.value.validate().then(() => {
        let bean = {
          albx6202: form.albx6202,
          albx6203: form.albx6203,
          albx6206: form.albx6206,
          albx6208: form.albx6208,
          albx6205: QuillEditor.value.getHTML(),
          areaid: userInfo.value.areaid,
          albx6213: form.albx6213,
        }
        let arr = []

        if (sendstatus == 0) {
          staging(bean)
        } else if (sendstatus == 1) {
          send(bean)
        }
      })
    }

    const staging = (bean) => {
      loading1.value = true
      if (props.type == 'create') {
        //新建暂存
        rpcPost('saveSpecialColumn', { bean }).then((res) => {
          if (res && res.code === 0) {
            message.success('保存成功')
            onClose(1)
          } else {
            message.warning(res.message)
          }
          loading1.value = false
        })
      } else if (props.type == 'modify') {
        //修改暂存
        bean.id = props.item.id
        rpcPost('saveSpecialColumn', { bean }).then((res) => {
          if (res && res.code === 0) {
            message.success('修改成功')
            onClose(1)
          } else {
            message.warning(res.message)
          }
          loading1.value = false
        })
      }
    }

    const send = (bean) => {
      //发送
      loading2.value = true
      // 发送
      props.type = 'modify' ? (bean.id = props.item.id) : ''
      rpcPost('saveSpecialColumn', { bean }).then((res) => {
        if (res && res.code === 0) {
          message.success('新增成功')
          onClose(2)
        } else {
          message.warning(res.message)
        }
        loading2.value = false
      })
    }
    watch(
      () => props.visible,

      (visible) => {
        if (visible && props.type != 'create') {
          //除新建操作外 需查询当前新闻详情
          let bean = {
            id: props.item.id,
          }

          rpcPost('getSpecialColumnDetails', { bean }).then((res) => {
            if (res && res.code === 0 && res.data) {
              Object.keys(form).forEach((name) => {
                if (res.data[name]) {
                  form[name] = res.data[name]
                }
              })
              if (res.data.albx6205) {
                QuillEditor.value.setHTML(res.data.albx6205)
              }

              if (form.albx6204) {
                //查询封面地址
                rpcPost('downloadFortisLogic', { bean: form.albx6204 }).then((res) => {
                  if (res && res.code === 0 && res.data) {
                    imageUrl.value = res.data
                  } else {
                    message.warning('栏目封面图片获取失败')
                  }
                })
              }
            } else {
              message.warning(res.message)
            }
          })
        }
      }
    )

    const onChangeScope = (e) => {
      formParam.albx0024 = e.target.value
    }

    const checkContent = async (rule, value) => {
      //新闻内容验证
      form.albx6205 = QuillEditor.value.getHTML()
      if (!form.albx6205) {
        return Promise.reject('请填写专题专栏备注')
      } else {
        return Promise.resolve()
      }
    }

    const rules = reactive({
      albx6202: [{ required: true, message: '专题专栏标题为空', trigger: 'change' }],
      albx6203: [{ required: true, message: '跳转链接为空', trigger: 'change' }],
      albx6208: [{ required: true, message: '专题类型为空', trigger: 'change' }],
      albx6205: [{ required: true, validator: checkContent, trigger: 'blur' }],
    })

    return {
      QuillEditor,
      loading2,
      loading1,
      fileList,
      urllist,
      props,
      visible,
      formRef,
      form,
      rules,
      confirmLoading,
      optionsList,
      handleOk,
      onClose,
      beforeUpload,
      handleFileUpload,
      onCloseModel1,
      openModel,
      staging,
      send,
      submit,
      imageUrl,
      onChangeScope,
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
