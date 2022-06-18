<template>
  <div class="memberManage_drawer">
    <a-drawer
      :title="'项目成员管理（' + item.albx0002 + '）'"
      :headerStyle="{ fontWeight: 800 }"
      :bodyStyle="{ padding: '12px', height: bodyH + 'px' }"
      placement="right"
      :maskClosable="false"
      :visible="visible"
      @close="onCloseMember(true)"
      width="1060px"
    >
      <div class="drawer_top">
        <BasicSearchForm>
          <searchForm isshow="1" :item="item" ref="searchFormref" @searchVol="searchVol"></searchForm>
        </BasicSearchForm>
      </div>
      <a-tabs type="card" class="teamTabs" v-model:activeKey="activeKey" @change="(e) => (activeKey = e)">
        <a-tab-pane key="2">
          <template #tab>已加入</template>
          <MemberManageTablecopy tabKey="2" :item="item" ref="volMemberTable1"></MemberManageTablecopy>
        </a-tab-pane>
        <a-tab-pane key="4" v-if="item.isshow != 4 && item.isshow != 5">
          <template #tab>邀请中</template>
          <MemberManageTablecopy tabKey="4" :item="item" ref="volMemberTable2"></MemberManageTablecopy>
        </a-tab-pane>
        <a-tab-pane key="7" v-if="item.isshow != 4 && item.isshow != 5">
          <template #tab>邀请被拒绝</template>
          <MemberManageTablecopy tabKey="7" :item="item" ref="volMemberTable3"></MemberManageTablecopy>
        </a-tab-pane>
        <template #tabBarExtraContent>
          <a-space>
            <a-button type="primary" v-if="item.isshow != 4" @click="showInviteVol"><PlusOutlined />邀请志愿者加入</a-button>
            <!-- <span v-if="activeKey == 2" @click="delectMember">批量删除成员</span> -->
            <a-button type="primary" ghost @click="batchOperation">
              <span v-if="activeKey == '2'">批量更换岗位</span>
              <span v-else-if="activeKey == '4'"><MinusOutlined />批量取消邀请</span>
              <span v-else><MinusOutlined />批量删除记录</span>
            </a-button>
          </a-space>
        </template>
      </a-tabs>
      <div
        class="drawer_bottom"
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e6e6e6',
          padding: '14px 18px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-pagination
          v-show="activeKey == '2'"
          v-model:current="pagination1.current"
          v-model:pageSize="pagination1.pageSize"
          :total="pagination1.total"
          :showTotal="pagination1.showTotal"
          @change="changePagination"
        />
        <a-pagination
          v-show="activeKey == '4'"
          v-model:current="pagination2.current"
          v-model:pageSize="pagination2.pageSize"
          :total="pagination2.total"
          :showTotal="pagination2.showTotal"
          @change="changePagination"
        />
        <a-pagination
          v-show="activeKey == '7'"
          v-model:current="pagination3.current"
          v-model:pageSize="pagination3.pageSize"
          :total="pagination3.total"
          :showTotal="pagination3.showTotal"
          @change="changePagination"
        />
      </div>
    </a-drawer>
    <!-- <stationDrawer :visible="stationvisible" :item="stationitem" @closeInviteVol="closeInviteVol"></stationDrawer> -->
    <InviteVolDrawer :visible="invitevisible" :item="inviteitem" @closeInviteVol="closeInviteVol"></InviteVolDrawer>
  </div>
