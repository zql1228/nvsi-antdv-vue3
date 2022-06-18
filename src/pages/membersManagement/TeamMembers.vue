<!-- 队伍成员管理 -->
<template>
  <PageFormTableWrapper>
    <!-- 成员搜索条件 -->
    <template #searchForm> <teamForm @searchVol="searchVol"></teamForm> </template>
    <!-- 成员列表 -->
    <template #table>
      <IATable
        serviceName="queryTeamMemberPageFortis"
        :searchParameter="searchParameter"
        ref="table"
        size="middle"
        :rowKey="(record) => record.id"
        :columns="columns"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
      >
        <template #total-title="{ totalData }">
          合计：队伍成员总数
          <span>
            {{ totalData.totals || '0' }}
          </span>
          人。
        </template>

        <template #name="{ text, record }">
          <a href="javascript:void(0)" @click.prevent="toVolInfo(record)">{{ text }}</a>
        </template>
        <template #total-action>
          <a-button type="primary" @click="addMember(false)">
            <PlusOutlined />
            批量添加成员
          </a-button>
          <a-button type="primary" @click="deleteMember(false)">
            <MinusCircleOutlined />
            批量删除成员
          </a-button>
          <a-button type="primary" @click="exportVolExcel"> <ExportOutlined />批量导出信息 </a-button>
        </template>
        <!-- <template #albp0006="{text}">
          {{ text == '1' ? '男' : '女' }}
        </template> -->
        <template #action="{ record }">
          <a-space>
            <a-button type="primary" :record="record" size="small" @click="showchangePhone(record)"> 修改手机号 </a-button>
            <a-popconfirm title="是否确认删除该队伍成员" ok-text="确定" cancel-text="取消" @confirm="deleteMember(record)">
              <a-button type="primary" ghost size="small" :record="record"> 删除成员 </a-button>
            </a-popconfirm>
            <a-button size="small" :disabled="record.albp0089 * 1 == 0" @click="downLoadCard(record)">下载证明</a-button>
          </a-space>
        </template>
      </IATable>
    </template>
  </PageFormTableWrapper>
  <MemberAdd v-model:visible="addVisible" @addInfo="closeAddInfo" />
  <MemberChangeInfo v-model:visible="isshowinfo" :memberRecord="memberRecord" @addInfo="closeAddInfo" />
