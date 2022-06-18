<template>
  <!-- 通知公告详情弹窗 -->
  <a-drawer :title="稿件" placement="right" :visible="visible" :maskClosable="false" @close="onClose" width="800">
    <a-card :bordered="false" headStyle="text-align:center;border:0;font-weight:bolder;font-size:24px;" bodyStyle="padding-top:0;">
      <a-row :gutter="[0, 48]">
        <a-col :span="24">
          <div class="noticeTitle">{{ currentRecord.title }}</div>
          <div class="noticeTime">
            <div>投稿人：{{ currentRecord.contributorname }}</div>
          </div>
          <div style="display: flex; flex-direction: row-reverse; padding-bottom: 30px">
            <div>{{ moment(currentRecord.createtime).format('YYYY-MM-DD HH:mm:ss') }}</div>
          </div>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="24" class="customerNode_content">
          <div v-html="currentRecord.newscontent"></div>
        </a-col>
        <a-col>
          <div class="docTitle" style="font-size: 19px; font-weight: 600">
            <span>附件</span>
          </div>
          <div class="docList" style="margin-top: 10px">
            <div v-for="(doc, index) in currentRecord.attachments">
              <a href="#" @click.prevent="downloadFortisLogic(doc)">{{ doc.name }}</a>
            </div>
            <a ref="download" download v-show="false" href="#"></a>
          </div>
        </a-col>
      </a-row>
    </a-card>
  </a-drawer>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, onBeforeUnmount } from 'vue'
import EventBus from '@/utils/bus'
import { message } from 'ant-design-vue/es'
import apis from '@/server/request'
import moment from 'moment'
// import projectBjImg from '@/assets/img/project/project-bg'
export default defineComponent({
  setup() {
    const visible = ref(false)
    const currentRecord = ref({})
    const download = ref()
    const onClose = () => {
      visible.value = false
      currentRecord.value = {}
    }
    const getTitle = () => {
      let noticeType = '稿件'
      return `${noticeType} `
    }
    onBeforeUnmount(() => {
      EventBus.off('handleViewManuscript')
    })

    const EventBusListener = () => {
      EventBus.on('handleViewManuscript', (record) => {
        try {
          currentRecord.value = JSON.stringify(record)
          currentRecord.value = JSON.parse(currentRecord.value) //绑定字段
          // console.log(currentRecord)
          if (currentRecord.value.attachments) {
            currentRecord.value.attachments = JSON.parse(currentRecord.value.attachments)
          }
        } catch (error) {
          console.log(error)
          message.warning('数据错误')
        }

        visible.value = true
      })
    }
    const downloadFortisLogic = async (docParam) => {
      const res = await apis.downloadFortisLogic(docParam)
      if (res.code == '0') {
        download.value.href = res.data
        download.value.click()
      } else {
        message.warning(res.message)
      }
    }
    onMounted(() => {
      EventBusListener()
    })
    return {
      visible,
      onClose,
      currentRecord,
      getTitle,
      moment,
      downloadFortisLogic,
      download,
      // projectBjImg,
    }
  },
})
</script>

<style scoped lang="less">
.noticeTitle {
  text-align: center;
  padding: 10px 20px;
  font-size: 20px;
  font-weight: 600;
}
.noticeTime {
  display: flex;
  justify-content: center;
}
.customerNode_content {
  :deep(img) {
    width: 100% !important;
  }
}
</style>
