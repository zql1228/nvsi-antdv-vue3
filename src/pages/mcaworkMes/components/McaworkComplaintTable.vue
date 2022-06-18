<!-- 管理部门 信息管理→投诉管理列表 -->
<template>
  <div>
    <IATable
      serviceName="complaintList2"
      :searchParameter="searchFunc"
      ref="McaworkComplaintTable"
      size="middle"
      :rowKey="(record) => record.id"
      :columns="McaworkComplaintColumns"
    >
      <template #total-title="{totalData:total}">
        查询合计：投诉条数
        <span>
          {{ total.totals }}
        </span>
        条
      </template>
      <template #albx0346="{text:albx0346}">
        {{ albx0346 == 1 ? '时长' : albx0346 == 2 ? '新闻' : albx0346 == 3 ? '动态' : '-' }}
      </template>
      <template #action="record">
        <a-button type="primary" size="small" @click="handleAdd(record)">
          查看
        </a-button>
      </template>
    </IATable>
    <McaworkComplaintForm
      :visible="data.visible"
      :item="data.item"
      :activeKey="props.activeKey"
      :queryParam="props.queryParam"
      @child="onClose"
    ></McaworkComplaintForm>
  </div>
</template>

<script>
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { defineComponent, reactive, ref } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import McaworkComplaintForm from './McaworkComplaintForm.vue'
import { McaworkComplaintColumns } from '../columns'

export default defineComponent({
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
  components: {
    PlusOutlined,
    // pagination,
    McaworkComplaintForm,
  },
  setup(props) {
    const InstitutionalInfoTable = ref()
    const userInfo = ref(LocalGetUserInfo())
    const McaworkComplaintTable = ref()
    const data = reactive({
      //弹窗表单相关参数
      visible: false,
      item: {},
    })
    const searchFunc = () => {
      return {
        areaid: userInfo.value.areaid,
        type: props.activeKey == 1 ? 0 : 1, //0：未处理 1：已处理
        albx0355: props.queryParam.albx0355 ? props.queryParam.albx0355 : null, //被投诉对象
        albx0346: props.queryParam.albx0346 ? props.queryParam.albx0346 : null, //被投诉对象
      }
    }
    const handleAdd = (record) => {
      //查看
      data.item = record.record
      data.visible = true
    }
    const onClose = (bool) => {
      if (bool) {
        getList()
      }
      data.visible = false
    }
    const getList = () => {
      //列表数据查询  点击父组件查询按钮时调用该方法
      McaworkComplaintTable.value.refresh(true)
    }
    return {
      McaworkComplaintTable,
      props,
      data,
      McaworkComplaintColumns,
      searchFunc,
      onClose,
      handleAdd,
      getList,
    }
  },
})
</script>
<style lang="scss" scoped></style>
