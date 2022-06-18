<template>
  <div>
    <a-drawer
      v-model:visible="props.visible"
      title="友情链接信息"
      :maskClosable="false"
      placement="right"
      @close="onClose(false)"
      width="800"
      :body-style="{ paddingBottom: '80px' }"
    >
      <a-form
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        ref="formRef"
        :model="form"
        :rules="rules"
      >
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item
              name="forsystem"
              label="所属系统"
              :wrapper-col="{
                span: 10,
              }"
            >
              <a-input v-model:value="form.forsystem" type="text" />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item
              name="name"
              label="名称"
              :wrapper-col="{
                span: 10,
              }"
            >
              <a-input v-model:value="form.name" type="text" />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item name="linkurl" label="链接">
              <a-input v-model:value="form.linkurl" type="text" />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item name="sort" label="排序">
              <a-input v-model:value="form.sort" type="text" />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item name="isshow" label="是否显示">
              <a-radio-group v-model:value="form.isshow" :options="optionsList.options1" />
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
        <a-button
          type="primary"
          @click="submit(1)"
          :loading="loading2"
          :disabled="props.type == 'view'"
        >{{ props.type == 'create' ? '创建' : props.type == 'view' ? '查看' : '修改' }}</a-button>
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
    const form = reactive({
      forsystem: '',
      name: '',
      linkurl: '',
      sort: '',
      isshow: '',
      areaid: '',
    })

    const QuillEditor = ref() //富文本对象form.content = QuillEditor.value.getHTML()
    const fileList = ref([]) //上传文件组件按钮的文件列表
    const urllist = ref([]) //修改查看时返回的文件下载列表
    const query = ref({}) //路由带的参数
    const confirmLoading = ref(false) //确定按钮loading
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

      options1: [
        {
          label: '是',
          value: '1',
        },
        {
          label: '否',
          value: '2',
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
      fileList.value = []
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

    // 文件上传
    const handleFileUpload = async (options) => {
      // if(fileList.length==5){
      //   message.warn('最多上传5个文件')
      //   return
      // }
      const res = await uploadHandle(options)
      if (res) {
        message.success('上传成功')
        fileList.value.push(res)
      } else {
        message.warning('上传失败')
      }
      // if (res) {
      //   rpcPost('downloadFortisLogic', { bean: res }).then((result) => {
      //     imageUrl.value = result.data
      //     message.success('上传成功')
      //   })
      //   formParam.albx0020 = res
      // } else {
      //   message.warning('上传失败')
      // }
    }

    const del = (index) => {
      //文件上传 文件删除
      if (props.type !== 'view') {
        fileList.value.splice(index, 1)
        if (urllist.value[index]) {
          urllist.value.splice(index, 1)
        }
      }
    }

    const submit = (sendstatus) => {
      formRef.value.validate().then(() => {
        let bean = {

          forsystem: form.forsystem,
          name: form.name,
          linkurl: form.linkurl,
          sort: form.sort,
          isshow: form.isshow,
          areaid: userInfo.value.areaid,
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
        rpcPost('saveFriendLink', { bean }).then((res) => {
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
        rpcPost('saveFriendLink', { bean }).then((res) => {
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
      rpcPost('saveFriendLink', { bean }).then((res) => {
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

          rpcPost('getFriendLinkDetails', { bean }).then((res) => {
            if (res && res.code === 0) {

              form.forsystem = res.data.forsystem
              form.name = res.data.name
              form.linkurl = res.data.linkurl
              form.sort = res.data.sort
              form.isshow = res.data.isshow



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
      del,
      staging,
      send,
      submit,
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
