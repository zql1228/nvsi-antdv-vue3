<!-- 管理部门 通知公告→收件箱 -->
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
                <a-select ref="select" v-model:value="queryParam.sort">
                  <a-select-option v-for="item in options" :key="item.codeid" :value="item.codeid">{{ item.codevalue }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
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
          <a-tab-pane key="1" tab="未读通知">
            <McaworkNoticeResiveTable :type="0" :queryParam="queryParam" ref="McaworkNoticeResiveTable1">
              <template #action="record">
                <a-space>
                  <a-button type="primary" size="small" @click="hadleView(record.record.record)">
                    查看
                  </a-button>
                  <a-button type="primary" ghost size="small" @click="read(record.record.record)">
                    标为已读
                  </a-button>
                </a-space>
              </template>
            </McaworkNoticeResiveTable>
          </a-tab-pane>
          <a-tab-pane key="2" tab="已读通知" force-render
            ><McaworkNoticeResiveTable :type="1" :queryParam="queryParam" ref="McaworkNoticeResiveTable2">
              <template #action="record">
                <a-space>
                  <a-button type="primary" size="small" @click="hadleView(record.record.record)">
                    查看
                  </a-button>
                </a-space>
              </template>
            </McaworkNoticeResiveTable></a-tab-pane
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
import McaworkNoticeResiveTable from './components/McaworkNoticeResiveTable'
import McaworkNoticeFrom from './components/McaworkNoticeFrom'
import { rpcPost } from '@/server/conf/index.js'
import { message } from 'ant-design-vue/es'
import EventBus from '@/utils/bus'
import InfoNoticeAnmentDrawer from '@/pages/informationManagement/components/drawers/InfoNoticeAnmentDrawer' //查看通知公告详情
export default defineComponent({
  components: {
    PlusOutlined,
    McaworkNoticeResiveTable,
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

    const McaworkNoticeResiveTable1 = ref()
    const McaworkNoticeResiveTable2 = ref()

    const data = reactive({
      //新建通知公告表单参数
      visible: false,
      type: 'create',
      item: {},
    })

    const userInfo = ref(LocalGetUserInfo())

    const options = ref([])

    onMounted(() => {
      getOptions()
    })

    const getOptions = async () => {
      options.value = await rpcPost('getCodeValueOnLeap', { bean: { tableName: 'Notice_type0001' } }) //通知公告类型
      options.value = options.value.data
      options.value.unshift({ codevalue: '不限', codeid: '' })
    }

    const refresh = (activeKey) => {
      //查询
      activeKey == 1 ? McaworkNoticeResiveTable1.value.getList(true) : McaworkNoticeResiveTable2.value.getList(true)
    }

    //重置
    const resetForm = (activeKey) => {
      searchFormRef.value.resetFields()
      activeKey == 1 ? McaworkNoticeResiveTable1.value.getList(true) : McaworkNoticeResiveTable2.value.getList(true)
    }

    const hadleView = (record) => {
      //查看
      // data.type = 'view'
      // data.item = record
      // data.visible = true
      EventBus.emit('handleViewNotice', record)
    }

    const onClose = (bool) => {
      data.visible = false
    }

    const read = (record) => {
      //标为已读
      let bean = {
        userid: userInfo.value.userid,
        bulletinid: record.id,
      }
      rpcPost('updateSingleBulletinOnRead', { bean }).then((res) => {
        if (res && res.code === 0) {
          message.success('已标记')
          McaworkNoticeResiveTable1.value.getList('delete')
          McaworkNoticeResiveTable2.value ? McaworkNoticeResiveTable2.value.getList(false) : ''
        } else {
          message.warning(res.message)
        }
      })
    }

    return {
      data,
      activeKey,
      McaworkNoticeResiveTable1,
      McaworkNoticeResiveTable2,
      options,
      moment,
      // 查询条件参数
      queryParam,
      // mode, // recombination monomer
      searchFormRef,
      resetForm,
      hadleView,
      onClose,
      read,
      refresh,
    }
  },
})
</script>
<style lang="scss" scoped></style>
