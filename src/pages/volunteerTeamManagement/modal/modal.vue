<template>
  <!--已结项项目 项目延期 -->
  <a-modal :title="props.title" :visible="props.visible" @cancel="onClose(false)" :confirm-loading="confirmLoading" :maskClosable="false">
    <template #footer>
      <a-button key="back" @click="onClose(false)">取消</a-button>
      <a-button key="submit1" type="primary" @click="btnAgree" :loading="confirmLoading">{{ props.title }}</a-button>
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
    title: {
      //确定按钮文本
      type: String,
      default: '停用队伍',
    },
    content: {
      //内容
      type: String,
      default: '',
    },
    type: {
      type: Number,
      default: 1, //1仅操作队伍  2操作队伍和其项目
    },
    activeKey: {
      type: String,
      default: '1',
    },
  },
  setup(props, text) {
    const userInfo = ref(LocalGetUserInfo())
    const confirmLoading = ref(false)
    const onClose = (bool) => {
      //bool为true时需要重新查询列表
      confirmLoading.value = false
      text.emit('child', bool, props.activeKey)
    }
    const btnAgree = () => {
      //停用或启用
      let bean = {
        type: props.item.albe0026 == 1 || props.item.albe0026 == 1 ? null : props.type, //启用时候传 1启用队伍 2启用队伍和项目
        albe0026: props.item.albe0026 == 1 || props.item.albe0026 == 1 ? 3 : 1, // 3 停用  1 启用
        id: props.item.id ? props.item.id : props.item.id, //队伍id  下属队伍管理(正式队伍)停用按钮id  队伍查询停用按钮id
        areaId: props.item.albe0012 ? props.item.albe0012 : props.item.albe0012, //区域id 下属队伍管理(正式队伍)停用按钮albe0012  队伍查询停用按钮albe0012
        userFlag: userInfo.value.userflag, //登陆的管理部门的用户名
        userId: userInfo.value.userid, //登陆的管理部门的id
      }
      confirmLoading.value = true
      rpcPost('deactivateOrEnalbeTeamFortis', { bean }).then((res) => {
        confirmLoading.value = false
        if (res && res.code === 0) {
          message.success('修改成功')
          onClose(true)
        } else {
          message.warning('修改失败')
        }
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
