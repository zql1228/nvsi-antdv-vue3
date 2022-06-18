<template>
  <a-modal v-model:visible="props.visible" :maskClosable="false" @cancel="onClose(false)" width="800px" :footer="false" centered>
    <template #title>
      <span>密码重置</span>
      <a-button type="primary" @click="handleOk" style="position: absolute; right: 50px; top: 11px" :loading="loading">重置密码</a-button>
    </template>
    <a-form :label-col="labelCol" :wrapper-col="wrapperCol" ref="formRef" :model="form">
      <a-row>
        <a-col :span="12">
          <a-form-item name="name" :label="props.type == 'team' ? '队伍名称' : '志愿者姓名'">
            <a-input type="text" v-model:value="form.name" readonly placeholder="请输入用户名" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="password" label="当前密码" :wrapper-col="{ span: 15 }" extra="重置密码后点击按钮复制密码">
            <a-input id="password" type="text" v-model:value="form.password" readonly />
            <a-button
              class="capy"
              type="primary"
              style="position: absolute"
              data-clipboard-target="#password"
              :disabled="!form.password"
              @click="copy"
              >复制</a-button
            >
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div style="height: 0.5px; width: 100%; background: #f0f0f0; margin: 6px 0"></div>
    <IATable
      serviceName="queryResetPwdPageFortis"
      :searchParameter="searchFunc"
      ref="table"
      size="middle"
      :isMc="false"
      :rowKey="(record) => record.id"
      :columns="columns"
      :showHeader="false"
    >
    </IATable>
  </a-modal>
</template>
<script>
import { message } from 'ant-design-vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { defineComponent, ref, reactive, watch, nextTick } from 'vue'
import { rpcPost } from '@/server/conf/index.js'
import Clipboard from 'clipboard'
import moment from 'moment'
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
      default: 'team', //team队伍 volunteer志愿者
    },
  },
  setup(props, text) {
    const userInfo = ref(LocalGetUserInfo())
    const table = ref()
    const formRef = ref()
    const form = reactive({
      name: '',
      password: '',
    })

    const loading = ref(false) //确定按钮loading

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
      props.type == 'team' ? submit1() : submit2()
    }

    const submit1 = () => {
      //队伍重置密码
      let bean = {
        albp0052: props.item.albp0052 ? props.item.albp0052 : props.item.albp0052, //队伍账号
        id: props.item.id, //队伍id
        userflag: userInfo.value.userflag,
        fullname: userInfo.value.fullName,
      }
      loading.value = true
      rpcPost('resetTeamPasswordFortis', { bean }).then((res) => {
        loading.value = false
        if (res && res.code === 0) {
          message.success('重置成功')
          form.password = res.data
          table.value.refresh()
          return
        }
        message.warning('重置失败')
      })
    }
    const submit2 = () => {
      //志愿者重置密码
      let bean = {
        albp0052: props.item.albp0052, //志愿者名称
        albp0066: props.item.albp0005, //身份证号码
        id: props.item.id, //队伍id
        userflag: userInfo.value.userflag,
        fullname: userInfo.value.fullName,
      }
      loading.value = true
      console.log(bean)
      rpcPost('replacePasswordOnVolunteer', { bean }).then((res) => {
        if (res && res.code === 0) {
          message.success('重置成功')
          loading.value = false
          form.password = res.data
          table.value.refresh()
        }
      })
    }
    const onClose = (bool) => {
      //关闭弹窗
      loading.value = false
      formRef.value.resetFields()
      text.emit('child', bool)
    }

    watch(
      () => props.visible,
      (visible) => {
        if (visible) {
          nextTick(() => {
            console.log(props.item)
            table.value.refresh()
            if (props.type == 'team') {
              form.name = props.item.albe0002 ? props.item.albe0002 : props.item.albe0002
            } else {
              form.name = props.item.albp0003
            }
          })
        }
      }
    )

    const searchFunc = () => {
      return {
        albe2701: props.item.id, //id
        albe2702: props.type == 'team' ? 1 : 2, //1队伍 2志愿者
      }
    }

    return {
      table,
      searchFunc,
      props,
      formRef,
      form,
      loading,
      handleOk,
      onClose,
      copy,
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 18,
      },
      columns: [
        {
          title: '序号',
          slots: {
            customRender: 'serial',
          },
          width: 80,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '修改人',
          dataIndex: 'albe2704',
          key: 'albe2704',
          width: '50%',
          ellipsis: true,
        },
        {
          title: '修改时间',
          dataIndex: 'albe2705',
          key: 'albe2705',
          slots: {
            customRender: 'albe2705',
          },
          customRender: ({ text }) => {
            return text ? moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss') : ''
          },
          width: '50%',
          ellipsis: true,
        },
      ],
    }
  },
})
</script>
