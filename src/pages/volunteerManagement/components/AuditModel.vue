<template>
  <!--志愿者实名认证 认证信息弹窗 -->
  <a-modal title="认证信息" :visible="props.visible" :maskClosable="false" @cancel="onClose(false)" width="900px">
    <template #footer>
      <a-button @click="onClose(false)" :loading="confirmLoading">取消</a-button>
      <a-button type="primary" @click="btnAgree(0)" :loading="confirmLoading">不通过</a-button>
      <a-button type="primary" @click="btnAgree(1)" :loading="confirmLoading">通过</a-button>
    </template>
    <a-form
      :label-col="{
        span: 6,
      }"
      :wrapper-col="{
        spam: 18,
      }"
      ref="formRef"
      :model="form"
    >
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item name="albp0052" label="用户名">
            <a-input v-model:value="form.albp0052" placeholder="请输入用户名" readonly />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="albp0004" label="证件类型">
            <a-select v-model:value="form.albp0004" disabled>
              <a-select-option v-for="item in optionsList.albp0004List" :key="item.codeid" :value="item.codeid">{{ item.codevalue }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="albp0003" label="姓名">
            <a-input v-model:value="form.albp0003" placeholder="请输入姓名" readonly />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="albp0005" label="证件号码">
            <a-input v-model:value="form.albp0005" placeholder="请填写证件号码" readonly />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="albp0006" label="性别">
            <a-select v-model:value="form.albp0006" :options="optionsList.albp0006List" disabled> </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="albp0057" label="注册区域">
            <AreaDevide ref="area" :showAll="false" :showLevel="4" :type="false" v-model:value="form.albp0057" disabled></AreaDevide>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="albp0010" label="手机">
            <a-input v-model:value="form.albp0010" placeholder="请输入手机号码" readonly />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="albp0034" label="注册日期">
            <a-date-picker v-model:value="form.albp0034" style="width: 100%" placeholder="注册日期" disabled />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            name="phone"
            label="认证照片"
            :label-col="{
              span: 3,
            }"
            :wrapper-col="{
              spam: 21,
            }"
          >
            <a-row :gutter="24" style="margin-top: 5px">
              <a-col :span="24">
                <a-row type="flex" justify="space-around">
                  <a-col :span="8" align="center">
                    <a @click="getUrl('albp0069')">证件照片正面</a>
                  </a-col>
                  <a-col :span="8" align="center">
                    <a @click="getUrl('albp0071')">证件照片反面</a>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="24">
                <a-row type="flex" justify="space-around">
                  <a-col :span="8">
                    <a-spin :spinning="spinning1" :delay="200">
                      <div style="height: 160px; width: 100%">
                        <img style="width: 100%; height: 100%" :src="form.albp0069" v-show="form.albp0069" />
                      </div>
                    </a-spin>
                  </a-col>
                  <a-col :span="8">
                    <a-spin :spinning="spinning2" :delay="200">
                      <div style="height: 160px; width: 100%">
                        <img style="width: 100%; height: 100%" :src="form.albp0071" v-show="form.albp0071" />
                      </div>
                    </a-spin>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script>
import { message } from 'ant-design-vue'
import { defineComponent, ref, onMounted, reactive, watch, nextTick } from 'vue'
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
      default: {},
    },
  },
  setup(props, text) {
    const userInfo = ref(LocalGetUserInfo())
    const confirmLoading = ref(false)
    const area = ref()
    const formRef = ref()
    const form = reactive({
      albp0052: '', //用户名
      albp0004: '', //证件类型
      albp0003: '', //姓名
      albp0005: '', //证件号码
      albp0006: '', //性别
      albp0057: [], //注册区域
      albp0010: '', //手机
      albp0034: null, //注册日期
      albp0069: null, //认证照片-证件正面照
      albp0071: null, //认证照片-证件反面照
      // albp0072: null, //认证照片-手持证件照
    })

    const spinning1 = ref(false) //证件照片正面加载状态
    const spinning2 = ref(false) //证件照片反面加载状态

    const optionsList = reactive({
      albp0006List: [
        { label: '男', value: '1' },
        { label: '女', value: '2' },
      ], //性别
      albp0004List: [], //证件类别
    })

    const getOptions = async () => {
      //查询证件类别列表
      optionsList.albp0004List = await rpcPost('getCodeValueOnLeap', { bean: { tableName: 'nvsi_albp0004' } }) //证件类型
      optionsList.albp0004List = optionsList.albp0004List.data
    }

    const onClose = (bool) => {
      formRef.value.resetFields()
      form.albp0057 = []
      form.albp0069 = null
      form.albp0071 = null
      form.albp0072 = null
      confirmLoading.value = false
      text.emit('child', bool)
    }
    const btnAgree = async (type) => {
      //提交审核结果
      let bean2 = {
        albp0005: form.albp0005,
        albp0063: type, //0不通过1通过
      }
      let bean = {
        cardno: form.albp0005,
      }
      bean2.albp0005 = await rpcPost('cardno', { bean }) //加密身份证号码
      bean2.albp0005 = bean2.albp0005.data.cardno
      confirmLoading.value = true
      rpcPost('updateVolunInforOnPC', { bean2 }).then((res) => {
        if (res && res.code === 0) {
          onClose(true)
          message.success('审核成功')
        } else {
          message.warning('审核失败')
        }
      })
    }
    onMounted(() => {
      getOptions()
    })

    const getUrl = (name) => {
      //获取图片地址
      if ((name == 'albp0069' && spinning1.value == true) || (name == 'albp0071' && spinning2.value == true)) {
        return
      }
      if (props.item[name] && !form[name]) {
        name == 'albp0069' ? (spinning1.value = true) : (spinning2.value = true)
        rpcPost('downloadFortisLogic', { bean: props.item[name] }).then((res) => {
          if (res && res.code === 0 && res.data) {
            form[name] = res.data
          } else {
            name == 'albp0069'
              ? message.warning("认证照片-证件正面照获取失败，点击'证件照片正面'可再次获取")
              : message.warning("认证照片-证件反面照获取失败，点击'证件反面照'可再次获取")
          }
          name == 'albp0069' ? (spinning1.value = false) : (spinning2.value = false)
        })
      }
    }

    watch(
      () => props.visible,
      (visible) => {
        if (visible) {
          nextTick(() => {
            form.albp0052 = props.item.albp0052 ? props.item.albp0052 : null //用户名!
            form.albp0004 = props.item.albp0004 ? props.item.albp0004 : null //证件类型!
            form.albp0003 = props.item.albp0003 ? props.item.albp0003 : null //姓名
            form.albp0005 = props.item.albp0005 ? props.item.albp0005 : null //证件号码
            form.albp0006 = props.item.albp0006 ? props.item.albp0006 : null //性别!
            form.albp0057 = props.item.albp0057 ? [props.item.albp0057] : null //注册区域!
            if (form.albp0057 && form.albp0057.length > 0) {
              area.value.defaultInitArea(form.albp0057)
            }
            form.albp0010 = props.item.albp0010 ? props.item.albp0010 : null //手机
            form.albp0034 = props.item.albp0034 ? moment(props.item.albp0034) : null //注册日期
            getUrl('albp0069') //获取证件照片正面
            getUrl('albp0071') //获取证件照片反面
          })
        }
      }
    )

    return {
      spinning1,
      spinning2,
      area,
      formRef,
      optionsList,
      form,
      props,
      confirmLoading,
      onClose,
      btnAgree,
      getUrl,
    }
  },
})
</script>
<style scoped></style>
