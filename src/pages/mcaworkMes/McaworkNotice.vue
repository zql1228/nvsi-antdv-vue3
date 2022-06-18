<!-- 管理部门 通知公告→发件箱 -->
<template>
  <div>
    <!-- recombination monomer -->
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
                <a-input v-model:value="queryParam.title" placeholder="请输入公告标题"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="通知类型" name="sort">
                <a-select ref="select" v-model:value="queryParam.sort" placeholder="通知类型">
                  <a-select-option v-for="item in options" :key="item.codeid" :value="item.codeid">{{ item.codevalue }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <a-form-item>
                <a-space>
                  <a-button type="primary" @click="refresh(activeKey)">
                    查询
                  </a-button>
                  <a-button @click="resetForm(activeKey)">
                    重置
                  </a-button>
                </a-space>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </template>
      <template #table>
        <a-tabs v-model:activeKey="activeKey" type="card">
          <template #tabBarExtraContent>
            <!-- <a-button type="primary" style="margin-right:8px;" @click="delList(activeKey)">批量删除</a-button> -->
            <a-button type="primary" @click="hadleCreate">新建</a-button>
          </template>
          <a-tab-pane key="1" tab="未发送">
            <McaworkNoticeTable :type="2" :queryParam="queryParam" ref="McaworkNoticeTable1">
              <template #action="record">
                <a-space>
                  <a-button type="primary" size="small" @click="send(record.record.record)">
                    发送
                  </a-button>
                  <a-button type="primary" ghost size="small" @click="edit(record.record.record)">
                    修改
                  </a-button>
                  <a-popconfirm :title="'确定删除吗?'" @confirm="del(record.record.record, 1)">
                    <a-button size="small">
                      删除
                    </a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </McaworkNoticeTable>
          </a-tab-pane>
          <a-tab-pane key="2" tab="已发送" force-render
            ><McaworkNoticeTable :type="1" :queryParam="queryParam" ref="McaworkNoticeTable2">
              <template #action="record">
                <a-space>
                  <a-button type="primary" size="small" @click="view(record.record.record)">
                    查看
                  </a-button>
                  <!-- <a-popconfirm :title="'确定删除吗?'" @confirm="del(record.record.record, 2)">
                    <a-button size="small">
                      删除
                    </a-button>
                  </a-popconfirm> -->
                </a-space>
              </template>
            </McaworkNoticeTable></a-tab-pane
          >
        </a-tabs>
      </template>
    </PageFormTableWrapper>
    <McaworkNoticeFrom :visible="data.visible" :item="data.item" :type="data.type" @child="onClose"></McaworkNoticeFrom>
    <InfoNoticeAnmentDrawer></InfoNoticeAnmentDrawer>
  </div>
</template>

<script>
import moment from 'moment'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { useRouter } from 'vue-router'
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import McaworkNoticeTable from './components/McaworkNoticeTable'
import McaworkNoticeFrom from './components/McaworkNoticeFrom' //编辑通知公告
import { rpcPost } from '@/server/conf/index.js'
import { message } from 'ant-design-vue/es'
import EventBus from '@/utils/bus'
import InfoNoticeAnmentDrawer from '@/pages/informationManagement/components/drawers/InfoNoticeAnmentDrawer' //查看通知公告详情
export default defineComponent({
  components: {
    PlusOutlined,
    McaworkNoticeTable,
    McaworkNoticeFrom,
    InfoNoticeAnmentDrawer,
  },
  setup(props) {
    const activeKey = ref('1') //tab页
    const searchFormRef = ref(null)
    const queryParam = reactive({
      title: '', //标题
      sort: '', //类型
    })
    const confirmLoading = ref(false)

    const McaworkNoticeTable1 = ref()
    const McaworkNoticeTable2 = ref()

    const options = ref([]) //通知公告类型

    const data = reactive({
      //通知公告表单参数
      visible: false,
      type: 'create',
      item: {},
    })

    onMounted(() => {
      getOptions()
    })

    const getOptions = async () => {
      options.value = await rpcPost('getCodeValueOnLeap', { bean: { tableName: 'Notice_type0001' } }) //通知公告类型
      options.value = options.value.data
      options.value.unshift({ codevalue: '不限', codeid: '' })
    }

    const hadleCreate = () => {
      //新建按钮
      data.type = 'create'
      data.item = {}
      data.visible = true
    }

    //$refs.table.refresh(true)
    const refresh = (activeKey) => {
      //查询
      activeKey == 1 ? McaworkNoticeTable1.value.getList(true) : McaworkNoticeTable2.value.getList(true)
    }

    //重置
    const resetForm = (activeKey) => {
      searchFormRef.value.resetFields()
      activeKey == 1 ? McaworkNoticeTable1.value.getList(true) : McaworkNoticeTable2.value.getList(true)
    }

    const onClose = (bool) => {
      //0没有任何操作 1修改或暂存 2发送
      if (bool == 1) {
        McaworkNoticeTable1.value.getList(false)
      } else if (bool == 2) {
        //新建 发送
        McaworkNoticeTable1.value.getList(false)
        McaworkNoticeTable2.value.getList(false)
      } else if (bool == 3) {
        //修改时发送
        McaworkNoticeTable1.value.getList('delete')
        McaworkNoticeTable2.value.getList(false)
      }
      data.visible = false
    }

    const send = (record) => {
      //发送
      let bean = {
        bulletinid: record.id,
      }
      rpcPost('updateSendStatus', { bean }).then((res) => {
        if (res && res.code === 0) {
          message.success('发送成功')
          McaworkNoticeTable1.value.getList('delete')
          McaworkNoticeTable2.value ? McaworkNoticeTable2.value.getList(false) : ''
        } else {
          message.warning(res.message)
        }
      })
    }

    const edit = (record) => {
      //修改
      data.type = 'modify'
      data.item = record
      data.visible = true
    }

    const del = (record, activeKey) => {
      //删除
      let bean = {
        bulletinid: record.id,
      }
      rpcPost('deleteBulletin', { bean }).then((res) => {
        if (res && res.code === 0) {
          message.success('已删除')
          activeKey == 1 ? McaworkNoticeTable1.value.getList('delete') : McaworkNoticeTable2.value.getList('delete')
        } else {
          message.warning(res.message)
        }
      })
    }

    const view = (record) => {
      //查看
      record.isShowRead = true // 是否显示该通知公告已读人数  true显示
      data.type = 'view'
      data.item = record
      data.visible = true
      // EventBus.emit('handleViewNotice', record)
    }

    const delList = (activeKey) => {
      //批量删除
      activeKey == 1 ? McaworkNoticeTable1.value.del() : McaworkNoticeTable2.value.del()
    }

    return {
      activeKey,
      McaworkNoticeTable1,
      McaworkNoticeTable2,
      data,
      options,
      moment,
      // 查询条件参数
      queryParam,
      // mode, // recombination monomer
      searchFormRef,
      resetForm,
      onClose,
      hadleCreate,
      send,
      edit,
      del,
      view,
      refresh,
      delList,
    }
  },
})
</script>
<style lang="scss" scoped></style>
