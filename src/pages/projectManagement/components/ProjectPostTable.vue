<!--发布项目 项目岗位管理tab页 -->
<template>
  <div style="height: 740px !important">
    <PageFormTableWrapper>
      <template #searchForm>
        <!-- 岗位搜索条件 -->
        <a-form ref="formRef" :label-col="labelCol" :wrapper-col="wrapperCol" :model="queryParam">
          <a-row :gutter="24">
            <a-col :md="6" :sm="24">
              <a-form-item label="岗位名称">
                <a-input v-model:value="queryParam.albx0072" placeholder="" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item>
                <a-space>
                  <a-button type="primary" @click="refresh">查询</a-button>
                  <a-button style="margin-left: 8px" @click="resetForm">重置</a-button>
                </a-space>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </template>
      <!-- 岗位列表 -->
      <template #table>
        <IATable
          ref="table"
          size="middle"
          :rowKey="(record) => record.id"
          :columns="columns"
          serviceName="groupProjectSelPostFortis"
          :searchParameter="searchFunc"
        >
          <template #total-title="{ totalData: total }">
            查询合计：共
            <span>
              {{ total.sum }}
            </span>
            岗位。
          </template>
          <template #total-action>
            <a-button type="primary" @click="handleAdd" v-if="query.type != 'view'">
              <template #icon><PlusOutlined /></template>
              新建岗位
            </a-button>
          </template>
          <!-- <template #description="{ text: description }">
            {{ description }}
          </template> -->
          <template #action="record">
            <a-space>
              <a-button type="primary" size="small" @click="handleEdit(record.record)" :disabled="query.type == 'view'"> 修改 </a-button>
              <a-popconfirm
                :title="'是否删除岗位【' + record.record.albx0072 + '】?'"
                @confirm="delBtn(record.record)"
                :disabled="query.type == 'view'"
                v-show="query.projectType == 1 || query.isRepair"
              >
                <a-button size="small" :disabled="query.type == 'view'" v-show="query.projectType == 1 || query.isRepair"> 删除 </a-button>
              </a-popconfirm>
              <a-button
                size="small"
                @click="delBtn(record.record)"
                :disabled="query.type == 'view'"
                v-show="query.projectType != 1 && !query.isRepair"
              >
                删除
              </a-button>
            </a-space>
          </template>
        </IATable>
      </template>
    </PageFormTableWrapper>
    <ProjectPostEdit :visible="visible" :model="item" @child="child"></ProjectPostEdit>
    <a-modal
      title="删除岗位"
      :visible="del.visible"
      @cancel="del.visible = false"
      @ok="handleSub(del.item)"
      :confirm-loading="del.confirmLoading"
      :maskClosable="false"
      okText="删除"
    >
      <p v-show="query.projectType != 4">删除【{{ del.item.albx0072 }}】岗位会将岗位内的志愿者踢出项目，无法恢复，是否确认删除岗位</p>
      <p v-show="query.projectType == 4">是否确认删除岗位【{{ del.item.albx0072 }}】</p>
    </a-modal>
  </div>
</template>

<script>
import ProjectPostEdit from './ProjectPostEdit.vue'
import { LocalGetUserInfo, LocalGetProjectInfo } from '@/utils/localStorage.js'
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { rpcPost } from '@/server/conf/index.js'
export default defineComponent({
  components: { ProjectPostEdit, PlusOutlined },
  props: {},
  setup(props) {
    const visible = ref(false)
    const loading = ref(false)
    const formRef = ref(null)
    const queryParam = reactive({ albx0072: '' }) // 查询参数
    const userInfo = ref(LocalGetUserInfo())
    const query = ref({}) //路由参数
    const item = ref() //修改岗位时 传递给表单的参数
    const table = ref()
    const del = reactive({
      //刪除崗位彈窗
      visible: false,
      confirmLoading: false,
      item: {},
    })
    onMounted(() => {
      query.value = LocalGetProjectInfo()
    })
    const refresh = () => {
      //查询按钮
      if (query.value.projectId) {
        table.value.refresh(true)
      } else {
        message.warning('请先去基本信息页生成项目再来!')
      }
    }

    const resetForm = () => {
      //重置按钮
      queryParam.albx0072 = ''
      formRef.value.resetFields()
      table.value.refresh(true)
    }

    const child = (arg) => {
      visible.value = false
      if (arg) {
        //true表明数据有改变 需要刷新列表
        table.value.refresh(true)
      }
    }
    const searchFunc = () => {
      query.value = LocalGetProjectInfo()
      return {
        albx0021: query.value.areaId ? query.value.areaId : null, // 项目区划
        proId: query.value.projectId ? query.value.projectId : null, // 项目ID
        albx0072: queryParam.albx0072 ? queryParam.albx0072 : null, //查询条件
      }
    }

    const handleAdd = () => {
      //新建岗位
      item.value = {
        operation: 'create',
      }
      visible.value = true
    }
    const handleEdit = (record) => {
      //修改岗位
      item.value = {
        operation: 'modify',
        record: record,
      }
      visible.value = true
    }

    const delBtn = (record) => {
      //刪除岗位按鈕 projectType
      if (query.value.projectType == 1 || query.value.isRepair) {
        //未发布项目 补录未发布项目
        handleSub(record)
      } else {
        //其它的状态的项目
        if (query.value.projectType == 4) {
          //运行中的项目
          let bean = {
            gwid: record.id, //岗位id
            albx0021: query.value.areaId, //项服务区域
          }
          rpcPost('getPostVolSumortis', { bean }).then((res) => {
            if (res) {
              //该岗位没有志愿者
              del.item = record
              del.visible = true
            } else {
              //该岗位有志愿者
              message.warning('项目岗位存在志愿者，无法删除')
              return
            }
          })
        } else {
          del.item = record
          del.visible = true
        }
      }
    }

    const handleSub = (record) => {
      //删除岗位
      let bean = {
        albx0021: query.value.areaId, //区划
        gwid: record.id, //列表数据中的id
        id: query.value.projectId, //项目id
      }
      del.confirmLoading = true
      rpcPost('groupProjectDelPostFortis', { bean }).then((res) => {
        if (res && res.message === '成功') {
          del.visible = false
          message.success('成功删除')
          table.value.refresh(true)
        } else {
          message.warning(res.message)
        }
        del.confirmLoading = false
      })
    }
    return {
      query,
      table,
      visible,
      del,
      loading,
      formRef,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
      queryParam,
      userInfo,
      resetForm,
      columns: [
        {
          title: '序号',
          slots: {
            customRender: 'serial',
          },
          width: 80,
          align: 'center',
        },
        {
          title: '岗位名称',
          dataIndex: 'albx0072',
          width: '20%',
          ellipsis: true,
        },
        {
          title: '计划招募人数',
          dataIndex: 'albx0077',
          width: '20%',
          ellipsis: true,
        },
        {
          title: '已加入成员',
          dataIndex: 'albx0079',
          width: '20%',
          customRender: ({ text }) => {
            return text ? text : '0'
          },
          ellipsis: true,
        },
        // {
        //   title: '岗位服务时长（小时）',
        //   dataIndex: 'sum',
        //   width: '20%',
        //   ellipsis: true,
        // },
        {
          title: '操作',
          dataIndex: 'action',
          slots: {
            customRender: 'action',
          },
          width: 200,
          align: 'center',
        },
      ],
      item,
      searchFunc,
      refresh,
      child,
      handleAdd,
      handleEdit,
      handleSub,
      delBtn,
    }
  },
})
</script>
<style lang="scss" scoped></style>
