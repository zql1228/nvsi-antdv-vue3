<template>
  <!-- 通知公告详情弹窗 -->
  <a-drawer :title="getTitle()" placement="right" :visible="visible" :maskClosable="false" @close="onClose" width="800">
    <a-card :bordered="false" headStyle="text-align:center;border:0;font-weight:bolder;font-size:24px;" bodyStyle="padding-top:0;">
      <a-row :gutter="[0, 48]">
        <a-col :span="24">
          <div class="noticeTitle">{{ currentRecord.title }}</div>
          <div class="noticeTime">
            <div>发送人：{{ currentRecord.creatorname }}</div>
          </div>
          <div style="display: flex; flex-direction: row-reverse; padding-bottom: 30px">
            <div>{{ moment(currentRecord.createtime).format('YYYY-MM-DD HH:mm:ss') }}</div>
          </div>
        </a-col>
      </a-row>
      <!-- 默认图片 -->
      <!-- <a-row :gutter="[0, 48]">
        <a-col :span="24">
          <div style="width:300px;height:150px;margin:auto;">
            <img style="width:100%;height:100%;" src="@/assets/img/bg.png" alt="" />
          </div>
        </a-col>
      </a-row> -->
      <a-row>
        <a-col :span="24" class="customerNode_content">
          <div v-html="currentRecord.content"></div>
        </a-col>
        <a-col>
          <div class="docTitle" style="font-size: 19px; font-weight: 600">
            <span>附件</span>
          </div>
          <div class="docList" style="margin-top: 10px">
            <div v-for="(doc, index) in currentRecord.annex">
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
      let noticeType = ''
      let level = ''

      switch (currentRecord.value.sort) {
        case '1':
          noticeType = '工作通知'
          break
        case '2':
          noticeType = '会议通知'
          break
        case '3':
          noticeType = '培训通知'
          break
      }
      switch (currentRecord.value.urgentlevel) {
        case '1':
          level = '紧急'
          break
        case '2':
          level = '普通'
          break
      }
      return `${noticeType}(${level})`
    }
    onBeforeUnmount(() => {
      EventBus.off('handleViewNotice')
    })
    const EventBusListener = () => {
      EventBus.on('handleViewNotice', (record) => {
        try {
          currentRecord.value = JSON.stringify(record)
          currentRecord.value = JSON.parse(currentRecord.value)
          if (currentRecord.value.annex) {
            currentRecord.value.annex = JSON.parse(currentRecord.value.annex)
          }
        } catch (error) {
          console.log(error)
        }

        console.log(currentRecord.value)
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
