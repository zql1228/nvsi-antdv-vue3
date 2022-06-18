<!-- 队伍稿件管理 -->
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
          <template #tabBarExtraContent>
            <a-button type="primary" @click="hadleCreate">新建</a-button>
          </template>
          <a-tab-pane key="1" tab="未投递">
            <TeamManuscriptTable :type="0" :queryParam="queryParam" ref="TeamManuscriptTable1">
              <template #action="record">
                <a-space>
                  <!-- 只有省级和全国的管理员有发布按钮 -->
                  <a-button type="primary" ghost size="small" @click="send(record.record.record, 1, 1)">投递</a-button>
                  <a-button type="primary" ghost size="small" @click="edit(record.record.record)">编辑</a-button>
                  <a-button size="small" @click="del(record.record.record, 1, 3)">删除</a-button>
                  <!-- 没有删除权限 -->
                  <!-- <a-popconfirm :title="'确定删除吗?'" @confirm="del(record.record.record, 1,3)">
                    <a-button size="small">删除</a-button>
                  </a-popconfirm> -->
                </a-space>
              </template>
            </TeamManuscriptTable>
          </a-tab-pane>
          <a-tab-pane key="2" tab="已投递" force-render>
            <TeamManuscriptTable :type="1" :queryParam="queryParam" ref="TeamManuscriptTable2">
              <template #action="record">
                <a-space>
                  <a-button type="primary" size="small" @click="view(record.record.record)">查看</a-button>
                  <!-- 一经投递不能撤回 -->
                  <!-- <a-popconfirm :title="'确定撤回吗?'" @confirm="revert(record.record.record, 2, 4)">
                    <a-button type="primary" ghost size="small">撤回</a-button>
                  </a-popconfirm> -->
                  <a-button size="small" @click="handleLog(record.record.record)">操作记录</a-button>
                </a-space>
              </template>
            </TeamManuscriptTable>
          </a-tab-pane>
        </a-tabs>
      </template>
    </PageFormTableWrapper>
    <ManuscriptEditForm :visible="data.visibleEdit" :item="data.item" :type="data.type" @child="onCloseEdit"></ManuscriptEditForm>
    <ManuscriptPublishtForm :visible="data.visiblePublish" :item="data.item" :type="data.type" @child="onClosePublish"></ManuscriptPublishtForm>
    <ManuscriptPublishtForm :visible="data.visibleInfo" :item="data.item" :type="data.type" @child="onCloseInfo"></ManuscriptPublishtForm>
    <InfoManuscriptDrawer></InfoManuscriptDrawer>
    <ManuscriptLogTable :visible="data.visibleLog" :item="data.item" :type="data.type" @child="onCloseLog"></ManuscriptLogTable>
  </div>
</template>

<script>
import moment from 'moment'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { useRouter } from 'vue-router'
import { defineComponent, reactive, ref, onMounted, watch } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import TeamManuscriptTable from './compontents/team/TeamManuscriptTable'
import ManuscriptEditForm from './compontents/team/ManuscriptEditForm'
import { rpcPost } from '@/server/conf/index.js'
import { message } from 'ant-design-vue/es'
import seaResource from './compontents/seaResource.vue'
import ManuscriptPublishtForm from './compontents/manager/ManuscriptPublishtForm'
import EventBus from '@/utils/bus'
import InfoManuscriptDrawer from './compontents/manager/InfoManuscriptDrawer' //查看新闻稿件详情
import ManuscriptLogTable from './compontents/manager/ManuscriptLogTable'

