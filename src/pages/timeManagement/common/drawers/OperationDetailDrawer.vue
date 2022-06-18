<template>
  <a-drawer
    class="operationDetail_drawer"
    title="时长记录明细"
    placement="right"
    :visible="visible"
    :bodyStyle="{ padding: '0.75rem', height: bodyH + 'px' }"
    :maskClosable="false"
    @close="onClose(true)"
    width="1060px"
  >
    <div class="drawer_top">
      <BasicSearchForm>
        <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" :model="queryParam">
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item label="姓名搜索">
                <a-input v-model:value="queryParam.albp0003"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="录入方式">
                <a-select label-in-value v-model:value="queryParam.albx0173" style="width: 80%" @change="changeStation">
                  <a-select-option value=""> 全部 </a-select-option>
                  <a-select-option value="1"> 手动录入 </a-select-option>
                  <a-select-option value="2"> 申请录入 </a-select-option>
                  <a-select-option value="4"> 签到录入 </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="录入时间">
                <a-date-picker v-model:value="queryParam.albx0178" @change="changeDate" />
              </a-form-item>
            </a-col>
            <a-col :offset="1" :md="5" :sm="24">
              <a-form-item>
                <a-space>
                  <a-button type="primary" @click="search(1)">查询</a-button>
                  <a-button @click="search(2)">重置</a-button>
                </a-space>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </BasicSearchForm>
      <div class="query_total">
        <a-row type="flex" justify="space-between">
          <a-col>
            查询合计：志愿者数<span style="font-size: 16px; color: #c12a2a"> {{ pagination.person }} </span>人。
          </a-col>
        </a-row>
      </div>
    </div>
    <a-spin :spinning="spinning">
      <a-table :pagination="false" :data-source="inquireList" :rowKey="(record) => record.id" :columns="columns" :scroll="{ y: tHeight }">
        <template #serial="{ index }">
          {{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}
        </template>
        <template #albp0003="{ text, record }">
          <a href="javascript:void(0)" @click.prevent="toInfo(record)">{{ text }}</a>
        </template>
        <template #albx0173="{ text }">
          <span v-show="text == 2">申请录入</span>
          <span v-show="text == 1">手动录入</span>
          <span v-show="text == 4">签到录入</span>
        </template>
        <template #action="{ record }">
          <a-space>
            <a-button size="small" type="primary" :disabled="record.albx0174 == 3" @click="deleteTime(record)"
              ><span
                style="width: 56px; text-align: center"
                v-text="record.albx0174 == 2 ? '删除时长' : record.albx0174 == 3 && record.albx0173 == 4 ? '强制签退' : '已删除'"
              ></span
            ></a-button>
            <a-button size="small" @click="showDetail(record)">详情</a-button>
          </a-space>
        </template>
      </a-table>
    </a-spin>
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
        v-model:current="pagination.current"
        v-model:pageSize="pagination.pageSize"
        :total="pagination.total"
        :showTotal="pagination.showTotal"
        @change="changePagination"
      />
    </div>
    <TimeAuditDrawer :visible="auditvisible" :item="audititem" @closeAuditDrawer="closeAuditDrawer"></TimeAuditDrawer>
  </a-drawer>
</template>
<script>
import moment from 'moment'
import { message, Modal } from 'ant-design-vue'
import { defineComponent, reactive, ref, onMounted, watch, nextTick, toRefs } from 'vue'
import { LocalGetUserInfo, LocalSetVolunteerInfo } from '@/utils/localStorage.js'
import { useRouter } from 'vue-router'
import { RecordCom } from '../tables/table'
import apis from '@/server/request'
import TimeAuditDrawer from './TimeAuditDrawer'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    TimeAuditDrawer,
  },
  setup(props, { emit }) {
    const queryParam = reactive({
      albp0003: '',
      albx0173: { value: '', label: '' },
      albx0178: null,
    })
    const userInfo = ref(LocalGetUserInfo())
    const columns = ref(RecordCom.columns2)
    const auditvisible = reactive({
      auditvisible: false,
      audititem: {},
    })
    const router = useRouter()
    const obj = reactive({
      spinning: false,
      bool: false,
      bodyH: 823,
      tHeight: 600,
    })
    const pagination = reactive({
      current: 1,
      pageSize: 10,
      total: 0,
      person: 0,
      showTotal: (total, range) => `共${total}条，当前显示${range[0]}~${range[1]}`,
    })
    const inquireList = ref([])
    const getOperationDetail = () => {
      obj.spinning = true
      const bean = {
        albx0021: props.item.albx0021, // this.userInfo.areaid, // 区域
        albx0057: props.item.id, // record.id, // record.id 项目id
        albx0086: queryParam.albp0003 ? queryParam.albp0003 : null, // this.volname2 志愿者姓名
        albx0090: null, // 岗位名称
        albx0173: queryParam.albx0173.value ? queryParam.albx0173.value : null, // 录入方式
        albx0178: queryParam.albx0178 ? moment(queryParam.albx0178).format('YYYY-MM-DD') + ' 00:00:00' : null, // 录入时间
        pageSize: 10,
        pageNum: pagination.current,
        pageNo: pagination.current,
      }
      apis.inquireVolunteerFortisService(bean).then((res) => {
        if (res) {
          console.log(res, '返回')
          inquireList.value = res.list
          pagination.total = res.totalcount ? res.totalcount * 1 : 0
          pagination.person = res.person ? res.person * 1 : 0
          obj.spinning = false
        }
      })
    }
    const onClose = (bool) => {
      emit('onCloseMember', bool)
    }
    const changeStation = (val) => {
      queryParam.albx0173.value = val.value
    }
    const changeDate = (date, dateString) => {}
    const deleteTime = (record) => {
      // 删除时长记录
      obj.spinning = true
      apis
        .deleteTimeFortisService({
          id: record.id,
          albx0021: props.item.albx0021,
          groupId: userInfo.value.team.groupid, //队伍id
          projectId: props.item.id, //项目id
          volunteerId: record.albx0053, //志愿者编号
          albx0172: record.albx0172,
        })
        .then((res) => {
          if (res) {
            message.success(res)
            obj.bool = true
            getOperationDetail()
          }
        })
    }
    const toInfo = (record) => {
      //跳转志愿者详情页
      apis.getcardno({ cardno: record.albp0005 }).then((res) => {
        if (res) {
          record.albp0005 = res.cardno
          LocalSetVolunteerInfo(record)
          router.push({ path: '/volunteerDetails' })
        }
      })
    }
    const showDetail = (record) => {
      //弹出时长审核详情
      const params = {
        areaid: props.item.albx0021, // 项目区划,
        id: record.id, // "111",时长表idTimeEntryDurationTable
        albx0057: props.item.id, //项目id
        albx0053: record.albx0053, //志愿者编号,
      }
      apis.timesFortisService(params).then((res) => {
        if (res) {
          auditvisible.audititem = res
          auditvisible.audititem.albx0057 = record.albx0057
          auditvisible.audititem.albx0053 = record.albx0053
          auditvisible.audititem.deleteTime = deleteTime
          auditvisible.audititem.showbtn = record.albx0174 == 2 ? 2 : 3
          auditvisible.auditvisible = true
        }
      })
    }
    const closeAuditDrawer = () => {
      //关闭时长审核详情
      auditvisible.auditvisible = false
    }
    const search = (val) => {
      if (val == 2) {
        queryParam.albp0003 = ''
        queryParam.albx0173 = { value: '', label: '' }
        queryParam.albx0178 = null
      }
      getOperationDetail()
    }
    const changePagination = (pageNumber) => {
      pagination.current = pageNumber
      getOperationDetail()
    }
    const getHeight = () => {
      window.addEventListener('resize', getHeight)
      if (document.querySelector('operationDetail_drawer')) {
        setTimeout(() => {
          let header = document.querySelector('div.ant-drawer-header').clientHeight
          let thead = document.querySelector('.ant-table-thead').clientHeight
          let topH = document.querySelector('div.drawer_top').clientHeight
          let bottomH = document.querySelector('div.drawer_bottom').clientHeight
          //24 是弹窗的padding
          obj.bodyH = window.innerHeight - (header + bottomH)
          obj.tHeight = window.innerHeight - (header + topH + bottomH + thead + 24)
        }, 200)
      }
    }
    watch(
      () => props.visible,
      (value) => {
        nextTick(() => {
          if (value) {
            search(2)
            getHeight()
          } else {
            obj.bool = false
          }
        })
      }
    )
    return {
      queryParam,
      ...toRefs(props),
      ...toRefs(obj),
      ...toRefs(auditvisible),
      onClose,
      columns,
      getOperationDetail,
      changeStation,
      changeDate,
      toInfo,
      search,
      closeAuditDrawer,
      showDetail,
      deleteTime,
      inquireList,
      pagination,
      changePagination,
    }
  },
})
</script>
<style>
.query_total {
  font-size: 16px;
}
</style>
