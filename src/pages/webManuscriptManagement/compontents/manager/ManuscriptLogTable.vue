<template>
  <!--稿件操作记录 -->
  <a-drawer
    v-model:visible="props.visible"
    title="稿件操作记录"
    :maskClosable="false"
    placement="right"
    @close="onClose(false)"
    width="800"
    :body-style="{ paddingBottom: '80px' }"
  >
    <IATable
      serviceName="listManuscriptLog"
      :searchParameter="searchFunc"
      ref="QueryModelTable"
      size="middle"
      :rowKey="(record) => record.id"
      :columns="ManuscriptLogColumns"
    >
    </IATable>
  </a-drawer>
</template>
<script>
import { defineComponent, ref, onMounted, reactive, watch, nextTick } from 'vue'
import moment from 'moment'

import { ManuscriptLogColumns } from '../../columns'

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
  components: {},
  setup(props, text) {
    const QueryModelTable = ref()
    const onClose = () => {
      text.emit('child')
    }
    const searchFunc = () => {
      return {
        articleid: props.item.articleid,
      }
    }

    watch(
      () => props.visible,
      (value) => {
        if (value) {
          nextTick(() => {
            QueryModelTable.value.refresh(true)
          })
        }
      }
    )

    return {
      props,
      QueryModelTable,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
      onClose,
      moment,
      searchFunc,
      ManuscriptLogColumns,
    }
  },
})
</script>
<style scoped></style>
