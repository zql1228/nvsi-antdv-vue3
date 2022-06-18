<!--发布项目 签到地点管理tab页 -->
<template>
  <div style="height: 740px !important; padding-bottom: 80px">
    <PageFormTableWrapper>
      <!-- 签到地点搜索条件 -->
      <template #searchForm>
        <a-form
          :label-col="{
            xs: { span: 24 },
            sm: { span: 6 },
          }"
          :wrapper-col="{
            xs: { span: 24 },
            sm: { span: 18 },
          }"
          ref="formRef"
          :model="queryParam"
          layout="horizontal"
        >
          <a-row :gutter="24">
            <a-col :md="6" :sm="24">
              <a-form-item label="地点搜索">
                <a-input v-model:value="queryParam.albx5606" placeholder="" />
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

      <!-- 成员列表 -->
      <template #table>
        <IATable
          ref="table"
          size="middle"
          :rowKey="(record) => record.id"
          :columns="columns"
          serviceName="listProjectSelPlacePostFortis"
          :searchParameter="searchFunc"
        >
          <template #total-title="{ totalData: total }">
            查询合计：共
            <span>
              {{ total.sum }}
            </span>
            打卡地点。
          </template>
          <template #total-action>
            <a-button type="primary" @click="handleAdd()" v-show="query.type != 'view'">
              <template #icon><PlusOutlined /></template>
              新增打卡地点
            </a-button>
          </template>
          <template #albx5604="{ text, record }">
            {{ text == 1 ? '签到点' : text == 2 ? '签退点' : '签到/签退点' }}
          </template>
          <template #description="text">
            {{ text }}
          </template>
          <template #action="record">
            <a-space>
              <a-button type="primary" size="small" @click="handleEdit(record.record)" :disabled="query.type == 'view'"> 修改 </a-button>
              <a-popconfirm :title="'确定删除该打卡地点吗?'" @confirm="handleSub(record.record)" :disabled="query.type == 'view'">
                <a-button size="small" :disabled="query.type == 'view'"> 删除 </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </IATable>
      </template>
    </PageFormTableWrapper>
    <ProjectSelPlaceEdit :visible="visible" :model="item" @child="child"></ProjectSelPlaceEdit>
  </div>
</template>

<script>
import ProjectSelPlaceEdit from './ProjectSelPlaceEdit.vue'
import { rpcPost } from '@/server/conf/index.js'
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { LocalGetProjectInfo } from '@/utils/localStorage.js'
export default defineComponent({
  components: { ProjectSelPlaceEdit, PlusOutlined },
  props: {},
  setup() {
    const visible = ref(false)
    const item = ref()
    const table = ref()
    const loading = ref(false)
    const formRef = ref(null)
    const query = ref({
      type: 'view',
    }) //路由参数
    // 查询参数
    const queryParam = reactive({ albx5606: '' })
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
      queryParam.albx5606 = ''
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
        proId: query.value.projectId ? query.value.projectId : '',
        albx5606: queryParam.albx5606 ? queryParam.albx5606 : '',
      }
    }

    const handleAdd = () => {
      //新增打卡地点
      item.value = {
        operation: 'create',
      }
      visible.value = true
    }
    const handleEdit = (record) => {
      //修改打卡地点
      visible.value = true
      item.value = {
        operation: 'modify',
        record: record,
      }
    }
    const handleSub = (record) => {
      //删除打卡地点
      let bean = {
        id: record.id,
      }
      rpcPost('groupProjectDelPlacePostFortis', { bean }).then((res) => {
        if (res && res.code === 0 && res.message === '成功') {
          message.success('成功删除')
          table.value.refresh(true)
        } else {
          message.warning(res.message)
        }
      })
    }

    return {
      searchFunc,
      query,
      table,
      visible,
      item,
      loading,
      formRef,
      queryParam,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
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
          title: '打卡地址',
          dataIndex: 'albx5606',
          ellipsis: true,
          width: '40%',
          ellipsis: true,
        },
        {
          title: '类型',
          dataIndex: 'albx5604',
          slots: {
            customRender: 'albx5604',
          },
          width: 150,
          width: '20%',
          ellipsis: true,
        },
        {
          title: '打卡范围(米)',
          dataIndex: 'albx5605',
          width: 150,
          width: '20%',
          ellipsis: true,
        },
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
      resetForm,
      refresh,
      child,
      handleAdd,
      handleEdit,
      handleSub,
    }
  },
})
</script>
<style lang="scss" scoped></style>
