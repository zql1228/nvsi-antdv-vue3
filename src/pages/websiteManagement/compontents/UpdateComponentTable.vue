<template>
  <!--修改组件 -->
  <a-drawer
    v-model:visible="props.visible"
    title="组件修改"
    :maskClosable="false"
    placement="right"
    @close="onClose2(false)"
    width="600"
    :body-style="{ paddingBottom: '80px' }"
  >
    <div style="background:#fff;margin:12px;height:801px;padding:24px">
      <a-form ref="formRef" :model="formParam" layout="horizontal" :rules="rules">
        <a-form-item label="组件名称" name="title">
          <a-input v-model:value="formParam.title" style="width: 300px" />
        </a-form-item>
        <a-form-item label="组件编号" name="resourcename">
          <a-input v-model:value="formParam.componentcode" style="width: 300px" />
        </a-form-item>
        <a-row>
          <a-col>
            <a-form-item name="img" label="组件图片">
              <a-upload
                name="avatar"
                list-type="picture-card"
                class="avatar-uploader"
                v-model:value="formParam.img"
                :show-upload-list="false"
                style="width: 100%"
                :customRequest="handleFileUpload"
                :beforeUpload="beforeUpload"
                :remove="removeFile"
                :showUploadList="false"
              >
                <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                <div v-else>
                  <a-icon :type="loading ? 'loading' : 'plus'" />
                  <div class="ant-upload-text">上传图片</div>
                </div>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="修改参数" name="params">
          <a-textarea
            v-model:value="formParam.params"
            style="width: 300px"
            placeholder="输入描述参数：分页，排序..."
            :auto-size="{ minRows: 3, maxRows: 8 }"
          />
        </a-form-item>
        <a-form-item :wrapperCol="{ span: 19, offset: 2 }">
          <a-button type="primary" @click="submit" :loading="loadingBtn">提交</a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-drawer>
</template>

<script>
import { uploadHandle, checkFileType } from '@/utils/upload'
import { message } from 'ant-design-vue'
import moment from 'moment'
import { defineComponent, ref, onMounted, reactive, watch } from 'vue'
import { rpcPost } from '@/server/conf/index.js'
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
  },
  setup(props, text) {
    const query = ref({}) //路由带的参数
    const formRef = ref()
    const loadingBtn = ref(false) //保存按钮
    const formParam = reactive({
      title: '', //名称
      componentcode: '', //组件编号
      img: '', //组件图片
      params: '',
    })
    const imageUrl = ref('') // 封面图片地址

    const rules = reactive({
      title: [{ required: true, message: '请输入本列名称', trigger: 'blur' }],
      componentcode: [{ required: true, message: '请输入关联组件编号', trigger: 'blur' }],
      // img: [
      //   { required: true, message: "请上传图片", trigger: "blur" },
      // ],
      params: [{ required: true, message: '请输入描述参数', trigger: 'blur' }],
    })

    const onClose2 = (bool) => {
      ;(imageUrl.value = ''), formRef.value.resetFields()
      text.emit('child', bool)
    }

    //监听修改页面，赋值
    watch(
      () => props.visible,
      (visible) => {
        if (visible) {
          formParam.title = props.item.title
          formParam.componentcode = props.item.componentcode
          formParam.img = props.item.img
          getimgUrl(props.item.img)
          console.log('imageUrl.value:' + imageUrl.value)
          formParam.params = props.item.params
        }
      }
    )

    //获取图片下载地址  参数img
    const getimgUrl = (param) => {
      let bean = { img: param }
      rpcPost('getFrontResourceImageUrl', { bean }).then((res) => {
        console.log('res:' + res.data)
        imageUrl.value = res.data.imageurl
      })
    }

    //上传
    const handleFileUpload = async (options) => {
      const res = await uploadHandle(options)
      if (res) {
        rpcPost('downloadFortisLogic', { bean: res }).then((result) => {
          imageUrl.value = result.data
          console.log(imageUrl.value)
          message.success('上传成功')
        })
        formParam.img = res
      } else {
        message.warning('上传失败')
      }
    }

    //文件格式校验
    const beforeUpload = (file) => {
      const flag = checkFileType(file)
      if (!flag) {
        message.error('上传文件格式错误，请重新上传')
        return false
      }
      return true
    }

    const submit = () => {
      handleSubmit()
    }

    // 提交方法
    const handleSubmit = () => {
      formRef.value
        .validate()
        .then(() => {
          let bean = {
            title: formParam.title,
            componentcode: formParam.componentcode,
            img: formParam.img,
            params: formParam.params,
            id: props.item.id,
          }
          loadingBtn.value = true
          rpcPost('saveOrUpdateComponent', {
            bean,
          }).then((res) => {
            if (res && res.code === 0) {
              onClose2(false)
              message.success('操作成功')
            } else {
              message.error(res.message)
            }
            loadingBtn.value = false
          })
        })
        .catch((error) => {
          loadingBtn.value = false
        })
    }

    return {
      handleFileUpload,
      beforeUpload,
      imageUrl,
      props,
      onClose2,
      formRef,
      formParam,
      loadingBtn,
      rules,
      submit,
    }
  },
})
</script>
<style scoped></style>
