<template>
  <!--行内列 -->
  <a-drawer
    v-model:visible="props.visible"
    title="行内列配置"
    :maskClosable="false"
    placement="right"
    @close="onClose2(false)"
    width="600"
    :body-style="{ paddingBottom: '80px' }"
  >
    <!--行内 新增列 -->
    <div style="background:#fff;margin:12px;height:801px;padding:24px">
      <a-form ref="formRef" :model="formParam" layout="horizontal" :rules="rules">
        <a-form-item label="标题名称" name="name">
          <a-input v-model:value="formParam.name" style="width: 300px" />
        </a-form-item>
        <a-form-item label="外链资源" name="exline">
          <a-input v-model:value="formParam.exline" style="width: 300px" />
        </a-form-item>
        <a-form-item label="排列顺序" name="sort">
          <a-input v-model:value="formParam.sort" style="width: 300px" />
        </a-form-item>
        <a-form-item label="所属列" name="becolumn">
          <a-input v-model:value="formParam.becolumn" style="width: 300px" />
        </a-form-item>
        <a-form-item label="描述参数" name="params">
          <a-textarea
            v-model:value="formParam.params"
            style="width: 300px"
            placeholder="输入描述参数：分页，排序..."
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-item>
          <a-col :span="24">
          <a-form-item
            name="beresourcecde"
            label="资源类型"
            :wrapper-col="{
              span: 10,
            }"
          >
           <seaResource placeholder="请选择资源" v-model:value="formParam.resourcecode" :islevel="false"></seaResource>

          </a-form-item>
        </a-col>
        <!-- <a-col :span="24">
          <a-form-item name="resourceList" style="width: 400px" :label-col="{ span: 0 }" :wrapper-col="{ span: 16, offset: 1 }">
            <a-select mode="multiple" v-model:value="formParam.resourceList" placeholder="请点击右侧按钮选择关联资源">
              <a-select-option v-for="(item, index) in options.resourceList" :key="index" :value="item.id">{{ item.showname }}</a-select-option>
            </a-select>
            <a-button type="primary" style="position: absolute;padding:0 18px;" @click="openModel('resource')">选择资源</a-button>
          </a-form-item>
        </a-col> -->
        <a-col :span="24">
          <a-form-item name="componentList" style="width: 400px" :label-col="{ span: 0 }" :wrapper-col="{ span: 16, offset: 1 }">
            <a-select mode="multiple" v-model:value="formParam.componentList" placeholder="请点击右侧按钮选择布局">
              <a-select-option v-for="(item, index) in options.componentList" :key="index" :value="item.id">{{ item.title }}</a-select-option>
            </a-select>
            <a-button type="primary" style="position: absolute;padding:0 18px;" @click="openModel('component')">选择组件</a-button>
          </a-form-item>
        </a-col>
        <a-form-item :wrapperCol="{ span: 19, offset: 2 }">
          <a-button type="primary" @click="submit" :loading="loadingBtn">提交</a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-drawer>
  <ComponentModelTable
    :visible="visibleModel.componentVisable"
    @child="onCloseModel1"
    :componentIdList="formParam.componentList"
    :componentList="options.componentList"
  ></ComponentModelTable>
  <ResourceModelTable
    :visible="visibleModel.resourceVisable"
    @child="onCloseModel2"
    :resourceIdList="formParam.resourceList"
    :resourceList="options.resourceList"
  ></ResourceModelTable>
</template>
<script>
import { message } from 'ant-design-vue'
import moment from 'moment'
import { defineComponent, ref, onMounted, reactive, watch } from 'vue'
import { rpcPost } from '@/server/conf/index.js'
import ComponentModelTable from './ComponentModelTable' //组件选择弹窗
 import seaResource from './seaResource.vue'

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
    seaResource,
  },
  setup(props, text) {
    const query = ref({}) //路由带的参数
    const formRef = ref()
    const loadingBtn = ref(false) //保存按钮
    const formParam = reactive({
      title: '',
      resourcename: '',
      componentname: '',
      exline: '',
      becolumn: '',
      params: '',
      rowid: '',
      componentid: '',
      img: '',
      componentList: [],
      resourceList: [],
      resourcecode: '',
    })

    const rules = reactive({
      name: [{ required: true, message: '请输入本列名称', trigger: 'blur' }],
      resourcename: [{ required: true, message: '请输入关联资源', trigger: 'blur' }],
      componentname: [{ required: true, message: '请输入关联组件', trigger: 'blur' }],
      // exline: [
      //   { required: true, message: "请输入外链", trigger: "blur" },
      // ],
      sort: [{ required: true, message: '请输入排列顺序', trigger: 'blur' }],
      params: [{ required: true, message: '请输入描述参数', trigger: 'blur' }],
      becolumn: [{ required: true, message: '请输入当前列所属列', trigger: 'blur' }],
    })

    //组件选择弹窗关闭所调用的方法
    const onCloseModel1 = (arr1, arr2) => {
      formParam.componentList = arr1 //id
      options.componentList = arr2 //bean
      visibleModel.componentVisable = false
    }

    //资源选择弹窗关闭所调用的方法
    const onCloseModel2 = (arr1, arr2) => {
      formParam.resourceList = arr1 //id
      options.resourceList = arr2 //bean
      visibleModel.resourceVisable = false
    }

    const openModel = (str) => {
      if (str == 'component') {
        visibleModel.componentVisable = true
      }
      if (str == 'resource') {
        visibleModel.resourceVisable = true
      }
    }

    //从弹窗传过来的布局对象数组
    const options = reactive({
      componentList: [],
      resourceList: [],
    })

    const visibleModel = reactive({
      componentVisable: false,
      resourceVisable: false,
    })

    const onClose2 = (bool) => {
      ;(options.componentList = []), (options.resourceList = []), formRef.value.resetFields()
      text.emit('child', bool)
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
            name: formParam.name,
            resourcename: options.resourceList[0]?.showname, //单选
            // resourcename:formParam.resourcename, // 资源多选
            resourcecode: options.resourceList[0]?.resourcecode, //资源单选
            componentname: options.componentList[0]?.componentcode, //组件单选  name 里存code
            componentid: formParam.componentList[0],
            sort: formParam.sort,
            exline: formParam.exline,
            becolumn: formParam.becolumn,
            params: formParam.params,
            layoutid: props.item.layoutid,
            layoutrowid: props.item.id,
          }
          loadingBtn.value = true
          rpcPost('saveOrUpdateLayoutCol', { bean }).then((res) => {
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
    }
  },
})
</script>
<style scoped></style>
