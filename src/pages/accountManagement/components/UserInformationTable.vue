<!-- 管理部门 账户管理→用户信息列表(民政和文明办) -->
<template>
  <div>
    <IATable
      serviceName="userInformationFortisService"
      :searchParameter="searchFunc"
      ref="UserInformationTable"
      size="middle"
      :rowKey="(record) => (record.aid ? record.aid : record.id)"
      :columns="UserInformationColumns"
    >
      <template #total-title="{totalData:total}">
        查询合计：账号数
        <span>
          {{ total.totals }}
        </span>
        个
      </template>
      <template #type="{text:type}">
        {{ type == 1 ? '完善' : '未完善' }}
      </template>
      <template #action="record">
        <a-button type="primary" size="small" @click="handleAdd(record)">
          重置密码
        </a-button>
      </template>
    </IATable>
    <UserInformationForm
      :visible="data.visible"
      :activeKey="props.activeKey"
      :queryParam="props.queryParam"
      :item="data.item"
      @child="onClose"
    ></UserInformationForm>
  </div>
</template>

<script>
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { defineComponent, reactive, ref } from 'vue'
import UserInformationForm from './UserInformationForm.vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { UserInformationColumns } from '../columns'
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
    UserInformationForm,
  },
  setup(props) {
    const UserInformationTable = ref()
    const userInfo = ref(LocalGetUserInfo())
    const data = reactive({
      //弹窗表单相关参数
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
        name: props.queryParam.name ? props.queryParam.name : null, //管理员名称
      }
    }

    const handleAdd = (record) => {
      //重置密码
      data.item = record.record
      data.visible = true
    }
    const onClose = (bool) => {
      if (bool) {
        //为true时说明数据改变了
        getList(false)
      }
      data.visible = false
    }
    const getList = (bool) => {
      //列表数据查询  点击父组件查询按钮时调用该方法
      UserInformationTable.value.refresh(bool)
    }
    return {
      userInfo,
      props,
      UserInformationTable,
      data,
      UserInformationColumns,
      searchFunc,
      onClose,
      handleAdd,
      getList,
    }
  },
})
</script>
<style lang="scss" scoped></style>
