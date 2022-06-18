<template>
  <div>
    <a-drawer
      v-model:visible="props.visible"
      title="机构详情"
      :maskClosable="false"
      placement="right"
      @close="onClose(false)"
      width="800"
      :body-style="props.type != 'view' ? { paddingBottom: '80px' } : {}"
    >
      <a-form :label-col="labelCol" :wrapper-col="wrapperCol" ref="formRef" :model="form" :rules="rules">
        <a-row :gutter="24">
          <!-- <a-col :span="12">
            <a-form-item name="albe0073" label="用户名">
              <a-input v-model:value="form.albe0073" type="text" placeholder="请输入用户名" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="fullname" label="管理员名称">
              <a-input type="text" v-model:value="form.fullname" placeholder="请输入用户名" />
            </a-form-item>
          </a-col> -->
          <a-col :span="12">
            <a-form-item name="albe0075" label="机构名称">
              <a-input type="text" v-model:value="form.albe0075" placeholder="请输入机构名称" :disabled="props.type == 'view'" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="albe0072" label="区域">
              <AreaDevNew ref="area" :showAll="false" :showLevel="4" :type="false" v-model:value="option.areaid" disabled></AreaDevNew>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="albe0077" label="联系人姓名">
              <a-input v-model:value="form.albe0077" type="text" placeholder="请输入联系人姓名" :disabled="props.type == 'view'" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="albe0078" label="联系人手机">
              <a-input v-model:value="form.albe0078" type="text" placeholder="请输入联系人手机" :disabled="props.type == 'view'" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="albe0081" label="负责人姓名">
              <a-input v-model:value="form.albe0081" type="text" placeholder="请输入负责人姓名" :disabled="props.type == 'view'" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="albe0082" label="负责人手机">
              <a-input v-model:value="form.albe0082" type="text" placeholder="请输入负责人手机" :disabled="props.type == 'view'" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="albe0080" label="电子邮箱">
              <a-input v-model:value="form.albe0080" type="text" placeholder="请输入电子邮箱" :disabled="props.type == 'view'" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="albe0089" label="举报受理电话">
              <a-input
                v-model:value="form.albe0089"
                type="text"
                placeholder="请输入固定电话，格式如：027-83783476"
                :disabled="props.type == 'view'"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="albe0083" label="领导姓名及职务">
              <a-input v-model:value="form.albe0083" type="text" placeholder="请输入领导姓名及职务" :disabled="props.type == 'view'" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="albe0084" label="领导办公电话">
              <a-input
                v-model:value="form.albe0084"
                type="text"
                placeholder="请输入领导办公电话，格式如：027-83783476"
                :disabled="props.type == 'view'"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item name="albe0076" label="详细地址" extra="请点击右边的地图图标在地图上选择项目详细地址">
              <a-input-search v-model:value="form.albe0076" placeholder="详细地址" @search="toggleMap" :disabled="props.type == 'view'">
                <template #enterButton>
                  <a-button>
                    <template #icon>
                      <ZoomInOutlined />
                    </template>
                    在地图上选择
                  </a-button>
                </template>
              </a-input-search>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div
        v-show="props.type != 'view'"
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button style="margin-right: 8px" @click="onClose(false)">取消</a-button>
        <a-button type="primary" :loading="confirmLoading" @click="handleOk(true)">修改</a-button>
      </div>
      <baidu-map v-model:visible="address.mapVisible" @resuleHandel="handleMapSubmit"> </baidu-map>
    </a-drawer>
  </div>
