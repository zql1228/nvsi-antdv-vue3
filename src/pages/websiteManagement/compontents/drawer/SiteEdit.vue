<template>
  <div>
    <a-drawer
      v-model:visible="props.visible"
      title="站点资源"
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
              name="name"
              label="资源名称"
              :wrapper-col="{
                span: 10,
              }"
            >
              <a-input v-model:value="form.name" type="text" placeholder="请输入资源名称" />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item
              name="showname"
              label="显示名称"
              :wrapper-col="{
                span: 10,
              }"
            >
              <a-input v-model:value="form.showname" type="text" placeholder="请输入显示名称" />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item name="resourcetype" label="资源类型">
              <a-radio-group v-model:value="form.resourcetype" :options="optionsList.options1" :disabled="props.type == 'view'"></a-radio-group>
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item name="sort" label="排序">
              <a-input v-model:value="form.sort" type="text" placeholder="请输入资源排序" />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item name="isshow" label="是否显示">
              <a-radio-group v-model:value="form.isshow" :options="optionsList.options2" :disabled="props.type == 'view'"></a-radio-group>
            </a-form-item>

            <a-col :span="24" v-if="props.type != 'view' ">
              <a-form-item
                name="areaid"
                label="所属区域"
                :wrapper-col="{
                  span: 10,
                }"
                              >
                <MacArea placeholder="请选择资源" v-model:value="form.areaid" :islevel="false"></MacArea>
              </a-form-item>
            </a-col>
            <!-- <a-col :span="24">
              <a-form-item
                name="params"
                label="固定参数"
                :wrapper-col="{
                  span: 10,
                }"
              >
                <a-textarea v-model:value="form.params" placeholder="请输入固定参数" allow-clear />
              </a-form-item>
            </a-col> -->
          </a-col>
          <a-col :span="24">
            <a-form-item name="catelevel" label="站点类型">
              <a-radio-group v-model:value="form.catelevel" :options="optionsList.options3" :disabled="props.type == 'view'"></a-radio-group>
            </a-form-item>
          </a-col>
        
         <a-col :span="24">
            <a-form-item name="url" label="域名链接">
              <a-input v-model:value="form.url" type="text" placeholder="请输入域名链接" />
            </a-form-item>
          </a-col>
           <a-col :span="24">
            <a-form-item name="url" label="后台域名链接">
              <a-input v-model:value="form.backgroundurl" type="text" placeholder="请输入后台域名链接" />
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
import MacArea from '@/components/Area/macArea.vue'
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
    MacArea,
  },
  setup(props, text) {
    //
    const formRef = ref(null)
    const userInfo = ref(LocalGetUserInfo())
    const form = reactive({
      name: '',
      showname: '',
      resourcetype: '',
      parentnode: '',
      params: '',
      isshow: '',
      pagetype: '',
      layoutList: [],
    })
    const options = reactive({
  
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
      options1: [
        {
          label: '站点',
          value: '1',
        },
      ],

      options2: [
        {
          label: '是',
          value: '1',
        },
        {
          label: '否',
          value: '2',
        },
      ],

       options3: [
        {
          label: '省级站点',
          value: '1',
        },
        // {
        //   label: '市级站点',
        //   value: '2',
        // },
        {
          label: '税收站点',
          value: '4',
        },
        {
          label: '普通站点(不在网站站点列表中显示)',
          value: '5',
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
        message.warning('上传文件格式错误，请重新上传')
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
          isshow: form.isshow, //未发布0 发布1
          name: form.name,
          showname: form.showname,
          parentnode: props.item.resourceCode,
          params: form.params,
          sort: form.sort,
          areaid: form.areaid.length > 0 ? form.areaid[form.areaid.length - 1] : null, //类型
          layoutid: form.layoutList,
          catelevel: form.catelevel,
          url: form.url,
          backgroundurl: form.backgroundurl
        }
        let arr = []

       if (sendstatus == 1) {
          send(bean)
        }
      })
    }

    

    const send = (bean) => {
      //发送
      loading2.value = true
      // 发送
      props.type = 'modify' ? (bean.id = props.item.id) : ''
      rpcPost('saveResource', { bean }).then((res) => {
        if (res && res.code === 0) {
          message.success('新增成功')
          onClose(1)
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

          rpcPost('getResourceDetails', { bean }).then((res) => {
            if (res && res.code === 0) {
                Object.keys(form).forEach((name) => {
                if (props.item[name]) {
                  form[name] = res.data[name]
                }
              })
             
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

    const rules = reactive({
      name: [{ required: true, message: '资源名称为空', trigger: 'blur' }],
      showname: [{ required: true, message: '显示名称为空', trigger: 'change' }],
      resourcetype: [{ required: true, message: '资源类型为空', trigger: 'change' }],
      isshow: [{ required: true, message: '是否显示为空', trigger: 'change' }],
      sort: [{ required: true, message: '排序为空', trigger: 'change' }],
    })

    return {
      QuillEditor,
      loading2,
      loading1,
      fileList,
      urllist,
      props,
      options,
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
