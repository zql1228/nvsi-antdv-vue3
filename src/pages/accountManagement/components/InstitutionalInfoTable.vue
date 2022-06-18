<!-- 管理部门 账户管理→机构信息列表 -->
<template>
  <div>
    <IATable
      serviceName="informationFortisService"
      :searchParameter="searchFunc"
      ref="InstitutionalInfoTable"
      size="middle"
      :rowKey="(record) => record.id"
      :columns="InstitutionalInfoColumns"
    >
      <template #total-title="{totalData:total}">
        查询合计：机构数
        <span>
          {{ total.totals }}
        </span>
        个
      </template>
      <template #albe0075="{text,record}">
        <a @click="heanView(record)" :title="text">{{ text }}</a>
      </template>
      <template #action="record">
        <a-button type="primary" size="small" @click="handleAdd(record)" :disabled="record.record.albe0073 != userInfo.userflag">
          修改信息
        </a-button>
      </template>
    </IATable>
    <InstitutionalInfoForm
      :visible="data.visible"
      :type="data.type"
      :item="data.item"
      :activeKey="props.activeKey"
      :queryParam="props.queryParam"
      @child="onClose"
    ></InstitutionalInfoForm>
  </div>
</template>

<script>
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { defineComponent, reactive, ref } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import InstitutionalInfoForm from './InstitutionalInfoForm'
import { InstitutionalInfoColumns } from '../columns'

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
    InstitutionalInfoForm,
  },
  setup(props) {
    const InstitutionalInfoTable = ref()
    const userInfo = ref(LocalGetUserInfo())
    const data = reactive({
      //弹窗表单相关参数
      type: 'view',
      visible: false,
      item: {},
    })
    const searchFunc = () => {
      return {
        type: props.activeKey, //1：民政  2：文明办 3：税务
        areaid:
          props.queryParam.areaid.length > 0
            ? props.queryParam.areaid[props.queryParam.areaid.length - 1]
            : userInfo.value.areaLevel == '0'
            ? '100000000000000000'
            : userInfo.value.areaid,
        name: props.queryParam.name ? props.queryParam.name : null, //单位名称
        personname: props.queryParam.personname ? props.queryParam.personname : null, //联系人姓名
      }
    }

    const handleAdd = (record) => {
      //修改信息
      data.type = 'modify'
      data.item = record.record
      data.visible = true
    }
    const heanView = (record) => {
      //查看信息
      data.type = 'view'
      data.item = record
      data.visible = true
    }
    const onClose = (bool) => {
      if (bool) {
        getList(true)
      }
      data.visible = false
    }
    const getList = (bool) => {
      //列表数据查询  点击父组件查询按钮时调用该方法
      InstitutionalInfoTable.value.refresh(bool)
    }
    return {
      userInfo,
      props,
      InstitutionalInfoTable,
      data,
      InstitutionalInfoColumns,
      searchFunc,
      onClose,
      handleAdd,
      getList,
      heanView,
    }
  },
})
</script>
<style lang="scss" scoped></style>
