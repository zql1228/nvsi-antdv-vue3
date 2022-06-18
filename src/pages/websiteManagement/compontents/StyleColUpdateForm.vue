<template>
  <!-- 列 修改 -->
  <a-drawer
    v-model:visible="props.visible"
    title="布局列修改"
    :maskClosable="false"
    placement="right"
    @close="onClose2(false)"
    width="600"
    :body-style="{ paddingBottom: '80px' }"
  >
    <!--布局列修改 -->
    <div style="background: #fff; margin: 12px; height: 801px; padding: 24px">
      <a-form ref="formRef" :model="formParam" layout="horizontal" :rules="rules">
        <a-form-item label="本列名称" name="name">
          <a-input v-model:value="formParam.name" />
        </a-form-item>
        <a-form-item label="所属列" name="becolumn">
          <a-input v-model:value="formParam.becolumn" />
        </a-form-item>
        <a-form-item label="排序" letter-spacing name="sort">
          <a-input v-model:value="formParam.sort" />
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
            <a-button type="primary" style="position: absolute; padding: 0 18px" @click="openModel('component')">选择组件</a-button>
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
      name: '',
      componentname: '',
      resourcename: '',
      becolumn: '',
      sort: '',
      componentList: [], //formParam里面是idList options里面是bean list
      resourceList: [],
      resourcecode: '',
    })

    const rules = reactive({
      name: [{ required: true, message: '请输入列名称', trigger: 'blur' }],
      componentname: [{ required: true, message: '请输入组件名称', trigger: 'blur' }],
      resourcename: [{ required: true, message: '请输入关联资源', trigger: 'blur' }],
      becolumn: [{ required: true, message: '请输入所属列', trigger: 'blur' }],
      sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
    })

    const onClose2 = (bool) => {
      ;(options.componentList = []), (options.resourceList = []), text.emit('child', bool)
    }

    //新增
    const submit = () => {
      handleSubmit()
    }

    //监听修改页面，赋值
    watch(
      () => props.visible,
      (visible) => {
        if (visible) {
          formParam.name = props.item.record.name
          formParam.becolumn = props.item.record.becolumn
          formParam.sort = props.item.record.sort
          formParam.resourceList = options.resourceList
        }
      }
    )

    //提交方法
    const handleSubmit = () => {
      formRef.value
        .validate()
        .then(() => {
          let bean = {
            name: formParam.name,
            becolumn: formParam.becolumn,
            sort: formParam.sort,
            id: props.item.record.id,
            // resourcename: options.resourceList[0]?.showname, //单选
            // resourcecode: options.resourceList[0]?.resourcecode, //资源单选
            resourcecode: formParam.resourcecode.length > 0 ? formParam.resourcecode[formParam.resourcecode.length - 1] : null, //类型
            componentname: options.componentList[0]?.componentcode, //组件单选  name里存code
            componentid: formParam.componentList[0],
          }
          loadingBtn.value = true
          rpcPost('saveOrUpdateLayoutCol', {
            bean,
          }).then((res) => {
            if (res && res.code === 0) {
              onClose2(false)
              message.success('操作成功')
            } else {
              onClose2(false)
              message.error(res.message)
            }
            loadingBtn.value = false
          })
        })
        .catch((error) => {
          loadingBtn.value = false
        })
    }

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

    return {
      visibleModel,
      options,
      openModel,
      onCloseModel1,
      onCloseModel2,
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
