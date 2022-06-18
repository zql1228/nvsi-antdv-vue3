<template>
  <!--修改志愿者信息 手机号 -->
  <a-drawer title="修改志愿者信息" placement="right" v-model:visible="props.visible" :maskClosable="false" @close="onClose(false)" width="600">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="修改信息">
        <a-form
          ref="searchFormRef"
          :model="queryParam"
          :rules="rules"
          :label-col="{
            span: 6,
          }"
          :wrapper-col="{
            span: 18,
          }"
        >
          <a-form-item label="志愿者姓名" name="albp0005">
            <a-input v-model:value="queryParam.albp0005" placeholder="请输入志愿者姓名" readonly />
          </a-form-item>
          <a-form-item label="手机号码" name="newPhone">
            <a-input placeholder="请输入手机号码" v-model:value="queryParam.newPhone" />
          </a-form-item>
          <a-form-item label="邮箱" name="newEmail">
            <a-input placeholder="请输入邮箱" v-model:value="queryParam.newEmail" />
          </a-form-item>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="2" tab="操作记录" force-render>
        <IATable
          serviceName="queryOperationRecordFortis"
          :searchParameter="searchFunc"
          ref="TeamQueryDrawerTable"
          size="middle"
          :rowKey="(record) => record.id"
          :columns="columns"
          :showHeader="false"
        >
          <template #action="record">
            <a-space>
              <a-button type="primary" size="small" @click="handleView(record.record)"> 详情 </a-button>
            </a-space>
          </template>
        </IATable>
      </a-tab-pane>
    </a-tabs>
    <div
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
      v-if="activeKey == 1"
    >
      <a-button style="margin-right: 8px" @click="onClose(false)">取消</a-button>
      <a-button type="primary" :loading="loading" @click="update">确认修改</a-button>
    </div>
    <InquiryDetailDrawer :visible="drawerData.visible" :item="drawerData.item" :activeKey="activeKey" @child="child"></InquiryDetailDrawer>
  </a-drawer>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, watch, nextTick } from 'vue'
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { rpcPost } from '@/server/conf/index.js'
import { message } from 'ant-design-vue'
import moment from 'moment'
import { uploadHandle, checkFileType } from '@/utils/upload'
import { checkPhoneno, checkEmail } from '@/utils/publicMethods/common'
import { PlusOutlined } from '@ant-design/icons-vue'
import {
  nvsiAlbp0039, //服务类别
  nvsiAlbe0003, //队伍类型
} from '@/utils/codevalue'
import InquiryDetailDrawer from './InquiryDetailDrawer.vue' //操作记录详情表单
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    item: {
      //列表队伍数据
      type: Object,
      default: {},
    },
    activeKey: {
      type: String,
      default: '1',
    },
  },
  components: { PlusOutlined, InquiryDetailDrawer },
  setup(props, text) {
    const activeKey = ref('1')
    const searchFormRef = ref()
    const userInfo = ref(LocalGetUserInfo())
    const queryParam = reactive({
      albp0005: '', //志愿者姓名
      oldPhone: '', //原手机号
      newPhone: '', //修改手机号码
      albe2508: [], //修改证明
    })
    const url = ref('') //修改证明地址
    const loading = ref(false)
    const TeamQueryDrawerTable = ref() //操作记录表格
    const drawerData = reactive({
      //操作记录详情弹窗参数
      visible: false,
      item: {},
    })

    const child = () => {
      //关闭操作记录详情弹窗
      drawerData.visible = false
    }

    const handleView = (record) => {
      //详情按钮
      drawerData.item = JSON.parse(JSON.stringify(record))
      drawerData.item.name = props.item.albp0003 ? props.item.albp0003 : props.item.albp0064
      drawerData.visible = true
    }

    const update = () => {
      //确定修改按钮
      searchFormRef.value
        .validate()
        .then(() => {
          //fullName
          let bean = {
            id: props.item.id,
            userFlag: userInfo.value.userflag,
            fullname: userInfo.value.fullName,
            userId: userInfo.value.userid,
            albp0005: props.item.albp0005, //志愿者身份证号码
            oldPhone: props.item.albp0010 ? props.item.albp0010 : null, //原手机号
            newPhone: queryParam.newPhone, //修改手机号码
            oldEmail: props.item.albp0081 ? props.item.albp0081 : null, //原邮箱
            newEmail: queryParam.newEmail, //新邮箱
          }
          if (bean.newPhone == props.item.albp0010 && bean.newEmail == props.item.albp0081) {
            return message.warning('本次修改后信息与修改前一样，请重新修改提交')
          }
          loading.value = true
          console.log(bean, '志愿者修改信息')
          rpcPost('updateTeamVolPhoneFortis', { bean }).then((res) => {
            console.log(res, 'res----修改志愿者信息')
            if (res && res.code === 0) {
              message.success('修改成功')
              onClose(true)
            } else {
              message.warning('修改失败')
            }
            loading.value = false
          })
        })
        .catch((error) => {
          console.log(error)
        })
    }

    const onClose = (bool) => {
      //关闭弹窗
      searchFormRef.value.resetFields()
      loading.value = false
      text.emit('child', bool, props.activeKey)
    }

    const searchFunc = () => {
      //操作记录入参
      return {
        id: props.item.id,
      }
    }

    const beforeUpload = (file) => {
      //文件格式校验
      const flag = checkFileType(file)
      if (!flag) {
        message.warning('上传文件格式错误，请重新上传')
        return false
      }
      return true
    }

    const handleFileUpload = async (options) => {
      //文件上传
      const res = await uploadHandle(options)
      if (res) {
        rpcPost('downloadFortisLogic', { bean: res }).then((result) => {
          if (result && result.code === 0 && result.data) {
            queryParam.albe2508 = []
            queryParam.albe2508.push(res)
            url.value = result.data
            message.success('上传成功')
          } else {
            message.warning('上传失败')
          }
        })
      } else {
        message.warning('上传失败')
      }
    }

    const del = (index) => {
      //文件删除
      queryParam.albe2508 = []
      url.value = ''
    }

    const checknewPhone = async (rule, value) => {
      //修改手机号校验
      if (!value) {
        return Promise.reject('联系方式不能为空')
      } else if (!checkPhoneno(value)) {
        return Promise.reject('请输入正确的手机号码')
      } else {
        return Promise.resolve()
      }
    }

    const checknewEmail = async (rule, value) => {
      //证明文件校验
      if (!value) {
        return Promise.reject('邮箱不能为空')
      } else if (!checkEmail(value)) {
        return Promise.reject('请输入正确的邮箱')
      } else {
        return Promise.resolve()
      }
    }

    const rules = reactive({
      albp0005: [{ required: true, message: '请输入志愿者姓名' }],
      newPhone: [{ required: true, validator: checknewPhone }],
      newEmail: [{ required: true, validator: checknewEmail }],
    })

    watch(
      () => props.visible,
      (visible) => {
        if (visible) {
          nextTick(() => {
            TeamQueryDrawerTable.value.refresh(true)
          })
          queryParam.albp0005 = props.item.albp0003
          queryParam.newPhone = props.item.albp0010 ? props.item.albp0010 : null
          queryParam.newEmail = props.item.albp0081 ? props.item.albp0081 : null
        }
      }
    )
    return {
      TeamQueryDrawerTable,
      drawerData,
      activeKey,
      loading,
      url,
      searchFormRef,
      queryParam,
      rules,
      props,
      onClose,
      update,
      beforeUpload,
      handleFileUpload,
      del,
      child,
      handleView,
      searchFunc,
      columns: [
        {
          title: '序号',
          slots: {
            customRender: 'serial',
          },
          width: 80,
          align: 'center',
        },
        {
          title: '修改人',
          dataIndex: 'albe2501',
          key: 'albe2501',
          width: '50%',
          ellipsis: true,
        },
        {
          title: '修改时间',
          dataIndex: 'albe2502',
          key: 'albe2502',
          width: '50%',
          customRender: (text) => {
            return moment(text.text).format('YYYY-MM-DD')
          },
          slots: { customRender: 'albe2502' },
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          align: 'center',
          slots: {
            customRender: 'action',
          },
          width: 100,
        },
      ],
    }
  },
})
</script>

<style scoped lang="less"></style>
