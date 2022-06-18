<template>
  <div>
    <div class="table-page-search-wrapper table_sum">
      <a-row type="flex" justify="space-between" style="margin: 10px 0">
        <a-col :span="24">
          <span style="font-size: 16px">
            查询合计：
            <span v-if="tabKey == 2">已加入</span>
            <span v-else-if="tabKey == 4">邀请中</span>
            <span v-else>邀请被拒绝</span><span style="font-size: 16px; color: #c12a2a">{{ pagination.total }}</span
            >人</span
          >
        </a-col>
      </a-row>
    </div>
    <a-table
      :pagination="false"
      :data-source="volList"
      :rowKey="(record) => record.id"
      :columns="columns"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
      :scroll="{ y: tHeight }"
    >
      <template #serial="{ index }">
        {{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}
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
    </a-table>
    <stationDrawer :visible="visibles.showStation" :item="visibles.item" @closeStation="closeStation"></stationDrawer>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, watch, onUnmounted } from 'vue'
import { proMenberCom } from './table.js'
import apis from '@/server/request'
import { rpcPost } from '@/server/conf/index.js'
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
  setup(props, { emit }) {
    const obj = reactive({
      columns: proMenberCom.columns,
      router: useRouter(),
      visibles: {
        showStation: false, //岗位
        item: [],
      },
      queryParam: {
        albp0003: '',
        albp0005: '',
        station: { value: '', label: '' },
      },
      volList: [], //表格数据
      pagination: {
        //分页
        pageSize: 10,
        current: 1,
        total: 0,
      },
      selectedRowKeys: [], //选中列
      selectedRows: [], //选中列参数
      tHeight: 600,
    })

    const searchVol = () => {
      //查询列表
      const bean = {
        areaid: props.item.albx0021, //项目区划
        proId: props.item.id, //项目
        albx0052: obj.queryParam.station.value,
        albx0084: props.tabKey == 2 ? 'B' : props.tabKey == 4 ? 'A' : 'C',
        albx0085: props.tabKey == 2 ? null : props.tabKey, //4邀请中 2已加入 7邀请被拒绝
        albp0003: obj.queryParam.albp0003,
        albp0005: obj.queryParam.albp0005,
        pageSize: obj.pagination.pageSize,
        pageNo: obj.pagination.current,
        pageNum: obj.pagination.current,
      }
      rpcPost('getProjectVolListFortis', { bean }).then((res) => {
        if (res.code == 0 && res.data) {
          obj.volList = res.data.list
          obj.pagination.total = res.totalCount
          props.item.getPagination(obj.pagination)
        }
      })
    }
    const getList = () => {
      //父组件调用子组件查询方法
      searchVol()
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
                obj.selectedRowKeys = hasSelected(record, obj.selectedRowKeys)
                obj.selectedRows = [record]
              }
              if (obj.selectedRowKeys.length > 0) {
                obj.visibles.item = props.item
                obj.visibles.item.record = obj.selectedRows
                obj.visibles.item.selectStationList = res
                obj.visibles.showStation = true
              } else {
                Modal.info({
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
          volnums: record.albx0053,
          postid: obj.queryParam.station.value, //岗位id
          cardno: record.albp0005,
        }
        // console.log(record, 'record')
        // console.log(params, 'params')
        apis.delProjectVol(params).then((res) => {
          if (res.code == 0) {
            message.success(res.message)
            searchVol()
          } else {
            message.warning(res.message)
          }
        })
      }
    }
    const canceldelete = (params) => {
      //取消邀请+删除邀请记录
      if (props.tabKey == '4') {
        apis.cancelInvitationsInBulkVolFortis(params).then((res) => {
          if (res) {
            message.success('取消成功')
            searchVol()
          }
        })
      } else if (props.tabKey == '7') {
        apis.deleteRejectionRecordsInBulkFortis(params).then((res) => {
          if (res) {
            message.success(res)
            searchVol()
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
        albx0052: obj.queryParam.station.value, //岗位id
      }
      let list = []
      if (record) {
        list.push({ lbx02id: record.id, volid: record.albx0053 })
        params.list = list
        canceldelete(params)
      } else {
        if (obj.selectedRowKeys.length > 0) {
          obj.selectedRows.forEach((el) => {
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
      obj.selectedRowKeys = selectedKeys
      obj.selectedRows = Rows
    }
    const closeStation = (bool) => {
      //关闭更换岗位弹窗
      obj.selectedRowKeys = []
      obj.selectedRows = []
      obj.visibles.showStation = false
      obj.visibles.item = []
      if (bool) {
        searchVol()
      }
    }
    const getqueryParam = (val) => {
      //获取查询入参
      // console.log(obj)
      if (val.station.value) {
        obj.queryParam.albp0003 = val.albp0003
        obj.queryParam.albp0005 = val.albp0005
        obj.queryParam.station.value = val.station.value
        obj.pagination.current = val.current ? val.current : obj.pagination.current
        searchVol()
      }
    }
    const toVolInfo = (record) => {
      //跳转志愿者详情
      LocalSetVolunteerInfo(record)
      obj.router.push({ path: '/volunteerDetails' })
    }
    const init = () => {
      obj.selectedRowKeys = []
      obj.selectedRows = []
      obj.volList = []
    }
    const getTH = (tHeight) => {
      //查询合计
      let heji = document.querySelector('div.table_sum').clientHeight
      let thead = document.querySelector('.ant-table-thead').clientHeight
      obj.tHeight = tHeight - (heji + thead + 20)
    }
    return {
      ...toRefs(props),
      ...toRefs(obj),
      searchVol,
      getqueryParam,
      getList,
      onSelectChange,
      showDrawer,
      closeStation,
      delectMember,
      cancelInvitation,
      toVolInfo,
      init,
      getTH,
    }
  },
})
</script>

<style scoped lang="less"></style>
