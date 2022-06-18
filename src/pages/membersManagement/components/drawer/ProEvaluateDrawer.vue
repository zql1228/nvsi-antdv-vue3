<template>
  <div>
    <a-drawer
      :title="'项目成员评价（' + item.albx0002 + '）'"
      :headerStyle="{ fontWeight: 800 }"
      :bodyStyle="{ padding: '12px' }"
      placement="right"
      :visible="visible"
      :maskClosable="false"
      width="1060px"
      @close="closeProEvalute(false)"
    >
      <searchForm isshow="3" :item="item" @searchVol="evaluateSearch" ref="searchFormref"></searchForm>
      <a-tabs type="card" class="teamTabs" v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="未评价">
          <ProEvaluateTablecopy tabKey="1" :item="item" ref="evaluateTable1"></ProEvaluateTablecopy>
        </a-tab-pane>
        <a-tab-pane key="2" tab="已评价">
          <ProEvaluateTable tabKey="2" :item="item" ref="evaluateTable2"></ProEvaluateTable>
        </a-tab-pane>
        <template #tabBarExtraContent>
          <a-button type="primary" v-show="activeKey == '1'" @click="showEvaluteDrawer">批量评价</a-button>
          <a-button type="primary" v-show="activeKey == '2'" @click="deleteEvalution">批量删除评价</a-button>
        </template>
      </a-tabs>
      <div
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
          v-show="activeKey == '1'"
          v-model:current="pagination1.current"
          v-model:pageSize="pagination1.pageSize"
          :total="pagination1.total"
          :showTotal="pagination1.showTotal"
          @change="changePagination"
        />
        <a-pagination
          v-show="activeKey == '2'"
          v-model:current="pagination2.current"
          v-model:pageSize="pagination2.pageSize"
          :total="pagination2.total"
          :showTotal="pagination2.showTotal"
          @change="changePagination"
        />
      </div>
    </a-drawer>
    <!-- 填写评价 -->
    <!-- <EvaluteDrawer :visible="evalvisible" :item="evalitem" @closeDrawer="closeEvaluteDrawer"></EvaluteDrawer> -->
  </div>
</template>
<script>
import { message, Modal } from 'ant-design-vue'
// import { useRouter } from 'vue-router'
import { defineComponent, reactive, ref, toRefs, onMounted, watch, nextTick } from 'vue'
import apis from '@/server/request'
import ProEvaluateTable from '../tables/ProEvaluateTable'
import ProEvaluateTablecopy from '../tables/ProEvaluateTablecopy'
import EvaluteDrawer from './EvaluteDrawer'
import searchForm from '../search/searchForm'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    item: { type: Object, default: {} },
  },
  components: {
    ProEvaluateTable,
    ProEvaluateTablecopy,
    EvaluteDrawer,
    searchForm,
  },
  setup(props, { emit }) {
    const activeKey = ref('1')
    const evaluateTable1 = ref()
    const evaluateTable2 = ref()
    const evalvisible = ref(false)
    const searchFormref = ref()
    const evalitem = ref()
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
    })
    const closeEvaluteDrawer = (val) => {
      //关闭填写评价
      evalvisible.value = false
      if (val) {
        evaluateTable1.value.getList()
        evaluateTable2.value.getList()
      }
    }
    const closeProEvalute = (bool) => {
      // 关闭项目评价抽屉
      emit('onCloseMember', bool)
    }
    const evaluateSearch = (obj) => {
      if (obj.isshow == 3) {
        activeKey.value == '1' ? evaluateTable1.value.getList(obj.queryParam) : evaluateTable2.value.getList(obj.queryParam)
      }
    }
    const showEvaluteDrawer = () => {
      //打开批量评价抽屉
      // evalitem.value.item = props.item
      // evalitem.value.record = evaluateTable1.value.getRows()
      // evalvisible.value.isshow = 1
      // evalvisible.value = true
      evaluateTable1.value.showEvalution()
    }
    const deleteEvalution = () => {
      //删除评价
      evaluateTable2.value.deleteEvalution()
    }
    //获取分页
    const getPagination = (page) => {
      if (activeKey.value == '1') {
        paginations.pagination1.current = page.current
        paginations.pagination1.total = page.total
      } else {
        paginations.pagination2.current = page.current
        paginations.pagination2.total = page.total
      }
    }
    const changePagination = (pageNumber) => {
      if (activeKey.value == '1') {
        paginations.pagination1.current = pageNumber
        getChangePageList()
      } else {
        paginations.pagination2.current = pageNumber
        getChangePageList()
      }
    }
    //    const getChangePageList = () => {
    //   let res = searchFormref.value.backQueryparam()
    //   res.current = activeKey.value == '2' ? paginations.pagination1.current : activeKey.value == '4' ? paginations.pagination2.current : paginations.pagination3.current
    //   if (res) {
    //     activeKey.value == '2' ? volMemberTable1.value.getqueryParam(res) : activeKey.value == '4' ? volMemberTable2.value.getqueryParam(res) : volMemberTable3.value.getqueryParam(res)
    //   }
    // }
    watch(
      () => props.visible,
      (visible) => {
        if (visible) {
          activeKey.value = '1'

          nextTick(() => {
            props.item.getPagination = getPagination
            searchFormref.value.getSelectStationList(props.item).then((res) => {
              if (res) {
                evaluateTable1.value.getList(res)
              }
            })
          })
        }
      }
    )
    watch(
      () => activeKey.value,
      (val) => {
        nextTick(() => {
          searchFormref.value.getSelectStationList(props.item).then((res) => {
            if (res) {
              val == '1' ? evaluateTable1.value.getList(res) : evaluateTable2.value.getList(res)
            }
          })
        })
      }
    )
    return {
      ...toRefs(props),
      ...toRefs(paginations),
      activeKey,
      searchFormref,
      showEvaluteDrawer,
      deleteEvalution,
      closeEvaluteDrawer,
      closeProEvalute,
      evaluateSearch,
      evaluateTable1,
      evaluateTable2,
      evalvisible,
      evalitem,
      changePagination,
    }
  },
})
</script>
<style lang="less" scoped>
.teamTabs :deep(.ant-tabs-nav div) {
  padding-left: 10px !important;
}
</style>
