<template>
  <!--机构信息完善弹窗 -->
  <a-modal :visible="props.visible" :closable="false" width="950px">
    <template #footer>
      <a-button type="primary" @click="btnAgree" :loading="confirmLoading">提交</a-button>
    </template>
    <template #title>
      <span>机构信息</span>
      <span style="color: red; margin-left: 20px">请先完善机构信息，未完善之前无法进行任何操作！</span>
    </template>
    <a-form
      :label-col="{
        span: 8,
      }"
      :wrapper-col="{
        spam: 16,
      }"
      ref="formRef"
      :model="form"
      :rules="rules"
    >
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item name="albe0073" label="用户名">
            <a-input v-model:value="form.albe0073" type="text" placeholder="请输入用户名" readonly />
          </a-form-item>
        </a-col>
        <!-- <a-col :span="12">
          <a-form-item name="fullname" label="管理员名称">
            <a-input type="text" v-model:value="form.fullname" placeholder="请输入用户名" />
          </a-form-item>
        </a-col> -->
        <a-col :span="12">
          <a-form-item name="albe0075" label="机构名称">
            <a-input type="text" v-model:value="form.albe0075" placeholder="请输入机构名称" />
          </a-form-item>
        </a-col>
        <!-- <a-col :span="12">
          <a-form-item name="albe0072" label="区域">
            <AreaDevide ref="area" :showAll="false" :showLevel="4" :type="true" v-model:value="form.albe0072" disabled></AreaDevide>
          </a-form-item>
        </a-col> -->
        <a-col :span="12">
          <a-form-item name="albe0077" label="联系人姓名">
            <a-input v-model:value="form.albe0077" type="text" placeholder="请输入联系人姓名" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="albe0078" label="联系人手机">
            <a-input v-model:value="form.albe0078" type="text" placeholder="请输入联系人手机" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="albe0081" label="负责人姓名">
            <a-input v-model:value="form.albe0081" type="text" placeholder="请输入负责人姓名" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="albe0082" label="负责人手机">
            <a-input v-model:value="form.albe0082" type="text" placeholder="请输入负责人手机" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="albe0080" label="电子邮箱">
            <a-input v-model:value="form.albe0080" type="text" placeholder="请输入电子邮箱" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="albe0089" label="举报受理电话">
            <a-input v-model:value="form.albe0089" type="text" placeholder="请输入固定电话，格式如：027-83783476" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="albe0083" label="领导姓名及职务">
            <a-input v-model:value="form.albe0083" type="text" placeholder="请输入领导姓名及职务" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="albe0084" label="领导办公电话">
            <a-input v-model:value="form.albe0084" type="text" placeholder="请输入领导办公电话，格式如：027-83783476" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            name="albe0076"
            label="详细地址"
            extra="请点击右边的地图图标在地图上选择项目详细地址"
            :label-col="{
              span: 4,
            }"
            :wrapper-col="{
              spam: 20,
            }"
          >
            <a-input-search v-model:value="form.albe0076" placeholder="详细地址" @search="toggleMap">
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
    <baidu-map v-model:visible="address.mapVisible" @resuleHandel="handleMapSubmit"> </baidu-map>
  </a-modal>
</template>
<script>
import { message } from 'ant-design-vue'
import { defineComponent, ref, onMounted, reactive, watch } from 'vue'
import moment from 'moment'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { rpcPost } from '@/server/conf/index.js'
import { ZoomInOutlined } from '@ant-design/icons-vue'
import { checkPhoneno, checkTelPhoneno, checkEmail } from '@/utils/publicMethods/common'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ZoomInOutlined,
  },
  setup(props, text) {
    const userInfo = ref(LocalGetUserInfo())
    const confirmLoading = ref(false)
    const formRef = ref()
    const form = reactive({
      albe0073: '', //用户名
      fullname: '', //管理员名称
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
    const address = reactive({
      //地图相关参数
      mapVisible: false,
      mapData: {},
    })
    const toggleMap = () => {
      //打卡关闭 地图
      address.mapVisible = !address.mapVisible
    }
    const handleMapSubmit = ({ val, e }) => {
      //选中地址
      address.mapData = e
      form.albe0076 = val
      form.albe0087 = address.mapData.point.lat
      form.albe0088 = address.mapData.point.lng
    }
    const onClose = () => {
      confirmLoading.value = false
      text.emit('child')
    }

    const btnAgree = (e) => {
      //确定按钮
      formRef.value
        .validate()
        .then(() => {
          //数据校验
          confirmLoading.value = true
          let bean = {
            albe0073: userInfo.value.userflag, //用户名
            fullname: userInfo.value.fullName, //管理员名称
            albe0075: form.albe0075, //机构名称
            albe0072: userInfo.value.areaid, //区域
            albe0077: form.albe0077, //联系人姓名
            albe0078: form.albe0078, //联系人手机
            albe0081: form.albe0081, //负责人姓名
            albe0082: form.albe0082, //负责人手机
            albe0080: form.albe0080, //电子邮箱
            albe0089: form.albe0089, //举报受理电话
            albe0083: form.albe0083, //领导姓名及职务
            albe0084: form.albe0084, //领导办公电话
            albe0076: form.albe0076, //详细地址
            albe0087: form.albe0087, //经度
            albe0088: form.albe0088, //纬度
          }
          rpcPost('addlbe03', { bean }).then((res) => {
            //修改详情
            if (res && res.code === 0 && res.data) {
              message.success('修改成功')
              onClose()
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

    const rules = reactive({
      albe0073: [{ required: true, message: '请输入用户名' }],
      albe0075: [{ required: true, message: '请输入机构名称' }],
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

    watch(
      () => props.visible,
      (visible) => {
        if (visible) {
          form.albe0073 = userInfo.value.userflag //用户名
          form.fullname = userInfo.value.fullName //管理员名称
          form.albe0072 = userInfo.value.areaid //区划
        }
      }
    )

    return {
      formRef,
      rules,
      address,
      form,
      props,
      handleMapSubmit,
      confirmLoading,
      onClose,
      btnAgree,
      toggleMap,
    }
  },
})
</script>
<style scoped></style>
