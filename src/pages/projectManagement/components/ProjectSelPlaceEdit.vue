<!-- 编辑签到地点 -->
<template>
  <div>
    <a-modal
      title="签到详情"
      :maskClosable="false"
      :confirm-loading="loading"
      :visible="props.visible"
      @ok="submit"
      @cancel="onClose(false)"
      width="600px"
    >
      <a-form ref="formRef" :model="formParam" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
        <a-form-item label="类型" name="albx5604">
          <a-radio-group v-model:value="formParam.albx5604">
            <a-radio value="3"> 签到/签退点 </a-radio>
            <a-radio value="1"> 签到点 </a-radio>
            <a-radio value="2"> 签退点 </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="打卡范围(米)" name="albx5605">
          <a-input
            v-model:value="formParam.albx5605"
            suffix="米"
            onkeyup="value=value.replace(/[^\d]/g,'')"
            onafterpaste="value=value.replace(/[^\d]/g,'')"
          />
        </a-form-item>
        <a-form-item
          name="albx5606"
          label="打卡地址"
          extra="请点击右侧图标选择项目详细地址"
          :wrapper-col="{
            span: 10,
          }"
        >
          <a-input v-model:value="formParam.albx5606" disabled placeholder="详细地址" />
          <a-button @click="toggleMap" style="position: absolute">
            <template #icon>
              <ZoomInOutlined />
            </template>
            在地图上选择
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
    <baidu-map v-model:visible="mapVisible" @resuleHandel="handleMapSubmit"> </baidu-map>
  </div>
</template>

<script>
import { message } from 'ant-design-vue'
import { defineComponent, ref, onMounted, reactive, watch } from 'vue'
import { rpcPost } from '@/server/conf/index.js'
import { ZoomInOutlined } from '@ant-design/icons-vue'
import { LocalGetProjectInfo } from '@/utils/localStorage.js'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    model: {
      //修改时传递的参数
      type: Object,
      default: () => null,
    },
  },
  components: {
    ZoomInOutlined,
  },
  setup(props, text) {
    const loading = ref(false)
    const formRef = ref()
    const mapVisible = ref(false)
    const mapData = ref({}) // 地图返回的数据
    const form = ref()
    const query = ref()
    const formParam = reactive({
      albx5604: '', //类型
      albx5605: '', //刷卡范围（0不限）
      albx5606: '', //签到地详细地址
      albx5602: '', //签到坐标-x轴经度
      albx5603: '', //签到坐标-y轴纬度
    })
    const rules = reactive({
      albx5604: [{ required: true, message: '请选择地点类型', trigger: 'change' }],
      albx5605: [
        { required: true, message: '请填写打卡范围', trigger: 'blur' },
        { max: 4, message: '打卡范围最多为4位', trigger: 'blur' },
      ],
      albx5606: [{ required: true, message: '请选择打卡地址', trigger: 'blur' }],
    })
    onMounted(() => {
      query.value = LocalGetProjectInfo()
    })
    watch(
      () => props.visible,
      (value) => {
        if (value && props.model.operation === 'modify') {
          //将父组件传值赋值
          formParam.albx5604 = props.model.record.albx5604
          formParam.albx5605 = props.model.record.albx5605
          formParam.albx5606 = props.model.record.albx5606
          formParam.albx5602 = props.model.record.albx5602
          formParam.albx5603 = props.model.record.albx5603
          formParam.id = props.model.record.id
        }
      }
    )
    const create = () => {
      //新增打卡地点
      let bean = JSON.parse(JSON.stringify(formParam))
      bean.proId = query.value.projectId //项目id
      loading.value = true
      console.log(bean, 'groupProjectAddPlacePostFortis')
      rpcPost('groupProjectAddPlacePostFortis', { bean }).then((res) => {
        loading.value = false
        if (res && res.code === 0) {
          onClose(true)
          message.success('新增成功')
        } else {
          message.warning(res.message)
        }
      })
    }
    const modify = () => {
      //修改打卡地点
      let bean = JSON.parse(JSON.stringify(formParam))
      bean.albx0021 = query.value.areaId
      bean.proId = query.value.projectId
      loading.value = true
      rpcPost('groupProjectUpdatePlacePostFortis', { bean }).then((res) => {
        loading.value = false
        if (res && res.code === 0) {
          onClose(true)
          message.success('修改成功')
        } else {
          message.warning(res.message)
        }
      })
    }
    const submit = () => {
      //  确定按钮
      formRef.value
        .validate()
        .then(() => {
          if (props.model.operation === 'create') {
            //  新增
            create()
          } else if (props.model.operation === 'modify') {
            // 修改
            modify()
          }
        })
        .catch((error) => {})
    }

    const handleMapSubmit = ({ val, e }) => {
      //选中地址
      mapData.value = e
      formParam.albx5606 = val
      formParam.albx5602 = mapData.value.point.lat
      formParam.albx5603 = mapData.value.point.lng
    }
    const toggleMap = () => {
      //打卡关闭 地图
      mapVisible.value = !mapVisible.value
    }
    const onClose = (bool) => {
      //关闭弹窗
      loading.value = false
      formRef.value.resetFields()
      text.emit('child', bool)
    }
    return {
      formRef,
      props,
      loading,
      mapVisible,
      mapData,
      form,
      formParam,
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 16,
      },
      rules,
      create,
      modify,
      submit,
      handleMapSubmit,
      toggleMap,
      onClose,
    }
  },
})
</script>
<style lang="scss" scoped></style>
