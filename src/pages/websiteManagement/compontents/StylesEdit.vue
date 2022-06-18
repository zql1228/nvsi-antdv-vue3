<template>
  <!--样式页 行新增 -->
  <a-drawer
    v-model:visible="props.visible"
    title="布局行新增"
    :maskClosable="false"
    placement="right"
    @close="onClose2(false)"
    width="600"
    :body-style="{ paddingBottom: '80px' }"
  >
  <!--行新增 -->
   <div style="background:#fff;margin:12px;height:801px;padding:24px">
    <a-form ref="formRef" :model="formParam" layout="horizontal" :rules="rules">
      <a-form-item label="名称" name="title">
        <a-input v-model:value="formParam.title" style="width: 200px" />
      </a-form-item>
      <a-form-item label="高度" name="height">
        <a-input v-model:value="formParam.height" style="width: 200px"/>
      </a-form-item>
      <a-form-item label="排序" name="sort">
        <a-input v-model:value="formParam.sort" style="width: 200px"/>
      </a-form-item>
      <a-form-item label="列数" name="colcount">
        <a-input v-model:value="formParam.colcount" style="width: 200px"/>
      </a-form-item>
      <a-form-item label="比例" name="proportion">
        <a-input v-model:value="formParam.proportion" style="width: 200px"/>
      </a-form-item>
      <a-form-item  name="ishidden" label="是否显示">
        <a-radio-group v-model:value="formParam.ishidden" :options="optionsList.options1" />
      </a-form-item>
      <a-form-item >
        <a-button type="primary" @click="submit" :loading="loadingBtn"  
          >创建</a-button
        >
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
    layoutid: {
      type: String,
      default: "1",
    },
    item: {
      type: Object,
      default: {},
    },
  },
  setup(props, text) {
    const query = ref({}) //路由带的参数
    const formRef = ref();
    const loadingBtn = ref(false); //保存按钮
     const formParam = reactive({
      title: "",  
      height: "", 
      sort: "", 
      colcount:"",//行内有几列
      ishidden: "",
      proportion:"",
    });


     const rules = reactive({
      title: [
        { required: true, message: "请输入英文名称", trigger: "blur" },
      ],
      // height: [
      //   { required: true, message: "请输入高度", trigger: "blur" },
      // ],
      sort: [
        { required: true, message: "请输入排序参数", trigger: "blur" },
      ],
      ishidden:[
        { required: true, message: "是否显示", trigger: "blur" },
      ],
      colcount:[
        { required: true, message: "是否显示", trigger: "blur" },
      ],
      proportion:[
        { required: true, message: "是否显示", trigger: "blur" },
      ],
    });

 
      

    const onClose2 = (bool) => {
      formRef.value.resetFields()
      text.emit('child',bool)
    }


    const submit = () => {
        handleSubmit()
    };
     //提交方法
    const handleSubmit = () => {
      formRef.value
        .validate()
        .then(() => {
          console.log(props.layoutid);
          let bean = {
              title:formParam.title ,
              colcount: formParam.colcount,
              proportion:formParam.proportion,
              height: formParam.height,
              sort: formParam.sort,
              ishidden: formParam.ishidden,
              layoutid: props.layoutid,
              
            }
          loadingBtn.value = true
          rpcPost('saveOrUpdateLayoutRow', {
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
          loadingBtn.value = false
        })
    }

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

    const onClose = () => {};

    return {
      props,
      onClose2,
      onClose,
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
