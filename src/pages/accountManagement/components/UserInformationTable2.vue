<!-- 管理部门 账户管理→用户信息列表(民政和文明办) -->
<template>
  <div>
    <IATable
      serviceName="userInformationFortisService"
      :searchParameter="searchFunc"
      ref="UserInformationTable2"
      size="middle"
      :rowKey="(record) => (record.aid ? record.aid : record.id)"
      :columns="UserInformationColumns2"
    >
      <template #total-title="{ totalData: total }">
        查询合计：账号数
        <span>
          {{ total.totals }}
        </span>
        个
      </template>
      <!-- <template #albe0002="{text,record}">
        <a @click="heanView(record)">{{ text }}</a>
      </template> -->
      <template #action="record">
        <a-button type="primary" size="small" @click="handleAdd(record)"> 重置密码 </a-button>
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
import { LocalGetUserInfo, LocalSetTeamViewInfo } from '@/utils/localStorage.js'
import { defineComponent, reactive, ref } from 'vue'
import UserInformationForm from './UserInformationForm.vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { UserInformationColumns2 } from '../columns'
import { useRouter } from 'vue-router'
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
    const router = useRouter()
    const UserInformationTable2 = ref()
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
        name: props.queryParam.name ? props.queryParam.name : null, //队伍名称
      }
    }

    const handleAdd = (record) => {
      //重置密码
      data.item = record.record
      data.visible = true
    }
    const heanView = (record) => {
      //查看信息
      let obj = JSON.parse(JSON.stringify(record))
      obj.id = record.aid
      obj.albe0012 = record.albe0012
      LocalSetTeamViewInfo(obj)
      router.push({ path: '/teamCmsDetails' })
    }
    const onClose = (bool) => {
      if (bool) {
        //为true时说明数据改变了
        getList(true)
      }
      data.visible = false
    }
    const getList = (bool) => {
      //列表数据查询  点击父组件查询按钮时调用该方法
      UserInformationTable2.value.refresh(bool)
    }
    return {
      props,
      UserInformationTable2,
      data,
      UserInformationColumns2,
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
