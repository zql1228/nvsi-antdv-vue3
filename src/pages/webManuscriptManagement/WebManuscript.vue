<!-- 管理部门 稿件管理 -->
<template>
  <div>
    <PageFormTableWrapper>
      <template #searchForm>
        <a-form
          ref="searchFormRef"
          :model="queryParam"
          :label-col="{
            xs: { span: 24 },
            sm: { span: 6 },
          }"
          :wrapper-col="{
            xs: { span: 24 },
            sm: { span: 18 },
          }"
        >
          <a-row :gutter="24">
            <a-col :md="6" :sm="24">
              <a-form-item label="标题搜索" name="title">
                <a-input v-model:value="queryParam.title" placeholder="请输入稿件标题"></a-input>
              </a-form-item>
            </a-col>

            <a-col :md="5" :sm="24">
              <a-form-item>
                <a-space>
                  <a-button type="primary" @click="refresh(activeKey)">查询</a-button>
                  <a-button @click="resetForm(activeKey)">重置</a-button>
                </a-space>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </template>
      <template #table>
        <a-tabs v-model:activeKey="activeKey" type="card">
          <a-tab-pane key="1" tab="接收稿件">
            <FrontManuscriptTable :type="0" :queryParam="queryParam" ref="FrontManuscriptTable1">
              <template #action="record">
                <a-space>
                  <!-- 只有省级和全国的管理员有发布按钮 -->
                  <a-button type="primary" v-show="isshow" ghost size="small" @click="send(record.record.record)">发布</a-button>
                  <a-button type="primary" v-show="!isshow2" ghost size="small" @click="push(record.record.record, 1, 2)">推送</a-button>
                  <a-button type="primary" ghost size="small" @click="revert(record.record.record, 1, 3)">退回</a-button>
                  <a-button type="primary" size="small" @click="view(record.record.record)">查看</a-button>
                </a-space>
              </template>
            </FrontManuscriptTable>
          </a-tab-pane>
          <a-tab-pane key="2" tab="已推送" force-render>
            <FrontManuscriptTable :type="1" :queryParam="queryParam" ref="FrontManuscriptTable2">
              <template #action="record">
                <a-space>
                  <a-button type="primary" v-show="isshow" ghost size="small" @click="send(record.record.record)">发布</a-button>
                  <a-button type="primary" size="small" @click="view(record.record.record)">查看</a-button>
                  <a-button size="small" @click="handleLog(record.record.record)">操作记录</a-button>
                </a-space>
              </template>
            </FrontManuscriptTable>
          </a-tab-pane>
          <a-tab-pane key="3" tab="已退回" force-render>
            <FrontManuscriptTable :type="2" :queryParam="queryParam" ref="FrontManuscriptTable2">
              <template #action="record">
                <a-space>
                  <a-button type="primary" size="small" @click="view(record.record.record)">查看</a-button>
                  <a-button size="small" @click="handleLog(record.record.record)">操作记录</a-button>
                </a-space>
              </template>
            </FrontManuscriptTable>
          </a-tab-pane>
          <a-tab-pane key="4" tab="已发布" force-render v-if="isshow">
            <FrontManuscriptTable :type="3" :queryParam="queryParam" ref="FrontManuscriptTable2">
              <template #action="record">
                <a-space>
                  <a-button type="primary" size="small" @click="view(record.record.record)">查看</a-button>
                  <a-button size="small" @click="handleLog(record.record.record)">操作记录</a-button>
                </a-space>
              </template>
            </FrontManuscriptTable>
          </a-tab-pane>
        </a-tabs>
      </template>
    </PageFormTableWrapper>
    <ManuscriptEditForm :visible="data.visibleEdit" :item="data.item" :type="data.type" @child="onCloseEdit"></ManuscriptEditForm>
    <ManuscriptPublishtForm :visible="data.visiblePublish" :item="data.item" :type="data.type" @child="onClosePublish"></ManuscriptPublishtForm>
    <ManuscriptRevertForm :visible="data.visibleRevert" :item="data.item" :type="data.type" @child="onCloseRevert"></ManuscriptRevertForm>
    <!-- 操作记录 -->
    <ManuscriptLogTable :visible="data.visibleLog" :item="data.item" :type="data.type" @child="onCloseLog"></ManuscriptLogTable>
    <InfoManuscriptDrawer></InfoManuscriptDrawer>
  </div>
</template>

<script>
import moment from 'moment'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { useRouter } from 'vue-router'
import { defineComponent, reactive, ref, onMounted, watch } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import FrontManuscriptTable from './compontents/manager/FrontManuscriptTable'
import ManuscriptEditForm from './compontents/team/ManuscriptEditForm'
import { rpcPost } from '@/server/conf/index.js'
import { message } from 'ant-design-vue/es'
import seaResource from './compontents/seaResource.vue'
import ManuscriptPublishtForm from './compontents/manager/ManuscriptPublishtForm'
import EventBus from '@/utils/bus'
import InfoManuscriptDrawer from './compontents/manager/InfoManuscriptDrawer' //查看新闻稿件详情
import ManuscriptRevertForm from './compontents/manager/ManuscriptRevertForm'
import ManuscriptLogTable from './compontents/manager/ManuscriptLogTable'