</template>
<script>
import { LocalGetUserInfo, LocalSetVolunteerInfo } from '@/utils/localStorage.js'
import { defineComponent, reactive, ref, toRefs, toRef } from 'vue'
import { Modal, message } from 'ant-design-vue'
import apis from '@/server/request'
import MemberAdd from './components/drawer/MemberAdd.vue'
import { hasSelected } from './components/tables/hasSelected.js'
import { TeamMemberCom } from './components/tables/table.js'
import MemberChangeInfo from './components/drawer/MemberChangeInfo.vue'
import teamForm from './components/search/teamForm'
import { useRouter } from 'vue-router'
import { ExportOutlined, DeleteOutlined, PlusOutlined, DownOutlined, UpOutlined, MinusCircleOutlined } from '@ant-design/icons-vue'
export default defineComponent({
  components: {
    teamForm,
    ExportOutlined,
    DeleteOutlined,
    PlusOutlined,
    DownOutlined,
    UpOutlined,
    ExportOutlined,
    MinusCircleOutlined,
    MemberAdd,
    MemberChangeInfo,
  },
  setup() {
    //#region
    const table = ref()
    const advanced = ref(false)
    const router = useRouter()
    const queryParam = reactive({
      name: '',
      albp0005: '',
      albx0021: [],
    })
    const userInfo = ref(LocalGetUserInfo())
    console.log(userInfo)
    const areaLevel = userInfo.value.areaLevel
    const columns = ref(TeamMemberCom.columns)
    const addVisible = ref(false)
    const selectedRowKeys = ref([])
    const dateList = ref([])

    const isshowinfo = ref(false)
    const memberRecord = ref({})
    const operationChildRecord = ref({})
    //#endregion
    const del = (params) => {
      console.log(params, '删除成员入参')
      apis
        .delManyTeamMemberFortis(params)
        .then((res) => {
          console.log(res, '删除成员删除成员返回')
          if (res.code == 0) {
            message.success('删除成功')
            selectedRowKeys.value = []
            dateList.value = []
            table.value.refresh(true)
          } else {
            message.error('删除失败')
          }
        })
        .catch((e) => {
          console.log(e)
          message.warning(e.message ? e.message : '删除失败')
        })
    }

    const deleteMember = (record) => {
      // 删除成员
      const params = {
        areaid: userInfo.value.areaid, // 队伍区划
        id: userInfo.value.team.groupid, // 队伍id
        entityBeans: [],
      }
      if (record) {
        params.entityBeans.push({
          albp0020: record.albp0020, // 志愿者区划
          albp0005: record.albp0005, // 志愿者身份证
          albp0029: record.albe0133, // 志愿者编号
        })
        del(params)
      } else {
        if (selectedRowKeys.value.length > 0) {
          Modal.confirm({
            title: '是否确认删除队伍成员',
            cancelText: '取消',
            okText: '确认',
            onOk: () => {
              dateList.value.forEach((e) => {
                params.entityBeans.push({
                  albp0020: e.albp0020,
                  albp0005: e.albp0005,
                  albp0029: e.albe0133,
                })
              })
              apis.delManyTeamMemberFortis(params).then((res) => {
                console.log(res, '删除成员删除成员返回')
                if (res.code == 0) {
                  message.success('删除成功')
                  selectedRowKeys.value = []
                  dateList.value = []
                  table.value.refresh(true)
                } else {
                  message.error('删除失败')
                }
              })
            },
          })
        } else {
          Modal.warning({
            title: '请勾选你需要批量删除的志愿者，点击志愿者名称左侧按钮即可勾选',
            okText: '关闭',
          })
        }
      }
    }
    const exportVolExcel = () => {
      // 批量导出

      const idCard = []
      if (dateList.value.length > 0) {
        dateList.value.forEach((el) => {
          idCard.push(el.albp0005)
        })
        const params = {
          idCards: idCard.join(','), //身份证号
          userName: userInfo.value.team.albe0002, // 队伍名称
        }
        apis.exportTeamVolExcelFortis(params).then((res) => {
          if (res) {
            window.location = res
          } else {
            message.error('导出失败')
          }
        })
      } else {
        Modal.warning({
          title: '请勾选你需要批量导出的志愿者，点击志愿者名称左侧按钮即可勾选',
          okText: '关闭',
        })
      }
    }
    const areaChange = (value, selectedOptions) => {
      // console.log(value, selectedOptions)
    }
    //修改手机号滑出页面
    const showchangePhone = (record) => {
      // 修改手机号
      selectedRowKeys.value = hasSelected(record, selectedRowKeys)
      isshowinfo.value = true
      memberRecord.value = record
    }
    // 批量添加
    const addMember = () => {
      addVisible.value = true
    }
    const closeAddInfo = (val) => {
      addVisible.value = false
      isshowinfo.value = false
      if (val) {
        table.value.refresh(true)
      }
      selectedRowKeys.value = []
      dateList.value = []
    }
    const toggleAdvanced = () => {
      advanced.value = !advanced.value
    }
    const onSelectChange = (selectedKeys, selectedRows) => {
      selectedRowKeys.value = selectedKeys
      dateList.value = selectedRows
    }
    const searchParameter = () => {
      return {
        id: userInfo.value.team.groupid,
        areaid:
          userInfo.value.areaLevel == 0
            ? queryParam.albx0021.length > 0
              ? queryParam.albx0021[queryParam.albx0021.length - 1]
              : '100000000000000000'
            : userInfo.value.areaid,
        name: queryParam.name ? queryParam.name : null,
        albp0005: queryParam.albp0005 ? queryParam.albp0005 : null,
      }
    }
    const searchVol = (obj) => {
      queryParam.name = obj.queryParam.albp0003
      queryParam.albp0005 = obj.queryParam.albp0005
      queryParam.albx0021 = obj.queryParam.albx0021
      table.value.refresh()
    }
    const toVolInfo = (record) => {
      // console.log(record, 'volunteer.....record')
      LocalSetVolunteerInfo(record)
      router.push({ path: '/volunteerDetails' })
    }
    //跳转下载证明
    const downLoadCard = (record) => {
      LocalSetVolunteerInfo(record)
      router.push({ path: '/downloadProof' })
    }
    //重置
    return {
      table,
      // 重置
      searchParameter,
      // 修改信息
      addVisible,
      // 高级搜索 展开/关闭
      advanced,
      // 查询参数
      queryParam,
      selectedRowKeys,
      columns,
      // 右侧滑出页面
      isshowinfo, // 滑出修改手机号页面
      memberRecord,
      // 操作记录
      columns3: [
        {
          title: '修改人',
          dataIndex: 'albe2501',
          width: 160,
        },
        {
          title: '修改时间',
          dataIndex: 'albe2502',
          width: 160,
        },
        {
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          width: '18%',
          align: 'center',
        },
      ],
      operationChildRecord, // 单条操作记录数据
      addMember,
      deleteMember,
      exportVolExcel,
      showchangePhone,
      closeAddInfo,
      toggleAdvanced,
      onSelectChange,
      searchVol,
      toVolInfo,
      downLoadCard,
    }
  },
})
</script>
<style scoped></style>
