<!--样式列表  -->
<template>
  <div>
    <PageTreeAndFormTableWrapper :showLeftTree="true">
      <template #leftTree>
        <a-tree
          v-model:expandedKeys="expandedKeys"
          v-model:selectedKeys="selectedKeys"
          :load-data="onLoadData"
          :tree-data="treeData"
        />
      </template>
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
            <a-form-item label="布局名称:" name="name">
              <a-input
               placeholder="布局名称" v-model:value="queryParam.name" :showLevel="3" />
            </a-form-item>
          </a-col>
       
          <a-col :md="5" :sm="24">
            <a-form-item label="显示名称" name="showname">
              <a-input
               placeholder="显示名称" v-model:value="queryParam.showname" :showLevel="3" />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item>
              <a-space>
                <a-button type="primary" @click="getList">
                  查询
                </a-button>
                <a-button @click="resetForm">
                  重置
                </a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </template>
    <template #table>
      <IATable
        serviceName="getLayoutRowList"  
        :searchParameter="searchFunc"
        ref="table"
        size="middle"
        :rowKey="(record) => record.id"
        :columns="columns"
      > 
       <template #action="{record}">
        <a-button slot="action" type="primary" ghost size="small"  @click="updateStyleRow(record)">修改</a-button>
         <a-button slot="action" type="primary" ghost style="margin-left:10px;"  size="small"  @click="addStyleCol(record)">配置</a-button>
         <a-button slot="action" type="primary" ghost style="margin-left:10px;" size="small"  @click="styleColList(record)">查看列</a-button>
        <a-popconfirm :title="'确定删除吗?'" @confirm="removeLayoutRow(record)">
          <a-button slot="action" type="primary" style="margin-left:10px;"  size="small" >删除</a-button>
        </a-popconfirm>
      </template>
        <template #total-action>
          <a-button type="primary" @click="handleAdd">
            <template #icon><PlusOutlined /></template>
            新建行
          </a-button>
        </template>
      </IATable>
    </template>
    </PageTreeAndFormTableWrapper>
    <!-- 修改行 -->
   <UpdateStyleRowTable :visible="visible1" :item="item" @child="onClose1"></UpdateStyleRowTable>
   <!-- 新增列 -->
   <StyleColAddTable :visible="visible2" :item="item" @child="onClose2"></StyleColAddTable>
   <!-- 查看每行里的列 -->
   <ListStyleColTable :visible="visible3" :item="item" @child="onClose3"></ListStyleColTable>
   <!-- 新增行 -->
   <StylesEdit :visible="visible4" :item="item" @child="onClose4" :layoutid="layoutid"></StylesEdit>
  </div>
</template>

<script>
import { message } from "ant-design-vue";
import moment from 'moment'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { useRouter } from 'vue-router'
import { defineComponent, reactive, ref, onMounted, watch ,toRefs} from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { rpcPost } from '@/server/conf/index.js'
import UpdateStyleRowTable from './compontents/UpdateStyleRowTable'
import StyleColAddTable from './compontents/StyleColAddTable'
import ListStyleColTable from './compontents/ListStyleColTable'
import StylesEdit from  './compontents/StylesEdit'
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
    title: '名称',
    dataIndex: 'title',
    ellipsis: true,
    width: 150,
    align: 'center',
  },
  {
    title: '高度',
    dataIndex: 'height',
    ellipsis: true,
    width: 150,
    align: 'center',
  },
  {
    title: '行配比',
    dataIndex: 'proportion',
    ellipsis: true,
    width: 150,
    align: 'center',
  },
  {
    title: '列数',
    dataIndex: 'colcount',
    ellipsis: true,
    width: 150,
    align: 'center',
  },
  {
    title: '是否显示',
    dataIndex: 'ishidden',
    ellipsis: true,
    width: 150,
    align: 'center',
    customRender:function (text) {
      if(text == 0){
          return "不显示";
      }else {
          return "显示";
      }
    }
  },
  {
    title: '排序',
    dataIndex: 'sort',
    ellipsis: true,
    width:150,
    align: 'center',
  },
   {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    slots: {
      customRender: 'action',
    },
    width: 280,
    align: 'center',
  },
]

export default defineComponent({
  props: {
    layoutid: {
      type: String,
      default: '',
    },
    item:{
      type:Object,
      default:{},
    }
  },
  components: {
    PlusOutlined,
    //修改列       修改
    UpdateStyleRowTable,
    //新建列       配置
    StyleColAddTable,
    //行内列 列表  查看
    ListStyleColTable,
    //新建行      新建   
    StylesEdit,
  },
  setup(props) {
    const userInfo = ref(LocalGetUserInfo())
    const searchFormRef = ref(null)
    const queryParam = reactive({
      id : "",
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
    //重置表单
    const resetForm = () => {
      searchFormRef.value.resetFields()
      getList()
    }
    //列表
    const getList = () => {
      table.value.refresh(true)
    }
    const expandedKeys = ref([]);
    const selectedKeys = ref([]);
    const treeData = ref([]);

    watch(expandedKeys, () => {
      console.log('expandedKeys', expandedKeys);
    });

    //监听树的变化
    watch(selectedKeys, () => {
      console.log('selectedKeys', selectedKeys);
      //变化时resourcecodes随着一起变化，将变化后code传到列表接口
      // queryParam.resourceCode = selectedKeys.value[selectedKeys.value.length - 1]
      queryParam.id =  selectedKeys.value[selectedKeys.value.length - 1]
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
        let id

        if (!treeNode) {
          id = ''
        } else {
          id = treeNode.dataRef.id
        }
        let bean = {
          id: id,
        }
        rpcPost('getLayoutList', { bean }).then((res) => {
          console.log(res)
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
        item.key = item.id
        item.isLeaf = true
      })
    }

    const model= reactive({
      visible1:false,
      visible2:false,
      visible3:false,
      visible4:false,
      layoutid:"",
      item:{} ,
    })

    //新建
    const handleAdd = ()=>{
        model.visible4 = true
        model.layoutid = selectedKeys.value[selectedKeys.value.length - 1]
        console.log("layoutID："+model.layoutid);
    }

    //修改
    const updateStyleRow = (record)=>{
         model.item = record
         model.visible1 = true
    }

    //查看
    const styleColList = (record)=>{
           model.item = record
           model.visible3 = true

    }

    //配置
    const addStyleCol = (record)=>{
         model.item = record
         model.visible2 = true
    }

    //删除
    const removeLayoutRow = (record)=>{
      let bean = { id :record.id,}
        rpcPost('removeLayoutRow',{bean}).then(res=>{
          console.log('res:'+res.code);
          if(res && res.code === 0){
            message.success('删除成功')
            table.value.refresh(true)
          }else{
            message.error((res.message));
          }
        })
    }

    
    //关闭抽屉 刷新列表
    const onClose1 = () => {
      model.visible1 = false
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

    const onClose4 = () => {
      model.visible4 = false
      table.value.refresh(true)
    }


    return {
      ...toRefs(model),
      expandedKeys,
      selectedKeys,
      treeData,
      onLoadData,
      table,
      moment,
      searchFunc,
      // 查询条件参数
      queryParam,
      searchFormRef,
      confirmLoading,
      columns,
      advanced,
      removeLayoutRow,
      updateStyleRow,
      addStyleCol,
      styleColList,
      onClose1,
      onClose2,
      onClose3,
      onClose4,
      selectedRowKeys,
      selectedRows,
      handleAdd,
      resetForm,
      getList,
    }
  },
})
</script>
<style lang="scss" scoped></style>
