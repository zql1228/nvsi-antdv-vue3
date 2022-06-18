<template>
  <a-drawer title="修改信息" placement="right" :maskClosable="false" :visible="visible" @close="onClose" width="40%"></a-drawer>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, onBeforeUnmount } from 'vue'
import EventBus from '@/utils/bus'
import apis from '@/server/request'
import { message } from 'ant-design-vue'
export default defineComponent({
  setup() {
    const visible = ref(false)
    const onClose = () => {
      init()
    }
    const init = () => {
      visible.value = false
    }
    onBeforeUnmount(() => {
      EventBus.off('handleTeamUpdate')
    })
    onMounted(() => {
      EventBusListener()
    })
    const EventBusListener = () => {
      EventBus.on('handleTeamUpdate', ({ record, type }) => {
        visible.value = true
        console.log(record)
        // currentReviewRecord = record
        // refreshReviewTable()
      })
    }
    return {
      visible,
      onClose,
    }
  },
})
</script>

<style scoped lang="less"></style>
