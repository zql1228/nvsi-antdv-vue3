<template>
  <!-- 项目审核 表单  队伍工作台 -->
  <a-drawer
    :body-style="{ paddingBottom: '80px' }"
    title="项目审核"
    placement="right"
    :maskClosable="false"
    :visible="visible"
    @close="onClose(false)"
    width="600"
  >
    <a-form-model ref="formRef" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="发起申请时间" prop="albx7307">
        <a-date-picker v-model="form.albx7307" style="width:100%" disabled />
      </a-form-model-item>
      <a-form-model-item label="项目名称" prop="albx7303">
        <a-input v-model="form.albx7303" disabled />
      </a-form-model-item>
      <a-form-model-item label="项目所属队伍" prop="albx7309">
        <a-input v-model="form.albx7309" disabled />
      </a-form-model-item>
      <a-form-model-item label="项目服务区域" prop="areaname">
        <a-input v-model="form.areaname" disabled />
      </a-form-model-item>
      <a-form-model-item label="项目时间" prop="proTime">
        <a-range-picker v-model="form.proTime" disabled></a-range-picker>
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
        zIndex: 1
      }"
    >
      <a-button style="margin-right: 8px" @click="btnRefused">不通过</a-button>
      <a-button type="primary" @click="btnAgree">审核通过</a-button>
    </div>
  </a-drawer>
</template>
<script>
import { USERINFO } from '@/store/mutation-types'
export default {
  props: {
    visible: Boolean,
    item: Object
  },
  data() {
    return {
      form: {
        albx7307: null, //发起申请时间
        albx7303: '', //项目名称
        albx7309: '', //项目所属队伍
        areaname: '', //项目服务区域
        proTime: '', //项目时间
        reviewer: '', //审核人
        opinion: '' //审核意见
      },
      userInfo: this.$storage.get(USERINFO),
      rules: {
        albx7307: [{ required: true, message: '请输入项目名称' }],
        albx7303: [{ required: true, message: '请输入项目名称' }],
        albx7309: [{ required: true, message: '请输入项目名称' }],
        areaname: [{ required: true, message: '请输入项目名称' }],
        proTime: [{ required: true, message: '请输入项目名称' }],
        reviewer: [{ required: true, message: '请输入项目名称' }],
        opinion: [{ required: true, message: '审核意见不能为空', trigger: 'blur' }]
      },
      labelCol: {
        span: 5
      },
      wrapperCol: {
        span: 16
      }
    }
  },
  watch: {
    visible: {
      handler(value) {
        if (value && this.item) {
          this.form.albx7307 = this.$moment(new Date(this.item.albx7307))
          this.form.albx7303 = this.item.albx7303
          this.form.albx7309 = this.item.albx7309
          this.form.areaname = this.item.areaname
          this.form.proTime = [this.$moment(new Date(this.item.albx0004)), this.$moment(new Date(this.item.albx0005))]
          this.form.reviewer = this.userInfo.team.albe0002
        }
      }
    }
  },
  methods: {
    onClose(bool) {
      //bool为true时需要重新查询列表

      this.$emit('child', bool)
    },
    btnRefused() {
      //拒绝
      this.onClose(true)
    },
    btnAgree() {
      //同意
      let data = {}
      this.onClose(true)
    }
  }
}
</script>
