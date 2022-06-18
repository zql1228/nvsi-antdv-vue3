<template>
  <a-drawer
    :body-style="{ paddingBottom: '80px' }"
    title="填写评价"
    placement="right"
    :maskClosable="false"
    :visible="visible"
    @close="closeDrawer"
    width="800px"
  >
    <a-form ref="evaluteRef" :model="form" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
      <a-form-item label="被评价人" name="albp0003">
        <a-input v-model:value="form.albp0003" disabled />
      </a-form-item>
      <a-form-item label="被评价项目" name="albx0002">
        <a-input v-model:value="form.albx0002" disabled />
      </a-form-item>
      <a-form-item label="被评价岗位" name="albx0072" v-show="item.isshow == 1">
        <a-input v-model:value="form.albx0072" disabled />
      </a-form-item>
      <a-form-item label="守时程度" name="albx0463">
        <a-rate v-model:value="form.albx0463" />
      </a-form-item>
      <a-form-item label="服务态度" name="albx0464">
        <a-rate v-model:value="form.albx0464" />
      </a-form-item>
      <a-form-item label="专业水平" name="albx0465">
        <a-rate v-model:value="form.albx0465" />
      </a-form-item>
      <a-form-item label="评价内容" name="remake">
        <a-textarea v-model:value="form.remake" :rows="4" allow-clear />
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
      <a-button type="primary" @click="addEvalute"><span v-text="item.tabKey == '1' ? '发布评价' : '修改评价'"></span></a-button>
    </div>
  </a-drawer>
</template>
<script>
import { Modal, message } from 'ant-design-vue'
import { defineComponent, reactive, ref, toRefs, onMounted, watch, nextTick } from 'vue'
import apis from '@/server/request'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
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
    const userInfo = ref(LocalGetUserInfo())
    // console.log(props)
    const evaluteRef = ref()
    const form = reactive({
      albp0003: '', //被评价人
      albx0002: '', //被评价项目
      albx0072: '', // 被评价岗位
      albx0463: '', // 守时程度
      albx0464: '', //服务态度
      albx0465: '', //专业水品
      remake: '', //评价内容
    })
    const closeDrawer = (val) => {
      emit('closeDrawer', val)
      for (let key in form) {
        form[key] = ''
      }
    }
    const validatePass = async (rule, value) => {
      // console.log(rule, value)
      if (value == 0) {
        return Promise.reject('此项为必填项')
      } else {
        return Promise.resolve()
      }
    }
    const getInfo = (val) => {
      // console.log(val, '填写评价')
      form.albp0003 = val.isshow == 2 ? val.albp0003 : val.record.length + '人' // 被评价人
      form.albx0002 = val.item.albx0002 //被评价项目
      form.albx0072 = val.isshow == 2 ? val.albx0072 : val.record[0].albx0072 // 被评价岗位
      if (val.tabKey == '2') {
        form.albx0463 = val.albx0463 // 守时程度
        form.albx0464 = val.albx0464 //服务态度
        form.albx0465 = val.albx0465 //专业水品
        form.remake = val.albx0468 //评价内容
      }
    }
    const addEvalute = () => {
      evaluteRef.value
        .validate()
        .then((res) => {
          const params = {
            teamId: userInfo.value.team.groupid,
            proId: props.item.item.id, //项目id
            areaid: props.item.item.albx0021,
          }
          params.volInfo = []
          if (props.item.isshow == 2) {
            params.volInfo.push({
              albx0463: form.albx0463,
              albx0464: form.albx0464,
              albx0465: form.albx0465,
              remake: '',
              albx0468: form.remake, //评价内同
              albx0470: props.item.albx0053, //志愿者编号
              albx0002: form.albx0002, //项目名称
              areaid: props.item.item.albx0021, //项目区划
              albp0003: props.item.albp0003, //志愿者编号
            })
            if (props.item.tabKey == '1') {
              apis.projectEvaluationVolFortis(params).then((res) => {
                if (res) {
                  message.success(res)
                  closeDrawer(true)
                } else {
                  closeDrawer(false)
                }
              })
            } else {
              apis
                .updateEvaluationVolFortis({
                  id: props.item.id, //志愿者编号
                  albx0463: form.albx0463,
                  albx0464: form.albx0464,
                  albx0465: form.albx0465,
                  albx0468: form.remake, //评价内容
                })
                .then((res) => {
                  if (res) {
                    message.success(res)
                    closeDrawer(true)
                  } else {
                    closeDrawer(false)
                  }
                })
            }
          } else {
            props.item.record.forEach((e) => {
              params.volInfo.push({
                albx0463: form.albx0463,
                albx0464: form.albx0464,
                albx0465: form.albx0465,
                remake: '',
                albx0468: form.remake, //评价内容
                albx0470: e.albx0053, //志愿者编号
                albx0002: form.albx0002, //项目名称
                areaid: props.item.item.albx0021, //项目区划
                albp0003: e.albp0003, //志愿者编号
              })
            })
            console.log(params)
            apis.projectEvaluationVolFortis(params).then((res) => {
              if (res) {
                message.success(res)
                closeDrawer(true)
              } else {
                closeDrawer(false)
              }
            })
          }
        })
        .catch(() => {})
    }
    watch(
      () => props.visible,
      (val) => {
        if (val) {
          getInfo(props.item)
        }
      }
    )

    const rules = reactive({
      albx0463: [{ validator: validatePass, required: true, trigger: 'change' }],
      albx0464: [{ validator: validatePass, required: true, trigger: 'change' }],
      albx0465: [{ validator: validatePass, required: true, trigger: 'change' }],
      remake: [{ required: true, message: '评价内容为必填项', trigger: 'blur' }],
    })
    return {
      ...toRefs(props),
      form,
      evaluteRef,
      rules,
      closeDrawer,
      addEvalute,
    }
  },
})
</script>
