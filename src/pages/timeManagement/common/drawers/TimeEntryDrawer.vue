<template>
  <a-drawer
    class="drawer_timeEntry"
    title="时长录入"
    :headerStyle="{ fontWeight: 800 }"
    :bodyStyle="{ padding: '12px', height: bodyH + 'px' }"
    placement="right"
    :visible="visible"
    :maskClosable="false"
    @close="onCloseMember(false)"
    width="1060px"
  >
    <div class="drawer_top">
      <div class="select-pro">当前选择项目：{{ item.albx0002 ? item.albx0002 : '' }}</div>
      <div style="padding-top: 10px; padding-bottom: 5px">提示：选择你需要录入时长的岗位，请先选择岗位，再选择需要录入时长的志愿者</div>
      <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
        <a-row>
          <a-col :md="12" :sm="24" v-if="props.visible">
            <a-form-item label="岗位名称" style="margin-bottom: 10px">
              <a-select :labelInValue="true" option-label-prop="label" v-model:value="searchParam.station" :options="option">
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div>提示：选择你需要录入时长的志愿者</div>
      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row type="flex" justify="start">
          <a-col :offset="1" :md="8" :sm="24">
            <a-form-item>
              <a-input v-model:value="searchParam.volname" placeholder="请输入志愿者名称" />
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item>
              <a-col :md="8" :sm="24">
                <a-form-item>
                  <a-space>
                    <a-button type="primary" @click="onSearch(1)">查询</a-button>
                    <a-button @click="onSearch(2)">重置</a-button>
                  </a-space>
                </a-form-item>
              </a-col>
            </a-form-item>
          </a-col>
          <a-col :offset="6" :md="2" :sm="24">
            <a-form-item>
              <a-button style="text-align: right" type="primary" @click="showChildrenDrawer(false)">批量选择</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-spin :spinning="spinning">
      <a-table
        :pagination="false"
        :data-source="entryList"
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
        <template #action="{ record }">
          <a-button type="primary" @click="showChildrenDrawer(record)">选择此人</a-button>
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
    <TimeEntryChildDrawer :visible="childvisible" :item="childitem" @closeChildrenDrawer="closeChildrenDrawer"></TimeEntryChildDrawer>
  </a-drawer>
</template>

<script>
import { defineComponent, reactive, ref, toRefs, watch, onMounted, nextTick, onBeforeUnmount } from 'vue'
import apis from '@/server/request'
import { Modal, message } from 'ant-design-vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { timeEntryCom } from '../tables/table'
import { rpcPost } from '@/server/conf/index.js'
import TimeEntryChildDrawer from './TimeEntryChildDrawer.vue'
import { hasSelected } from '@/pages/membersManagement/components/tables/hasSelected.js'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
    },
    item: {
      type: Object,
      default: () => ({ selectStationList: [] }),
    },
  },
  components: {
    TimeEntryChildDrawer,
  },
  setup(props, { emit }) {
    // console.log(props, 'TimeEntryDrawer')
    const userInfo = ref(LocalGetUserInfo())
    const columns = ref(timeEntryCom.columns2)
    const searchParam = reactive({
      station: { value: '', label: '' }, // 岗位选择
      volname: '', // 搜索志愿者名称
    })
    const option = ref([])
    const ProjectVolTable = ref()
    const obj = reactive({
      childvisible: false,
      childitem: { record: [{ albx0072: '' }], proitem: {} },
    })
    const spinning = ref(false)
    const pagination = reactive({
      current: 1,
      pageSize: 10,
      total: 0,
      showTotal: (total, range) => `共${total}条，当前显示${range[0]}~${range[1]}`,
    })
    const entryList = ref([])
    const selectedRowKeys = ref([])
    const selectedRows = ref([])
    const height = reactive({
      tHeight: 500,
      bodyH: 827,
    })
    const searchProjectVolTable = () => {
      // getProjectVolListFortis项目成员列表
      spinning.value = true
      const bean = {
        proid: props.item.id,
        areaid: props.item.albx0021, //项目区划
        albx0084: 'B',
        albx0052: searchParam.station.value,
        albp0003: searchParam.volname ? searchParam.volname : null,
        pageNo: pagination.current,
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      }
      rpcPost('getProjectVolListFortis', { bean }).then((res) => {
        if (res.code == 0 && res.data) {
          console.log(res)
          entryList.value = res.data.list
          pagination.total = res.totalCount
          spinning.value = false
        }
      })
    }
    const onSearch = (val) => {
      if (val == 2) {
        searchParam.volname = ''
      }
      searchProjectVolTable()
    }
    const onCloseMember = (bool) => {
      emit('onCloseMember', bool)
    }
    const showChildrenDrawer = (record) => {
      //打开子抽屉
      if (record) {
        selectedRowKeys.value = hasSelected(record, selectedRowKeys)
        obj.childitem.record = [record]
        obj.childitem.proitem = props.item
        obj.childvisible = true
      } else {
        if (selectedRowKeys.value.length > 0) {
          obj.childitem.record = selectedRows.value
          obj.childitem.proitem = props.item
          obj.childvisible = true
        } else {
          Modal.info({
            title: '请勾选你需要批量录入的志愿者，点击志愿者名称左侧按钮即可勾选',
            okText: '关闭',
          })
        }
      }
    }
    const closeChildrenDrawer = (val) => {
      //关闭子抽屉
      obj.childvisible = false
      selectedRowKeys.value = []
      if (val) {
        onSearch(1)
      }
    }
    const onSelectChange = (RowKeys, Rows) => {
      selectedRowKeys.value = RowKeys
      selectedRows.value = Rows
    }
    const changePagination = (pageNumber) => {
      debugger
      pagination.current = pageNumber
      onSearch(1)
    }
    const getHeight = () => {
      window.addEventListener('resize', getHeight)
      if (document.querySelector('div.drawer_timeEntry')) {
        setTimeout(() => {
          let header = document.querySelector('div.ant-drawer-header').clientHeight
          let topH = document.querySelector('div.drawer_top').clientHeight
          let bottomH = document.querySelector('div.drawer_bottom').clientHeight
          let thead = document.querySelector('.ant-table-thead').clientHeight
          //24 是弹窗的padding 55表格的头部高度
          height.bodyH = window.innerHeight - (header + bottomH)
          height.tHeight = window.innerHeight - (header + topH + bottomH + thead + 24)
        }, 200)
      }
    }
    watch(
      () => props.visible,
      (visible) => {
        if (visible) {
          // selectStationList.value = props.item.selectStationList
          let options = []
          props.item.selectStationList.forEach((e) => {
            options.push({ value: e.id, label: e.albx0072 })
          })
          option.value = options
          searchParam.station.value = option.value[0].value
          searchParam.station.label = option.value[0].label
          nextTick(() => {
            onSearch(2)
            getHeight()
          })
        } else {
          searchParam.station.value = option.value[0].value
          searchParam.station.label = option.value[0].label
        }
      }
    )
    return {
      props,
      columns,
      searchProjectVolTable,
      selectedRowKeys,
      ProjectVolTable,
      onSearch,
      spinning,
      entryList,
      ...toRefs(height),
      onCloseMember,
      searchParam,
      showChildrenDrawer,
      ...toRefs(obj),
      closeChildrenDrawer,
      onSelectChange,
      option,
      pagination,
      changePagination,
    }
  },
})
</script>

<style scoped lang="less"></style>
