<template>
  <!-- 时长录入项目表格-->
  <div>
    <IATable
      serviceName="listGroupPublishProjectFortis"
      :searchParameter="searchFunc"
      ref="table"
      size="middle"
      :rowKey="(record) => record.id"
      :columns="columns"
    >
      <template #total-title="{totalData:total}">
        查询合计：项目数
        <span>
          {{ total.sumpro }}
        </span>
        个，总服务时长
        <span>
          {{ total.sumtime }}
        </span>
        小时， 项目人数
        <span>
          {{ total.sumvol }}
        </span>
        人。
      </template>
      <template #albx0002="{text,record}">
        <a @click="heanViewTeamInfo(record)" :title="text">{{ text }}</a>
      </template>
      <template #action="{record}">
        <a-space>
          <a-button type="primary" size="small" v-show="isshow == 1" @click="showDrawer(1, record)">
            录入时长
          </a-button>
          <a-button type="primary" size="small" v-show="isshow == 1" @click="showDrawer(2, record)" ghost>
            录入记录
          </a-button>
          <a-button type="primary" size="small" v-show="isshow == 2 || isshow == 4 || isshow == 5" @click="showDrawer(3, record)">
            成员管理
          </a-button>
          <a-button type="primary" size="small" v-show="isshow == 3" @click="showDrawer(4, record)">
            查看记录明细
          </a-button>
          <!-- <a-button type="primary" size="small" v-show="isshow == 4" @click="showDrawer(5, record)">
            项目评价
          </a-button> -->
          <a-button type="primary" size="small" v-show="isshow == 5" @click="showDrawer(6, record)">
            导入系统外成员
          </a-button>
        </a-space>
      </template>
    </IATable>
    <TimeEntryDrawer :visible="entryvisible" :item="entryitem" @onCloseMember="onCloseMember" />
    <EntryRecordDrawer :visible="recordvisible" :item="recorditem" @onCloseMember="onCloseMember" />
    <MemberManageDrawer :visible="membervisible" :item="memberitem" @onCloseMember="onCloseMember"></MemberManageDrawer>
    <OperationDetailDrawer :visible="operationvisible" :item="operationitem" @onCloseMember="onCloseMember"></OperationDetailDrawer>
    <!-- 项目评价 -->
    <ProEvaluateDrawer :visible="evaluatevisible" :item="evaluateitem" @onCloseMember="onCloseMember"></ProEvaluateDrawer>
    <!-- 导入系统外成员 -->
    <AddOutMemberDrawer :visible="ousidevisible" :item="outsideitem" @onCloseMember="onCloseMember"></AddOutMemberDrawer>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, watch } from 'vue'
import { LocalGetUserInfo, LocalSetProjectInfo } from '@/utils/localStorage.js'
import apis from '@/server/request'
import { useRouter } from 'vue-router'
import { timeEntryCom } from './table'
import TimeEntryDrawer from '../drawers/TimeEntryDrawer.vue'
import EntryRecordDrawer from '../drawers/EntryRecordDrawer'
import MemberManageDrawer from '../../../membersManagement/components/drawer/MemberManageDrawer'
import OperationDetailDrawer from '../drawers/OperationDetailDrawer.vue'
import ProEvaluateDrawer from '../../../membersManagement/components/drawer/ProEvaluateDrawer'
import AddOutMemberDrawer from '../../../membersManagement/components/drawer/AddOutMemberDrawer'
export default defineComponent({
  components: {
    TimeEntryDrawer,
    EntryRecordDrawer,
    MemberManageDrawer,
    OperationDetailDrawer,
    ProEvaluateDrawer,
    AddOutMemberDrawer,
  },
  props: {
    tabKey: {
      type: String,
    },
    isshow: {
      type: Number, //控制显示按钮
    },
    queryParam: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const columns = reactive(timeEntryCom.columns)
    const userInfo = ref(LocalGetUserInfo())
    const table = ref()
    const router = useRouter()
    const visible = reactive({
      membervisible: false,
      memberitem: {},
      entryvisible: false,
      entryitem: {
        selectStationList: [],
      },
      recordvisible: false,
      recorditem: {},
      operationvisible: false,
      operationitem: {},
      evaluatevisible: false,
      evaluateitem: {},
      ousidevisible: false,
      outsideitem: {},
    })
    const searchFunc = () => {
      return {
        teamId: userInfo.value.team.groupid,
        albx0021:
          userInfo.value.areaLevel == 0
            ? props.queryParam.albx0021.length > 0
              ? props.queryParam.albx0021[props.queryParam.albx0021.length - 1]
              : '100000000000000000'
            : userInfo.value.areaid,
        albx0072: props.tabKey, //1 运行中 2已结项 3 补录
        albx0002: props.queryParam.albx0002 ? props.queryParam.albx0002 : null,
      }
    }
    const getList = () => {
      table.value.refresh()
    }
    const showDrawer = (val, record) => {
      const params = {
        proId: record.id, //,
        areaid: record.albx0021,
      }
      //console.log('岗位名称传参', params)
      apis.commonChangeJobFortis(params).then((res) => {
        // console.log('岗位名称', res)
        if (res) {
          if (val == 1) {
            visible.entryitem = record
            visible.entryitem.selectStationList = res
            visible.entryvisible = true
          } else if (val == 2) {
            visible.recordvisible = true
            visible.recorditem = record
            visible.recorditem.selectStationList = res
          } else if (val == 3) {
            visible.membervisible = true
            visible.memberitem = record
            visible.memberitem.isshow = props.isshow
            visible.memberitem.selectStationList = res
          } else if (val == 4) {
            visible.operationvisible = true
            visible.operationitem = record
            visible.operationitem.selectStationList = res
          } else if (val == 5) {
            visible.evaluatevisible = true
            visible.evaluateitem = record
            visible.evaluateitem.selectStationList = res
          } else {
            visible.outsideitem = record
            visible.outsideitem.selectStationList = res
            visible.ousidevisible = true
          }
        }
      })
    }
    const onCloseMember = (bool) => {
      visible.membervisible = false
      visible.memberitem = { selectStationList: [] }
      visible.entryvisible = false
      visible.entryitem = { selectStationList: [] }
      visible.recordvisible = false
      visible.recorditem = { selectStationList: [] }
      visible.operationvisible = false
      visible.operationitem = { selectStationList: [] }
      visible.evaluatevisible = false
      visible.evaluateitem = { selectStationList: [] }
      visible.ousidevisible = false
      visible.outsideitem = { selectStationList: [] }
      if (bool) {
        table.value.refresh()
      }
    }
    const heanViewTeamInfo = (record) => {
      let obj = {
        type: 'view', //查看
        isRepair: props.tabKey == 6 ? true : false, //是否是补录项目
        projectId: record.id,
        areaId: record.albx0021,
      }
      // localStorage.setItem('projectQuery', JSON.stringify(obj))
      LocalSetProjectInfo(obj)
      router.push({
        path: '/publishProject',
      })
    }

    watch(
      () => props.queryParam,
      () => {}
    )
    return {
      columns,
      searchFunc,
      showDrawer,
      ...toRefs(visible),
      ...toRefs(props),
      getList,
      table,
      onCloseMember,
      heanViewTeamInfo,
    }
  },
})
</script>

<style scoped lang="less">

</style>
