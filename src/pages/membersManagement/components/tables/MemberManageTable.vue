<template>
  <div>
    <IATable
      serviceName="getProjectVolListFortis"
      :searchParameter="searchVol"
      ref="volMemberTable"
      size="middle"
      :rowKey="(record) => record.id"
      :columns="columns"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
    >
      <template #total-title="{ totalData }">
        查询合计：
        <span v-if="tabKey == 2">已加入</span>
        <span v-else-if="tabKey == 4">邀请中</span>
        <span v-else>邀请被拒绝</span>
        <span>
          {{ totalData.totals }}
        </span>
        人。
      </template>
      <template #name="{ text, record }">
        <a href="javascript:void(0)" @click.prevent="toVolInfo(record)">{{ text }}</a>
      </template>
      <template #albp0006="{ text }">
        {{ text == 2 ? '女' : '男' }}
      </template>
      <template #action="{ record }">
        <a-space>
          <a-button type="primary" size="small" v-show="tabKey == 2" @click="showDrawer(record)"> 更换岗位</a-button>
          <a-button type="primary" size="small" v-show="tabKey == 2" ghost @click="delectMember(record)"> 删除成员 </a-button>
          <a-button type="primary" size="small" v-show="tabKey == 4" @click="cancelInvitation(record)"> 取消邀请 </a-button>
          <a-button type="primary" size="small" v-show="tabKey == 7" @click="cancelInvitation(record)"> 删除记录 </a-button>
        </a-space>
      </template>
    </IATable>
    <stationDrawer :visible="showStation" :item="item" @closeStation="closeStation"></stationDrawer>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, watch } from 'vue'
import { proMenberCom } from './table.js'
import apis from '@/server/request'
import { useRouter } from 'vue-router'
import { Modal, message } from 'ant-design-vue'
import { hasSelected } from './hasSelected'
import { LocalSetVolunteerInfo } from '@/utils/localStorage.js'
import stationDrawer from '../drawer/stationDrawer'
export default defineComponent({
  props: {
    tabKey: {
      type: String,
      default: '2',
    },
    item: { type: Object },
  },
  components: {
    stationDrawer,
  },
  setup(props) {
    const columns = ref(proMenberCom.columns)
    const volMemberTable = ref()
    const router = useRouter()
    const visibles = reactive({
      showStation: false,
      item: [],
    })
    const queryParam = reactive({
      albp0003: '',
      albp0005: '',
      station: { value: '' },
    })
    const selectedRowKeys = ref()
    selectedRowKeys.value = []
    const selectedRows = ref()
    const searchVol = () => {
      console.log(props, '======================')
      return {
        areaid: props.item.albx0021, //项目区划
        proId: props.item.id, //项目
        albx0052: queryParam.station.value,
        albx0084: props.tabKey == 2 ? 'B' : props.tabKey == 4 ? 'A' : 'C',
        albx0085: props.tabKey == 2 ? null : props.tabKey, //4邀请中 2已加入 7邀请被拒绝
        albp0003: queryParam.albp0003,
        albp0005: queryParam.albp0005,
      }
    }
    const getList = () => {
      volMemberTable.value.refresh()
    }
    const showDrawer = (record) => {
      //更换岗位
      const params = {
        proid: props.item.id, //xiangmuid
        areaid: props.item.albx0021, //项目区划
      }
      apis
        .commonChangeJobFortis(params) //
        .then((res) => {
          // console.log('岗位名称', res)
          if (res) {
            if (res.length > 1) {
              if (record) {
                selectedRowKeys.value = hasSelected(record, selectedRowKeys)
                selectedRows.value = [record]
              }
              if (selectedRowKeys.value.length > 0) {
                visibles.item = props.item
                visibles.item.record = selectedRows.value
                visibles.item.selectStationList = res
                visibles.showStation = true
              } else {
                Modal.warning({
                  title: () => '请勾选你需要批量更换岗位的成员，点击志愿者名称左侧按钮即可勾选',
                  okText: '关闭',
                })
              }
            } else {
              message.warning('此项目只有一个岗位，无法更换')
            }
          }
        })
    }
    const delectMember = (record) => {
      //删除成员
      if (record.albx0083 != 0) {
        Modal.info({
          title: '此志愿者有存在的服务时长，请先删除时长记录再操作',
          okText: '确定',
        })
      } else {
        const params = {
          areaid: props.item.albx0021, //项目区划
          projectid: props.item.id, //项目id
          ids: record.id, //列表id
          volnums: record.albx0053, //
          postid: queryParam.station.value, //岗位id
          cardno: record.albp0005,
        }
        apis.delProjectVol(params).then((res) => {
          if (res.code == 0) {
            message.success(res.message)
            volMemberTable.value.refresh()
          } else {
            message.warning(res.message)
          }
        })
        // apis.delProjectVol(params).then((res) => {
        //   if (res) {
        //     message.success(res)
        //     volMemberTable.value.refresh()
        //   }
        // })
      }
    }
    const canceldelete = (params) => {
      //取消邀请+删除邀请记录
      if (props.tabKey == '4') {
        apis.cancelInvitationsInBulkVolFortis(params).then((res) => {
          if (res) {
            message.success('取消成功')
            volMemberTable.value.refresh()
          }
        })
      } else if (props.tabKey == '7') {
        apis.deleteRejectionRecordsInBulkFortis(params).then((res) => {
          if (res) {
            message.success(res)
            volMemberTable.value.refresh()
          }
        })
      }
    }
    const cancelInvitation = (record) => {
      //取消邀请
      const params = {
        areaid: props.item.albx0021, //项目区划
        proId: props.item.id, //项目id
        // list:[],//lbx02表id(lbx02id)和志愿者编号(volid)
        albx0052: queryParam.station.value, //岗位id
      }
      let list = []
      if (record) {
        list.push({ lbx02id: record.id, volid: record.albx0053 })
        params.list = list
        canceldelete(params)
      } else {
        if (selectedRowKeys.value.length > 0) {
          selectedRows.value.forEach((el) => {
            list.push({ lbx02id: el.id, volid: el.albx0053 })
          })
          params.list = list
          canceldelete(params)
        } else {
          Modal.info({
            title: () => '请勾选你需要批量取消邀请的成员，点击志愿者名称左侧按钮即可勾选',
            okText: '关闭',
          })
        }
      }
    }
    const onSelectChange = (selectedKeys, Rows) => {
      selectedRowKeys.value = selectedKeys
      selectedRows.value = Rows
    }
    const closeStation = (bool) => {
      selectedRowKeys.value = []
      selectedRows.value = []
      visibles.showStation = false
      visibles.item = []
      if (bool) {
        volMemberTable.value.refresh()
      }
    }
    const getqueryParam = (obj) => {
      console.log(obj)
      if (obj.station.value) {
        queryParam.albp0003 = obj.albp0003
        queryParam.albp0005 = obj.albp0005
        queryParam.station.value = obj.station.value
        volMemberTable.value.refresh()
      }
    }
    const toVolInfo = (record) => {
      LocalSetVolunteerInfo(record)
      router.push({ path: '/volunteerDetails' })
    }
    // watch(
    //   () => props.queryParam,
    //   (val) => {}
    // )
    return {
      columns,
      volMemberTable,
      ...toRefs(props),
      ...toRefs(visibles),
      searchVol,
      getqueryParam,
      getList,
      onSelectChange,
      selectedRowKeys,
      showDrawer,
      closeStation,
      delectMember,
      cancelInvitation,
      toVolInfo,
    }
  },
})
</script>

<style scoped lang="less"></style>
