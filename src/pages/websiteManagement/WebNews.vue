<!-- 管理部门 新闻 -->
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
                <a-input v-model:value="queryParam.title" placeholder="请输入新闻标题"></a-input>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="资源类型" name="sort">
                <seaResource placeholder="请选择资源" v-model:value="queryParam.resourcecode" :islevel="false"></seaResource>
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
          <a-tab-pane key="1" tab="未发布">
            <FrontNewsTable :type="0" :queryParam="queryParam" ref="FrontNewsTable1">
              <template #action="record">
                <a-space>
                  <a-button type="primary" ghost size="small" @click="send(record.record.record)">发布</a-button>
                  <a-button type="primary" ghost size="small" @click="edit(record.record.record)">修改</a-button>
                  <a-popconfirm :title="'确定删除吗?'" @confirm="del(record.record.record, 1, 3)">
                    <a-button size="small">删除</a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </FrontNewsTable>
          </a-tab-pane>
          <a-tab-pane key="2" tab="已发布" force-render>
            <FrontNewsTable :type="1" :queryParam="queryParam" ref="FrontNewsTable2">
              <template #action="record">
                <a-space>
                  <a-button type="primary" size="small" @click="view(record.record.record)">查看</a-button>
                  <a-popconfirm :title="'确定撤回吗?'" @confirm="revert(record.record.record, 2, 2)">
                    <a-button size="small">撤回</a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </FrontNewsTable>
          </a-tab-pane>
        </a-tabs>
      </template>
    </PageFormTableWrapper>
    <NewsEditForm :visible="data.visibleEdit" :item="data.item" :type="data.type" @child="onCloseEdit"></NewsEditForm>

    <NewsPublishForm :visible="data.visiblePublish" :item="data.item" :type="data.type" @child="onClosePublish"></NewsPublishForm>
    <InfoManuscriptDrawer></InfoManuscriptDrawer>
  </div>
</template>

<script>
import moment from 'moment'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { useRouter } from 'vue-router'
import { defineComponent, reactive, ref, onMounted, watch } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import FrontNewsTable from './compontents/table/FrontNewsTable'
import NewsEditForm from './compontents/drawer/NewsEditForm'
import { rpcPost } from '@/server/conf/index.js'
import { message } from 'ant-design-vue/es'
import seaResource from './compontents/seaResource.vue'
import NewsPublishForm from './compontents/drawer/NewsPublishForm'
import EventBus from '@/utils/bus'
import InfoManuscriptDrawer from './compontents/drawer/InfoManuscriptDrawer' //查看新闻稿件详情

export default defineComponent({
  props: {
    item: {
      type: Object,
    },
  },
  components: {
    PlusOutlined,
    FrontNewsTable,
    NewsEditForm,
    seaResource,
    NewsPublishForm,
    InfoManuscriptDrawer,
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

    const FrontNewsTable1 = ref()
    const FrontNewsTable2 = ref()

    const options = ref([]) //新闻类型

    const data = reactive({
      //新闻表单参数
      visibleEdit: false,
      visiblePublish: false,
      type: 'create',
      item: {},
    })

    //$refs.table.refresh(true)
    const refresh = (activeKey) => {
      //查询
      activeKey == 1 ? FrontNewsTable1.value.getList() : FrontNewsTable2.value.getList()
    }

    //重置
    const resetForm = (activeKey) => {
      searchFormRef.value.resetFields()
      activeKey == 1 ? FrontNewsTable1.value.getList() : FrontNewsTable2.value.getList()
    }

    const onCloseEdit = (bool) => {
      FrontNewsTable1.value.getList()
      if (bool == 2) {
        FrontNewsTable2.value.getList()
      }
      data.visibleEdit = false
    }

    const onClosePublish = (bool) => {
      FrontNewsTable1.value.getList()
      if (bool == 2) {
        FrontNewsTable2.value.getList()
      }
      data.visiblePublish = false
    }

    const hadleCreate = () => {
      //新建按钮
      data.type = 'create'
      data.item = {}
      data.visibleEdit = true
    }

    //发布新闻
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
      data.visibleEdit = true
    }

    const view = (record) => {
      //查看

      //删除
      let bean = {
        id: record.id,
      }
      rpcPost('getNewDetails', { bean }).then((res) => {
        if (res && res.code === 0) {
          record = res.data
        } else {
          message.warning(res.message)
        }
        EventBus.emit('handleViewNews', res.data)
      })
    }
    const del = (record, activeKey, operateType) => {
      //删除
      let bean = {
        id: record.id,
        type: operateType,
        areaid: userInfo.value.areaid,
      }
      rpcPost('updateNewsStatus', { bean }).then((res) => {
        if (res && res.code === 0) {
          message.success('已删除')
          activeKey == 1 ? FrontNewsTable1.value.getList() : FrontNewsTable2.value.getList()
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
        areaid: userInfo.value.areaid,
      }
      rpcPost('updateNewsStatus', { bean }).then((res) => {
        if (res && res.code === 0) {
          message.success('已撤回')
          activeKey == 2 ? FrontNewsTable2.value.getList() : FrontNewsTable1.value.getList()
        } else {
          message.warning(res.message)
        }
      })
    }

    const delList = (activeKey) => {
      //批量删除
      activeKey == 1 ? FrontNewsTable1.value.del() : FrontNewsTable2.value.del()
    }

    return {
      activeKey,
      FrontNewsTable1,
      FrontNewsTable2,
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
      hadleCreate,
      onClosePublish,
      onCloseEdit,
      refresh,
      delList,
      userInfo: {},
    }
  },
})
</script>
<style lang="scss" scoped></style>
