<template>
  <!-- 新建或修改网站资源 -->
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
      <a-row >
        <a-col >
           <a-form-item label="组件图片" name="img">
              <a-upload
                    v-model:value="formParam.img"
                    action="/person/uploadFile"
                    list-type="picture"
                    :remove="removeFile"
                    :default-file-list="fileList"
                    :customRequest="customRequest"
                    class="upload-list-inline" >
              <a-button>
                <a-icon type="upload"/>upload
              </a-button>
              </a-upload>
           </a-form-item>		
        </a-col>   
      </a-row>
      <a-form-item :wrapperCol="{ span: 19, offset: 2 }">
        <a-button type="primary" @click="submit" :loading="loadingBtn"  
          >提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { message } from "ant-design-vue";
import { defineComponent, ref, onMounted, reactive, watch } from "vue";
import { rpcPost } from "@/server/conf/index.js";
export default defineComponent({
  setup(props, text) {
    const query = ref({}) //路由带的参数
    const formRef = ref();
    const loadingBtn = ref(false); //保存按钮
    const formParam = reactive({
      title: "", //显示名称
      componentcode: "", //组件编号
      params: "", //描述擦参数
      img: "", //组件图片
    });

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

    const submit = () => {

        if (query.value.type === 'modify') {
        //修改
        modify()
      } else {
        //新增
        handleSubmit()
      }
    };

    //提交方法
    const handleSubmit = () => {
      formRef.value
        .validate()
        .then(() => {
          let bean = {
            //title: formParam.title,
            title:"cxComponent",
            componentcode:"test0001",
            params:"分页信息描述",
            img: "",          }
          // console.log(bean)
          loadingBtn.value = true
          // 这个接口需要返回项目插入成功后的id
          rpcPost('saveOrUpdateComponent', {
            bean,
          }).then((res) => {
            if (res && res.code === 0) {
              // 项目创建成功 因为是步骤， 看需不需要一个提示
              let obj = {
                type: 'modify',
                projectId: res.data.proid,
                areaId: option.areaid[option.areaid.length - 1],
              }
              localStorage.setItem('projectQuery', JSON.stringify(obj))
              query.value = JSON.parse(localStorage.getItem('projectQuery'))
              message.success('新增成功')
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



    const onClose = () => {};

    return {
      formRef,
      formParam,
      loadingBtn,
      rules,
      submit,
    };
  },
});
</script>
