<template>
  <!--修改密码 -->
  <a-modal title="修改密码" :visible="props.visible" @cancel="onClose" :confirm-loading="confirmLoading">
    <template #okText>
      <a-popconfirm title="是否确认修改密码?" @confirm="btnAgree">
        <a>确认修改</a>
      </a-popconfirm>
    </template>
    <a-form ref="formRef" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="登录账户" name="name">
        <a-input v-model:value="form.name" disabled />
      </a-form-item>
      <a-form-item label="原密码" name="oldPassword">
        <a-input-password v-model:value="form.oldPassword" />
      </a-form-item>
      <a-form-item label="新密码" name="newPassword" extra="8-20个字符，且必须同时包含数字、大写字母和小写字母">
        <a-input-password v-model:value="form.newPassword" />
      </a-form-item>
      <a-form-item label="确认新密码" name="newPassword2">
        <a-input-password v-model:value="form.newPassword2" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { message } from 'ant-design-vue'
import { defineComponent, ref, onMounted, reactive, watch } from 'vue'
import moment from 'moment'
import { rpcPost } from '@/server/conf/index.js'
import { checkPW } from '@/utils/publicMethods/common.js'
import { LocalGetUserInfo } from '@/utils/localStorage'
import { useRouter } from 'vue-router'
import store from '@/store'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, text) {
    const router = useRouter()
    const loading = ref(false)
    const form = reactive({
      name: '', //登录账户
      oldPassword: '', //原密码
      newPassword: '', //新密码
      newPassword2: '', //确认新密码
    })
    const userInfo = ref(LocalGetUserInfo())
    const formRef = ref()
    const confirmLoading = ref(false)
    const checkOldPassword = async (rule, value) => {
      console.log(userInfo, 'userInfo')
      //校验原密码
      if (value) {
        let bean = {
          password: value, //原密码
          albp0052: userInfo.value.userflag, //用户名
          type: userInfo.value.team.groupid ? 1 : 2, //1队伍 2:管理部门
        }
        userInfo.value.team.groupid ? (bean.id = userInfo.value.team.groupid) : ''
        const res = await rpcPost('checkOldPwdFortis', { bean })
        if (res && res.code == 0) {
          return Promise.resolve()
        }
        return Promise.reject('原密码输入错误')
      } else {
        return Promise.reject('请输入原密码')
      }
    }
    const checkPassword = async (rule, value) => {
      //新密码校验
      if (!value) {
        return Promise.reject('请输入新密码')
      } else if (!checkPW(form.newPassword)) {
        return Promise.reject('密码格式错误')
      } else {
        return Promise.resolve()
      }
    }
    const checkPassword2 = async (rule, value) => {
      //新密码校验
      if (!value) {
        return Promise.reject('请确认新密码')
      } else if (form.newPassword2 != form.newPassword) {
        return Promise.reject('密码不一致')
      } else {
        return Promise.resolve()
      }
    }
    const rules = {
      oldPassword: [{ required: true, validator: checkOldPassword }],
      newPassword: [{ required: true, validator: checkPassword }],
      newPassword2: [{ required: true, validator: checkPassword2 }],
    }
    watch(
      () => props.visible,
      (value) => {
        if (value) {
          form.name = userInfo.value.userflag
        }
      }
    )

    const onClose = () => {
      //关闭弹窗
      formRef.value.resetFields()
      text.emit('child')
    }
    const btnRefused = () => {
      //拒绝
      onClose(true)
    }
    const btnAgree = () => {
      //同意
      formRef.value
        .validate()
        .then(() => {
          let bean = {
            albp0053: form.newPassword, //新密码
            albp0052: userInfo.value.userflag, //账号
            type: userInfo.value.team.groupid ? 1 : 2, //1队伍 2:管理部门
          }
          confirmLoading.value = true
          userInfo.value.team.groupid ? (bean.id = userInfo.value.team.groupid) : ''
          rpcPost('updateTeamPasswordFortis', { bean }).then((res) => {
            if (res && res.code === 0) {
              message.success('修改成功，请重新登录!')
              onClose(true)
              store.dispatch('Logout').then(() => {
                //退出登录，清除缓存
                router.push({ path: '/login' })
              })
            } else {
              message.warning(res.message)
            }
            confirmLoading.value = false
          })
        })
        .catch(() => {})
    }
    return {
      props,
      formRef,
      loading,
      form,
      confirmLoading,
      rules,
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 16,
      },
      onClose,
      btnRefused,
      btnAgree,
    }
  },
})
</script>
<style scoped></style>
