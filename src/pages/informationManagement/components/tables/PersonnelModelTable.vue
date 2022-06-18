<template>
  <!--通知公告 选择人员弹窗 -->
  <a-modal title="指定队伍" :visible="props.visible" @cancel="onClose([])" width="800px" @ok="start">
    <a-form :label-col="labelCol" :wrapper-col="wrapperCol" ref="formRef" :model="queryParam">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="姓名">
            <a-input v-model:value="queryParam.name" placeholder="请输入人员姓名" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <span>
            <a-button type="primary" @click="refresh">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetForm">重置</a-button>
          </span>
        </a-col>
      </a-row>
    </a-form>
    <IATable
      ref="table"
      size="middle"
      :rowKey="(record) => record.id"
      :columns="columns"
      serviceName="getPositionOtherPeople"
      :searchParameter="searchFunc"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
    </IATable>
  </a-modal>
</template>
<script>
import { message } from 'ant-design-vue'
import { defineComponent, ref, onMounted, reactive, watch, computed, toRefs } from 'vue'
import moment from 'moment'
import { rpcPost } from '@/server/conf/index.js'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    personnelIdList: {
      type: Array,
      default: [],
    },
    personnelList: {
      type: Array,
      default: [],
    },
  },
  setup(props, text) {
    const loading = ref(false)
    const formRef = ref()
    const userInfo = ref(LocalGetUserInfo())
    const queryParam = reactive({
      name: '', //姓名
    })
    const table = ref()

    const refresh = () => {
      //查询按钮
      table.value.refresh(true)
    }

    const resetForm = () => {
      //重置按钮
      queryParam.name = ''
      formRef.value.resetFields()
      table.value.refresh(true)
    }

    const onClose = (arr) => {
      text.emit('closePersonTableModel', state.selectedRowKeys, state.personnelList)
    }
    const searchFunc = () => {
      return {
        positionid: userInfo.value.positionid,
        name: queryParam.name ? queryParam.name : null,
      }
    }

    const state = reactive({
      selectedRowKeys: [], //选中的人员id列表
      personnelList: [], //选中人员列表
      // Check here to configure the default column
    })

    const onSelectChange = (selectedKeys, selectedRows) => {
      state.selectedRowKeys = selectedKeys
      state.personnelList = selectedRows
    }

    const start = () => {
      //确定按钮
      onClose()
    }

    watch(
      () => props.visible,
      (value) => {
        state.selectedRowKeys = props.personnelIdList
      }
    )

    return {
      table,
      props,
      loading,
      formRef,
      queryParam,
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
      ...toRefs(state),
      start,
      onSelectChange,
      refresh,
      resetForm,
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
          title: '姓名',
          dataIndex: 'name',
          width: '100%',
          align: 'center',
          ellipsis: true,
        },
      ],
    }
  },
})
</script>
<style scoped></style>
