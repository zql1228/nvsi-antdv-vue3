<template>
  <!-- 布局配置-->
  <a-drawer
    v-model:visible="props.visible"
    title="布局配置"
    :maskClosable="false"
    placement="right"
    @close="onClose2(false)"
    width="600"
    :body-style="{ paddingBottom: '80px' }"
  >

  <!--布局配置 -->
  <div style="background:#fff;margin:12px;height:801px;padding:24px">
    <a-form ref="formRef" :model="formParam" layout="horizontal" :rules="rules">
      
       <a-col :span="24">
            <a-form-item  name="leftLayoutList" :label-col="{ span: 0,}" :wrapper-col="{ span: 16, offset: 4, }" >
              <a-select mode="multiple" v-model:value="formParam.leftLayoutList" placeholder="请点击右侧按钮选择左布局">
                <a-select-option
                  v-for="(item, index) in options.leftLayoutList" :key="index" :value="item.id"
                >{{ item.showname }}</a-select-option>
              </a-select>
              <a-button
                type="primary"
                style="position: absolute;padding:0 18px;"
                @click="openModel('leftLayout')"
              >选择左布局</a-button>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item  name="rightLayoutList" :label-col="{ span: 0,}" :wrapper-col="{ span: 16, offset: 4, }" >
              <a-select mode="multiple" v-model:value="formParam.rightLayoutList" placeholder="请点击右侧按钮选择右布局">
                <a-select-option
                  v-for="(item, index) in options.rightLayoutList" :key="index" :value="item.id"
                >{{ item.showname }}</a-select-option>
              </a-select>
              <a-button
                type="primary"
                style="position: absolute;padding:0 18px;"
                @click="openModel('rightLayout')"
              >选择右布局</a-button>
            </a-form-item>
          </a-col>

      <a-form-item :wrapperCol="{ span: 19, offset: 2 }">
        <a-button type="primary" @click="submit" :loading="loadingBtn"  
          >提交</a-button>  
      </a-form-item>
    </a-form>
  </div>
  </a-drawer>
  <LayoutModelTable
      :visible="visibleModel.leftLayoutVisable"
      @child="onCloseModel1"
      :leftLayoutIdList="formParam.leftLayoutList"
      :leftLayoutList="options.leftLayoutList"
    ></LayoutModelTable>
  <LayoutModelTable
      :visible="visibleModel.rightLayoutVisable"
      @child="onCloseModel2"
      :rightLayoutIdList="formParam.rightLayoutList"
      :rightLayoutList="options.rightLayoutList"
    ></LayoutModelTable>
</template>

<script>
import { message } from "ant-design-vue";
import moment from 'moment'
import { defineComponent, ref, onMounted, reactive, watch } from "vue";
import { rpcPost } from "@/server/conf/index.js";
import ComponentModelTable from './ComponentModelTable' //组件选择弹窗
 import LayoutModelTable from './LayoutModelTable'  //布局选择弹窗
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
  components: {
     ComponentModelTable,
    LayoutModelTable,
  },
  setup(props, text) {
    const query = ref({}) //路由带的参数
    const formRef = ref();
    const loadingBtn = ref(false); //保存按钮
    const formParam = reactive({
      title: "", 
      resourcename: "", 
      componentname: "", 
      exline: "", 
      becolumn:"",
      params:"",   
      rowid:"",
      componentid:"",
      img:"",
      rightLayoutList: [],
      leftLayoutList: [],
    });

    const rules = reactive({
      name: [
        { required: true, message: "请输入本列名称", trigger: "blur" },
      ],
      resourcename: [
        { required: true, message: "请输入关联资源", trigger: "blur" },
      ],
      componentname: [
        { required: true, message: "请输入关联组件", trigger: "blur" },
      ],
      exline: [
        { required: true, message: "请输入外链", trigger: "blur" },
      ],
      becolumn: [
        { required: true, message: "请输入排列顺序", trigger: "blur" },
      ],
      params: [
        { required: true, message: "请输入描述参数", trigger: "blur" },
      ],
    });


     //左布局选择弹窗关闭所调用的方法
     const onCloseModel1 = (arr1, arr2) => {
      formParam.leftLayoutList = arr1
      options.leftLayoutList = arr2
      visibleModel.leftLayoutVisable = false
    }

     //右布局选择弹窗关闭所调用的方法
     const onCloseModel2 = (arr1, arr2) => {
      formParam.rightLayoutList = arr1
      options.rightLayoutList = arr2
      visibleModel.rightLayoutVisable = false
    }


     const openModel = (str) => {
        console.log(str);
      if (str == 'rightLayout') {
        visibleModel.rightLayoutVisable = true
      }
      if(str == 'leftLayout'){
         visibleModel.leftLayoutVisable = true
      }
    }


   //从弹窗传过来的布局对象数组
   const options = reactive({ 
      leftLayoutList: [],
      rightLayoutList: [],
    })
     

  const visibleModel = reactive({
      leftLayoutVisable: false,
       rightLayoutVisable: false,
    })

    const onClose2 = (bool) => {
      formRef.value.resetFields()
      text.emit('child',bool)
    }

    const submit = () => {
      handleSubmit()
    };

   // 提交方法
    const handleSubmit = () => {
      formRef.value
        .validate()
        .then(() => {
          let bean = {
            type:"struct",  //作为配置左右布局的标识
            id:props.item.id,
            leftLayout:options.leftLayoutList[0].id,
            rightLayout:options.rightLayoutList[0].id,
                    }
          loadingBtn.value = true
          rpcPost('saveOrUpdateLayout', {bean,}).then((res) => {
            if (res && res.code === 0) {
              onClose2(false)
              message.success('新增成功')
            } else {
              onClose2(false)
              message.error(res.message)
            }
            loadingBtn.value = false
          })
        })
        .catch((error) => {
          onClose2(false)
          loadingBtn.value = false
        })
    }

    return {
      props,
      visibleModel,
      onClose2,
      onCloseModel1,
      onCloseModel2,
      options,
      openModel,
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
