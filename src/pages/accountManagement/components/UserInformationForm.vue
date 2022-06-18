<template>
  <a-modal
    v-model:visible="props.visible"
    title="密码重置"
    :maskClosable="false"
    okText="重置密码"
    @cancel="onClose(false)"
    @ok="handleOk"
    :confirmLoading="confirmLoading"
  >
    <a-form :label-col="labelCol" :wrapper-col="wrapperCol" ref="formRef" :model="form" :rules="rules">
      <a-form-item name="albe0073" label="用户名">
        <a-input type="text" v-model:value="form.albe0073" readonly placeholder="请输入用户名" />
      </a-form-item>
      <a-form-item name="fullname" label="管理员名称">
        <a-input type="text" v-model:value="form.fullname" readonly placeholder="请输入管理员名称" />
      </a-form-item>
      <a-form-item name="password" label="当前密码" :wrapper-col="{ span: 15 }" extra="重置密码后点击按钮复制密码">
        <a-input id="password" type="text" v-model:value="form.password" readonly />
        <a-button class="capy" type="primary" style="position: absolute" data-clipboard-target="#password" :disabled="btn" @click="copy"
          >复制</a-button
        >
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { message } from 'ant-design-vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { defineComponent, ref, reactive, watch } from 'vue'
import { rpcPost } from '@/server/conf/index.js'
import Clipboard from 'clipboard'
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
    activeKey: {
      type: Number,
      default: 1,
    },
    queryParam: {
      type: Object,
      default: {},
    },
  },
  setup(props, text) {
    const userInfo = ref(LocalGetUserInfo())
    const formRef = ref()
    const btn = ref(true)
    const form = reactive({
      albe0073: '',
      fullname: '',
      password: '',
    })
    const rules = reactive({
      albe0073: {
        required: true,
        message: '请填写用户名',
      },
      fullname: {
        required: true,
        message: '请填写管理员名称',
      },
      password: {
        required: false,
      },
    })
    const areaid = ref()
    const resData = ref()
    const confirmLoading = ref(false) //确定按钮loading

    const copy = () => {
      //复制按钮
      let clipboard = new Clipboard('.capy')
      clipboard.on('success', (e) => {
        message.success('复制成功')
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', (e) => {
        // 不支持复制
        message.warning('该浏览器不支持自动复制')
        // 释放内存
        clipboard.destroy()
      })
    }
    const handleOk = (e) => {
      //确定按钮
      formRef.value
        .validate()
        .then(() => {
          //数据校验
          let bean = {
            type: props.activeKey, ////民政1、文明传2 税务传3
            id: props.activeKey == 3 ? props.item.bid : props.item.id,
            albp0052: form.albe0073,
          }
          confirmLoading.value = true
          rpcPost('changePasswordFortis', { bean }).then((res) => {
            //重置密码
            if (res && res.code === 0 && res.data) {
              message.success('重置成功')
              btn.value = false
              form.password = res.data
            } else {
              message.warning(res.message)
            }
            confirmLoading.value = false
          })
        })
        .catch((e) => {
          console.log(e)
        })
    }
    const onClose = (bool) => {
      //关闭弹窗
      confirmLoading.value = false
      btn.value = true
      formRef.value.resetFields()
      text.emit('child', bool)
    }

    watch(
      () => props.visible,
      (visible) => {
        if (visible) {
          form.albe0073 = props.activeKey != 3 ? props.item.userflag : props.item.albp0052
          form.fullname = props.item.fullname
          // areaid.value =
          //   props.queryParam.areaid.length != 0 && props.queryParam.areaid[0] != 0
          //     ? props.queryParam.areaid[props.queryParam.areaid.length - 1]
          //     : userInfo.value.areaid === '000000000000000000'
          //     ? '110000000000000000'
          //     : userInfo.value.areaid
          // let bean = {
          //   id: props.item.aid,
          //   type: props.activeKey,
          //   areaId: areaid.value,
          // }
          // rpcPost('selPasswordListFortis', { bean }).then((res) => {
          //   if (res && res.code === 0 && res.data) {
          //     resData.value = res.data
          //     form.albe0073 = res.data.albe0073
          //     form.fullname = res.data.fullname
          //   } else {
          //     if (!res.data) {
          //       message.warning('未查询到相关信息')
          //     }
          //     // else {
          //     //   message.warning(res, message)
          //     // }
          //   }
          // })
        }
      }
    )

    return {
      btn,
      props,
      formRef,
      form,
      rules,
      confirmLoading,
      handleOk,
      onClose,
      copy,
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 18,
      },
    }
  },
})
</script>
