<template>
  <!--布局行修改 -->
  <a-drawer
    v-model:visible="props.visible"
    title="布局行修改"
    :maskClosable="false"
    placement="right"
    @close="onClose2(false)"
    width="600"
    :body-style="{ paddingBottom: '80px' }"
  >
    <!--布局行修改 -->
    <div style="background:#fff;margin:12px;height:801px;padding:24px">
      <a-form ref="formRef" :model="formParam" layout="horizontal" :rules="rules">
        <a-form-item label="资源名称" name="title">
          <a-input v-model:value="formParam.title" style="width: 300px" />
        </a-form-item>
        <a-form-item label="布局高度" name="height">
          <a-input v-model:value="formParam.height" style="width: 300px" />
        </a-form-item>
        <a-form-item label="本行配比" name="proportion">
          <a-input v-model:value="formParam.proportion" style="width: 300px" />
        </a-form-item>
        <a-form-item label="本行列数" name="colcount">
          <a-input v-model:value="formParam.colcount" style="width: 300px" />
        </a-form-item>
        <a-form-item label="是否显示" name="ishidden">
          <a-radio-group v-model:value="formParam.ishidden" :options="optionsList.options1" />
        </a-form-item>
        <a-form-item label="排序顺序" name="sort">
          <a-input v-model:value="formParam.sort" style="width: 300px" />
        </a-form-item>
        <a-form-item :wrapperCol="{ span: 19, offset: 2 }">
          <a-button type="primary" @click="submit" :loading="loadingBtn">修改</a-button>
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
      default: {},
    },
  },
  setup(props, text) {
    const query = ref({}) //路由带的参数
    const formRef = ref()
    const loadingBtn = ref(false) //保存按钮
    const formParam = reactive({
      title: '',
      rowtype: '',
      height: '',
      ishidden: '',
      sort: '',
    })

    const rules = reactive({
      title: [{ required: true, message: '请输入资源名称', trigger: 'blur' }],
      proportion: [{ required: true, message: '请输入本行配比', trigger: 'blur' }],
      colcount: [{ required: true, message: '请输入本行列数', trigger: 'blur' }],
      ishidden: [{ required: true, message: '是否显示', trigger: 'blur' }],
      sort: [{ required: true, message: '排序顺序', trigger: 'blur' }],
    })

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

    const onClose2 = () => {
      text.emit('child')
    }

    //监听修改页面，赋值
    watch(
      () => props.visible,
      (visible) => {
        if (visible) {
          formParam.title = props.item.title
          formParam.colcount = props.item.colcount
          formParam.height = props.item.height
          formParam.proportion = props.item.proportion
          formParam.ishidden = props.item.ishidden
          formParam.sort = props.item.sort
        }
      }
    )

    const onChange = (checkedList) => {
      this.indeterminate = !!checkedList.length && checkedList.length < plainOptions.length
      this.checkAll = checkedList.length === plainOptions.length
    }

    const submit = () => {
      //新增
      handleSubmit()
    }

    // 提交方法
    const handleSubmit = () => {
      formRef.value
        .validate()
        .then(() => {
          let bean = {
            title: formParam.title,
            colcount: formParam.colcount,
            height: formParam.height,
            proportion: formParam.proportion,
            ishidden: formParam.ishidden,
            sort: formParam.sort,
            id: props.item.id,
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

    return {
      props,
      onClose2,
      optionsList,
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
