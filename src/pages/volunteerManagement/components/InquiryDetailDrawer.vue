<template>
  <!-- 队伍查询 修改信息 -->
  <a-drawer
    title="操作记录详情"
    placement="right"
    v-model:visible="props.visible"
    :maskClosable="false"
    @close="onClose"
    width="600"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-form
      ref="searchFormRef"
      :mode="form"
      :label-col="{
        span: 6,
      }"
      :wrapper-col="{
        span: 16,
      }"
    >
      <a-form-item label="志愿者姓名" name="name">
        <a-input v-model:value="form.name" readonly />
      </a-form-item>
      <a-form-item :label="form.oldPhone == form.newPhone ? '手机号码' : '原手机号'" name="oldPhone">
        <a-input v-model:value="form.oldPhone" readonly />
      </a-form-item>
      <a-form-item label="新手机号" name="newPhone" v-show="form.oldPhone != form.newPhone">
        <a-input v-model:value="form.newPhone" readonly />
      </a-form-item>
      <a-form-item :label="form.oldEmail == form.newEmail ? '邮箱' : '原邮箱'" name="oldEmail">
        <a-input v-model:value="form.oldEmail" readonly />
      </a-form-item>
      <a-form-item label="新邮箱" name="newEmail" v-show="form.oldEmail != form.newEmail">
        <a-input v-model:value="form.newEmail" readonly />
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, watch, nextTick } from 'vue'
import { rpcPost } from '@/server/conf/index.js'
//<ArrowDownOutlined />
import { ArrowDownOutlined } from '@ant-design/icons-vue'
import { uploadHandle, checkFileType } from '@/utils/upload'

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    item: {
      //列表修改人数据
      type: Object,
      default: {},
    },
  },
  components: { ArrowDownOutlined },
  setup(props, text) {
    const searchFormRef = ref()
    const form = reactive({
      name: '', //志愿者姓名
      oldPhone: '', //原手机号
      newPhone: '', //现手机号
      oldEmail: '', //原邮箱
      newEmail: '', //现邮箱
    })

    const onClose = () => {
      //关闭弹窗
      searchFormRef.value.resetFields()
      text.emit('child')
    }

    watch(
      () => props.visible,
      (visible) => {
        if (visible) {
          let bean = {
            id: props.item.id,
          }
          rpcPost('getOperationRecordInfoFortis', { bean }).then((res) => {
            //查找详情
            if (res && res.code === 0 && res.data) {
              console.log(res.data)
              form.name = props.item.name
              form.oldPhone = res.data.albe2504.phone
              form.newPhone = res.data.albe2505.phone
              form.oldEmail = res.data.albe2504.email
              form.newEmail = res.data.albe2505.email
            }
          })
        }
      }
    )
    return {
      props,
      searchFormRef,
      form,
      onClose,
    }
  },
})
</script>

<style scoped lang="less"></style>
