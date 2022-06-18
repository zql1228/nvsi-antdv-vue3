<template>
  <!-- 成员审核详情 表单  队伍工作台 -->
  <a-drawer
    :body-style="{ paddingBottom: '80px' }"
    title="成员审核"
    placement="right"
    :maskClosable="false"
    :visible="props.visible"
    @close="onClose(false)"
    width="600px"
  >
    <a-form ref="formRef" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="发起申请时间">
        <a-input v-model:value="form.time1" style="width: 100%" disabled />
      </a-form-item>
      <a-form-item label="申请类型">
        <a-select v-model:value="form.type" disabled>
          <a-select-option value="1"> 时长申请 </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="志愿者姓名">
        <a-input v-model:value="form.name" disabled />
      </a-form-item>
      <a-form-item label="志愿者年龄">
        <a-input v-model:value="form.age" disabled />
      </a-form-item>
      <a-form-item label="志愿者性别">
        <a-select v-model:value="form.sex" disabled>
          <a-select-option value="0"> 男 </a-select-option>
          <a-select-option value="1"> 女 </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="志愿者服务区域">
        <a-input v-model:value="form.areaid" disabled />
      </a-form-item>
      <a-form-item label="个人总服务时长">
        <a-input v-model:value="form.serviceTime" suffix="小时" disabled />
      </a-form-item>
      <a-form-item v-show="item.applytype === '申请加入项目'" label="所属项目">
        <a-input v-model:value="form.proName" disabled />
      </a-form-item>
      <a-form-item v-show="item.applytype === '申请加入项目'" label="所属岗位">
        <a-input v-model:value="form.jobs" disabled />
      </a-form-item>
    </a-form>
    <div
      :style="{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e8e8e8',
        padding: '20px 16px',
        textAlign: 'right',
        left: 0,
        background: '#fff',
        borderRadius: '0 0 4px 4px',
      }"
    >
      <a-button style="margin-right: 8px" @click="btnAgree(props.item.applytype == '申请加入队伍' ? 3 : 0)">拒绝</a-button>
      <a-button type="primary" @click="btnAgree(1)">同意</a-button>
    </div>
  </a-drawer>
</template>
<script>
import apis from '@/server/request'
import moment from 'moment'
import { rpcPost } from '@/server/conf/index.js'
import { message } from 'ant-design-vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { checkage2 } from '@/utils/publicMethods/common.js'
import { useRouter } from 'vue-router'
import { defineComponent, reactive, ref, onMounted, watch, nextTick } from 'vue'
export default defineComponent({
  props: {
    visible: Boolean,
    item: Object,
  },
  setup(props, { emit }) {
    const userInfo = ref(LocalGetUserInfo())
    const rules = reactive({
      time1: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
      type: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
      name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
      age: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
      sex: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
      areaid: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
      serviceTime: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
      proName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
      jobs: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
    })
    const form = reactive({
      time1: null, // 发起申请时间
      type: '', // 申请类型
      name: '', // 志愿者姓名
      age: '', // 年龄
      sex: '', // 性别
      areaid: '', // 服务区域
      serviceTime: '', // 服务时长
      proName: '', // 所属项目
      jobs: '', // 所属岗位
    })
    const isclick = ref(0)
    const getData = (res) => {
      const bean = {
        cardno: res.albp0005,
      }
      if (props.item.applytype === '申请加入队伍') {
        apis.getVolunteerInfo(bean).then((res) => {
          if (Object.keys(res).length > 0) {
            form.time1 = props.item.albp3305 ? props.item.albp3305.slice(0, 19) : '-' //发起申请时间
            form.type = '加入队伍'
            form.name = res.albp0003
            form.age = checkage2(res.albp0014.slice(0, 10))
            form.sex = res.albp0006 == 2 ? '女' : '男'
            form.areaid = res.albp0025
            form.serviceTime = props.item.albp3304
            // this.from.proName = res.data.albx0002
            // this.form.jobs = res.data.albx0053
          }
        })
      } else {
        apis.getcardno({ cardno: res.albp0005 }).then((card) => {
          if (card) {
            apis.getVolunteerInfo({ cardno: card.cardno }).then((element) => {
              if (element) {
                apis.getVolunteerInfoOnProject(bean).then((res) => {
                  if (res) {
                    form.time1 = props.item.albx0056 ? props.item.albx0056.slice(0, 19) : '-'
                    form.type = '加入项目'
                    form.name = res.albp0003
                    form.age = checkage2(element.albp0014.slice(0, 10))
                    form.sex = res.albp0006 == 2 ? '女' : '男'
                    form.areaid = res.areaid
                    form.serviceTime = props.item.albp0089
                    form.proName = props.item.albx0002
                    form.jobs = props.item.albx0072
                  }
                })
              }
            })
          }
        })
      }
    }
    const onClose = (bool) => {
      // bool为true时需要重新查询列表
      if (bool) {
        emit('child', true)
      }
      emit('child')
    }
    const GetAge = (cardno) => {
      var len = cardno.length
      var strBirthday = ''
      if (len == 18) {
        //处理18位的身份证号码从号码中得到生日和性别代码
        strBirthday = cardno.substr(6, 4) + '/' + cardno.substr(10, 2) + '/' + cardno.substr(12, 2)
      }
      if (len == 15) {
        strBirthday = '19' + cardno.substr(6, 2) + '/' + cardno.substr(8, 2) + '/' + cardno.substr(10, 2)
      }
      //时间字符串里，必须是“/”
      var birthDate = new Date(strBirthday)
      var nowDateTime = new Date()
      var age = nowDateTime.getFullYear() - birthDate.getFullYear()
      //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
      if (
        nowDateTime.getMonth() < birthDate.getMonth() ||
        (nowDateTime.getMonth() == birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())
      ) {
        age--
      }
      return age
    }
    const btnAgree = (bool) => {
      isclick.value++
      if (isclick.value == 1) {
        props.item.agree(props.item, bool, true)
      }
    }
    watch(
      () => props.visible,
      (a) => {
        nextTick(() => {
          if (a) {
            getData(props.item)
          } else {
            form.time1 = null // 发起申请时间
            form.type = '' // 申请类型
            form.name = '' // 志愿者姓名
            form.areaid = '' // 服务区域
            form.proName = '' // 所属项目
            form.jobs = '' // 岗位
            form.age = ''
            form.sex = ''
            form.serviceTime = '' // 服务时长
            isclick.value = 0
          }
        })
      }
    )
    return {
      props,
      form,
      userInfo,
      rules,
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 16,
      },
      onClose,
      btnAgree,
    }
  },
})
</script>