export default defineComponent({
  props: {
    item: {
      type: Object,
    },
  },
  components: {
    PlusOutlined,
    TeamManuscriptTable,
    ManuscriptEditForm,
    seaResource,
    ManuscriptPublishtForm,
    InfoManuscriptDrawer,
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
    })

    const confirmLoading = ref(false)

    const TeamManuscriptTable1 = ref()
    const TeamManuscriptTable2 = ref()

    const options = ref([]) //稿件类型

    const data = reactive({
      //稿件表单参数
      visibleEdit: false,
      visiblePublish: false,
      visibleLog: false,

      type: 'create',
      item: {},
    })

    //$refs.table.refresh(true)
    const refresh = (activeKey) => {
      //查询
      activeKey == 1 ? TeamManuscriptTable1.value.getList() : TeamManuscriptTable2.value.getList()
    }

    //重置
    const resetForm = (activeKey) => {
      searchFormRef.value.resetFields()
      activeKey == 1 ? TeamManuscriptTable1.value.getList() : TeamManuscriptTable2.value.getList()
    }

    const onCloseEdit = (bool) => {
      TeamManuscriptTable1.value.getList()
      if (bool == 2) {
        TeamManuscriptTable2.value.getList()
      }
      data.visibleEdit = false
    }

    const onClosePublish = (bool) => {
      TeamManuscriptTable1.value.getList()
      if (bool == 2) {
        TeamManuscriptTable2.value.getList()
      }
      data.visiblePublish = false
    }

    const onCloseInfo = (bool) => {
      TeamManuscriptTable1.value.getList()
      if (bool == 2) {
        TeamManuscriptTable2.value.getList()
      }
      data.visiblePublish = false
    }

    const hadleCreate = () => {
      //新建按钮
      data.type = 'create'
      data.item = {}
      data.visibleEdit = true
    }

    const edit = (record) => {
      //修改
      data.type = 'modify'
      data.item = record
      data.visibleEdit = true
    }

    // const view = (record) => {
    //   //查看
    //   data.type = 'view'
    //   data.item = record
    //   data.visibleUpdate = true
    // }

    const view = (record) => {
      //查看

      //删除
      let bean = {
        id: record.id,
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
    const seeInfo = (record) => {
      data.type = 'view'
      data.item = record
      data.visibleInfo = true
    }
    const del = (record, activeKey, operateType) => {
      //删除
      let bean = {
        id: record.id,
        type: operateType,
        areaid: userInfo.value.areaid,
      }
      rpcPost('updateManuscriptStatus', { bean }).then((res) => {
        if (res && res.code === 0) {
          message.success('已删除')
          activeKey == 1 ? TeamManuscriptTable1.value.getList() : TeamManuscriptTable2.value.getList()
        } else {
          message.warning(res.message)
        }
      })
    }

    //撤回
    const revert = (record, activeKey, operateType) => {
      let bean = {
        id: record.id,
        type: operateType,
        areaid: userInfo.value.areaid.substring(0, 6) + '000000000000',
      }
      rpcPost('updateManuscriptStatus', { bean }).then((res) => {
        if (res && res.code === 0) {
          message.success('已撤回')
          activeKey == 2 ? TeamManuscriptTable2.value.getList() : TeamManuscriptTable1.value.getList()
        } else {
          message.warning(res.message)
        }
      })
    }

    //投递稿件
    const send = (record, activeKey, operateType) => {
      let bean = {
        id: record.id,
        type: operateType,
        areaid: userInfo.value.areaid,
        operator: userInfo.value.fullName,
      }
      rpcPost('updateManuscriptStatus', { bean }).then((res) => {
        if (res && res.code === 0) {
          message.success('已投递')
          activeKey == 1 ? TeamManuscriptTable1.value.getList() : TeamManuscriptTable2.value.getList()
        } else {
          message.warning(res.message)
        }
      })
    }

    const delList = (activeKey) => {
      //批量删除
      activeKey == 1 ? TeamManuscriptTable1.value.del() : TeamManuscriptTable2.value.del()
    }

    //操作记录
    const onCloseLog = (bool) => {
      data.visibleLog = false
    }

    //操作记录
    const handleLog = (record) => {
      data.type = 'view'
      data.item = record
      data.item.articleid = record.id
      data.visibleLog = true
    }
    return {
      activeKey,
      TeamManuscriptTable1,
      TeamManuscriptTable2,
      data,
      options,
      moment,
      // 查询条件参数
      queryParam,
      searchFormRef,
      resetForm,
      revert,
      view,
      seeInfo,
      del,
      edit,
      send,
      hadleCreate,
      handleLog,
      onCloseLog,
      onClosePublish,
      onCloseEdit,
      onCloseInfo,
      refresh,
      delList,
      userInfo: {},
    }
  },
})
</script>
<style lang="scss" scoped></style>