</template>
<script>
import { defineComponent, ref, reactive, watch, nextTick } from 'vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { rpcPost } from '@/server/conf/index.js'
import { ZoomInOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { checkPhoneno, checkTelPhoneno, checkEmail } from '@/utils/publicMethods/common'
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
    type: {
      type: String,
      default: 'view',
    },
    activeKey: {
      type: Number,
      default: 1,
    },
    queryParam: {
      type: Object,
      default: {},
    },
  },
  components: {
    ZoomInOutlined,
  },
  setup(props, text) {
    const area = ref()
    const userInfo = ref(LocalGetUserInfo())
    const form = reactive({
      // albe0073: '', //用户名
      // fullname: '', //管理员名称
      albe0075: '', //机构名称
      albe0072: '', //区域
      albe0077: '', //联系人姓名
      albe0078: '', //联系人手机
      albe0081: '', //负责人姓名
      albe0082: '', //负责人手机
      albe0080: '', //电子邮箱
      albe0089: '', //举报受理电话
      albe0083: '', //领导姓名及职务
      albe0084: '', //领导办公电话
      albe0076: '', //详细地址
      albe0087: '', //经度
      albe0088: '', //纬度
    })
    const formRef = ref()
    const option = reactive({
      areaid: [],
    })
    const checkPhone = async (rule, value) => {
      if (value && checkPhoneno(value)) {
        return Promise.resolve()
      } else if (value && !checkPhoneno(value)) {
        return Promise.reject('请输入正确的手机号码')
      } else {
        return Promise.reject('联系人手机不能为空')
      }
    }

    const checkLandline = async (rule, value) => {
      //领导办公电话座机验证
      if (!value) {
        return Promise.reject('领导办公电话不能为空')
      } else if (value && !checkTelPhoneno(value)) {
        return Promise.reject('请输入正确的座机号码')
      } else {
        return Promise.resolve()
      }
    }

    const checkLandline2 = async (rule, value) => {
      //举报受理电话座机验证
      if (!value) {
        return Promise.reject('举报受理电话不能为空')
      } else if (value && !checkTelPhoneno(value)) {
        return Promise.reject('请输入正确的座机号码')
      } else {
        return Promise.resolve()
      }
    }

    const checkemail = async (rule, value) => {
      //邮箱验证
      if (value && !checkEmail(value)) {
        return Promise.reject('请输入正确的邮箱·')
      } else {
        return Promise.resolve()
      }
    }

    const checkAreaid = async (rule, value) => {
      //区域验证
      if (option.areaid && option.areaid.length && option.areaid.length !== 0) {
        return Promise.resolve()
      } else {
        return Promise.reject('选择服务区域')
      }
    }

    const rules = reactive({
      albe0075: [{ required: true, message: '请输入机构名称' }],
      albe0072: [{ required: true, validator: checkAreaid, trigger: 'change' }],
      albe0077: [{ required: true, message: '请输入联系人姓名' }],
      albe0078: [{ required: true, validator: checkPhone }],
      albe0081: [{ required: true, message: '请输入负责人姓名' }],
      albe0082: [{ required: true, validator: checkPhone }],
      albe0080: [{ required: false, validator: checkemail }],
      albe0089: [{ required: true, validator: checkLandline2 }], //举报受理电话
      albe0083: [{ required: true, message: '请输入领导姓名及职务' }],
      albe0084: [{ required: true, validator: checkLandline }], //领导办公电话
      albe0076: [{ required: true, message: '请选择详细地址' }],
    })
    const confirmLoading = ref(false) //确定按钮loading
    const address = reactive({
      //地图相关参数
      mapVisible: false,
      mapData: {},
    })
    const resData = ref() //机构详情
    const handleOk = (e) => {
      //确定按钮
      formRef.value
        .validate()
        .then(() => {
          //数据校验
          confirmLoading.value = true
          let bean = {
            id: props.item.id,
            type: 1,
            albe0075: form.albe0075, //机构名称
            albe0072: option.areaid[option.areaid.length - 1], //区域
            albe0077: form.albe0077, //联系人姓名
            albe0078: form.albe0078, //联系人手机
            albe0081: form.albe0081, //负责人姓名
            albe0082: form.albe0082, //负责人手机
            albe0080: form.albe0080, //电子邮箱
            albe0089: form.albe0089, //举报受理电话
            albe0083: form.albe0083, //领导姓名及职务
            albe0084: form.albe0084, //领导办公电话
            albe0076: form.albe0076, //详细地址
            albe0087: form.albe0087 ? form.albe0087 : null, //经度
            albe0088: form.albe0088 ? form.albe0088 : null, //纬度
          }
          rpcPost('updateManagementDepartmentInformationFortis', { bean }).then((res) => {
            //修改详情
            if (res && res.code === 0 && res.data) {
              message.success('修改成功')
              onClose(true)
            } else {
              message.warning(res.message)
            }
            confirmLoading.value = false
          })
        })
        .catch((error) => {
          //校验未通过
          confirmLoading.value = false
        })
    }
    const onClose = (bool) => {
      //关闭弹窗
      formRef.value.resetFields()
      for (let k in form) {
        form[k] = ''
      }
      option.areaid = []
      text.emit('child', bool)
    }

    const handleMapSubmit = ({ val, e }) => {
      //选中地址
      address.mapData = e
      form.albe0076 = val
      form.albe0087 = address.mapData.point.lat
      form.albe0088 = address.mapData.point.lng
    }

    const toggleMap = () => {
      //打卡关闭 地图
      address.mapVisible = !address.mapVisible
    }

    watch(
      () => props.visible,
      (visible) => {
        if (visible) {
          form.albe0075 = props.item.albe0075 ? props.item.albe0075 : '' //机构名称
          option.areaid.push(props.item.albe0072) //区域 数字区划
          if (props.item.albe0072) {
            nextTick(() => {
              area.value.defaultInitArea([props.item.albe0072])
            })
          }
          form.albe0072 = props.item.albe0072 ? props.item.albe0072 : '' //区域
          form.albe0077 = props.item.albe0077 ? props.item.albe0077 : '' //联系人姓名
          form.albe0078 = props.item.albe0078 ? props.item.albe0078 : '' //联系人手机
          form.albe0081 = props.item.albe0081 ? props.item.albe0081 : '' //负责人姓名
          form.albe0082 = props.item.albe0082 ? props.item.albe0082 : '' //负责人手机
          form.albe0080 = props.item.albe0080 ? props.item.albe0080 : '' //电子邮箱
          form.albe0089 = props.item.albe0089 ? props.item.albe0089 : '' //举报受理电话 !
          form.albe0083 = props.item.albe0083 ? props.item.albe0083 : '' //领导姓名及职务
          form.albe0084 = props.item.albe0084 ? props.item.albe0084 : '' //领导办公电话
          form.albe0076 = props.item.albe0076 ? props.item.albe0076 : '' //详细地址
          form.albe0087 = props.item.albe0087 ? props.item.albe0087 : '' //经度!
          form.albe0088 = props.item.albe0088 ? props.item.albe0088 : '' //纬度!
        }
      }
    )

    return {
      area,
      props,
      option,
      formRef,
      form,
      rules,
      confirmLoading,
      address,
      handleOk,
      onClose,
      handleMapSubmit,
      toggleMap,
      labelCol: {
        span: 24,
      },
      wrapperCol: {
        span: 24,
      },
    }
  },
})
</script>
