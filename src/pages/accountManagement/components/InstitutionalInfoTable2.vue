<!-- 管理部门 账户管理→机构信息列表 -->
<template>
  <div>
    <IATable
      serviceName="informationFortisService"
      :searchParameter="searchFunc"
      ref="InstitutionalInfoTable2"
      size="middle"
      :rowKey="(record) => record.id"
      :columns="InstitutionalInfoColumns2"
    >
      <template #total-title="{ totalData: total }">
        查询合计：机构数
        <span>
          {{ total.totals }}
        </span>
        个
      </template>
      <template #albe0002="{ text, record }">
        <a @click="heanView(record)" :title="text">{{ text }}</a>
      </template>
      <template #action="record">
        <a-button type="primary" size="small" @click="handleAdd(record)" disabled> 修改信息 </a-button>
      </template>
    </IATable>
  </div>
</template>

<script>
import { LocalGetUserInfo, LocalSetTeamViewInfo } from '@/utils/localStorage.js'
import { defineComponent, reactive, ref } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { InstitutionalInfoColumns2 } from '../columns'
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
  },
  setup(props) {
    const router = useRouter()
    const InstitutionalInfoTable2 = ref()
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
        name: props.queryParam.name ? props.queryParam.name : null, //单位名称
        albe0018: props.queryParam.personname ? props.queryParam.personname : null, //管理员名称
      }
    }

    const handleAdd = (record) => {
      //修改信息
      data.item = record.record
      data.visible = true
    }

    const heanView = (record) => {
      //查看信息
      let obj = JSON.parse(JSON.stringify(record))
      obj.id = record.id
      obj.albe0012 = record.albe0012
      LocalSetTeamViewInfo(obj)
      router.push({ path: '/teamCmsDetails' })
    }
    const onClose = (bool) => {
      if (bool) {
        getList(true)
      }
      data.visible = false
    }
    const getList = (bool) => {
      //列表数据查询  点击父组件查询按钮时调用该方法
      InstitutionalInfoTable2.value.refresh(bool)
    }
    return {
      props,
      InstitutionalInfoTable2,
      data,
      InstitutionalInfoColumns2,
      searchFunc,
      onClose,
      handleAdd,
      heanView,
      getList,
    }
  },
})
</script>
<style lang="scss" scoped></style>