export default defineComponent({
  props: {
    item: {
      type: Object,
    },
  },
  components: {
    PlusOutlined,
    FrontManuscriptTable,
    ManuscriptEditForm,
    seaResource,
    ManuscriptPublishtForm,
    InfoManuscriptDrawer,
    ManuscriptRevertForm,
    ManuscriptLogTable,
  },
  setup(props) {
    const userInfo = ref(LocalGetUserInfo())

    const activeKey = ref('1') //tab页
    const searchFormRef = ref(null)
    const queryParam = reactive({
      title: '', //标题
      sort: '', //类型
      resourcecode: [], //区划
      areaLevel: userInfo.value.areaLevel,
    })

    //当前用户的级别判断是否显示发布按钮
    const isshow = (userInfo.value.areaLevel == 0 || userInfo.value.areaLevel == 1) && userInfo.value.team.groupid == ''
    const isshow2 = userInfo.value.areaLevel == 0 && userInfo.value.team.groupid == ''

    const confirmLoading = ref(false)

    const FrontManuscriptTable1 = ref()
    const FrontManuscriptTable2 = ref()

    const options = ref([]) //稿件类型

    const data = reactive({
      //稿件表单参数
      visibleEdit: false,
      visiblePublish: false,
      visibleRevert: false,
      visibleLog: false,
      type: 'create',
      item: {},
    })

    //$refs.table.refresh(true)
    const refresh = (activeKey) => {
      //查询
      activeKey == 1 ? FrontManuscriptTable1.value.getList() : FrontManuscriptTable2.value.getList()
    }

    //重置
    const resetForm = (activeKey) => {
      searchFormRef.value.resetFields()
      activeKey == 1 ? FrontManuscriptTable1.value.getList() : FrontManuscriptTable2.value.getList()
    }

    const onCloseEdit = (bool) => {
      FrontManuscriptTable1.value.getList()
      if (bool == 2) {
        FrontManuscriptTable2.value.getList()
      }
      data.visibleEdit = false
    }

    const onClosePublish = (bool) => {
      FrontManuscriptTable1.value.getList()
      if (bool == 2) {
        FrontManuscriptTable2.value.getList()
      }
      data.visiblePublish = false
    }

    const onCloseRevert = (bool) => {
      FrontManuscriptTable1.value.getList()
      if (bool == 2) {
        FrontManuscriptTable2.value.getList()
      }
      data.visibleRevert = false
    }
    //操作记录
    const onCloseLog = (bool) => {
      data.visibleLog = false
    }

    const hadleCreate = () => {
      //新建按钮
      data.type = 'create'
      data.item = {}
      data.visibleEdit = true
    }

    //发布稿件
    const send = (record) => {
      data.type = 'modify'
      data.item = record
      data.visiblePublish = true
      //选择所属资源并且确定发布
    }

    const edit = (record) => {
      //修改
      data.type = 'modify'
      data.item = record
      data.visibleUpdate = true
    }

    const view = (record) => {
      //查看

      //删除
      let bean = {
        id: record.articleid,
      }
      rpcPost('getManuscriptDetails', { bean }).then((res) => {
        if (res && res.code === 0) {
          record = res.data
        } else {
          message.warning(res.message)
        }
        EventBus.emit('handleViewManuscript', res.data)
      })
    }

    //操作记录
    const handleLog = (record) => {
      data.type = 'view'
      data.item = record
      data.visibleLog = true
    }

    const del = (record, activeKey, operateType) => {
      //删除
      let bean = {
        logid: record.logid, //记录id
        articleid: record.articleid, //稿件id
        type: operateType,
        areaid: userInfo.value.areaid,
      }
      rpcPost('updateNewsStatus', { bean }).then((res) => {
        if (res && res.code === 0) {
          message.success('已删除')
          activeKey == 1 ? FrontManuscriptTable1.value.getList() : FrontManuscriptTable2.value.getList()
        } else {
          message.warning(res.message)
        }
      })
    }

    //撤回
    const revert = (record) => {
      data.type = 'modify'
      data.item = record
      data.visibleRevert = true
    }

    //推送 稿件
    const push = (record, activeKey, operateType) => {
      let pushto = 1
      let areaid = userInfo.value.areaid
      if (userInfo.value.areaLevel == 1) {
        //省级
        pushto = 5
        areaid = '000000000000000000'
      } else if (userInfo.value.areaLevel == 2) {
        //市级
        pushto = 3
        areaid = areaid.substring(0, 2) + '0000000000000000'
      } else if (userInfo.value.areaLevel == 3) {
        //区级
        pushto = 1
        areaid = areaid.substring(0, 4) + '00000000000000'
      }
      let bean = {
        operator: userInfo.value.fullName,
        logid: record.logid, //记录id
        articleid: record.articleid, //稿件id
        type: operateType,
        areaid: areaid,
        pushto: pushto,
      }
      rpcPost('updateManuscriptPushto', { bean }).then((res) => {
        if (res && res.code === 0) {
          message.success('已推送')
          activeKey == 1 ? FrontManuscriptTable1.value.getList() : FrontManuscriptTable2.value.getList()
        } else {
          message.warning(res.message)
        }
      })
    }

    const delList = (activeKey) => {
      //批量删除
      activeKey == 1 ? FrontManuscriptTable1.value.del() : FrontManuscriptTable2.value.del()
    }

    return {
      activeKey,
      FrontManuscriptTable1,
      FrontManuscriptTable2,
      data,
      options,
      moment,
      // 查询条件参数
      queryParam,
      searchFormRef,
      resetForm,
      revert,
      view,
      del,
      edit,
      send,
      push,
      hadleCreate,
      handleLog,
      onClosePublish,
      onCloseEdit,
      onCloseRevert,
      onCloseLog,
      refresh,
      delList,
      userInfo: {},
      isshow, //发布按钮是否显示
      isshow2,
    }
  },
})
</script>
<style lang="scss" scoped></style>
