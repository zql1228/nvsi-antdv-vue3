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
      :label-col="{
        span: 6,
      }"
      :wrapper-col="{
        span: 16,
      }"
    >
      <a-form-item label="队伍名称" name="albe0002" v-show="oldDetail.albe0002 != newDetail.albe0002">
        <a-input v-model:value="oldDetail.albe0002" readonly />
        <div style="text-align: center">
          <ArrowDownOutlined />
        </div>
        <a-input v-model:value="newDetail.albe0002" readonly />
      </a-form-item>
      <a-form-item label="负责人姓名" name="albe0022" v-show="oldDetail.albe0022 != newDetail.albe0022">
        <a-input v-model:value="oldDetail.albe0022" readonly />
        <div style="text-align: center">
          <ArrowDownOutlined />
        </div>
        <a-input v-model:value="newDetail.albe0022" readonly />
      </a-form-item>
      <a-form-item label="负责人身份证" name="albe0023" v-show="oldDetail.albe0023 != newDetail.albe0023">
        <a-input v-model:value="oldDetail.albe0023" readonly />
        <div style="text-align: center">
          <ArrowDownOutlined />
        </div>
        <a-input v-model:value="newDetail.albe0023" readonly />
      </a-form-item>
      <a-form-item label="负责人手机" name="albe0024" v-show="oldDetail.albe0024 != newDetail.albe0024">
        <a-input v-model:value="oldDetail.albe0024" readonly />
        <div style="text-align: center">
          <ArrowDownOutlined />
        </div>
        <a-input v-model:value="newDetail.albe0024" readonly />
      </a-form-item>
      <a-form-item label="联系人姓名" name="albe0018" v-show="oldDetail.albe0018 != newDetail.albe0018">
        <a-input v-model:value="oldDetail.albe0018" readonly />
        <div style="text-align: center">
          <ArrowDownOutlined />
        </div>
        <a-input v-model:value="newDetail.albe0018" readonly />
      </a-form-item>
      <a-form-item label="联系人手机号" name="albe0019" v-show="oldDetail.albe0019 != newDetail.albe0019">
        <a-input v-model:value="oldDetail.albe0019" readonly />
        <div style="text-align: center">
          <ArrowDownOutlined />
        </div>
        <a-input v-model:value="newDetail.albe0019" readonly />
      </a-form-item>
      <a-form-item label="联系人邮箱" name="albe0049" v-show="oldDetail.albe0049 != newDetail.albe0049">
        <a-input v-model:value="oldDetail.albe0049" readonly />
        <div style="text-align: center">
          <ArrowDownOutlined />
        </div>
        <a-input v-model:value="newDetail.albe0049" readonly />
      </a-form-item>
      <a-form-item label="修改证明" name="albe2508">
        <a-row v-if="url != ''" style="border-bottom: 1px solid#666; margin-top: 5px">
          <a-col span="20">
            <a-col span="22" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap">{{ file.name ? file.name : '' }}</a-col>
          </a-col>
          <a-col span="4">
            <a-row justify="end">
              <a-col span="24" style="text-align: right"><a style="border-bottom: 1px solid red" :href="url">下载</a></a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, watch, nextTick } from 'vue'
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { rpcPost } from '@/server/conf/index.js'
import { message } from 'ant-design-vue'
import moment from 'moment'
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
    const userInfo = ref(LocalGetUserInfo())

    const oldDetail = ref({}) //修改前详情
    const newDetail = ref({}) //修改后详情
    const file = ref({}) //证明文件
    const url = ref('') //证明文件地址

    const onClose = () => {
      //关闭弹窗
      text.emit('child')
      oldDetail.value = {}
      newDetail.value = {}
      file.value = {}
      url.value = ''
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
              oldDetail.value = res.data.albe2504
              newDetail.value = res.data.albe2505
              if (res.data.albe2508) {
                file.value = JSON.parse(res.data.albe2508)
                rpcPost('downloadFortisLogic', { bean: file.value }).then((res) => {
                  if (res && res.code === 0 && res.data) {
                    url.value = res.data
                  } else {
                    message.warning('未查询到证明文件地址')
                  }
                })
              }
            } else {
              message.warning('未查询到相关信息')
            }
          })
        }
      }
    )
    return {
      props,
      oldDetail,
      newDetail,
      file,
      url,
      onClose,
    }
  },
})
</script>

<style scoped lang="less"></style>
