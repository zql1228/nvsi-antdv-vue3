<template>
  <!--项目操作记录 -->
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
      <a-form-item label="资源名称" name="title">
        <a-input v-model:value="formParam.title"  style="width: 300px" />
      </a-form-item>
      <a-form-item label="资源类型" name="rowtype">
        <a-input v-model:value="formParam.rowtype" style="width: 300px"/>
      </a-form-item>
      <a-form-item label="布局高度" name="height">
        <a-input v-model:value="formParam.height" style="width: 300px"/>
      </a-form-item>
      <a-form-item label="是否显示" name="ishidden">
         <a-checkbox-group v-model="checkedList" :options="plainOptions" @change="onChange" />
      </a-form-item>
       <a-form-item label="排序顺序" name="sort">
        <a-input v-model:value="formParam.sort" style="width: 300px"/>
      </a-form-item>
      <a-form-item :wrapperCol="{ span: 19, offset: 2 }">
        <a-button type="primary" @click="submit" :loading="loadingBtn"  
          >修改</a-button>
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

      data() {
    return {
      checkedList: defaultCheckedList,
      plainOptions,
    };
  },
    // item: {
    //   type: Object,
    //   default: {},
    // },
  },
  setup(props, text) {
    const query = ref({}) //路由带的参数
    const formRef = ref();
    const loadingBtn = ref(false); //保存按钮
    const formParam = reactive({
      title: "", //
      rowtype: "", 
      height: "", //
      ishidden: "", //
      sort:"",   
      
    });

    const rules = reactive({
      title: [
        { required: true, message: "请输入显示名称", trigger: "blur" },
      ],
      rowtype: [
        { required: true, message: "请输入资源类型", trigger: "blur" },
      ],
      height: [
        { required: true, message: "请输入资源高度", trigger: "blur" },
      ],
      ishidden: [
        { required: true, message: "是否显示", trigger: "blur" },
      ],
      sort: [
        { required: true, message: "排序顺序", trigger: "blur" },
      ],
    });

    //   const handle = (record) => {
    //   //详情 按钮
    //   detail.item = record
    //   detail.visible = false
    // }

    const DetailsOnClose = () => {
      detail.visible = false
    }

    const plainOptions = ['是', '否'];
    const defaultCheckedList = ['是'];
      

    const onClose2 = () => {
      text.emit('child')
    }

     const detail = reactive({
      //操作详情弹窗参数
      visible: true,
      item: {},
    })

   const onChange = (checkedList) =>{
      this.indeterminate = !!checkedList.length && checkedList.length < plainOptions.length;
      this.checkAll = checkedList.length === plainOptions.length;
    }

    const submit = () => {
        if (query.value.type === 'modify') {
        //修改
        modify()
      } else {
        //新增
        handleSubmit()
      }
    };

   // 提交方法
    const handleSubmit = () => {
      formRef.value
        .validate()
        .then(() => {
          let bean = {
            //title: formParam.title,
            name:"SHGZ-VUE",
            showname:"新闻页面",
            color:"红色",
            width: "500px",
            sort:"1",
                    }
          // console.log(bean)
          loadingBtn.value = true
          // 这个接口需要返回项目插入成功后的id
          rpcPost('saveOrUpdateLayout', {
            bean,
          }).then((res) => {
            if (res && res.code === 0) {
              // 项目创建成功 因为是步骤， 看需不需要一个提示
              let obj = {
                type: 'modify',
                projectId: res.data.proid,
                areaId: option.areaid[option.areaid.length - 1],
              }
              localStorage.setItem('WebLayout', JSON.stringify(obj))
              query.value = JSON.parse(localStorage.getItem('WebLayout'))
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
        props,
      detail,
      onClose2,
      onClose,
      
      DetailsOnClose,
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
