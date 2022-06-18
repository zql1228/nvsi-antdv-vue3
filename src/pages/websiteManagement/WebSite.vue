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
                <a-input v-model:value="queryParam.showname" placeholder="资源显示名称" />
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
          serviceName="listSiteTree"
          :searchParameter="searchFunc"
          ref="table"
          size="middle"
          :rowKey="(record) => record.id"
          :columns="columns"
        >
          <template #total-action>
            <a-button
              type="primary"
              ghost
              size="small"
              @click="handleEdit(queryParam.resourceCode, 1)"
            >
              <template #icon>
                <PlusOutlined />
              </template>
              新建站点
            </a-button>
          </template>

          <template
            #resourcetype="{ record }"
          >{{ record.resourcetype == 1 ? '站点' : record.resourcetype == 2 ? '一级栏目' : '二级栏目' }}</template>
          <template #isshow="{ text, record }" >
            <a-popconfirm 
              :title="'确定操作' + record.showname + '吗?'"
              @confirm="switchClick(text, record)"
            
            >
              <a-switch  
 checked-children="显示" un-checked-children="不显示" :checked="text == 1" />
            </a-popconfirm>
          </template>
          <template #action="{ record }">
            <a-space>
              <a-button type="primary" ghost size="small" @click="handleEdit(record, 2)">查看</a-button>
              <a-button type="primary" ghost size="small" @click="handleEdit(record, 3)">修改</a-button>
              <a-popconfirm
                :title="'确定删除站点' + record.showname + '吗?'"
                @confirm="switchClick(3, record)"
              >
                <a-button type="primary" size="small">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </IATable>
      </template>
    </PageFormTableWrapper>

    <SiteEdit :visible="model.visible" :item="model.item" :type="model.type" @child="onClose"></SiteEdit>
  </div>
</template>

<script>
import moment from 'moment'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { useRouter } from 'vue-router'
import { defineComponent, reactive, ref, onMounted, watch } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { rpcPost } from '@/server/conf/index.js'
import ResourceEdit from './compontents/drawer/ResourceEdit'
import SiteEdit from './compontents/drawer/SiteEdit.vue'


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
    title: '资源编码',
    dataIndex: 'resourcecode',
    ellipsis: true,
  },
  {
    title: '资源名称',
    ellipsis: true,
    dataIndex: 'name',
  },
  {
    title: '显示名称',
    dataIndex: 'showname',
    ellipsis: true,
  },
  {
    title: '资源类型',
    dataIndex: 'resourcetype',
    ellipsis: true,
    slots: {
      customRender: 'resourcetype',
    },

  },
  {
    title: '排序',
    dataIndex: 'sort',
    ellipsis: true,
  },
  {
    title: '是否显示',
    dataIndex: 'isshow',
    ellipsis: true,
    slots: {
      customRender: 'isshow',
    },
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    slots: {
      customRender: 'action',
    },
    width: 220,
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
    SiteEdit
  },
  setup(props) {
    const userInfo = ref(LocalGetUserInfo())
    const searchFormRef = ref(null)
    const queryParam = reactive({
      areaid:userInfo.value.areaid,
    })
    const confirmLoading = ref(false)
    const advanced = ref(false)
    const selectedRowKeys = ref([])
    const selectedRows = ref([])
    const router = useRouter()
    const table = ref()
    onMounted(() => { })

    //
    let serachResourceCode = "0";
     let resourcecode

     const searchFunc = () => {
      return {
         areaid: userInfo.value.areaid,
         resourcecode: '0',
       }
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

    const expandedKeys = ref([]);
    const selectedKeys = ref([]);
    const treeData = ref([]);

    watch(expandedKeys, () => {
      // console.log('expandedKeys', expandedKeys);
    });
    watch(selectedKeys, () => {
      // console.log('selectedKeys', selectedKeys);
      queryParam.resourceCode = selectedKeys.value[selectedKeys.value.length - 1]
      getList()
    });

    onMounted(() => {
      onLoadData()
    })

    const onLoadData = treeNode => {
      return new Promise(resolve => {
        if (treeNode && treeNode.dataRef.children) {
          resolve();
          return;
        }
      

        if (!treeNode) {
          resourcecode = 0
        } else {
          resourcecode = treeNode.dataRef.resourcecode
        }
        let bean = {
           resourcecode: '0',
          areaid:userInfo.value.areaid,
        }
        rpcPost('listSiteTree', { bean }).then((res) => {
          if (res && res.code === 0) {
            treeDataHandle(res.data)
            if (!treeNode) {
              treeData.value = res.data
            } else {
              treeNode.dataRef.children = res.data
              treeData.value = [...treeData.value];
            }
            resolve();
          } else {
            message.warning('删除失败')
          }
        })
      });
    };
    const treeDataHandle = (nodes) => {
      nodes.forEach(item => {
        item.title = item.showname
        item.key = item.resourcecode
      })
    }

    const handleEdit = (resourcecode, num) => {
      // 新建资源
      model.item = resourcecode
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
      rpcPost('updateResourceStatus', { bean })
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
      expandedKeys,
      selectedKeys,
      treeData,
      onLoadData,
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
