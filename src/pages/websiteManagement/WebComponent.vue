<!-- 组件列表 -->
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
            <a-form-item label="组件编号:" name="componentcode">
              <a-input
               placeholder="输入编号" v-model:value="queryParam.componentcode" :showLevel="3" />
            </a-form-item>
          </a-col>
       
          <a-col :md="5" :sm="24">
            <a-form-item label="显示名称" name="title">
              <a-input
               placeholder="资源显示名称" v-model:value="queryParam.title" :showLevel="3" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
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
        serviceName="getComponentList"
        :searchParameter="searchFunc"
        ref="table"
        size="middle"
        :rowKey="(record) => record.id"
        :columns="columns"
      >
        <template #img="{text,record}">
          <a href="javascript:void(0)"  download ref="download" v-if="text?.length>5" @click.prevent="openImg(record)">查看</a>
          <a href="javascript:void(0)" v-else>暂无</a>
          <a v-show="false" download ref="download"></a>
        </template>
      <template #action="{record}">
        <a-button slot="action" ghost type="primary" size="small"   @click="updateAdd(record)">修改</a-button>
        <a-popconfirm :title="'确定删除吗?'" @confirm="removeComponent(record)">
          <a-button slot="action" type="primary" style="margin-left:10px;"  size="small" >删除</a-button>
        </a-popconfirm>
      </template>
        <template #total-action>
          <a-button type="primary" @click="handleAdd()">
            <template #icon><PlusOutlined /></template>
            新建资源
          </a-button>
        </template>
      </IATable>
    </template>
  </PageFormTableWrapper>
   <UpdateComponentTable :visible="model.visible" :item="model.item" @child="onClose"></UpdateComponentTable>
   <ComponentAddTable :visible="model.visible1" :item="item" @child="onClose1"></ComponentAddTable>
   <ImgModel :visible="model.imgModel" :item="item" @child="onClose2"></ImgModel>
   </div>
</template>

<script>
import { message } from "ant-design-vue"
import moment from 'moment'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { useRouter } from 'vue-router'
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { rpcPost } from '@/server/conf/index.js'
import UpdateComponentTable from './compontents/UpdateComponentTable'
import ComponentAddTable from './compontents/ComponentAddTable'
import ImgModel from './compontents/ImgModel' //图片抽屉 未使用
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
    title: '组件编号',
    dataIndex: 'componentcode',
    ellipsis: true,
      width: 220,
      align: 'center',
  },
  {
    title: '显示名称',
    ellipsis: true,
    dataIndex: 'title',
    width: 220,
    align: 'center',
  },
  {
    title: '图片',
    ellipsis: true,
    dataIndex: 'img',
    width: 220,
    align: 'center',
    slots: {
        customRender: 'img',
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
      default: {},
    },
  },
  components: {
    PlusOutlined,
    UpdateComponentTable,
    ComponentAddTable,
    ImgModel,
  },
  setup(props) {
    const userInfo = ref(LocalGetUserInfo())
    const searchFormRef = ref(null)
    const queryParam = reactive({
      componentcode: '',
      title: '', 
    })
    const confirmLoading = ref(false)
    const download=ref()
    const advanced = ref(false)
    const selectedRowKeys = ref([])
    const selectedRows = ref([])
    const router = useRouter()
    const table = ref()
    const imageUrl = ref('')//图片地址
    onMounted(() => {
      
    })

    const model = reactive({
      visible: false,
      visible1:false,
      imgModel:false,
      item: {},
    
    })

    //查看图片 下载改为预览显示 todo
    const openImg=(record)=>{
      let bean = {img:record.img}
         getimgUrl(bean)
         console.log('imageUrl.value:'+imageUrl.value);
         download.value.href= imageUrl.value
         download.value.click()
    }

     //获取图片下载地址  参数img
    const getimgUrl = (param)=>{
        rpcPost('getFrontResourceImageUrl',{param}).then((res) => {
        imageUrl.value = res.data.imageurl
      })
    }

    //查询条件
    const searchFunc = () => {
      return {
        componentcode: queryParam.componentcode ? queryParam.componentcode : null,
        title: queryParam.title ? queryParam.title : null,
      }
    }

    //修改弹出
    const updateAdd = (record)=>{
         model.item = record
         model.visible = true
    }
    
    //删除
    const removeComponent = (record)=>{
        let bean = { id :record.id,}
        rpcPost('removeComponent',{bean}).then(res=>{
          if(res && res.code === 0){
            message.success('删除成功')
            table.value.refresh(true)
          }else{
            message.error((res.message));
          }
        })
    }

     const onClose = () => {
      model.visible = false
      table.value.refresh(true)
    }
    const onClose1 = ()=>{
      model.visible1 = false
      table.value.refresh(true)
    }
     const onClose2 = ()=>{
      model.imgModel = false
    }

    const handleAdd = () =>{
      model.visible1 = true
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
    return {
      openImg,
      download,
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
      onClose,
      onClose1,
      onClose2,
      updateAdd,
      selectedRowKeys,
      selectedRows, 
      removeComponent,
      handleAdd,
      resetForm,
      getList,
    }
  },
})
</script>
<style lang="scss" scoped></style>
