<template>
  <!--新增组件 -->
  <a-drawer
    v-model:visible="props.visible"
    title="组件新增"
    :maskClosable="false"
    placement="right"
    @close="onClose2(false)"
    width="800"
    :body-style="{ paddingBottom: '80px' }"
  >
  <!--组件新增 -->
  <div style="background:#fff;margin:12px;height:801px;padding:24px">
    <a-form ref="formRef" :model="formParam" layout="horizontal" :rules="rules">
      <a-form-item label="显示名称" name="title">
        <a-input v-model:value="formParam.title"  style="width: 300px" />
      </a-form-item>
      <a-form-item label="组件编号" name="componentcode">
        <a-input v-model:value="formParam.componentcode" style="width: 300px"/>
      </a-form-item>
       <a-form-item label="描述参数" name="params">
          <a-textarea
             v-model:value="formParam.params" style="width: 300px"
            placeholder="输入描述参数：分页，排序..."
            :auto-size="{ minRows: 3, maxRows: 5 }" 
          />
        </a-form-item>
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
      <a-form-item :wrapperCol="{ span: 19, offset: 2 }">
        <a-button type="primary" @click="submit" :loading="loadingBtn"  
          >提交</a-button>
      </a-form-item>
    </a-form>
  </div>
  </a-drawer>
</template>

<script>
import { message } from "ant-design-vue";
import moment from 'moment'
import { defineComponent, ref, onMounted, reactive, watch } from "vue";
import { rpcPost } from "@/server/conf/index.js";
import { uploadHandle, checkFileType } from '@/utils/upload'
import { imgList } from '../img.js'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, text) {
    const query = ref({}) //路由带的参数
    const formRef = ref();
    const loadingBtn = ref(false); //保存按钮
    const formParam = reactive({
      title: "", //显示名称
      componentcode: "", //组件编号
      params: "", //描述参数
      img: "", //组件图片
    });
    const imageUrl = ref('') // 图片地址
    const rules = reactive({
      title: [
        { required: true, message: "请输入显示名称", trigger: "blur" },
      ],
      componentcode: [
        { required: true, message: "请输入组件编号", trigger: "blur" },
      ],
      // img: [
      //   { required: true, message: "请上传图片", trigger: "blur" },
      // ],
      params: [
        { required: true, message: "请输入描述参数", trigger: "blur" },
      ],
    });

    const onClose2 = (bool) => {
      text.emit('imageUrl',imageUrl.value)
      imageUrl.value = '',  //关闭时清空图片
      formRef.value.resetFields()
      text.emit('child',bool)
    }


    const submit = () => {
        //新增
        handleSubmit()
    };

     //提交方法
    const handleSubmit = () => {
      formRef.value
        .validate()
        .then(() => {
          let bean = {
            title:formParam.title,
            componentcode:formParam.componentcode,
            params:formParam.params,
            img: formParam.img,          }
          loadingBtn.value = true
          rpcPost('saveOrUpdateComponent', {
            bean,
          }).then((res) => {
            if (res && res.code === 0) {
              message.success('新增成功')
              onClose2(false)
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

      // 文件上传
    const handleFileUpload = async (options) => {
      //上传
      const res = await uploadHandle(options)
      if (res) {
        //返回地址 下载
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
    
    return {
      props,
      onClose2,
      handleFileUpload,
      imageUrl,
      beforeUpload,
      formRef,
      formParam,
      loadingBtn,
      rules,
      submit,
    };
  },
});
</script>
<style scoped></style>
