<template>
  <!-- 账号申诉弹窗 -->
  <a-modal title="认证信息" :visible="props.visible" :maskClosable="false" @cancel="onClose(false)" width="900px">
    <template #footer>
      <a-button @click="onClose(false)" :loading="confirmLoading">取消</a-button>
      <a-button type="primary" @click="noBtnAgree" :loading="confirmLoading">不通过</a-button>
      <a-button type="primary" @click="btnAgree" :loading="confirmLoading">通过</a-button>
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
          <a-form-item name="albp1002" label="真实姓名">
            <a-input v-model:value="form.albp1002" placeholder="请输入真实姓名" readonly />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="albp1003" label="证件号码">
            <a-input v-model:value="form.albp1003" placeholder="请填写证件号码" readonly />
          </a-form-item>
        </a-col>
        <a-col :span="12" v-show="form.albp1005">
          <a-form-item name="albp1005" label="邮箱">
            <a-input v-model:value="form.albp1005" placeholder="请输入邮箱" readonly />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            name="phone"
            label="申诉照片"
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
                    <a @click="getUrl('albp1006')">证件照片反面</a>
                  </a-col>
                  <a-col :span="8" align="center">
                    <a @click="getUrl('albp1007')">证件照片正面</a>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="24">
                <a-row type="flex" justify="space-around">
                  <a-col :span="8">
                    <a-spin :spinning="spinning1" :delay="200">
                      <div class="newli_img">
                        <img class="p_img" ref="img_albp1006" @click="preview('albp1006')" :src="form.albp1006" v-show="form.albp1006" />
                      </div>
                    </a-spin>
                  </a-col>
                  <a-col :span="8">
                    <a-spin :spinning="spinning2" :delay="200">
                      <div class="newli_img">
                        <img class="p_img" ref="img_albp1007" @click="preview('albp1007')" :src="form.albp1007" v-show="form.albp1007" />
                      </div>
                    </a-spin>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <p style="margin-left: 100px; color: red">* 注意：请点击查看大图</p>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
  <a-modal :visible="cardVisible" title="身份证照" width="600px" :footer="null" @cancel="onCloseCard">
    <img alt="example" style="width: 100%; height: 40vh" :src="previewImage" />
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
  emits: ['child'],
  setup(props, text) {
    const userInfo = ref(LocalGetUserInfo())
    const confirmLoading = ref(false)
    const cardVisible = ref(false)
    const previewImage = ref(null)
    const img_albp1006 = ref()
    const img_albp1007 = ref()
    const formRef = ref()
    const form = reactive({
      albp1002: '', //真实姓名
      albp1003: '', //证件号码
      albp1005: '', //邮箱
      albp1006: null, //证件照片反面
      albp1007: null, //证件照片正面
      albp1008: null, //申诉照片-手持证件照
    })

    const spinning1 = ref(false) //证件照反面加载状态
    const spinning2 = ref(false) //证件照正面加载状态

    const onClose = (bool) => {
      formRef.value.resetFields()
      form.albp1006 = null
      form.albp1007 = null
      form.albp1008 = null
      confirmLoading.value = false
      text.emit('child', bool)
    }
    const onCloseCard = () => {
      cardVisible.value = false
    }

    const preview = (flied) => {
      if (flied == 'albp1006' && form.albp1006) {
        cardVisible.value = true
        previewImage.value = form.albp1006
      }
      if (flied == 'albp1007' && form.albp1007) {
        cardVisible.value = true
        previewImage.value = form.albp1007
      }
    }
    const noBtnAgree = () => {
      //不通过
      let bean = JSON.parse(JSON.stringify(props.item))
      bean.albp1003 = bean.cardno
      confirmLoading.value = true
      rpcPost('appealisNoPassFortisLogic', { bean }).then((res) => {
        if (res && res.code === 0) {
          onClose(true)
          message.success('审核成功')
        } else {
          message.warning(res.message)
        }
        confirmLoading.value = false
      })
    }

    const btnAgree = (type) => {
      //通过
      let bean = JSON.parse(JSON.stringify(props.item))
      bean.albp1003 = bean.cardno
      console.log(bean)
      confirmLoading.value = true
      rpcPost('appealisPasssFortisLogic', { bean }).then((res) => {
        if (res && res.code === 0) {
          onClose(true)
          message.success('审核成功')
        } else {
          message.warning(res.message)
        }
        confirmLoading.value = false
      })
    }

    const getUrl = (name) => {
      console.log(name, 'name')
      //获取图片地址
      if ((name == 'albp1007' && spinning2.value == true) || (name == 'albp1006' && spinning1.value == true)) {
        return
      }
      console.log(props.item, 'props___item')
      if (props.item[name] && !form[name]) {
        name == 'albp1007' ? (spinning2.value = true) : (spinning1.value = true)
        rpcPost('downloadFortisLogic', { bean: props.item[name] }).then((res) => {
          if (res && res.code === 0 && res.data) {
            form[name] = res.data
          } else {
            name == 'albp1007'
              ? message.warning("申诉照片-证件正面照获取失败，点击'证件照片正面'可再次获取")
              : message.warning("申诉照片-证件反面照获取失败，点击'证件反面照'可再次获取")
          }
          name == 'albp1007' ? (spinning2.value = false) : (spinning1.value = false)
        })
      }
    }

    watch(
      () => props.visible,
      (visible) => {
        if (visible) {
          form.albp1002 = props.item.albp1002 ? props.item.albp1002 : null //真实姓名
          form.albp1005 = props.item.albp1005 ? props.item.albp1005 : null //电子邮箱
          getUrl('albp1006')
          getUrl('albp1007')

          if (props.item.cardno) {
            rpcPost('cardno2', { bean: { cardno: props.item.cardno } }).then((res) => {
              //解密身份证号
              if (res && res.code == 0) {
                form.albp1003 = res.data.cardno //身份证号
              }
            })
          }
        }
      }
    )
    onMounted(() => {
      // createImageContainer()
    })

    return {
      formRef,
      spinning1,
      spinning2,
      form,
      props,
      confirmLoading,
      onClose,
      btnAgree,
      noBtnAgree,
      getUrl,
      img_albp1006,
      img_albp1007,
      cardVisible,
      onCloseCard,
      previewImage,
      preview,
    }
  },
})
</script>
<style scoped>
.newli_img {
  height: 160px;
  width: 100%;
  overflow: hidden;
}
.newli_img:hover img {
  z-index: 100;
  /* -webkit-transform: scale(2); */
  /* 在Safari 和 Chrome兼容下还原  */
  /* -moz-transform: scale(2); */
  /* 在Firefox兼容下还原  */
  /* -ms-transfrom: scale(2); */
  /* 在IE9兼容下还原  */
  /* -o-transform: scale(2); */
  /* 在opera兼容下还原  */
  /* transform: scale(2); */
  /* 适用于所有浏览兼容下还原 */
}
img.p_img {
  width: 100%;
  height: 100%;
  cursor: pointer;
  /* -webkit-transition: 0.5s all; */
  /* 适用Safari 和 Chrome兼容  */
  /* -moz-transition: 0.5s all; */
  /* 适用Firefox兼容  */
  /* -ms-transition: 0.5s all; */
  /* 适用IE9兼容  */
  /* -o-transition: 0.5s all; */
  /* Opera */
  /* transition: 0.5s; */
}
</style>
