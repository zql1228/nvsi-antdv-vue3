<template>
  <!--项目操作记录 -->
  <a-drawer
    v-model:visible="props.visible"
    title="项目操作记录"
    :maskClosable="false"
    placement="right"
    @close="onClose(false)"
    width="800"
    :body-style="{ paddingBottom: '80px' }"
  >
    <IATable
      serviceName="getProjectOperationRecordFortis"
      :searchParameter="searchFunc"
      ref="QueryModelTable"
      size="middle"
      :rowKey="(record) => record.id"
      :columns="columns"
    >
      <template #albx5403="{text:albx5403}">
        {{ albx5403 == 0 ? '启用' : albx5403 == 1 ? '停用' : '-' }}
      </template>
    </IATable>
  </a-drawer>
</template>
<script>
import { message } from 'ant-design-vue'
import { defineComponent, ref, onMounted, reactive, watch, nextTick } from 'vue'
import moment from 'moment'
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
  components: {},
  setup(props, text) {
    const QueryModelTable = ref()
    const onClose = () => {
      text.emit('child')
    }
    const searchFunc = () => {
      return {
        proId: props.item.id,
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

    // const detail = reactive({
    //   //操作详情弹窗参数
    //   visible: false,
    //   item: {},
    // })

    // const handle = (record) => {
    //   //详情 按钮
    //   detail.item = record
    //   detail.visible = true
    // }

    // const DetailsOnClose = () => {
    //   detail.visible = false
    // }

    return {
      props,
      QueryModelTable,
      //detail,
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
      // DetailsOnClose,
      // handle,
      columns: [
        {
          title: '序号',
          slots: {
            customRender: 'serial',
          },
          width: 80,
          align: 'center',
        },
        {
          title: '修改人',
          dataIndex: 'albx5401',
          width: '50%',
          ellipsis: true,
        },
        {
          title: '修改时间',
          dataIndex: 'createtime',
          width: '50%',
          ellipsis: true,
          slots: { customRender: 'createtime' },
          customRender: (text) => {
            return moment(text.text).format('YYYY-MM-DD HH:mm:ss')
          },
        },
        {
          title: '操作',
          dataIndex: 'albx5403',
          key: 'albx5403',
          slots: {
            customRender: 'albx5403',
          },
          width: 100,
          ellipsis: true,
        },
      ],
    }
  },
})
</script>
<style scoped></style>
