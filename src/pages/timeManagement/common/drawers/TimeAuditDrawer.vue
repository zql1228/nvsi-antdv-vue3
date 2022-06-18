<template>
  <!-- 时长审核详情 表单  队伍工作台 -->
  <a-drawer
    :body-style="{ paddingBottom: '80px' }"
    :title="item.showbtn == 1 ? '时长审核' : '时长记录详情'"
    placement="right"
    :maskClosable="false"
    :visible="visible"
    @close="closeAuditDrawer"
    width="600px"
  >
    <a-form :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="发起申请时间" name="time1">
        <a-input v-model:value="form.time1" style="width: 100%" disabled />
      </a-form-item>
      <a-form-item v-show="item.showbtn == 1" label="申请类型" name="type">
        <a-input value="时长申请" disabled />
      </a-form-item>
      <a-form-item v-show="item.showbtn == 2 || item.showbtn == 3" label="录入时间" name="entrytime">
        <a-input v-model:value="form.entrytime" disabled />
      </a-form-item>
      <a-form-item v-show="item.showbtn == 2 || item.showbtn == 3" label="录入类型" name="entrytype">
        <a-select v-model:value="form.entrytype" disabled>
          <a-select-option value="1"> 手动录入 </a-select-option>
          <a-select-option value="2"> 申请录入 </a-select-option>
          <a-select-option value="4"> 签到录入 </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="志愿者姓名" name="name">
        <a-input v-model:value="form.name" disabled />
      </a-form-item>
      <a-form-item label="所属项目" name="proName">
        <a-input v-model:value="form.proName" disabled />
      </a-form-item>
      <a-form-item label="所属岗位" name="jobs">
        <a-input v-model:value="form.jobs" disabled />
      </a-form-item>
      <a-form-item label="开始时间" name="creatTime">
        <a-input format="YYYY-MM-DD HH:mm:ss" v-model:value="form.creatTime" style="width: 100%" disabled />
      </a-form-item>
      <a-form-item label="结束时间" name="endTime">
        <a-input format="YYYY-MM-DD HH:mm:ss" v-model:value="form.endTime" style="width: 100%" disabled />
      </a-form-item>
      <a-form-item label="服务时长" name="serviceTime">
        <a-input v-model:value="form.serviceTime" suffix="小时" disabled />
      </a-form-item>
      <a-form-item label="备注" name="note">
        <a-textarea v-model:value="form.note" :rows="4" allow-clear disabled />
      </a-form-item>
    </a-form>
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
      <a-button style="margin-right: 8px" v-show="item.showbtn == 1" @click="btnRefused">拒绝</a-button>
      <a-button type="primary" v-show="item.showbtn == 1" @click="btnAgree">同意</a-button>
      <a-button style="text-align: center" type="primary" v-show="item.showbtn == 2" @click="delTime">删除时长</a-button>
      <a-button style="text-align: center" type="primary" v-show="item.showbtn == 3" disabled>已删除</a-button>
    </div>
  </a-drawer>
</template>
<script>
import { Modal, message } from 'ant-design-vue'
import { defineComponent, reactive, ref, toRefs, onMounted, watch, nextTick } from 'vue'
import moment from 'moment'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { emit }) {
    const form = reactive({
      time1: null, // 发起申请时间
      name: '', // 志愿者姓名
      proName: '', // 所属项目
      jobs: '', // 岗位
      creatTime: null, // 开始时间
      endTime: null, // 结束时间
      serviceTime: '', // 服务时长
      note: '', // 备注
      entrytime: '', //录入时间
      entrytype: '', //录入类型
    })
    const rules = reactive({
      time1: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
      type: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
      name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
      proName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
      jobs: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
      creatTime: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
      endTime: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
      serviceTime: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
      note: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
    })
    const isclick = ref(true)
    const closeAuditDrawer = (bool) => {
      // bool为true时需要重新查询列表
      emit('closeAuditDrawer', bool)
    }
    const btnRefused = () => {
      if (isclick) {
        props.item.refuse(props.item)
        isclick.value = false
      }
    }
    const btnAgree = () => {
      // 同意)
      if (isclick) {
        props.item.agree(props.item)
        isclick.value = false
      }
    }
    const delTime = () => {
      if (isclick) {
        props.item.deleteTime(props.item)
        isclick.value = false
      }
    }
    const getInfo = (val) => {
      console.log(val, 'val')
      form.time1 = val.albx0180 ? val.albx0180.slice(0, 10) : '-' // 发起申请时间
      form.name = val.albp0003 // 志愿者姓名
      val.albx0002 ? (form.proName = val.albx0002) : '' // 所属项目
      val.albx0072 ? (form.jobs = val.albx0072) : '' // 岗位
      val.albx0181 ? (form.creatTime = val.albx0181.slice(0, 19)) : '' // 开始时间
      val.albx0182 ? (form.endTime = val.albx0182.slice(0, 19)) : '' // 结束时间
      val.albx0172 ? (form.serviceTime = val.albx0172) : '' // 服务时长
      val.albp0057 ? (form.note = val.albp0057) : '' // 备注
      if (val.showbtn != 1) {
        form.entrytype = val.albx0173
        form.entrytime = val.albx0178.slice(0, 10)
      }
    }
    watch(
      () => props.visible,
      (val) => {
        nextTick(() => {
          if (val) {
            for (let key in form) {
              form[key] = ''
            }
            getInfo(props.item)
            isclick.value = true
          }
        })
      }
    )
    return {
      ...toRefs(props),
      form,
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 16,
      },
      closeAuditDrawer,
      btnRefused,
      btnAgree,
      delTime,
    }
  },
})
</script>
