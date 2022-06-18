<template>
  <div>
    <IATable
      serviceName="managementDepartmentSelProjectFortis"
      :searchParameter="searchFunc"
      ref="table"
      size="middle"
      :rowKey="(record) => record.id"
      :columns="ProjectQueryColumns"
    >
      <template #total-title="{totalData:total}">
        查询合计：项目数
        <span>
          {{ total.totals }}
        </span>
        个
      </template>
      <template #albx0002="{text,record}">
        <a @click="heanViewTeamInfo(record)" :title="text">{{ text }}</a>
      </template>
      <template #albx0016="{text,record}">
        <a @click="heanViewVolInfo(record)">{{ text }}</a>
      </template>
      <template #action="record">
        <slot name="action" :record="record.record"> </slot>
      </template>
    </IATable>
    <QueryModelTable :visible="model.visible" :item="model.item" @child="onClose2"></QueryModelTable>
  </div>
</template>
<script>
import { defineComponent, reactive, ref, toRefs, onMounted, watch, nextTick } from 'vue'
import { LocalGetUserInfo, LocalSetVolunteerInfo, LocalSetProjectInfo } from '@/utils/localStorage.js'
import { ProjectQueryColumns } from '../columns'
import { rpcPost } from '@/server/conf/index.js'
import { useRouter } from 'vue-router'
import moment from 'moment'
import QueryModelTable from './QueryModelTable' //人员表格弹窗
export default defineComponent({
  props: {
    activeKey: {
      type: String,
      default: '1',
    },
    queryParam: {
      type: Object,
      default: {},
    },
  },
  components: {
    QueryModelTable,
  },
  setup(props) {
    const router = useRouter()
    const userInfo = ref(LocalGetUserInfo())
    const table = ref()
    // const queryTotal = reactive({
    //   sumvol: 0,
    //   sumtime: 0,
    // })
    const model = reactive({
      //人员弹窗参数
      visible: false,
      item: {},
    })
    // const getVolTotal = async () => {
    //   //查询统计数据
    //   let bean = {
    //     areaid:
    //       props.queryParam.areaid.length > 0
    //         ? props.queryParam.areaid[props.queryParam.areaid.length - 1]
    //         : userInfo.value.areaLevel == '0'
    //         ? '110000000000000000'
    //         : userInfo.value.areaid,
    //     albx0002: props.queryParam.albx0002 ? props.queryParam.albx0002 : null,
    //     albx0013: props.queryParam.albx0013 ? props.queryParam.albx0013 : null,
    //     albx0072: props.activeKey == 1 ? 3 : props.activeKey == 2 ? 5 : 7, //7停用 6补录 5已结项 4运行中 3待启动
    //     albx0072A: props.activeKey == 1 ? 4 : props.activeKey == 2 ? 6 : null,
    //     albx0024: props.queryParam.albx0024 ? props.queryParam.albx0024 : null,
    //     albx0009: props.queryParam.albx0009 ? props.queryParam.albx0009 : null,
    //     albx0014: props.queryParam.albx0014 ? props.queryParam.albx0014 : null,
    //     albx0061: props.queryParam.albx0061 ? props.queryParam.albx0061 : null,
    //     // albx0073: props.activeKey == 3 ? 1 : null, //0启用 1停用
    //     minPerson: props.queryParam.minPerson ? props.queryParam.minPerson : null,
    //     maxPerson: props.queryParam.maxPerson ? props.queryParam.maxPerson : null,
    //     minTime: props.queryParam.minTime ? props.queryParam.minTime : null,
    //     maxTime: props.queryParam.maxTime ? props.queryParam.maxTime : null,
    //     minDay: props.queryParam.minDay ? moment(new Date(props.queryParam.minDay)).format('YYYY-MM-DD') : null,
    //     maxDay: props.queryParam.maxDay ? moment(new Date(props.queryParam.maxDay)).format('YYYY-MM-DD') : null,
    //   }
    //   const res = await rpcPost('sumManagementDepartmentSelProjectFortis', { bean })
    //   if (res && res.code == '0' && res.data) {
    //     queryTotal.sumvol = res.data.sumvol
    //     queryTotal.sumtime = res.data.sumtime
    //   }
    // }
    const searchFunc = () => {
      // getVolTotal()
      return {
        areaid:
          props.queryParam.areaid.length > 0
            ? props.queryParam.areaid[props.queryParam.areaid.length - 1]
            : userInfo.value.areaLevel == '0'
            ? '110000000000000000'
            : userInfo.value.areaid,
        albx0002: props.queryParam.albx0002 ? props.queryParam.albx0002 : null,
        albx0013: props.queryParam.albx0013 ? props.queryParam.albx0013 : null,
        albx0072: props.activeKey == 1 ? 3 : props.activeKey == 2 ? 5 : 7, //7停用 6补录 5已结项 4运行中 3待启动
        albx0072A: props.activeKey == 1 ? 4 : props.activeKey == 2 ? 6 : null,
        albx0024: props.queryParam.albx0024 ? props.queryParam.albx0024 : null,
        albx0009: props.queryParam.albx0009 ? props.queryParam.albx0009 : null,
        albx0014: props.queryParam.albx0014 ? props.queryParam.albx0014 : null,
        albx0061: props.queryParam.albx0061 ? props.queryParam.albx0061 : null,
        // albx0073: props.activeKey == 3 ? 1 : null, //0启用 1停用
        minPerson: props.queryParam.minPerson ? props.queryParam.minPerson : null,
        maxPerson: props.queryParam.maxPerson ? props.queryParam.maxPerson : null,
        minTime: props.queryParam.minTime ? props.queryParam.minTime : null,
        maxTime: props.queryParam.maxTime ? props.queryParam.maxTime : null,
        minDay: props.queryParam.minDay ? moment(new Date(props.queryParam.minDay)).format('YYYY-MM-DD') : null,
        maxDay: props.queryParam.maxDay ? moment(new Date(props.queryParam.maxDay)).format('YYYY-MM-DD') : null,
      }
    }

    const getList = (bool) => {
      table.value.refresh(bool)
    }

    const getheight = () => {
      table.value.getheight()
    }

    const heanViewTeamInfo = (record) => {
      //查看项目详情
      let obj = {
        type: 'view', //查看
        isRepair: record.albx0072 == 6 ? true : false, //是否是补录不通过项目
        isNotAudit: record.albx0073 == 12 ? true : false, //是否是审核不通过项目
        projectId: record.id,
        areaId: record.albx0021,
      }
      // localStorage.setItem('projectQuery', JSON.stringify(obj))
      LocalSetProjectInfo(obj)
      router.push({
        path: '/publishCmsProject',
      })
    }

    const heanViewVolInfo = (record) => {
      //查看人员详情
      model.item = record
      model.visible = true
    }

    const onClose2 = () => {
      //关闭人员弹窗
      model.visible = false
    }

    return {
      model,
      props,
      // queryTotal,
      ProjectQueryColumns,
      getList,
      getheight,
      table,
      searchFunc,
      heanViewVolInfo,
      // ...toRefs(queryTotal),
      heanViewTeamInfo,
      onClose2,
    }
  },
})
</script>
<style scoped></style>
