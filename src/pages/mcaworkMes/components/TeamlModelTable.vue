<template>
  <!--通知公告 选择队伍弹窗 -->
  <a-modal title="指定队伍" :visible="props.visible" @cancel="onClose([])" width="800px" @ok="start">
    <a-form :label-col="labelCol" :wrapper-col="wrapperCol" ref="formRef" :model="queryParam">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="队伍名称">
            <a-input v-model:value="queryParam.name" placeholder="请输入队伍名称" />
          </a-form-item>
        </a-col>
        <!-- <a-col :span="9">
          <a-form-item label="队伍编号">
            <a-input v-model:value="queryParam.albe0041" placeholder="请输入队伍编号" />
          </a-form-item>
        </a-col> -->
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
      serviceName="getPositionOtherTeam"
      :searchParameter="searchFunc"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, onSelect: onSelect, onSelectAll: onSelectAll }"
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
    teamIdList: {
      type: Array,
      default: [],
    },
    teamList: {
      type: Array,
      default: [],
    },
  },
  setup(props, text) {
    const loading = ref(false)
    const formRef = ref()
    const userInfo = ref(LocalGetUserInfo())
    const queryParam = reactive({
      name: '', //队伍名称
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

    const onClose = () => {
      text.emit('child', state.selectedRowKeys, state.teamList)
    }
    const searchFunc = () => {
      return {
        positionid: userInfo.value.positionid,
        name: queryParam.name ? queryParam.name : null,
      }
    }

    const state = reactive({
      selectedRowKeys: [], //选中队伍id数组
      teamList: [], //选中队伍所有数据数组
      // Check here to configure the default column
    })

    const onSelectChange = (selectedKeys, selectedRows) => {
      state.selectedRowKeys = selectedKeys
      // state.teamList = selectedRows
    }

    const onSelect = (record, selected, selectedRows, nativeEvent) => {
      //用户手动选择/取消选择某列的回调
      if (selected) {
        state.teamList.push(record)
      }

      if (!selected) {
        const delIndex = state.teamList.findIndex((val) => {
          return val.id === record.id
        })
        state.teamList.splice(delIndex, 1)
      }
    }

    const onSelectAll = (selected, selectedRows, changeRows) => {
      //用户手动选择/取消选择所有列的回调
      if (selected) {
        state.teamList = state.teamList.concat(changeRows)
      }
      if (!selected) {
        let selectedRows = JSON.parse(JSON.stringify(state.teamList))
        const delIndex = []
        selectedRows.forEach((item, index) => {
          changeRows.forEach((val, itemIndex) => {
            if (item.id === val.id) {
              delIndex.push(index)
            }
          })
        })
        delIndex.forEach((item) => {
          delete selectedRows[item]
        })
        selectedRows = selectedRows.filter((item) => {
          return item !== undefined
        })
        state.teamList = selectedRows
      }
    }

    const start = () => {
      //确定按钮
      onClose()
    }

    watch(
      () => props.visible,
      (value) => {
        state.selectedRowKeys = props.teamIdList
        state.teamList = props.teamList
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
      onSelect,
      onSelectAll,
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
          title: '队伍名称',
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
