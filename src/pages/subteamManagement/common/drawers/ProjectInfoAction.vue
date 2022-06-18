<template>
  <a-drawer title="项目操作记录" placement="right" :visible="visible" :maskClosable="false" @close="onClose" width="800">
    <IATable
      serviceName="getProjectOperationRecordFortis"
      :searchParameter="searchFunc"
      ref="ProOperationTable"
      size="middle"
      :rowKey="(record) => record.id"
      :columns="columns"
    ></IATable>
  </a-drawer>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, onBeforeUnmount } from 'vue'
import EventBus from '@/utils/bus'
import moment from 'moment'
import apis from '@/server/request'
const tableColumns = [
  {
    title: '序号',
    slots: {
      customRender: 'serial',
    },
    width: 50,
    align: 'center',
  },
  {
    title: '操作人',
    dataIndex: 'albx5401',
    key: 'albx5401',
    ellipsis: true,
    width: '30%',
  },
  {
    title: '操作时间',
    dataIndex: 'createtime',
    key: 'createtime',
    customRender: ({ text }) => {
      return moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    slots: { customRender: 'createtime' },
    ellipsis: true,
    width: '30%',
  },
  {
    title: '操作类型',
    dataIndex: 'albx5403',
    customRender: ({ text }) => {
      switch (text) {
        case '0':
          return '启用'
        case '1':
          return '停用'
      }
    },
    key: 'albx5403',
    ellipsis: true,
    width: '20%',
  },
  {
    title: '原因',
    dataIndex: 'albx5404',
    key: 'albx5404',
    ellipsis: true,
    width: '40%',
  },
]
export default defineComponent({
  setup() {
    const visible = ref(false)
    let currentRecord = reactive({})
    const ProOperationTable = ref()
    const columns = reactive(tableColumns)
    const onClose = () => {
      init()
    }
    const init = () => {
      visible.value = false
    }
    onBeforeUnmount(() => {
      EventBus.off('handleViewProOperation')
    })
    onMounted(() => {
      EventBusListener()
    })
    const searchFunc = () => {
      return {
        proId: currentRecord.id,
        pageNum: 1,
        pageSize: 12,
      }
    }
    const EventBusListener = () => {
      EventBus.on('handleViewProOperation', ({ record }) => {
        visible.value = true
        currentRecord = record
        ProOperationTable.value.refresh(true)
        console.log('visible.value: ', record)
      })
    }
    return {
      visible,
      onClose,
      columns,
      ProOperationTable,
      searchFunc,
    }
  },
})
</script>

<style scoped lang="less"></style>
