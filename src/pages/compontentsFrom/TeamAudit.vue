<template>
  <!-- 队伍审核 -->
  <a-drawer
    :body-style="{ paddingBottom: '80px' }"
    title="队伍审核"
    placement="right"
    :maskClosable="false"
    :visible="visible"
    @close="onClose(false)"
    width="600"
  >
    <a-form-model ref="formRef" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="发起申请时间" prop="time1">
        <a-date-picker v-model="form.time1" style="width: 100%" disabled />
      </a-form-model-item>
      <a-form-model-item label="申请类型" prop="type">
        <a-select v-model="form.type" disabled>
          <a-select-option value="1"> 注册审核 </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="队伍名称" prop="teamName">
        <a-input v-model="form.teamName" disabled />
      </a-form-model-item>
      <a-form-model-item label="队伍服务区域" prop="areaid">
        <a-input v-model="form.areaid" disabled />
      </a-form-model-item>
      <a-form-model-item label="审核人" prop="reviewer">
        <a-input v-model="form.reviewer" disabled />
      </a-form-model-item>
      <a-form-model-item label="审核意见" prop="opinion">
        <a-textarea v-model="form.opinion" :rows="4" allow-clear />
      </a-form-model-item>
    </a-form-model>
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
    >
      <a-button style="margin-right: 8px" @click="btnAgree(false)">不通过</a-button>
      <a-button type="primary" @click="btnAgree(true)">审核通过</a-button>
    </div>
  </a-drawer>
</template>
<script>
import { USERINFO } from '@/store/mutation-types'
export default {
  props: {
    visible: Boolean,
    item: Object,
  },
  data() {
    return {
      form: {
        time1: null, //发起申请时间
        type: '', //申请类型
        teamName: '', //队伍名称
        areaid: '', //队伍服务区域
        reviewer: '', //审核人
        opinion: '', //审核意见
      },
      userInfo: this.$storage.get(USERINFO),
      rules: {
        time1: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        type: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        teamName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        areaid: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        reviewer: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        opinion: [{ required: true, message: '审核建议不能为空', trigger: 'blur' }],
      },
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 16,
      },
    }
  },
  watch: {
    visible: {
      handler(value) {
        if (value && this.item) {
          this.form.time1 = this.$moment(new Date(this.item.applytime))
          this.form.type = this.item.applytype
          this.form.teamName = this.item.albe0002
          this.form.areaid = this.item.albe0012
          this.form.reviewer = this.userInfo.team.albe0002
        }
      },
    },
  },
  methods: {
    onClose(bool) {
      //bool为true时需要重新查询列表
      this.$refs.formRef.resetFields()
      this.$emit('child', bool)
    },
    btnAgree(bool) {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          let data = {
            id: this.item.id,
            ispass: bool === true ? 1 : 0, //1同意 0拒绝
            areaId: this.item.albe0012,
            albp0052: this.item.albp0052,
            option: this.form.opinion,
            userFlag: this.userInfo.team.groupid,
          }
          this.$rpcPost('updateTeamStateFortis', { bean: data })
            .then((res) => {
              if (res && res.code === 0) {
                this.$message.success('成功')
                this.onClose(true)
              } else {
                this.$message.warning('失败')
              }
            })
            .catch((error) => {
              this.$message.warning('失败')
            })
            .finally(() => {})
        }
      })
    },
  },
}
</script>
