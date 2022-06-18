<template>
  <!-- 队伍查询 修改信息 -->
  <a-drawer
    title="修改队伍信息"
    placement="right"
    v-model:visible="props.visible"
    :maskClosable="false"
    @close="onClose"
    width="600"
    :body-style="{ paddingBottom: '80px' }"
  >
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
          <a-form-item label="队伍名称" name="albe0002">
            <a-input v-model:value="queryParam.albe0002" placeholder="请输入队伍名称" :disabled="isNameDisabled" />
          </a-form-item>
          <a-form-item label="负责人姓名" name="albe0022">
            <a-input placeholder="请输入负责人姓名" v-model:value="queryParam.albe0022" />
          </a-form-item>
          <a-form-item label="负责人身份证" name="albe0023">
            <a-input laceholder="请输入负责人身份证" v-model:value="queryParam.albe0023" />
          </a-form-item>
          <a-form-item label="负责人手机号" name="albe0024">
            <a-input placeholder="请输入负责人手机" v-model:value="queryParam.albe0024" />
          </a-form-item>
          <a-form-item label="联系人姓名" name="albe0018">
            <a-input laceholder="请输入联系人姓名" v-model:value="queryParam.albe0018" />
          </a-form-item>
          <a-form-item label="联系人手机号" name="albe0019">
            <a-input placeholder="请输入联系人手机号" v-model:value="queryParam.albe0019" />
          </a-form-item>
          <a-form-item label="联系人邮箱" name="albe0049">
            <a-input placeholder="请输入联系人邮箱" v-model:value="queryParam.albe0049" />
          </a-form-item>
          <a-form-item label="修改证明" name="albe2508">
            <a-upload name="file" :showUploadList="false" :beforeUpload="beforeUpload" :customRequest="handleFileUpload" v-show="!url">
              <a-button>
                <template #icon><PlusOutlined /> </template>
                上传</a-button
              >
            </a-upload>
            <a-row v-show="url" style="border-bottom: 1px solid#666; margin-top: 5px">
              <a-col span="18">
                <a-col span="22">{{ queryParam.albe2508 ? queryParam.albe2508.showname : '' }}</a-col>
              </a-col>
              <a-col span="6">
                <a-row justify="end">
                  <a-col span="12" style="text-align: right"><a style="border-bottom: 1px solid red" :href="url">下载</a></a-col>
                  <a-col span="12" style="text-align: right"><a @click="del" style="color: red; border-bottom: 1px solid red">删除</a></a-col>
                </a-row>
              </a-col>
            </a-row>
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
      <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
      <a-button type="primary" :loading="loading" @click="update">确认修改</a-button>
    </div>
    <TeamQueryDetailDrawer :visible="drawerData.visible" :item="drawerData.item" @child="child"></TeamQueryDetailDrawer>
  </a-drawer>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, watch, nextTick } from 'vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { rpcPost } from '@/server/conf/index.js'