</template>
<script>
// import { message } from 'ant-design-vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
// import { useRouter } from 'vue-router'
import { defineComponent, reactive, ref, toRefs, onMounted, watch, nextTick } from 'vue'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons-vue'
import apis from '@/server/request'
import searchForm from '../search/searchForm'
import InviteVolDrawer from './InviteVolDrawer'
import MemberManageTable from '../tables/MemberManageTable'
import MemberManageTablecopy from '../tables/MemberManageTablecopy'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    item: { type: Object, default: {} },
  },
  components: {
    searchForm,
    MemberManageTable,
    MemberManageTablecopy,
    InviteVolDrawer,
    PlusOutlined,
    MinusOutlined,
  },
  setup(props, { emit }) {
    // console.log(props, 'drawerdrawer')
    const userInfo = LocalGetUserInfo()
    const volMemberTable1 = ref()
    const volMemberTable2 = ref()
    const volMemberTable3 = ref()
    const searchFormref = ref()
    const activeKey = ref('2')
    const invite = reactive({
      invitevisible: false,
      inviteitem: {},
      // stationvisible: false,
      // stationitem: [],
    }) //邀请志愿者弹窗开关控制
    const paginations = reactive({
      pagination1: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) => `共${total}条，当前显示${range[0]}~${range[1]}`,
      },
      pagination2: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) => `共${total}条，当前显示${range[0]}~${range[1]}`,
      },
      pagination3: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) => `共${total}条，当前显示${range[0]}~${range[1]}`,
      },
    })
    const bodyH = ref(823)
    onMounted(() => {
      activeKey.value = '2'
    })
    const onCloseMember = (bool) => {
      emit('onCloseMember', bool)
    }

    const showInviteVol = () => {
      //弹出邀请志愿者的抽屉
      // let back = searchFormref.value.backQueryparam()
      invite.invitevisible = true
      invite.inviteitem = props.item
      // invite.inviteitem.selectpost = back.station.value //选中岗位id
      // invite.inviteitem._albx0072 = back.albx0072 //选中岗位id
    }
    const closeInviteVol = (bool) => {
      //关闭邀请志愿者抽屉
      if (bool) {
        activeKey.value == '2'
          ? volMemberTable1.value.getList()
          : activeKey.value == '4'
          ? volMemberTable2.value.getList()
          : volMemberTable3.value.getList()
      }
      invite.invitevisible = false
      invite.stationvisible = false
    }
    const searchVol = (obj) => {
      //查询传参
      if (obj.isshow == 1) {
        activeKey.value == '2'
          ? volMemberTable1.value.getqueryParam(obj.queryParam)
          : activeKey.value == '4'
          ? volMemberTable2.value.getqueryParam(obj.queryParam)
          : volMemberTable3.value.getqueryParam(obj.queryParam)
      }
    }
    const showStation = () => {
      invite.stationvisible = false
      volMemberTable1.value.showDrawer()
    }
    const batchOperation = () => {
      if (activeKey.value == '4') {
        volMemberTable2.value.cancelInvitation()
      }
      if (activeKey.value == '2') {
        volMemberTable1.value.showDrawer()
      }
      if (activeKey.value == '7') {
        volMemberTable3.value.cancelInvitation()
      }
    }
    //获取分页
    const getPagination = (page) => {
      if (activeKey.value == '2') {
        paginations.pagination1.current = page.current
        paginations.pagination1.total = page.total
      } else if (activeKey.value == '4') {
        paginations.pagination2.current = page.current
        paginations.pagination2.total = page.total
      } else {
        paginations.pagination3.current = page.current
        paginations.pagination3.total = page.total
      }
    }
    const changePagination = (pageNumber) => {
      if (activeKey.value == '2') {
        paginations.pagination1.current = pageNumber
        getChangePageList()
      } else if (activeKey.value == '4') {
        paginations.pagination2.current = pageNumber
        getChangePageList()
      } else {
        paginations.pagination3.current = pageNumber
        getChangePageList()
      }
    }
    const getChangePageList = () => {
      let res = searchFormref.value.backQueryparam()
      res.current =
        activeKey.value == '2'
          ? paginations.pagination1.current
          : activeKey.value == '4'
          ? paginations.pagination2.current
          : paginations.pagination3.current
      console.log(res, 'res')
      if (res) {
        activeKey.value == '2'
          ? volMemberTable1.value.getqueryParam(res)
          : activeKey.value == '4'
          ? volMemberTable2.value.getqueryParam(res)
          : volMemberTable3.value.getqueryParam(res)
      }
    }
    const getHeight = () => {
      window.addEventListener('resize', getHeight)
      if (document.querySelector('div.memberManage_drawer')) {
        setTimeout(() => {
          let header = document.querySelector('div.ant-drawer-header').clientHeight
          let topH = document.querySelector('div.drawer_top').clientHeight
          let bottomH = document.querySelector('div.drawer_bottom').clientHeight
          let tab = document.querySelector('div.ant-tabs-nav-wrap').clientHeight
          // 26+20查询合计的高度+合计margin 55thead的高度  tab(40px)
          bodyH.value = window.innerHeight - (header + bottomH)
          let tHeight = window.innerHeight - (header + bottomH + topH + tab + 24)
          activeKey.value == '2'
            ? volMemberTable1.value.getTH(tHeight)
            : activeKey.value == '4'
            ? volMemberTable2.value.getTH(tHeight)
            : volMemberTable3.value.getTH(tHeight)
          // console.log(bodyH, tHeight)
        }, 200)
      }
    }
    watch(
      () => props.visible,
      (visible) => {
        if (visible) {
          activeKey.value = '2'
          nextTick(() => {
            props.item.getPagination = getPagination
            searchFormref.value.init()
            searchFormref.value.getSelectStationList(props.item).then((res) => {
              if (res) {
                volMemberTable1.value.getqueryParam(res)
              }
            })
            getHeight()
          })
        } else {
          activeKey.value = '2' ? volMemberTable1.value.init() : (activeKey.value = '4' ? volMemberTable2.value.init() : volMemberTable3.value.init())
        }
      }
    )
    watch(
      () => activeKey.value,
      () => {
        nextTick(() => {
          if (props.visible) {
            getChangePageList()
            getHeight()
          }
        })
      }
    )
    return {
      activeKey,
      searchFormref,
      volMemberTable1,
      volMemberTable2,
      volMemberTable3,
      ...toRefs(props),
      ...toRefs(invite),
      onCloseMember,
      closeInviteVol,
      showInviteVol,
      showStation,
      searchVol,
      batchOperation,
      ...toRefs(paginations),
      changePagination,
      getPagination,
      bodyH,
    }
  },
})
</script>
<style lang="less" scoped>
.teamTabs :deep(.ant-tabs-nav div) {
  padding-left: 10px !important;
}
:deep(.ant-tabs-bar) {
  margin-bottom: 0px;
}
</style>
