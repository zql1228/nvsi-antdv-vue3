<!--时长录入-录入记录-->
<template>
  <a-drawer class="entryRecord_drawer" title="录入记录" :bodyStyle="{ padding: '0.75rem', height: bodyH + 'px' }" :maskClosable="false" placement="right" :visible="visible" @close="onCloseMember(true)" width="1060px">
    <div class="drawer_top">
      <div style="font-size:16px;margin-left:35px">项目名称：{{ item.albx0002 ? item.albx0002 : '' }}</div>
      <BasicSearchForm>
        <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 17 }" :model="queryParam">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item label="姓名搜索">
                <a-input v-model:value="queryParam.volname"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
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
      <!-- <div class="query_total">
        <a-row type="flex" justify="space-between">
          <a-col>
            查询合计：志愿者数<span style="font-size:16px;color:#c12a2a"> {{ pagination.person }} </span>人。
          </a-col>
        </a-row>
      </div> -->
    </div>
    <a-spin :spinning="spinning">
      <a-table
        :pagination="false"
        :data-source="recordList"
        :rowKey="(record) => record.id"
        :columns="columns"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :scroll="{ y: tHeight }"
      >
        <template #serial="{index}">
          {{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}
        </template>
        <template #albx0174="{text}">
          <span v-show="text == 0"> <RedoOutlined spin /> 录入中 </span>
          <span v-show="text == 1"> <RedoOutlined spin /> 未签退 </span>
          <span v-show="text == 2" style="color:'#d92f2f'">录入成功</span>
          <span v-show="text == 4" title="录入失败,审核被拒绝">录入失败&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:'#d92f2f'">审核被拒绝</span></span>
          <span v-show="text == 5" title="录入失败,已存在时长">录入失败&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:'#d92f2f'">已存在时长</span></span>
        </template>
        <template #action="{record}">
          <a-button v-show="record.albx0174 == 0" disabled>录入中无法操作</a-button>
          <a-popconfirm v-if="record.albx0174 == 2" title="是否确认删除，删除后时长可不恢复" ok-text="确定" cancel-text="取消" @confirm="deleteTime(record)">
            <a-button type="primary" size="small">
              删除时长
            </a-button>
          </a-popconfirm>
          <a-button v-show="record.albx0174 == 4 || record.albx0174 == 5" type="primary" size="small" @click="deleteTime(record)">
            删除记录
          </a-button>
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
        padding: '14px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }"
    >
      <a-pagination v-model:current="pagination.current" v-model:pageSize="pagination.pageSize" :total="pagination.total" :showTotal="pagination.showTotal" @change="changePagination" />
    </div>
  </a-drawer>
</template>
<script>
import { Modal, message } from 'ant-design-vue'
import { RedoOutlined } from '@ant-design/icons-vue'
import { defineComponent, reactive, toRefs, ref, onMounted, watch, nextTick } from 'vue'
import apis from '@/server/request'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { timeEntryCom } from '../tables/table'
import { hasSelected } from '@/pages/membersManagement/components/tables/hasSelected.js'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  components: { RedoOutlined },
  setup(props, { emit }) {
    const userInfo = ref(LocalGetUserInfo())
    const columns = ref(timeEntryCom.columns3)
    const queryParam = reactive({ volname: null })
    const recordtable = ref()
    const selectedRowKeys = ref([])
    const selectedRows = ref()
    const spinning = ref(false)
    const pagination = reactive({
      current: 1,
      pageSize: 10,
      total: 0,
      person: 0,
      showTotal: (total, range) => `共${total}条，当前显示${range[0]}~${range[1]}`,
    })
    const recordList = ref([])
    const height = reactive({
      tHeight: 500,
      bodyH: 827,
    })
    const onCloseMember = (bool) => {
      emit('onCloseMember', bool)
    }
    const searchProjectVolTable = () => {
      spinning.value = true
      const bean = {
        albx0021: props.item.albx0021, // 项目区划
        albx0057: props.item.id, //  项目id
        albx0086: queryParam.volname ? queryParam.volname : null, // 志愿者姓名
        pageNo: pagination.current,
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      }
      apis.recordTimeListFortisLogic(bean).then((res) => {
        if (res) {
      
          recordList.value = res.list
          pagination.total = res.totalcount ? res.totalcount : 0
          pagination.person = res.person ? res.person * 1 : 0
          spinning.value = false
        }
      })
    }
    const onSearch = (val) => {
      if (val == 2) {
        queryParam.volname = ''
      }
      searchProjectVolTable()
    }
    const del = (params, params2) => {
      if (params.length > 0) {
        apis.delTimesFortisService(params).then((res) => {
          if (res) {
            message.success(res)
            selectedRowKeys.value = []
            onSearch(1)
          }
        })
      }
      if (params2.length > 0) {
        apis.deleteTimeFortisService(params2).then((res) => {
          if (res) {
            message.success(res)
            selectedRowKeys.value = []
            onSearch(1)
          }
        })
      }
    }
    const deleteTime = (record) => {
      // 点击确定时删除时长

      const params = []
      const params2 = []
      if (record) {
        spinning.value = true
        selectedRowKeys.value = hasSelected(record, selectedRowKeys)
        if (record.albx0174 == 5 || record.albx0174 == 4) {
          params.push({
            id: record.id,
            albx0172: record.albx0172,
            albx0174: record.albx0174,
            albx0021: props.item.albx0021, //项目区划
          })
        }
        if (record.albx0174 == 2) {
          params.push({
            groupId: userInfo.value.team.groupid, // 队伍id
            projectId: props.item.id, // 项目id
            volunteerId: record.albx0175, // 志愿者id
            id: record.id,
            albx0172: record.albx0172,
            albx0174: record.albx0174,
            albx0021: props.item.albx0021,
          })
        }
        del(params, params2)
      } else {
        if (selectedRowKeys.value.length > 0) {
          Modal.confirm({
            title: '是否确认删除，删除后时长不可恢复',
            cancelText: '取消',
            okText: '确认',
            onOk: () => {
              spinning.value = true
              selectedRows.value.forEach((e) => {
                if (e.albx0174 == 5 || e.albx0174 == 4) {
                  params.push({
                    id: e.id,
                    albx0174: e.albx0174,
                    albx0172: e.albx0172,
                    albx0021: props.item.albx0021, //项目区划
                  })
                }
                if (e.albx0174 == 2) {
                  params2.push({
                    groupId: userInfo.value.team.groupid, // 队伍id
                    projectId: props.item.id, // 项目id
                    volunteerId: e.albx0175, // 志愿者id
                    id: e.id,
                    albx0172: e.albx0172,
                    albx0174: e.albx0174,
                    albx0021: props.item.albx0021,
                  })
                }
              })
        
              del(params, params2)
            },
          })
        } else {
          Modal.info({
            title: () => '请勾选你需要批量删除的志愿者，点击志愿者名称左侧按钮即可勾选',
            okText: '关闭',
          })
        }
      }
    }
    const onSelectChange = (RowKeys, selectedRows) => {
      selectedRowKeys.value = RowKeys
      selectedRows.value = selectedRows
    }
    const changePagination = (pageNumber) => {
      pagination.current = pageNumber
      onSearch(1)
    }
    const getHeight = () => {
      window.addEventListener('resize', getHeight)
      if (document.querySelector('div.entryRecord_drawer')) {
        setTimeout(() => {
          let header = document.querySelector('div.ant-drawer-header').clientHeight
          let topH = document.querySelector('div.drawer_top').clientHeight
          let bottomH = document.querySelector('div.drawer_bottom').clientHeight
          //24 是弹窗的padding 55表格的头部高度
          height.bodyH = window.innerHeight - (header + bottomH)
          height.tHeight = window.innerHeight - (header + topH + bottomH + 55 + 24)
        }, 200)
      }
    }
    watch(
      () => props.visible,
      (visible) => {
        nextTick(() => {
          if (visible) {
            onSearch(2)
            getHeight()
          }
        })
      }
    )
    return {
      queryParam,
      searchProjectVolTable,
      ...toRefs(props),
      ...toRefs(height),
      columns,
      spinning,
      recordtable,
      onCloseMember,
      onSearch,
      selectedRowKeys,
      onSelectChange,
      deleteTime,
      recordList,
      pagination,

      changePagination,
    }
  },
})
</script>