import { message } from 'ant-design-vue'
import moment from 'moment'
import { uploadHandle, checkFileType, checkUpload } from '@/utils/upload'
import { checkEmail, checkPhoneno, checkCardNo } from '@/utils/publicMethods/common'
import { PlusOutlined } from '@ant-design/icons-vue'
import TeamQueryDetailDrawer from './TeamQueryDetailDrawer' //操作记录详情表单、
import { delObjSpaces } from '@/utils/util'
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
  components: { PlusOutlined, TeamQueryDetailDrawer },
  setup(props, text) {
    const activeKey = ref('1')
    const searchFormRef = ref()
    const userInfo = ref(LocalGetUserInfo())
    const queryParam = reactive({
      albe0002: '', //队伍名称
      albe0022: '', //负责人姓名
      albe0023: '', //负责人身份证号
      albe0024: '', //负责人手机号
      albe0018: '', //联系人姓名
      albe0019: '', //联系人手机号
      albe0049: '', //联系人邮箱
      albe2508: null, //修改证明
    })
    const url = ref('') //修改证明地址
    const loading = ref(false)
    const resDate = ref() //查询出来的队伍详情
    const TeamQueryDrawerTable = ref() //操作记录表格
    const drawerData = reactive({
      //操作记录详情弹窗参数
      visible: false,
      item: {},
    })

    const isUpdate = ref(false) //是否修改成功过
    const isNameDisabled = ref(true)
    const child = () => {
      //关闭操作记录详情弹窗
      drawerData.visible = false
    }

    const handleView = (record) => {
      //详情按钮
      drawerData.item = record
      drawerData.visible = true
    }

    const update = () => {
      //确定修改按钮
      searchFormRef.value
        .validate()
        .then(() => {
          if (!isSame(queryParam, resDate.value)) {
            return message.warning('本次修改后信息与修改前一样，请重新修改提交')
          }
          let bean = JSON.parse(JSON.stringify(queryParam))
          // Object.keys(bean).forEach((key) => {
          //   typeof bean[key] == 'string' ? (bean[key] = bean[key].trim()) : ''
          // })
          bean = delObjSpaces(bean)
          bean.id = resDate.value.id
          bean.userFlag = userInfo.value.userflag
          bean.fullName = userInfo.value.fullName
          bean.areaId = props.item.albe0012 ? props.item.albe0012 : props.item.albe0012 //下属队伍管理(正式队伍)albe0012  队伍查询albe0012
          bean.userId = userInfo.value.userid
          loading.value = true
          console.log(bean)
          rpcPost('orgUpdateNextTeamInfoFortis', { bean }).then((res) => {
            if (res && res.code === 0) {
              resDate.value = { ...resDate.value, ...queryParam } //刷新比对数据
              TeamQueryDrawerTable.value.refresh(true)
              message.success('修改成功')
              isUpdate.value = true
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

    const onClose = () => {
      //关闭弹窗
      searchFormRef.value.resetFields()
      queryParam.albe2508 = ''
      url.value = ''
      loading.value = false
      text.emit('child', isUpdate.value, props.activeKey)
    }

    const searchFunc = () => {
      //操作记录入参
      return {
        id: props.item.id ? props.item.id : props.item.id, //下属队伍管理(正式队伍)id  队伍查询id
      }
    }

    const beforeUpload = (file) => {
      //文件格式校验
      const flag = checkFileType(file)
      if (!flag) {
        message.warning('上传文件格式错误，请重新上传')
        return false
      }
      const flag2 = checkUpload(file)
      if (!flag2) {
        message.warning('上传文件最大为10M，请重新上传')
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
            queryParam.albe2508 = res
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
      queryParam.albe2508 = ''
      url.value = ''
    }

    const isSame = (obj1, obj2) => {
      //校验修改后的数据相较于修改前的数据是否有变化

      for (let key in obj1) {
        if (key != 'albe2508' && obj1[key].trim() != obj2[key]) {
          return true
        }
      }
      return false
    }

    const checkalbe0024 = async (rule, value) => {
      //负责人手机号校验
      if (!value) {
        return Promise.reject('负责人手机号码不能为空')
      } else if (!checkPhoneno(value)) {
        return Promise.reject('请输入正确的手机号码')
      } else {
        return Promise.resolve()
      }
    }

    const checkalalbe0019 = async (rule, value) => {
      //联系人手机号校验
      if (!value) {
        return Promise.reject('联系人手机号码不能为空')
      } else if (!checkPhoneno(value)) {
        return Promise.reject('请输入正确的手机号码')
      } else {
        return Promise.resolve()
      }
    }

    const checkidcard = async (rule, value) => {
      //负责人身份证号校验
      if (!value) {
        return Promise.reject('负责人身份证号不能为空')
      } else if (value != resDate.value.albe0023 && !checkCardNo(value)) {
        return Promise.reject('请输入正确的身份证号码')
      } else {
        return Promise.resolve()
      }
    }

    const checkalbe0049 = async (rule, value) => {
      //联系人邮箱验证
      if (!value) {
        return Promise.reject('联系人邮箱不能为空')
      } else if (!checkEmail(value)) {
        return Promise.reject('请输入正确的联系人邮箱')
      } else {
        return Promise.resolve()
      }
    }

    const checkalbe2508 = async (rule, value) => {
      //联系人邮箱验证
      if (!queryParam.albe2508) {
        return Promise.reject('请上传修改证明')
      } else {
        return Promise.resolve()
      }
    }

    const rules = reactive({
      albe0002: [{ required: true, message: '请输入队伍名称' }],
      albe0022: [{ required: true, message: '请输入负责人姓名' }],
      albe0024: [{ required: true, validator: checkalbe0024 }],
      albe0018: [{ required: true, message: '请输入联系人姓名' }],
      albe0023: [{ required: true, validator: checkidcard }],
      albe0019: [{ required: true, validator: checkalalbe0019 }],
      albe0049: [{ required: true, validator: checkalbe0049 }],
      albe2508: [{ required: true, validator: checkalbe2508, trigger: 'blur' }],
    })

    watch(
      () => props.visible,
      (visible) => {
        isUpdate.value = false
        if (visible) {
          nextTick(() => {
            TeamQueryDrawerTable.value.refresh(true)
          })
          let bean = {
            id: props.item.id ? props.item.id : props.item.id,
            areaid: props.item.albe0012 ? props.item.albe0012 : props.item.albe0012,
          }
          rpcPost('getTeamInfoFortis', { bean }).then((res) => {
            if (res && res.code === 0 && res.data) {
              isNameDisabled.value = res.data.albe0003 == '1' ? false : true
              resDate.value = res.data
              queryParam.albe0002 = res.data.albe0002
              queryParam.albe0022 = res.data.albe0022
              queryParam.albe0024 = res.data.albe0024
              queryParam.albe0023 = res.data.albe0023
              queryParam.albe0018 = res.data.albe0018
              queryParam.albe0019 = res.data.albe0019
              queryParam.albe0049 = res.data.albe0049
            } else {
              message.warning('未查询到该队伍相关信息')
            }
          })
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
            return moment(text.text).format('YYYY-MM-DD HH:mm:ss')
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
      isNameDisabled,
    }
  },
})
</script>

<style scoped lang="less"></style>
