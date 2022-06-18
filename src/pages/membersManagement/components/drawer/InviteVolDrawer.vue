<template>
  <div class="invite_drawer">
    <a-drawer title="邀请志愿者" :bodyStyle="{ padding: '12px', height: drawerBodyH + 'px', overflow: 'hidden' }" placement="right" :visible="visible" :maskClosable="false" width="900px" @close="closeInviteVol">
      <a-tabs type="card" class="teamTabs" v-model:activeKey="activeKey">
        <a-tab-pane key="1" :tab="userInfo.team.albe0003 == 1 ? '邀请本队伍成员' : '邀请本队伍及直属团体成员'">
          <div class="inviteDrawer_div">
            <div style="padding-top:12px">
              提示：选择你需要添加成员的岗位，注意，同一个项目下志愿者只能加入一个岗位
            </div>
            <BasicSearchForm><searchForm isshow="2" :item="item" @searchVol="inviteSearch" ref="inviteRef"></searchForm></BasicSearchForm>
            <a-row type="flex" justify="end">
              <a-col>
                <a-button type="primary" style="margin-bottom:8px" @click="inviteToJoin(false)">批量邀请</a-button>
              </a-col>
            </a-row>
          </div>
          <a-table
            :pagination="false"
            :data-source="teamData"
            ref="inviteTable"
            :rowKey="(record) => record.id"
            :columns="columns"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
            :scroll="{ y: height1 }"
          >
            <template #action="{record}">
              <a-button size="small" type="primary" @click="inviteToJoin(record)">邀请加入</a-button>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="2" tab="邀请队伍外成员">
          <div class="outside_form">
            <BasicSearchForm>
              <a-form
                :model="searchParam"
                :rules="{
                  cardno: [{ validator: validatePass, trigger: 'blur' }],
                }"
                ref="outsideorgRef"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 17 }"
              >
                <div style="color:#d92f2f">批量邀请：可陆续输入身份证查询并勾选志愿者</div>
                <a-row>
                  <a-col :md="8" :sm="24">
                    <a-form-item label="岗位名称">
                      <a-select label-in-value v-model:value="selectStation.station">
                        <a-select-option :value="el.id" v-for="(el, index) in selectStationList" :key="index">{{ el.albx0072 }}</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :md="8" :sm="24">
                    <a-form-item label="身份证号" name="cardno">
                      <a-input :maxLength="18" placeholder="请输入身份证号搜索" v-model:value="searchParam.cardno" />
                    </a-form-item>
                  </a-col>
                  <a-col :offset="1" :md="7" :sm="24">
                    <a-form-item>
                      <a-space>
                        <a-button type="primary" @click="searchCardno">
                          查询
                        </a-button>
                        <a-button @click="resetForm">
                          重置
                        </a-button>
                      </a-space>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </BasicSearchForm>
            <div class="table-page-search-wrapper">
              <a-row type="flex" justify="space-between" style="margin:10px 0">
                <a-col :span="4">
                  <span style="font-size:16px;"> 已选择: {{ selectedRowKeys2.length ? selectedRowKeys2.length : 0 }} / 50人 </span>
                </a-col>
              </a-row>
            </div>
          </div>
          <a-table
            :pagination="pagination"
            :columns="volcolumns"
            ref="voltable"
            :data-source="dataSource"
            :rowKey="(record) => record.albp0005"
            :row-selection="{
              selectedRowKeys: selectedRowKeys2,
              onChange: onSelectChange2,
            }"
            :scroll="{ y: height2 }"
          >
            <template #serial="{index}">
              {{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
      <div
        v-show="activeKey == 1"
        class="drawer_page"
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-pagination v-model:current="teamPage.current" v-model:pageSize="teamPage.pageSize" :total="teamPage.total" :showTotal="teamPage.showTotal" @change="changeTeamPage" />
      </div>
      <div
        class="drawer_bottom"
        v-show="activeKey == 2"
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-row type="flex" justify="end">
          <a-col>
            <a-button type="primary" :disabled="isdisabled" @click="inviteToJoin(false)">
              开始添加
            </a-button>
          </a-col>
        </a-row>
      </div>
    </a-drawer>
    <a-modal v-model:visible="showmodal" title="错误原因展示" :footer="null" width="60%">
      <a-table :columns="msgcolumns" :data-source="msgList" :pagination="false" :rowKey="(record) => record.cardno">
        <template #msg="{text}">
          <span style="color:#db0000">{{ text }}</span>
        </template>
      </a-table>
      <div style="text-align:right;width:'800px'">
        <a-button @click="closeModal">关闭</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { message, Modal } from 'ant-design-vue'
import { MinusCircleOutlined } from '@ant-design/icons-vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
// import { useRouter } from 'vue-router'
import { defineComponent, reactive, ref, toRefs, onMounted, watch, nextTick } from 'vue'
import apis from '@/server/request'
import { checkCardNo } from '@/utils/publicMethods/common'
import searchForm from '../search/searchForm'
import { proMenberCom, addCom, addMemberCom } from '../tables/table'
import MemberManageTable from '../tables/MemberManageTable'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    item: { type: Object, default: {} },
  },
  components: {
    MemberManageTable,
    MinusCircleOutlined,
    searchForm,
  },
  setup(props, { emit }) {
    // console.log(props, 'inviteDrawer')
    const userInfo = ref(LocalGetUserInfo())
    console.log(userInfo.value, '//////////////')
    const inviteRef = ref()
    const outsideorgRef = ref()
    const inviteTable = ref()
    const columns = ref(proMenberCom.columns2)
    const volcolumns = ref(addMemberCom.columns)
    const msgcolumns = ref(addCom.columns2)
    const msgList = ref() //对话框错误展示
    const showmodal = ref(false) //对话框显示影藏
    const activeKey = ref('1')
    const selectStationList = ref()
    const selectedRowKeys = ref([])
    const selectedRows = ref([])
    const selectedRowKeys2 = ref([])
    const selectedRows2 = ref([])
    const searchParam = reactive({
      //邀请队伍外成员加入队伍的查询条件
      cardno: '', //身份证
    })
    const selectStation = reactive({
      station: { value: '', label: '' },
    })
    const queryParam = reactive({
      station: '', //岗位id
      albx0072: '',
      groupid: '',
      name: '',
      albp0005: '',
      areaid: '',
    }) //岗位id name
    let dataSource = ref()
    dataSource.value = []
    const voltable = ref()
    const isdisabled = ref(true)
    let pagination = reactive({
      pageSize: 8,
      current: 1,
      showQuickJumper: false,
      total: dataSource.value.length,
      showLessItems: true,
      showTotal: (total, range) => `共${total}条，当前显示${range[0]}~${range[1]}`,
      onChange: (pageNumber) => {
        voltable.value.pagination.current = pageNumber
      },
    })
    const h = reactive({
      height1: 500,
      height2: 500,
      drawerBodyH: 827,
      teamData: [],
      teamPage: {
        pageSize: 9,
        current: 1,
        showQuickJumper: false,
        total: 0,
        showLessItems: true,
        showTotal: (total, range) => `共${total}条，当前显示${range[0]}~${range[1]}`,
      },
    })
    onMounted(() => {
      //获取当前登录队伍下属队伍
    })
    // #region
    const getstation = () => {
      // 获取当前项目岗位名称
      apis.commonChangeJobFortis({ proId: props.item.id, areaid: props.item.albx0021 }).then((res) => {
        if (res) {
          // console.log(res, '邀请队伍外成员获取岗位')
          selectStationList.value = res
          selectStation.station.value = res[0].id
          selectStation.station.label = res[0].albx0072
        }
      })
    }
    const searchParameter = () => {
      const bean = {
        id: queryParam.groupid ? queryParam.groupid : userInfo.value.team.groupid, //队伍id
        areaid: queryParam.areaid ? queryParam.areaid : userInfo.value.areaid, //队伍区划
        name: queryParam.name ? queryParam.name : null, //姓名
        albp0005: queryParam.albp0005 ? queryParam.albp0005 : null, //身份证
        pageSize: h.teamPage.pageSize,
        pageNo: h.teamPage.current,
        pageNum: h.teamPage.current,
      }
      apis.queryTeamMemberPageFortis(bean).then((res) => {
        if (res && res.data) {
          h.teamData = res.data
          h.teamPage.total = res.totalCount
        }
      })
    }
    // #endregion
    const onSelectChange = (selectedKeys, Rows) => {
      selectedRowKeys.value = selectedKeys
      selectedRows.value = Rows
    }
    const onSelectChange2 = (selectedKeys, Rows) => {
      selectedRowKeys2.value = selectedKeys
      selectedRows2.value = Rows
      if (selectedRowKeys2.value.length > 0) {
        isdisabled.value = false
      } else {
        isdisabled.value = true
      }
    }
    const closeInviteVol = (val) => {
      //关闭当前页
      emit('closeInviteVol', val)
    }
    const inviteSearch = (obj) => {
      //查询重置
      // console.log(obj, 'objobjobj')
      if (obj.isshow == 2) {
        queryParam.station = obj.queryParam.station.value //岗位id
        queryParam.albx0072 = obj.queryParam.albx0072
        queryParam.groupid = obj.queryParam.org.value
        queryParam.areaid = obj.queryParam.orgAreaid
        queryParam.name = obj.queryParam.albp0003
        queryParam.albp0005 = obj.queryParam.albp0005
      }
      searchParameter()
    }
    const Join = (params) => {
      if (activeKey.value == '1') {
        apis.addGroupVolInProject(params).then((res) => {
          if (res) {
            if (res.data.length > 0) {
              // console.log(res.data)
              msgList.value = res.data
              showmodal.value = true
            } else {
              selectedRows.value = []
              selectedRowKeys.value = []
              message.success('邀请加入' + res.message)
              closeInviteVol(true)
            }
          }
        })
      } else {
        apis.addManyProjectMember(params).then((res) => {
          if (res) {
            if (res.data.length > 0) {
              // console.log(res.data)
              msgList.value = res.data
              showmodal.value = true
            } else {
              message.success('邀请加入' + res.message)
              selectedRows2.value = []
              selectedRowKeys2.value = []
              searchParam.cardno = ''
              closeInviteVol(true)
            }
          }
        })
      }
    }
    const inviteToJoin = (record) => {
      //邀请志愿者加入
      let back = inviteRef.value.backQueryparam()
      queryParam.station = back.station.value //岗位id
      queryParam.albx0072 = back.station.label
      const params = {
        projectId: props.item.id, //项目id
        positionId: activeKey.value == '1' ? queryParam.station : selectStation.station.value, //岗位id
        albx0072: activeKey.value == '1' ? queryParam.albx0072 : selectStation.station.label.children ? selectStation.station.label.children : selectStation.station.label, //岗位名称
        areaId: props.item.albx0021, //项目区划
        // list: [], //志愿者信息集合
      }
      props.item.isshow == 5 ? (params.type = 1) : false
      let list = []
      if (record) {
        list.push({ albp0003: record.albp0003, cardno: record.albp0005 })
        params.list = list
        // console.log(params, ' //邀请志愿者加入')
        Join(params)
      } else {
        if (selectedRowKeys.value.length > 0 || selectedRowKeys2.value.length > 0) {
          Modal.confirm({
            title: '是否确认批量邀请志愿者',
            cancelText: '取消',
            okText: '确认',
            onOk: () => {
              if (activeKey.value == '1') {
                selectedRows.value.forEach((e) => {
                  list.push({ albp0003: e.albp0003, cardno: e.albp0005 })
                })
              } else {
                selectedRows2.value.forEach((e) => {
                  list.push({ albp0003: e.albp0003, cardno: e.albp0005 })
                })
              }
              params.list = list
              // console.log(params, ' //邀请志愿者加入')
              Join(params)
            },
          })
        } else {
          Modal.info({
            title: '请勾选你需要批量邀请的志愿者，点击志愿者名称左侧按钮即可勾选',
            okText: '关闭',
          })
        }
      }
    }
    const closeModal = () => {
      msgList.value = []
      showmodal.value = false
      closeInviteVol(false)
    }
    const resetForm = () => {
      searchParam.cardno = '' //身份证
    }
    const searchCardno = () => {
      outsideorgRef.value
        .validate()
        .then(() => {
          // .getVolunteerAndProjectInfo({
          apis
            .getVolunteerAndProjectInfo({
              cardno: searchParam.cardno,
              areaid: props.item.albx0021, //项目区划
            })
            .then((res) => {
              if (res && res.albp0005) {
                if (dataSource.value.length == 0) {
                  dataSource.value.push(res)
                  pagination.total = dataSource.value.length
                } else {
                  if (
                    dataSource.value.every((e) => {
                      return e.albp0005 != res.albp0005
                    })
                  ) {
                    dataSource.value.unshift(res)
                    pagination.total = dataSource.value.length
                  } else {
                    message.warning('下方列表中已存在该志愿者')
                  }
                }
              } else {
                message.error(res.message)
              }
            })
        })
        .catch((e) => {
          console.log(e)
        })
    }
    let validatePass = async (rule, value) => {
      if (!value) {
        return Promise.reject('身份证号不能为空')
      } else {
        if (checkCardNo(value)) {
          return Promise.resolve()
        } else {
          return Promise.reject('身份证号格式输入不正确')
        }
      }
    }
    const inviteHeight = () => {
      window.addEventListener('resize', inviteHeight)
      if (document.querySelector('div.invite_drawer')) {
        setTimeout(() => {
          let headH = document.querySelector('div.ant-drawer-header').clientHeight
          let thead = document.querySelector('.ant-table-thead').clientHeight //表头高度
          if (activeKey.value == '1') {
            let formHt = document.querySelector('div.inviteDrawer_div').clientHeight //选择条件高度
            let btnHeight = document.querySelector('div.drawer_page').clientHeight
            h.drawerBodyH = window.innerHeight - (55 + 55) //drawerbody的高度
            h.height1 = window.innerHeight - (headH + thead + 40 + 24 + formHt + btnHeight)
          } else {
            let formHt = document.querySelector('div.outside_form').clientHeight
            let btnHeight = document.querySelector('div.drawer_bottom').clientHeight
            //24drawerbody的padding  40tab头
            h.drawerBodyH = window.innerHeight - (headH + btnHeight)
            h.height2 = window.innerHeight - (headH + btnHeight + 40 + 24 + formHt + thead)
          }
        }, 200)
      }
    }
    watch(
      () => props.visible,
      (visible) => {
        if (visible) {
          activeKey.value = '1'
          nextTick(() => {
            for (let key in queryParam) {
              queryParam[key] = ''
            }
            inviteRef.value.getSelectStationList(props.item).then((res) => {
              if (res) {
                queryParam.name = res.albp0003
                queryParam.albp0005 = res.albp0005 //身份证
                queryParam.groupid = res.org.value
                queryParam.station = res.station.value
                queryParam.albx0072 = res.albx0072
                queryParam.areaid = res.orgAreaid
                searchParameter()
              }
            }) //获取岗位和当前选择队伍 返回queryParam
          })
          getstation()
          inviteHeight()
        } else {
          dataSource.value = []
          selectedRows.value = []
          selectedRows2.value = []
          selectedRowKeys.value = []
          searchParam.cardno = ''
          h.teamPage.current = 1
          pagination.current = 1
          selectedRowKeys2.value = []
        }
      }
    )
    const changeTeamPage = (pageNumber) => {
      h.teamPage.current = pageNumber
      searchParameter()
    }
    watch(activeKey, (val) => {
      if (val == '2') {
        nextTick(() => {
          getHeight(2)
        })
      }
    })
    watch(
      () => msgList,
      () => {}
    )
    return {
      ...toRefs(props),
      ...toRefs(h),
      userInfo,
      activeKey,
      searchParameter,
      inviteRef,
      outsideorgRef,
      inviteTable,
      searchParam,
      selectStation,
      columns,
      volcolumns,
      msgcolumns,
      selectedRowKeys,
      selectedRowKeys2,
      onSelectChange,
      onSelectChange2,
      inviteToJoin,
      closeInviteVol,
      dataSource,
      isdisabled,
      inviteSearch,
      msgList,
      showmodal,
      closeModal,
      resetForm,
      searchCardno,
      selectStationList,
      validatePass,
      pagination,
      voltable,
      changeTeamPage,
    }
  },
})
</script>
<style lang="less" scoped>
.teamTabs :deep(.ant-tabs-nav div) {
  padding-left: 10px !important;
}
.ant-table td {
  white-space: nowrap;
}
:deep(.ant-tabs-bar) {
  margin-bottom: 0px;
}
</style>
