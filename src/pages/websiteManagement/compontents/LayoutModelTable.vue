<template>
  <!--新增资源 选择布局样式弹窗 -->
  <a-modal title="指定布局样式" :visible="props.visible" @cancel="onClose([])" width="800px" @ok="start">
    <a-form :label-col="labelCol" :wrapper-col="wrapperCol" ref="formRef" :model="queryParam">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="布局样式名称">
            <a-input v-model:value="queryParam.showname" placeholder="请输入布局样式名称" />
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
      serviceName="getLayoutList"
      :searchParameter="searchFunc"
      :row-selection="{ 
        selectedRowKeys: selectedRowKeys, 
        onChange: onSelectChange,
                type:'radio'
         }"
    ></IATable>
  </a-modal>
</template>
<script>
 import { defineComponent, ref, onMounted, reactive, watch, computed, toRefs } from 'vue'
 import { LocalGetUserInfo } from '@/utils/localStorage.js'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    layoutIdList: {
      type: Array,
      default: [],
    },
  },
  setup(props, text) {
    const loading = ref(false)
    const formRef = ref()
    const userInfo = ref(LocalGetUserInfo())
    const queryParam = reactive({
      showname: '', //布局名称
    })
    const table = ref()

    const refresh = () => {
      //查询按钮
      table.value.refresh(true)
    }

    const resetForm = () => {
      //重置按钮
      queryParam.showname = ''
      formRef.value.resetFields()
      table.value.refresh(true)
    }

    const onClose = () => {
      text.emit('child', state.selectedRowKeys, state.layoutList)
    }
    const searchFunc = () => {
      return {
        positionid: userInfo.value.positionid,
        showname: queryParam.showname ? queryParam.showname : null,
      }
    }

    const state = reactive({
      selectedRowKeys: [],
      layoutList: [], //选中布局列表
      // Check here to configure the default column
    })

    const onSelectChange = (selectedKeys, selectedRows) => {
      state.selectedRowKeys = selectedKeys
      state.layoutList = selectedRows
    }

    const start = () => {
      //确定按钮
      onClose()
    }

    watch(
      () => props.visible,
      (value) => {
        state.selectedRowKeys = props.layoutList
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
          title: '布局名称',
          dataIndex: 'showname',
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
