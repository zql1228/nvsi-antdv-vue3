<!--  -->
<template>
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
          <a-col :md="6" :sm="24" v-if="userInfo.areaLevel == '0'">
            <a-form-item label="服务区域">
              <AreaDevide ref="area" :showAll="false" :showLevel="4" :type="false" v-model:value="queryParam.albx0021"></AreaDevide>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="项目名称" name="albx0002">
              <a-input v-model:value="queryParam.albx0002" placeholder="项目名称" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item>
              <a-space>
                <a-button type="primary" @click="getList(true)"> 查询 </a-button>
                <a-button @click="resetForm"> 重置 </a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </template>
    <template #table>
      <IATable
        serviceName="listGroupPublishProjectFortis"
        :searchParameter="searchFunc"
        ref="table"
        size="middle"
        :rowKey="(record) => record.id"
        :columns="props.projectType == 7 ? columns2 : columns"
      >
        <template #total-title="{ totalData: total }">
          查询合计：项目数
          <span>
            {{ total.sumpro }}
          </span>
          个
          <!-- <span v-show="props.projectType != 2 && props.projectType != 3" style="color:#000;">
            ，总服务时长
          </span>
          <span v-show="props.projectType != 2 && props.projectType != 3">
            {{ total.sumtime }}
          </span>
          <span v-show="props.projectType != 2 && props.projectType != 3" style="color:#000;">
            小时， 项目人数
          </span>
          <span v-show="props.projectType != 2 && props.projectType != 3">
            {{ total.sumvol }}
          </span>
          <span v-show="props.projectType != 2 && props.projectType != 3" style="color:#000;">
            人。
          </span> -->
        </template>
        <template #albx0002="{ text, record }">
          <a @click="heanViewTeamInfo(record)" :title="text">{{ text }}</a>
        </template>
        <template #areanames="{ text: areanames }">
          {{ areanames ? areanames.join('>') : '-' }}
        </template>
        <template #time="{ record: data }">
          {{ moment(data.albx0004).format('YYYY-MM-DD') + ' ~ ' + moment(data.albx0005).format('YYYY-MM-DD') }}
        </template>
        <!-- <template #description="{text:description}">
          {{ description }}
        </template> -->
        <template #action="record">
          <slot name="action" :record="record"> </slot>
        </template>
      </IATable>
    </template>
  </PageFormTableWrapper>
</template>

<script>
import moment from 'moment'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { useRouter } from 'vue-router'
import { defineComponent, reactive, ref, onMounted, nextTick } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { LocalSetProjectInfo } from '@/utils/localStorage.js'
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
    title: '项目名称',
    dataIndex: 'albx0002',
    slots: {
      customRender: 'albx0002',
    },
    ellipsis: true,
    width: '20%',
  },
  {
    title: '服务区域',
    ellipsis: true,
    key: 'areanames',
    dataIndex: 'areanames',
    slots: {
      customRender: 'areanames',
    },
    width: '20%',
  },
  {
    title: '创建时间',
    ellipsis: true,
    key: 'createtime',
    dataIndex: 'createtime',
    slots: {
      customRender: 'createtime',
    },
    customRender: ({ text }) => {
      return moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')
    },
    width: '20%',
  },
  {
    title: '项目时间',
    ellipsis: true,
    key: 'time',
    dataIndex: 'time',
    slots: {
      customRender: 'time',
    },
    width: '20%',
  },
  {
    title: '项目时长',
    dataIndex: 'albx0061',
    needTotal: true,
    customRender: ({ text }) => {
      return text + ' 小时'
    },
    width: '20%',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    slots: {
      customRender: 'action',
    },
    width: 300,
    align: 'center',
  },
]
const columns2 = [
  {
    title: '序号',
    slots: {
      customRender: 'serial',
    },
    width: 80,
    align: 'center',
  },
  {
    title: '项目名称',
    dataIndex: 'albx0002',
    slots: {
      customRender: 'albx0002',
    },
    ellipsis: true,
    width: '20%',
  },
  {
    title: '服务区域',
    ellipsis: true,
    key: 'areanames',
    dataIndex: 'areanames',
    slots: {
      customRender: 'areanames',
    },
    width: '20%',
  },
  {
    title: '创建时间',
    ellipsis: true,
    key: 'createtime',
    dataIndex: 'createtime',
    slots: {
      customRender: 'createtime',
    },
    customRender: ({ text }) => {
      return moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')
    },
    width: '20%',
  },
  {
    title: '项目时间',
    ellipsis: true,
    key: 'time',
    dataIndex: 'time',
    slots: {
      customRender: 'time',
    },
    width: '20%',
  },
  {
    title: '项目时长',
    dataIndex: 'albx0061',
    needTotal: true,
    customRender: ({ text }) => {
      return text + ' 小时'
    },
    width: '20%',
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
    // pagination,
  },
  setup(props) {
    const area = ref()
    const userInfo = ref(LocalGetUserInfo())
    const searchFormRef = ref(null)
    const queryParam = reactive({
      albx0021: [], //区划 全国队伍才有
      albx0002: '', //项目名称
    })
    const confirmLoading = ref(false)
    const router = useRouter()
    const table = ref()
    onMounted(() => {
      nextTick(() => {
        userInfo.value = LocalGetUserInfo()
        if (userInfo.value.areaLevel == '0') {
          //全国账号
          queryParam.albx0021 = ['100000000000000000']
          area.value.defaultInitArea(queryParam.albx0021)
        }
      })
    })

    const searchFunc = () => {
      let albx0021 = ''
      if (userInfo.value.areaLevel == '0') {
        //全国队伍
        albx0021 = queryParam.albx0021 && queryParam.albx0021.length > 0 ? queryParam.albx0021[queryParam.albx0021.length - 1] : '100000000000000000'
      } else {
        albx0021 = userInfo.value.areaid
      }
      return {
        teamId: userInfo.value.team.groupid,
        albx0021: albx0021,
        albx0072: props.projectType,
        albx0073: props.projectType == 2 ? 11 : null,
        albx0002: queryParam.albx0002 ? queryParam.albx0002 : null,
        // areaid: queryParam.areaid ? queryParam.areaid : null,
      }
    }

    const handleAdd = () => {
      //创建项目
      let obj = {
        type: 'create', //create创建项目
        isRepair: true, //是否是补录项目
      }
      LocalSetProjectInfo(obj)
      router.push({
        path: '/publishProject',
      })
      // localStorage.setItem('projectQuery', JSON.stringify(obj))
    }

    //点击项目名称跳转详情页

    const heanViewTeamInfo = (record) => {
      let obj = {
        type: 'view', //查看
        isRepair: props.projectType == 6 ? true : false, //是否是补录项目
        projectId: record.id,
        areaId: record.albx0021,
      }
      // localStorage.setItem('projectQuery', JSON.stringify(obj))
      LocalSetProjectInfo(obj)
      router.push({
        path: '/publishProject',
      })
    }

    //重置
    const resetForm = () => {
      searchFormRef.value.resetFields()
      getList(true)
    }

    //查询按钮
    const getList = (bool) => {
      table.value.refresh(bool)
    }
    return {
      area,
      props,
      table,
      userInfo,
      moment,
      searchFunc,
      // 查询条件参数
      queryParam,
      // mode, // recombination monomer
      searchFormRef,
      confirmLoading,
      columns,
      columns2,
      handleAdd,
      resetForm,
      getList,
      heanViewTeamInfo,
    }
  },
})
</script>
<style lang="scss" scoped></style>
