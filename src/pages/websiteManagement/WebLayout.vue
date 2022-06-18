<!--布局列表  -->
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
            <a-col :md="5" :sm="24">
              <a-form-item label="显示名称" name="showname">
                <a-input v-model:value="queryParam.showname" placeholder="显示名称" />
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <a-form-item label="布局类型" name="layouttype">
                <a-select ref="select" v-model:value="queryParam.layouttype" :options="options" placeholder="布局类型"></a-select>
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <a-form-item label="布局结构" name="structuretype">
                <a-select ref="select" v-model:value="queryParam.structuretype" :options="options1" placeholder="布局结构"></a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item>
                <a-space>
                  <a-button type="primary" @click="getList">查询</a-button>
                  <a-button @click="resetForm">重置</a-button>
                </a-space>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </template>
      <template #table>
        <IATable
          serviceName="getLayoutList"
          :searchParameter="searchFunc"
          ref="table"
          size="middle"
          :rowKey="(record) => record.id"
          :columns="columns"
        >
          <template #total-action>
            <a-button type="primary" size="small" @click="handleEdit(record)">
              <template #icon>
                <PlusOutlined />
              </template>
              新建布局
            </a-button>
          </template>
          <template #action="{record}">
            <a-space>
              <a-button slot="action" type="primary" ghost size="small" @click="addLayout(record)">布局配置</a-button>
              <a-button slot="action" type="primary" ghost size="small" @click="updateLayout(record)">修改</a-button>
              <a-popconfirm :title="'确定删除吗?'" @confirm="removeLayout(record)">
                <a-button slot="action" type="primary" size="small">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </IATable>
      </template>
    </PageFormTableWrapper>
    <!-- 新增布局 -->
    <LayoutAdd :visible="model.visible" :item="model.item" @child="onClose"></LayoutAdd>
    <!-- 修改布局 -->
    <UpdateLayout :visible="model.visible2" :item="model.item" @child="onClose2"></UpdateLayout>
    <!-- 布局配置 -->
    <LayoutEdit :visible="model.visible3" :item="model.item" @child="onClose3"></LayoutEdit>
  </div>
</template>

<script>
import { message } from 'ant-design-vue'
import moment from 'moment'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { useRouter } from 'vue-router'
import { defineComponent, reactive, ref, onMounted, watch } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { rpcPost } from '@/server/conf/index.js'
import ResourceEdit from './compontents/drawer/ResourceEdit'
import LayoutAdd from './compontents/LayoutAdd'
import UpdateLayout from './compontents/UpdateLayout'
import LayoutEdit from './compontents/LayoutEdit'
const columns = [
  {
    title: '序号',
    slots: {
      customRender: 'serial',
    },
    width: 80,
    align: 'center',
  },
  {
    title: '资源名称',
    ellipsis: true,
    dataIndex: 'name',
    width: 150,
  },
  {
    title: '显示名称',
    dataIndex: 'showname',
    ellipsis: true,
    width: 150,
  },
  {
    title: '颜色',
    dataIndex: 'color',
    ellipsis: true,
    width: 100,
  },
  {
    title: '排序',
    dataIndex: 'sort',
    ellipsis: true,
    width: 100,
  },
  {
    title: '宽度',
    dataIndex: 'width',
    ellipsis: true,
    width: 100,
  },
  {
    title: '布局类型',
    dataIndex: 'layouttype',
    ellipsis: true,
    width: 200,
    customRender: function(params) {
      if (params.text == '1') {
        return '页头'
      } else if (params.text == '2') {
        return '导航'
      } else if (params.text == '3') {
        return '中间'
      } else if (params.text == '4') {
        return '页尾'
      } else if (params.text == '5') {
        return '栏目'
      }
    },
  },
  {
    title: '布局结构',
    dataIndex: 'structuretype',
    ellipsis: true,
    width: 200,
    customRender: function(params) {
      if (params.text == '2') {
        return '上下'
      } else {
        return '左右'
      }
    },
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    slots: {
      customRender: 'action',
    },
    width: 350,
    align: 'center',
  },
]
export default defineComponent({
  props: {
    item: {
      type: Object,
    },
  },
  components: {
    PlusOutlined,
    ResourceEdit,
    LayoutAdd,
    UpdateLayout,
    LayoutEdit,
  },
  setup(props) {
    const userInfo = ref(LocalGetUserInfo())
    const searchFormRef = ref(null)
    const queryParam = reactive({
      name: '',
      showname: '',
      layouttype: '',
      structuretype: '',
    })
    const confirmLoading = ref(false)
    const advanced = ref(false)
    const router = useRouter()
    const table = ref()
    onMounted(() => {})

    const searchFunc = () => {
      return queryParam
    }

    //重置
    const resetForm = () => {
      searchFormRef.value.resetFields()
      getList()
    }

    //查询按钮
    const getList = () => {
      table.value.refresh(true)
    }

    //新建
    const handleEdit = (record) => {
      model.item = record
      model.visible = true
    }

    //抽屉参数
    const model = reactive({
      visible: false,
      visible2: false,
      visible3: false,
      item: {},
    })

    //修改布局 列表行
    const updateLayout = (record) => {
      model.item = record
      model.visible2 = true
    }

    //布局配置列表
    const addLayout = (record) => {
      if (queryParam.structuretype != '1') {
        message.warning('布局结构为左右才能操作')
        return
      }
      model.item = record
      model.visible3 = true
    }

    //删除方法
    const removeLayout = (record) => {
      let bean = { id: record.id }
      rpcPost('removeLayout', { bean }).then((res) => {
        if (res && res.code === 0) {
          message.success('删除成功')
          table.value.refresh(true)
        } else {
          message.error(res.message)
        }
      })
    }

    const onClose = () => {
      model.visible = false
      table.value.refresh(true)
    }

    const onClose2 = () => {
      model.visible2 = false
      table.value.refresh(true)
    }

    const onClose3 = () => {
      model.visible3 = false
      table.value.refresh(true)
    }

    const options = ref([
      { value: '1', label: '页头' },
      { value: '2', label: '导航' },
      { value: '3', label: '中间' },
      { value: '4', label: '页尾' },
      { value: '5', label: '栏目' },
    ])

    const options1 = ref([
      { value: '1', label: '左右' },
      { value: '2', label: '上下' },
    ])
    return {
      options,
      options1,
      model,
      table,
      moment,
      searchFunc,
      // 查询条件参数
      queryParam,
      searchFormRef,
      confirmLoading,
      columns,
      // 高级搜索 展开/关闭
      advanced,
      removeLayout,
      resetForm,
      getList,
      handleEdit,
      updateLayout,
      addLayout,
      onClose,
      onClose2,
      onClose3,
    }
  },
})
</script>
<style lang="scss" scoped></style>
