<template>
  <!--项目管理 删除项目弹窗 -->
  <a-modal title="删除项目" :visible="props.visible" @cancel="onClose(false)" :confirm-loading="confirmLoading" :maskClosable="false">
    <template #okText>
      <a-popconfirm title="是否确认删除项目?" @confirm="btnAgree">
        <a>确认删除</a>
      </a-popconfirm>
    </template>
    <p>{{ props.content }}</p>
  </a-modal>
</template>
<script>
import { message } from 'ant-design-vue'
import { defineComponent, ref, onMounted, reactive, watch } from 'vue'
import moment from 'moment'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { rpcPost } from '@/server/conf/index.js'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: false,
    },
    content: {
      //内容
      type: String,
      default: '删除项目会将项目内志愿者踢出项目，并同步删除此项目已录入的项目成员信息，无法恢复，是否确认删除项目',
    },
  },
  setup(props, text) {
    const userInfo = ref(LocalGetUserInfo())
    const confirmLoading = ref(false)
    const onClose = (bool) => {
      //关闭弹窗
      confirmLoading.value = false
      text.emit('child', bool)
    }
    const btnAgree = () => {
      //确认删除按钮
      confirmLoading.value = true
      let bean = {
        albx0021: props.item.albx0021,
        id: props.item.id,
      }
      rpcPost('delGroupPublishProjectFortis', { bean }).then((res) => {
        if (res && res.code == 0) {
          message.success('删除成功')
          onClose(true)
        } else {
          message.warning(res.message)
        }
        confirmLoading.value = false
      })
    }
    return {
      props,
      confirmLoading,
      onClose,
      btnAgree,
    }
  },
})
</script>
<style scoped></style>
