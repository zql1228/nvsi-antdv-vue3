<!-- 未发布项目 -->
<template>
  <div>
    <PageFormTableWrapper>
      <template #searchForm>
        <ProjectFrom @child="getList"></ProjectFrom>
      </template>
      <template #table>
        <a-tabs type="card" v-model:activeKey="activeKey">
          <template #tabBarExtraContent>
            <a-button type="primary" @click="handleAdd()">
              <template #icon><PlusOutlined /></template>
              新建项目
            </a-button>
          </template>
          <a-tab-pane key="1" tab="未发布">
            <ProjectTable :searchFunc="searchFunc1" :columns="columns" ref="table1">
              <template #action="record">
                <a-space>
                  <a-popconfirm :title="'确定发布项目“' + record.record.record.albx0002 + '”吗?'" @confirm="handle(record.record.record, activeKey)">
                    <a-button type="primary" size="small">
                      发布项目
                    </a-button>
                  </a-popconfirm>
                  <a-button type="primary" ghost size="small" @click="handleEdit(record.record.record)">
                    编辑项目
                  </a-button>
                  <a-popconfirm :title="'确定删除项目“' + record.record.record.albx0002 + '”吗?'" @confirm="handleDelect(record.record.record, 1)">
                    <a-button size="small">
                      删除项目
                    </a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </ProjectTable>
          </a-tab-pane>
          <a-tab-pane key="2" tab="审核不通过" v-if="userInfo.team.albe0003 == 1 && (userInfo.team.albe0004 || userInfo.team.albe0066)">
            <ProjectTable :searchFunc="searchFunc2" ref="table2">
              <template #action="record">
                <a-space>
                  <a-popconfirm :title="'确定发布项目“' + record.record.record.albx0002 + '”吗?'" @confirm="handle(record.record.record, activeKey)">
                    <a-button type="primary" size="small">
                      发布项目
                    </a-button>
                  </a-popconfirm>
                  <a-button type="primary" ghost size="small" @click="handleEdit(record.record.record)">
                    编辑项目
                  </a-button>
                  <a-popconfirm :title="'确定删除项目“' + record.record.record.albx0002 + '”吗?'" @confirm="handleDelect(record.record.record, 2)">
                    <a-button size="small">
                      删除项目
                    </a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </ProjectTable>
          </a-tab-pane>
        </a-tabs>
      </template>
    </PageFormTableWrapper>
  </div>
</template>

<script>
import moment from 'moment'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { useRouter } from 'vue-router'
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { rpcPost } from '@/server/conf/index.js'
import { message } from 'ant-design-vue'
import { LocalSetProjectInfo } from '@/utils/localStorage.js'
import ProjectTable from './components/ProjectTable'
import ProjectFrom from './components/ProjectFrom'
import { checktime } from '@/utils/publicMethods/common'
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
    ellipsis: true,
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
export default defineComponent({
  props: {},
  components: {
    ProjectTable,
    ProjectFrom,
    PlusOutlined,
  },
  setup(props) {
    const userInfo = ref(LocalGetUserInfo())
    const table1 = ref()
    const table2 = ref()
    const activeKey = ref('1')
    const router = useRouter()

    const searchFunc1 = ref({
      //未发布列表参数
      teamId: userInfo.value.team.groupid,
      albx0021: userInfo.value.areaid,
      albx0024A: '5',
      albx0072: 1,
      albx0002: null,
    })

    const searchFunc2 = ref({
      //审核不通过列表参数
      teamId: userInfo.value.team.groupid,
      albx0021: userInfo.value.areaid,
      albx0072: 2,
      albx0073: 12,
      albx0002: null,
    })

    const handleAdd = () => {
      //创建项目
      let obj = {
        type: 'create', //create创建项目
        isRepair: false, //是否是补录项目
      }
      LocalSetProjectInfo(obj)
      router.push({
        path: '/publishProject',
      })
      // localStorage.setItem('projectQuery', JSON.stringify(obj))
    }

    const handle = (record, activeKey) => {
      //发布项目
      if (checktime(moment(new Date(record.albx0004)).format('YYYY-MM-DD'))) {
        return message.warning('该项目开始时间比当前时间早，请先点击编辑项目按钮修改项目时间!')
      } else {
        let bean = {
          albx0021: record.albx0021,
          proId: record.id,
          teamName: userInfo.value.team.albe0002,
          teamId: userInfo.value.team.groupid,
        }
        rpcPost('groupPubProjectFortis', { bean }).then((res) => {
          if (res && res.code === 0) {
            message.success('发布成功')
            activeKey == 1 ? table1.value.getList(searchFunc1.value, 'delete') : table2.value.getList(searchFunc2.value, 'delete')
          } else {
            message.warning(res.message)
          }
        })
      }
    }
    const handleDelect = (record, activeKey) => {
      //删除项目
      let bean = {
        albx0021: record.albx0021,
        id: record.id,
      }
      rpcPost('delGroupPublishProjectFortis', { bean }).then((res) => {
        if (res && res.data) {
          message.success('删除成功')
          activeKey == 1 ? table1.value.getList(searchFunc1.value, 'delete') : table2.value.getList(searchFunc2.value, 'delete')
        } else {
          message.warning(res.message)
        }
      })
    }
    const handleEdit = (record) => {
      //编辑项目
      let obj = {
        type: 'modify', //修改
        isRepair: record.albx0024 == 5 ? true : false, //是否是补录项目
        isNotAudit: record.albx0073 == 12 ? true : false, //是否是审核不通过项目
        projectType: 1, //当前编辑项目的状态
        projectId: record.id,
        areaId: record.albx0021,
      }
      LocalSetProjectInfo(obj)
      router.push({
        path: '/publishProject',
      })
    }

    const getList = (queryParam) => {
      //查询列表
      if (activeKey.value == 1) {
        // searchFunc1.value = { ...searchFunc1.value, ...queryParam }
        if (userInfo.value.areaLevel == '0') {
          //全国队伍
          searchFunc1.value.albx0021 =
            queryParam.albx0021 && queryParam.albx0021.length > 0 ? queryParam.albx0021[queryParam.albx0021.length - 1] : '100000000000000000'
        } else {
          searchFunc1.value.albx0021 = userInfo.value.areaid
        }
        searchFunc1.value.albx0002 = queryParam.albx0002 ? queryParam.albx0002 : null
        table1.value.getList(searchFunc1.value, true)
      } else {
        // searchFunc2.value = { ...searchFunc2.value, ...queryParam }
        if (userInfo.value.areaLevel == '0') {
          //全国队伍
          searchFunc2.value.albx0021 =
            queryParam.albx0021 && queryParam.albx0021.length > 0 ? queryParam.albx0021[queryParam.albx0021.length - 1] : '100000000000000000'
        } else {
          searchFunc2.value.albx0021 = userInfo.value.areaid
        }
        searchFunc2.value.albx0002 = queryParam.albx0002 ? queryParam.albx0002 : null
        table2.value.getList(searchFunc2.value, true)
      }
    }
    return {
      columns,
      activeKey,
      table1,
      userInfo,
      table2,
      searchFunc1,
      searchFunc2,

      handleAdd,
      handle,
      handleEdit,
      handleDelect,
      getList,
    }
  },
})
</script>
<style lang="scss" scoped></style>
