<!-- 补录项目 -->
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
              新建补录项目
            </a-button>
          </template>
          <a-tab-pane key="1" tab="未发布">
            <ProjectTable :searchFunc="searchFunc1" ref="table1">
              <template #action="record">
                <a-space>
                  <a-popconfirm :title="'确定发布项目“' + record.record.record.albx0002 + '”吗?'" @confirm="handle(record.record.record, activeKey)">
                    <a-button type="primary" size="small"> 发布项目 </a-button>
                  </a-popconfirm>
                  <a-button type="primary" ghost size="small" @click="handleEdit(record.record.record)"> 编辑项目 </a-button>
                  <a-popconfirm :title="'确定删除项目“' + record.record.record.albx0002 + '”吗?'" @confirm="handleDelect(record.record.record, 1)">
                    <a-button size="small"> 删除项目 </a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </ProjectTable>
          </a-tab-pane>
          <a-tab-pane key="2" tab="已发布">
            <ProjectTable :searchFunc="searchFunc2" ref="table2">
              <template #action="record">
                <a-button size="small" @click="handleDelect(record.record.record, 2)"> 删除项目 </a-button>
              </template>
            </ProjectTable>
          </a-tab-pane>
        </a-tabs>
      </template>
    </PageFormTableWrapper>
    <DelProjectModel :visible="del.visible" :item="del.item" :content="del.content" @child="onClose"></DelProjectModel>
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
import DelProjectModel from './components/DelProjectModel.vue'
export default defineComponent({
  props: {},
  components: {
    ProjectTable,
    ProjectFrom,
    PlusOutlined,
    DelProjectModel,
    // pagination,
  },
  setup(props) {
    const userInfo = ref(LocalGetUserInfo())
    const table1 = ref()
    const table2 = ref()
    const activeKey = ref('1')
    const router = useRouter()

    const searchFunc1 = ref({
      teamId: userInfo.value.team.groupid,
      albx0021: userInfo.value.areaid,
      albx0024: 5,
      albx0071: 'A',
      albx0072: 1,
      albx0002: null,
    })

    const searchFunc2 = ref({
      teamId: userInfo.value.team.groupid,
      albx0021: userInfo.value.areaid,
      albx0024: 5,
      albx0071: 'B',
      albx0072: 6,
      albx0002: null,
    })

    const del = reactive({
      //删除项目按钮参数
      visible: false,
      item: {},
      content: '',
    })

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
    }

    const handle = (record, activeKey) => {
      //发布项目
      if (!record.albx0047) return message.warning('您还未上传项目证明扫描件，请点击编辑项目按钮前往上传!')
      let bean = {
        albx0021: record.albx0021,
        proId: record.id,
        teamName: userInfo.value.team.albe0002,
        teamId: userInfo.value.team.groupid,
      }
      rpcPost('groupPubProjectFortis', { bean }).then((res) => {
        if (res && res.code === 0) {
          message.success('发布成功')
          table1.value.getList(searchFunc1.value, 'delete')
          table2.value ? table2.value.getList(searchFunc2.value, false) : ''
        } else {
          message.warning(res.message)
        }
      })
    }
    const handleDelect = (record, activeKey) => {
      //删除项目
      if (activeKey == 1) {
        //未发布项目删除
        let bean = {
          albx0021: record.albx0021,
          id: record.id,
        }
        rpcPost('delGroupPublishProjectFortis', { bean }).then((res) => {
          if (res && res.data) {
            message.success('删除成功')
            table1.value.getList(searchFunc1.value, 'delete')
          } else {
            message.warning(res.message)
          }
        })
      } else {
        //已发布项目删除
        del.item = record
        del.content = '删除项目会将项目内志愿者踢出项目，并同步删除此项目已录入的项目成员服务时长，无法恢复，是否确认删除项目'
        del.visible = true
      }
    }

    const onClose = (bool) => {
      //关闭删除项目弹窗
      del.visible = false
      if (bool) {
        table2.value.getList(searchFunc2.value, 'delete')
      }
    }

    const handleEdit = (record) => {
      //编辑项目
      let obj = {
        type: 'modify', //修改
        isRepair: record.albx0024 == 5 ? true : false, //是否是补录项目
        isNotAudit: record.albx0073 == 12 ? true : false, //是否是审核不通过项目
        projectType: 6, //当前编辑项目类别
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
        if (userInfo.value.areaid == '100000000000000000') {
          //全国队伍
          searchFunc1.value.albx0021 =
            queryParam.albx0021 && queryParam.albx0021.length > 0 ? queryParam.albx0021[queryParam.albx0021.length - 1] : userInfo.value.areaid
        } else {
          searchFunc1.value.albx0021 = userInfo.value.areaid
        }
        searchFunc1.value.albx0002 = queryParam.albx0002 ? queryParam.albx0002 : null
        table1.value.getList(searchFunc1.value, true)
      } else {
        // searchFunc2.value = { ...searchFunc2.value, ...queryParam }
        if (userInfo.value.areaid == '100000000000000000') {
          //全国队伍
          searchFunc2.value.albx0021 =
            queryParam.albx0021 && queryParam.albx0021.length > 0 ? queryParam.albx0021[queryParam.albx0021.length - 1] : userInfo.value.areaid
        } else {
          searchFunc2.value.albx0021 = userInfo.value.areaid
        }
        searchFunc2.value.albx0002 = queryParam.albx0002 ? queryParam.albx0002 : null
        table2.value.getList(searchFunc2.value, true)
      }
    }
    return {
      del,
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
      onClose,
    }
  },
})
</script>
<style lang="scss" scoped></style>
