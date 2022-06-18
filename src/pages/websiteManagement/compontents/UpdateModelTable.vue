<template>
  <!--项目操作记录 -->
  <a-drawer
    v-model:visible="props.visible"
    title="修改行"
    :maskClosable="false"
    placement="right"
    @close="onClose(false)"
    width="800"
    :body-style="{ paddingBottom: '80px' }"
  >
    <IATable
      ref="table"
      size="middle"
      :rowKey="(record) => record.id"
      :columns="columns"
      serviceName="getProjectOperationRecordFortis"
      :searchParameter="searchFunc"
    >
      <template #action="record">
        <a-button type="" @class="">详情</a-button>
      </template>
    </IATable>
    <!-- <QueryModelDetails :visible="detail.visible" :item="detail.item" @child="DetailsOnClose"></QueryModelDetails> -->
  </a-drawer>
</template>
<script>
import { message } from 'ant-design-vue'
import { defineComponent, ref, onMounted, reactive, watch, computed } from 'vue'
import moment from 'moment'
import { rpcPost } from '@/server/conf/index.js'
// import QueryModelDetails from './QueryModelDetails'
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
//   components: {
//     QueryModelDetails,
//   },
  setup(props, text) {
    const onClose = () => {
      text.emit('child')
    }
    const searchFunc = () => {
      return {
        proId: props.item.id,
      }
    }

    const detail = reactive({
      //操作详情弹窗参数
      visible: true,
      item: {},
    })

    const handle = (record) => {
      //详情 按钮
      detail.item = record
      detail.visible = false
    }

    const DetailsOnClose = () => {
      detail.visible = false
    }

    return {
      props,
      detail,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
      onClose,
      searchFunc,
      DetailsOnClose,
      columns: [
        {
          title: '名称',
          dataIndex:'name',
        //   slots: {
        //     customRender: 'serial',
        //   },
          width: 60,
          align: 'center',
        },
        {
          title: '布局名称',
          dataIndex: 'showname',
          width: 60,
          ellipsis: true,
        },
        {
          title: '颜色',
          dataIndex: 'color',
          width: 60,
          ellipsis: true,
        },
        {
          title: '宽度',
          dataIndex: 'width',
          width: '20%',
          ellipsis: true,
        },
        {
          title: '排序',
          dataIndex: 'sort',
          width: '10%',
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          slots: {
            customRender: '详情',
          },
          width: '10%',
          ellipsis: true,
        },
      ],
    }
  },
})
</script>
<style scoped></style>
