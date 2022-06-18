<template>
  <!-- 新增布局-->
  <a-drawer
    v-model:visible="props.visible"
    title="布局新增"
    :maskClosable="false"
    placement="right"
    @close="onClose2(false)"
    width="600"
    :body-style="{ paddingBottom: '80px' }"
  >

  <!--布局新增 -->
  <div style="background:#fff;margin:12px;height:801px;padding:24px">
    <a-form ref="formRef" :model="formParam" layout="horizontal" :rules="rules">
      <a-form-item label="资源名称" name="name">
        <a-input v-model:value="formParam.name"  style="width: 300px" />
      </a-form-item>
      <a-form-item label="显示名称" name="showname">
        <a-input v-model:value="formParam.showname" style="width: 300px"/>
      </a-form-item>
      <a-form-item label="布局颜色" name="color">
        <a-input v-model:value="formParam.color" style="width: 300px"/>
      </a-form-item>
      <a-form-item label="布局宽度" name="width">
        <a-input v-model:value="formParam.width" style="width: 300px"/>
      </a-form-item>
      <a-form-item label="布局类型" name="layouttype">
        <a-select ref="select" v-model:value="formParam.layouttype" :options="options" placeholder="请选择布局类型" style="width: 300px"/>
      </a-form-item>
      <a-form-item label="布局结构" name="structuretype"> 
        <a-select ref="select" v-model:value="formParam.structuretype" :options="options1" placeholder="请选择布局结构" style="width: 300px"/>
      </a-form-item>
      <a-form-item label="布局排序" name="sort">
         <a-input v-model:value="formParam.sort" style="width: 300px"/>
      </a-form-item>
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
      name: "", 
      showname: "", 
      color: "", 
      width: "", 
      sort:"",   
      layouttype:"",
      structuretype:"",
    });

    const rules = reactive({
      name: [
        { required: true, message: "请输入资源名称", trigger: "blur" },
      ],
      showname: [
        { required: true, message: "请输入显示名称", trigger: "blur" },
      ],
      color: [
        { required: true, message: "请输入布局颜色", trigger: "blur" },
      ],
      width: [
        { required: true, message: "请输入布局宽度", trigger: "blur" },
      ],
      sort: [
        { required: true, message: "请输入布局排序", trigger: "blur" },
      ],
      layouttype: [
        { required: true, message: "请输入布局类型", trigger: "blur" },
      ],
      structuretype: [
        { required: true, message: "请输入布局结构", trigger: "blur" },
      ],
    });
    const onClose2 = (bool) => {
      formRef.value.resetFields()
      text.emit('child',bool)
    }

    const options = ref([
      { value: '1', label: '页头' },
      { value: '2', label: '导航' },
      { value: '3', label: '中间' },
      { value: '4', label: '页尾' },
      { value: '5', label: '栏目' },
    ])

    const options1 = ref([
      { value: '1', label: '左右' },
      { value: '2', label: '上下' },
     
    ])

    const optionsList = reactive({

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
    const submit = () => {
        //新增
        handleSubmit()
      
    };

   // 提交方法
    const handleSubmit = () => {
      formRef.value
        .validate()
        .then(() => {
          let bean = {
            name:formParam.name,
            showname:formParam.showname,
            color:formParam.color,
            width:formParam.width,
            sort:formParam.sort,
            layouttype:formParam.layouttype,
            structuretype:formParam.structuretype,
                    }
          loadingBtn.value = true
          rpcPost('saveOrUpdateLayout', {
            bean,
          }).then((res) => {
            if (res && res.code === 0) {
              onClose2(false)
              message.success('新增成功')
            } else {
              message.error(res.message)
            }
            loadingBtn.value = false
          })
        })
        .catch((error) => {
          console.log("11");
          loadingBtn.value = false
        })
    }

    return {
      options,
      options1,
      props,
      onClose2,
      formParam,
      optionsList,
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
