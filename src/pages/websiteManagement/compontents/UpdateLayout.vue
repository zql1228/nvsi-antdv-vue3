<template>
  <!--布局修改页 修改 -->
  <a-drawer
    v-model:visible="props.visible"
    title="布局修改"
    :maskClosable="false"
    placement="right"
    @close="onClose2(false)"
    width="800"
    :body-style="{ paddingBottom: '80px' }"
  >
    <!--布局修改 -->
    <div style="background:#fff;margin:12px;height:801px;padding:24px">
      <a-form ref="formRef" :model="formParam" layout="horizontal" :rules="rules">
        <a-form-item label="布局名称" name="name">
          <a-input v-model:value="formParam.name" style="width: 300px" />
        </a-form-item>
        <a-form-item label="显示名称" name="showname">
          <a-input v-model:value="formParam.showname" style="width: 300px" />
        </a-form-item>
        <a-form-item label="布局颜色" name="color">
          <a-input v-model:value="formParam.color" style="width: 300px" />
        </a-form-item>
        <a-form-item label="布局宽度" name="width">
          <a-input v-model:value="formParam.width" style="width: 300px" />
        </a-form-item>
        <a-form-item label="布局排序" name="sort">
          <a-input v-model:value="formParam.sort" style="width: 300px" />
        </a-form-item>
        <a-form-item label="布局类型" name="layouttype">
          <a-input v-model:value="formParam.layouttype" style="width: 300px" />
        </a-form-item>
        <a-form-item label="布局结构" name="structuretype">
          <a-select ref="select" v-model:value="formParam.structuretype" :options="options1" placeholder="请选择布局结构" style="width: 300px" />
        </a-form-item>
        <a-form-item :wrapperCol="{ span: 19, offset: 2 }">
          <a-button type="primary" @click="submit" :loading="loadingBtn">提交</a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-drawer>
</template>

<script>
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
    },
    
  },
  setup(props, text) {
    const query = ref({}) //路由带的参数
    const formRef = ref()
    const loadingBtn = ref(false) //保存按钮

    const formParam = reactive({
      
      name: '',
      showname: '',
      color: '',
      width: '',
      sort: '',
      layouttype: '',
      structuretype: '',
    })

    const rules = reactive({
      name: [{ required: true, message: '请输入资源名称', trigger: 'blur' }],
      showname: [{ required: true, message: '请输入显示名称', trigger: 'blur' }],
      color: [{ required: true, message: '请输入颜色', trigger: 'blur' }],
      width: [{ required: true, message: '请输入宽度', trigger: 'blur' }],
      sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
      layouttype: [{ required: true, message: '请输入类型', trigger: 'blur' }],
      structuretype: [{ required: true, message: '请输入结构', trigger: 'blur' }],
    })
    const onClose2 = () => {
      text.emit('child')
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
          formParam.name = props.item.name
          formParam.showname = props.item.showname
          formParam.color = props.item.color
          formParam.width = props.item.width
          formParam.sort = props.item.sort
          formParam.layouttype = props.item.layouttype
          formParam.structuretype = props.item.structuretype
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
            showname: formParam.showname,
            color: formParam.color,
            width: formParam.width,
            sort: formParam.sort,
            layouttype: formParam.layouttype,
            structuretype: formParam.structuretype,
            id: props.item.id,
          }
          loadingBtn.value = true
          rpcPost('saveOrUpdateLayout', {
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

    const options1 = ref([
      { value: '1', label: '左右' },
      { value: '2', label: '上下' },
    ])

    return {
      options1,
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
