<template>
  <!--选择不可同时报名项目弹窗 -->
  <a-modal title="不可同时报名项目" :visible="props.visible" @cancel="onClose()" width="800px" @ok="start">
    <a-form :label-col="labelCol" :wrapper-col="wrapperCol" :model="queryParam">
      <a-row :gutter="24">
        <a-col :span="9">
          <a-form-item label="项目名称">
            <a-input v-model:value="queryParam.albe0002" placeholder="请输入项目名称" />
          </a-form-item>
        </a-col>
        <a-col :span="9">
          <a-form-item label="项目编号">
            <a-input v-model:value="queryParam.albe0041" placeholder="请输入项目编号" />
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
      :rowKey="(record) => record.albe0041"
      :columns="columns"
      serviceName="getDirecGroupFortis"
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
    projectList: {
      type: Array,
      default: [],
    },
    // teamList: {
    //   type: Array,
    //   default: [],
    // },
  },
  setup(props, text) {
    const loading = ref(false)
    const formRef = ref()
    const userInfo = ref(LocalGetUserInfo())
    const queryParam = reactive({
      albe0002: '', //队伍名称
      albe0041: '', //队伍编号
    })
    const table = ref()

    const refresh = () => {
      //查询按钮
      table.value.refresh(true)
    }

    const resetForm = () => {
      //重置按钮
      queryParam.albe0002 = ''
      queryParam.albe0041 = ''
      formRef.value.resetFields()
      table.value.refresh(true)
    }

    const onClose = () => {
      text.emit('child', state.selectedRowKeys)
    }
    const searchFunc = () => {
      return {
        areaid: userInfo.value.areaid,
        albe0002: queryParam.albe0002 ? queryParam.albe0002 : null,
        albe0041: queryParam.albe0041 ? queryParam.albe0041 : null,
      }
    }

    const state = reactive({
      selectedRowKeys: [], //选中队伍id数组
      teamList: [], //选中队伍所有数据数组
      // Check here to configure the default column
    })

    const onSelectChange = (selectedKeys, selectedRows) => {
      state.selectedRowKeys = selectedKeys
    }

    const onSelect = (record, selected, selectedRows, nativeEvent) => {
      //用户手动选择/取消选择某列的回调
      // if (selected) {
      //   state.teamList.push(record)
      // }
      // if (!selected) {
      //   const delIndex = state.teamList.findIndex((val) => {
      //     return val.id === record.id
      //   })
      //   state.teamList.splice(delIndex, 1)
      // }
    }

    const onSelectAll = (selected, selectedRows, changeRows) => {
      //用户手动选择/取消选择所有列的回调
      // if (selected) {
      //   state.teamList = state.teamList.concat(changeRows)
      // }
      // if (!selected) {
      //   let selectedRows = JSON.parse(JSON.stringify(state.teamList))
      //   const delIndex = []
      //   selectedRows.forEach((item, index) => {
      //     changeRows.forEach((val, itemIndex) => {
      //       if (item.id === val.id) {
      //         delIndex.push(index)
      //       }
      //     })
      //   })
      //   delIndex.forEach((item) => {
      //     delete selectedRows[item]
      //   })
      //   selectedRows = selectedRows.filter((item) => {
      //     return item !== undefined
      //   })
      //   state.teamList = selectedRows
      // }
    }

    const start = () => {
      //确定按钮
      onClose()
    }

    watch(
      () => props.visible,
      (value) => {
        state.selectedRowKeys = props.projectList
        // state.teamList = props.teamList
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
          dataIndex: 'albe0002',
          width: '50%',
          ellipsis: true,
        },
        {
          title: '队伍编号',
          dataIndex: 'albe0041',
          width: '50%',
          ellipsis: true,
        },
      ],
    }
  },
})
</script>
<style scoped></style>
