<template>
  <!--行内列 列表 -->
  <div>
    <a-drawer
      v-model:visible="props.visible"
      title="行内列"
      :maskClosable="false"
      placement="right"
      @close="onClose1(false)"
      width="1000"
      :body-style="{ paddingBottom: '80px' }"
    >
      <IATable
        ref="table"
        size="middle"
        :rowKey="(record) => record.id"
        :columns="columns"
        serviceName="getLayoutColList"
        :searchParameter="searchFunc"
      >
        <template #action="record">
          <a-button type="primary" size="small" ghost @click="updateLayoutCol(record)">修改</a-button>
          <a-popconfirm :title="'确定删除吗?'" @confirm="removeCol(record)">
            <a-button type="primary" size="small" style="margin-left:10px;">删除</a-button>
          </a-popconfirm>
        </template>
      </IATable>
      <StyleColUpdateForm :visible="model.visible" :item="model.item" @child="onClose5"></StyleColUpdateForm>
    </a-drawer>
  </div>
</template>
<script>
import { message } from 'ant-design-vue'
import { defineComponent, ref, onMounted, reactive, watch, computed, nextTick } from 'vue'
import moment from 'moment'
import { rpcPost } from '@/server/conf/index.js'
import StyleColAddTable from './StyleColAddTable'
import StyleColUpdateForm from './StyleColUpdateForm.vue'
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
    props: {
      activeKey: {
        type: Number,
        default: 1,
      },
      queryParam: {
        type: Object,
        default: {},
      },
    },
  },
  components: {
    StyleColAddTable,
    StyleColUpdateForm,
  },

  setup(props, text) {
    const onClose1 = () => {
      text.emit('child')
    }

    const searchFunc = () => {
      return {
        layoutid: props.item.layoutid,
        layoutrowid: props.item.id,
      }
    }
    const model = reactive({
      visible: false,
      item: {},
    })
    const table = ref()
    const updateLayoutCol = (record) => {
      model.visible = true
      model.item = record
    }

    const removeCol = (record) => {
      let bean = { id: record.record.id }
      rpcPost('removeLayoutCol', { bean }).then((res) => {
        if (res && res.code === 0) {
          message.success('删除成功')
          table.value.refresh(true)
        } else {
          message.error(res.message)
        }
      })
    }

    const onClose5 = () => {
      model.visible = false
      table.value.refresh(true)
    }

    //每次点击重新查询
    watch(
      () => props.visible,
      (visible) => {
        nextTick(() => {
          table.value.refresh(true)
        })
      }
    )

    return {
      table,
      model,
      props,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
      removeCol,
      updateLayoutCol,
      onClose5,
      onClose1,
      searchFunc,
      columns: [
        {
          title: '序号',
          slots: {
            customRender: 'serial',
          },
          width: 50,
          align: 'center',
        },
        {
          title: '名称',
          dataIndex: 'name',
          width: 50,
          ellipsis: true,
        },
        {
          title: '所属列',
          dataIndex: 'becolumn',
          width: 50,
          ellipsis: true,
        },
        {
          title: '排序',
          dataIndex: 'sort',
          width: 30,
          ellipsis: true,
        },
        {
          title: '关联资源',
          dataIndex: 'resourcename',
          width: 50,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '组件名称',
          dataIndex: 'componentname',
          width: 50,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          slots: {
            customRender: 'action',
          },
          width: 100,
          ellipsis: true,
          align: 'center',
        },
      ],
    }
  },
})
</script>
<style scoped></style>
