<template>
  <IATable
    serviceName="listGroupPublishProjectFortis"
    :searchParameter="searchFunc"
    ref="table"
    size="middle"
    :rowKey="(record) => record.id"
    :columns="props.columns && props.columns.length > 0 ? props.columns : columns"
  >
    <template #total-title="{totalData:total}">
      查询合计：项目数
      <span>
        {{ total.sumpro }}
      </span>
      个
    </template>
    <template #albx0002="{text,record}">
      <a @click="heanViewTeamInfo(record)" :title="text">{{ text }}</a>
    </template>
    <template #areanames="{text:areanames}">
      {{ areanames ? areanames.join('>') : '-' }}
    </template>
    <template #time="{record: data}">
      {{ moment(data.albx0004).format('YYYY-MM-DD') + ' ~ ' + moment(data.albx0005).format('YYYY-MM-DD') }}
    </template>
    <template #description="{text:description}">
      {{ description }}
    </template>
    <template #action="record">
      <slot name="action" :record="record"> </slot>
    </template>
  </IATable>
</template>
<script>
import moment from 'moment'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { useRouter } from 'vue-router'
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { rpcPost } from '@/server/conf/index.js'
import { message } from 'ant-design-vue'
import { LocalSetProjectInfo } from '@/utils/localStorage.js'
const columns = [
  {
    title: '序号',
    slots: {
      customRender: 'serial',
    },
    width: 80,
    align: 'center',
  },
  {
    title: '项目名称',
    dataIndex: 'albx0002',
    slots: {
      customRender: 'albx0002',
    },
    ellipsis: true,
    width: '20%',
  },
  {
    title: '服务区域',
    ellipsis: true,
    key: 'areanames',
    dataIndex: 'areanames',
    slots: {
      customRender: 'areanames',
    },
    width: '20%',
  },
  {
    title: '创建时间',
    ellipsis: true,
    key: 'createtime',
    dataIndex: 'createtime',
    slots: {
      customRender: 'createtime',
    },
    customRender: ({ text }) => {
      return moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')
    },
    width: '20%',
  },
  {
    title: '项目时间',
    ellipsis: true,
    key: 'time',
    dataIndex: 'time',
    slots: {
      customRender: 'time',
    },
    width: '20%',
  },
  {
    title: '项目时长',
    dataIndex: 'albx0061',
    needTotal: true,
    customRender: ({ text }) => {
      return text + ' 小时'
    },
    width: '20%',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    slots: {
      customRender: 'action',
    },
    width: 300,
    align: 'center',
  },
]
export default defineComponent({
  props: {
    searchFunc: {
      typr: Object,
      default: {},
    },
    columns: {
      typr: Array,
      default: [],
    },
  },
  components: {
    PlusOutlined,
    // pagination,
  },
  setup(props) {
    const userInfo = ref(LocalGetUserInfo())
    const router = useRouter()
    const table = ref()
    const param = ref()
    param.value = props.searchFunc
    const searchFunc = () => {
      return param.value
    }
    const heanViewTeamInfo = (record) => {
      //查看项目
      let obj = {
        type: 'view', //查看
        isRepair: record.albx0024 == 5 ? true : false, //是否是补录项目
        isNotAudit: record.albx0073 == 12 ? true : false, //是否是审核不通过项目
        projectId: record.id,
        areaId: record.albx0021,
      }
      LocalSetProjectInfo(obj)
      router.push({
        path: '/publishProject',
      })
    }
    const getList = (queryParam, bool) => {
      //查询列表
      param.value = queryParam
      table.value.refresh(bool)
    }
    return {
      userInfo,
      props,
      searchFunc,
      columns,
      table,
      moment,
      heanViewTeamInfo,
      getList,
    }
  },
})
</script>
<style lang="scss" scoped></style>
