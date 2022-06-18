<!--  -->
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
              <a-form-item label="显示名称" name="re">
                <a-input v-model:value="queryParam.albx6202" placeholder="专题专栏名称" />
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
          serviceName="listSpecialColumn"
          :searchParameter="searchFunc"
          ref="table"
          size="middle"
           :columns="columns"
        >
          <template #total-action>
            <a-button
              type="primary"
              ghost
              size="small"
              @click="handleEdit(queryParam.areaid, 1)"
            >
              <template #icon>
                <PlusOutlined />
              </template>
              创建新专题
            </a-button>
          </template>

          <template
            #albx6208="{ record }"
          >
          {{ record.albx6208 == 1 ? '图片专题' : record.albx6208 == 2 ? '文字专题' : record.albx6208 == 3 ? '普通专题':'轮播专题s' }}</template>
         
          
            <template #albx6207="{ text, record }">
            <a-popconfirm
              :title="'确定操作' + record.albx6202 + '吗?'"
              @confirm="switchClick(text, record)"
            >
              <a-switch checked-children="启用" un-checked-children="停用" :checked="text == 1" />
            </a-popconfirm>
          </template>
           <template #action="{ record }">
            <a-space>
              <a-button type="primary" ghost size="small" @click="handleEdit(record, 2)">查看</a-button>
              <a-button type="primary" ghost size="small" @click="handleEdit(record, 3)">修改</a-button>
              <a-popconfirm
                :title="'确定删除专题' + record.albx6202 + '吗?'"
                @confirm="switchClick(3, record)"
              >
                <a-button type="primary" size="small">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </IATable>
      </template>
    </PageFormTableWrapper>
    <SpecialColumnEdit :visible="model.visible" :item="model.item" :type="model.type" @child="onClose"></SpecialColumnEdit>
  </div>
</template>

<script>
import moment from 'moment'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { useRouter } from 'vue-router'
import { defineComponent, reactive, ref, onMounted, watch } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { rpcPost } from '@/server/conf/index.js'
import SpecialColumnEdit from './compontents/drawer/SpecialColumnEdit'

const columns = [
  {
    title: '序号',
    slots: {
      customRender: 'serial',
    },
    width: 100,
    align: 'center',
  },
  {
    title: '标题',
    dataIndex: 'albx6202',
    ellipsis: true,
  },
  {
    title: '跳转链接',
    ellipsis: true,
    dataIndex: 'albx6206',
  },
  {
    title: '专题类型',
    dataIndex: 'albx6208',
    ellipsis: true,
    slots: {
      customRender: 'albx6208',
    },
  },
  {
    title: '启用状态',
    dataIndex: 'albx6207',
    ellipsis: true,
    slots: {
      customRender: 'albx6207',
    },
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    slots: {
      customRender: 'action',
    },
    width: 200,
    align: 'center',
  },
]
export default defineComponent({
  props: {
    projectType: {
      type: String,
      default: '0',
    },
  },
  components: {
    PlusOutlined,

SpecialColumnEdit,
  },
  setup(props) {
    const userInfo = ref(LocalGetUserInfo())
    const searchFormRef = ref(null)
    const queryParam = reactive({
       areaid: userInfo.value.areaid === '000000000000000000' ? '110000000000000000' : userInfo.value.areaid,
    })
    const confirmLoading = ref(false)
    const advanced = ref(false)
    const selectedRowKeys = ref([])
    const selectedRows = ref([])
    const router = useRouter()
    const table = ref()
    onMounted(() => { })

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

  
   

    const handleEdit = (reocrd, num) => {
      // 新建资源
      model.item = reocrd
      model.visible = true
      if (num == 1) {
        model.type = 'create'
      }
      if (num == 2) {
        model.type = 'view'
      }
      if (num == 3) {
        model.type = 'modify'
      }
    }

    const model = reactive({
      visible: false,
    })
    const onClose = (bool) => {
      getList()
      model.visible = false
    }


    let type
    const switchClick = (text, record) => {
      if (text == 1 || text == 0) {
        type = text == 1 ? 1 : 2
      } else if (text == 3) {
        type = 3
      }
      //停用 按钮
      let bean = {
        areaid: userInfo.value.areaid === '000000000000000000' ? '110000000000000000' : userInfo.value.areaid,
        //默认不显示 2是启用
        type: type,
        id: record.id,
        userFlag: userInfo.value.userflag,
      }
      rpcPost('updateSpecialColumnStatus', { bean })
        .then((res) => {
          if (res && res.code === 0) {
            // message.success('停用成功')
            table.value.refresh(true)
            getList()
          } else {
            // message.warning('停用失败')
          }
        })
        .catch((error) => {
          // message.warning('停用失败')
        })
    }
    return {
      model,
      table,
      moment,
      searchFunc,
      // 查询条件参数
      queryParam,
      // mode, // recombination monomer
      searchFormRef,
      confirmLoading,
      columns,
      // 高级搜索 展开/关闭
      advanced,

      selectedRowKeys,
      selectedRows,

      // handleAdd,
      resetForm,
      getList,
      handleEdit,
      onClose,
      switchClick,
    }
  },
})
</script>
<style lang="scss" scoped></style>
