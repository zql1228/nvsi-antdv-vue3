<!-- 队伍成员管理___待审核成员 -->
<template>
  <PageFormTableWrapper>
    <!-- 成员搜索条件 -->
    <template #searchForm>
      <teamForm isshow="audit" :item="{}" @searchVol="searchVol"></teamForm>
    </template>
    <!-- 成员列表 -->
    <template #table>
      <a-tabs type="card" class="teamTabs" v-model:activeKey="activeKey" @change="(e) => (activeKey = e)">
        <!-- applyToJoinTeam /  applyToJoinProject-->
        <a-tab-pane key="1">
          <template #tab>申请加入队伍</template>
          <IATable
            serviceName="getVerifyTeamMember"
            :searchParameter="searchauditMember"
            ref="orgtable"
            size="middle"
            :rowKey="(record) => record.id"
            :columns="columns"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
          >
            <template #total-title="{ totalData: total }">
              查询合计：申请加入队伍共 <span>{{ total.totals }}</span> 个。
            </template>
            <template #name="{ text, record }">
              <a href="javascript:void(0)" @click.prevent="toVolInfo(record)">{{ text }}</a>
            </template>
            <template #albp3305="{ text: albp3305 }">
              {{ albp3305 ? albp3305.slice(0, 11) : '' }}
            </template>
            <template #action="{ record }">
              <a-space>
                <a-button type="primary" size="small" @click="showDrawer(record)">详情</a-button>
                <a-button type="primary" size="small" ghost @click="applyToJoinTeamAgreeOrRefuse(record, 1)">同意</a-button>
                <a-button size="small" @click="applyToJoinTeamAgreeOrRefuse(record, 3)">拒绝</a-button>
                <!-- <a-button type="primary" size="small" ghost @click="agree(record, 1)">同意</a-button>
                <a-button size="small" @click="agree(record, 3)">拒绝</a-button> -->
              </a-space>
            </template>
          </IATable>
        </a-tab-pane>
        <a-tab-pane key="2">
          <template #tab>申请加入项目</template>
          <IATable
            serviceName="getVerifyProjectMember"
            :searchParameter="getProList"
            ref="protable"
            size="middle"
            :rowKey="(record) => record.id"
            :columns="columns2"
            :row-selection="{
              selectedRowKeys: selectedRowKeys2,
              onChange: onSelectChange2,
            }"
          >
            <template #total-title="{ totalData: total }">
              查询合计：申请加入项目共 <span>{{ total.totals }}</span> 个。
            </template>
            <template #name="{ text, record }">
              <a href="javascript:void(0)" @click="toVolInfo(record)">{{ text }}</a>
            </template>
            <template #albx0056="{ text: albx0056 }">
              <span>{{ albx0056 ? albx0056.slice(0, 11) : '' }}</span>
            </template>
            <template #action="{ record }">
              <a-space>
                <a-button type="primary" size="small" @click="showDrawer(record)">详情</a-button>

                <a-button type="primary" size="small" ghost @click="applyToJoinProjectAgreeOrRefuse(record, 1)">同意</a-button>
                <a-button @click="applyToJoinProjectAgreeOrRefuse(record, 0)">拒绝</a-button>
                <!-- <a-button type="primary" size="small" ghost @click="agree(record, 1)">同意</a-button>
                <a-button @click="agree(record, 0)">拒绝</a-button>
                -->
              </a-space>
            </template>
          </IATable>
        </a-tab-pane>
        <template #tabBarExtraContent>
          <a-space>
            <!-- batchAgreeOrRefuse -->
            <a-button type="primary" @click="batchAgreeOrRefuse(1)"><PlusOutlined />批量同意</a-button>
            <a-button type="primary" @click="batchAgreeOrRefuse(3)"><delete-outlined />批量拒绝</a-button>
            <!-- <a-button type="primary" @click="agree('', 1)"><PlusOutlined />批量同意</a-button>
            <a-button type="primary" @click="agree('', 3)"><delete-outlined />批量拒绝</a-button> -->
          </a-space>
        </template>
      </a-tabs>
      <MembersAudit :visible="visible" :item="item" @child="onCloseInfo"></MembersAudit>
    </template>
  </PageFormTableWrapper>
</template>

<script>
import { rpcPost } from '@/server/conf/index.js'
import { Modal, message } from 'ant-design-vue'
import { LocalGetUserInfo, LocalSetVolunteerInfo } from '@/utils/localStorage.js'
import { useRouter } from 'vue-router'
import { defineComponent, reactive, ref, onMounted, watch, nextTick } from 'vue'
import { AuditMemberCom } from './components/tables/table.js'
import MembersAudit from './components/drawer/MembersAudit'
import apis from '@/server/request'
import { hasSelected } from './components/tables/hasSelected.js'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue'
import teamForm from './components/search/teamForm'
export default defineComponent({
  components: { MembersAudit, DeleteOutlined, PlusOutlined, teamForm },
  setup() {
    const orgtable = ref()
    const protable = ref()
    const userInfo = ref(LocalGetUserInfo())
    const columns = ref(AuditMemberCom.columns)
    const columns2 = ref(AuditMemberCom.columns2)
    const selectedRowKeys = ref([])
    const selectedRowKeys2 = ref([])
    const activeKey = ref('1')
    const router = useRouter()
    const orgList = ref([])
    const proList = ref([])
    // 批量同意拒绝传参
    const visible = ref(false)
    const item = ref({})
    const queryParam = reactive({
      albp0003: '',
      albp0005: '',
    })
    onMounted(() => {
      selectedRowKeys.value = []
    })
    const searchauditMember = () => {
      return {
        albp3309: userInfo.value.team.groupid, //队伍id
        name: queryParam.albp0003 ? queryParam.albp0003 : null,
        cardno: queryParam.albp0005 ? queryParam.albp0005 : null,
      }
    }
    const getProList = () => {
      return {
        albp3309: userInfo.value.team.groupid, //队伍id
        name: queryParam.albp0003 ? queryParam.albp0003 : '',
        cardno: queryParam.albp0005 ? queryParam.albp0005 : '',
      }
    }
    const onCloseInfo = (val) => {
      visible.value = false
      selectedRowKeys.value = []
      orgList.value = []
      selectedRowKeys2.value = []
      proList.value = []
      if (val) {
        activeKey.value == '1' ? orgtable.value.refresh(true) : protable.value.refresh(true)
      }
      selectedRowKeys.value = []
      orgList.value = []
    }
    const onSelectChange = (selectedKeys, selectedRows) => {
      selectedRowKeys.value = selectedKeys
      orgList.value = selectedRows
    }
    const onSelectChange2 = (selectedKeys, selectedRows) => {
      selectedRowKeys2.value = selectedKeys
      proList.value = selectedRows
    }
    const showDrawer = (record) => {
      // getVolunteerInfoOnProject    getVolunteerInfo
      if (activeKey.value === '1') {
        selectedRowKeys.value = hasSelected(record, selectedRowKeys)
        item.value = record
        item.value.albp0005 = record.albp3310
        item.value.applytype = '申请加入队伍'
        item.value.agree = agree
        visible.value = true
      } else {
        selectedRowKeys2.value = hasSelected(record, selectedRowKeys2)
        item.value = record
        item.value.albp0005 = record.albp0005
        item.value.applytype = '申请加入项目'
        item.value.agree = agree
        visible.value = true
      }
    }

    // 单个同意加入或者拒绝队伍
    const applyToJoinTeamAgreeOrRefuse = async (record, type) => {
      // type:1 同意  3：拒绝
      const params = {
        flag: type,
        entityBean: {
          id: userInfo.value.team.groupid, // 队伍id xiangmuid
          areaid: userInfo.value.areaid,
        },
        entityBeans: [
          {
            cardno: record.albp3310,
            areaid: userInfo.value.areaid,
          },
        ],
      }
      const res = await apis.agreeOrRefuseJoinTeamNew(params)
      if (res.code == 0) {
        orgtable.value.refresh(true)
        message.success(res.message)
      } else {
        message.warning(res.message)
      }
    }

    // 单个同意加入或者拒绝项目 type:0 同意  1 拒绝
    const applyToJoinProjectAgreeOrRefuse = async (record, type) => {
      const params = {
        flag: type,
        entityBeans: [
          {
            cardno: record.albp0005,
            albp0020: record.albp0020,
            areaid: record.albx0021,
            id: record.albx0057,
            albx0052: record.albx0052,
          },
        ],
      }
      const res = await apis.agreeOrRefuseJoinProjectNew(params)
      if (res.code == 0) {
        protable.value.refresh(true)
        message.success(res.message)
      } else {
        message.warning(res.message)
      }
    }

    // 批量同意或者拒绝 type: 1 批量同意 3 批量拒绝
    const batchAgreeOrRefuse = (type) => {
      const params = {
        flag: type == 3 && activeKey.value == '2' ? 0 : type,
      }
      const entityBeans = []
      // 看是申请加入队伍或者加入项目
      if (selectedRowKeys.value.length > 0 || selectedRowKeys2.value.length) {
        Modal.confirm({
          title: type == 1 ? '是否确认批量同意加入' : '是否确认批量拒绝加入',
          cancelText: '取消',
          okText: '确认',
          onOk: () => {
            if (activeKey.value == '1') {
              params.entityBean = {
                id: userInfo.value.team.groupid, // 队伍id xiangmuid
                areaid: userInfo.value.areaid,
              }
              orgList.value.forEach((e) => {
                entityBeans.push({ cardno: e.albp3310, areaid: userInfo.value.areaid })
              })
            } else {
              proList.value.forEach((e) => {
                entityBeans.push({
                  cardno: e.albp0005,
                  albp0020: e.albp0020,
                  areaid: e.albx0021,
                  id: e.albx0057,
                  albx0052: e.albx0052,
                })
              })
            }
            params.entityBeans = entityBeans
            Jion(params, type)
          },
        })
      } else {
        Modal.warning({
          title: '请勾选你需要批量同意的志愿者，点击志愿者名称左侧按钮即可勾选',
          okText: '关闭',
        })
      }
    }
    const agree = (record, val, bool) => {
      let params = {
        flag: val == 3 && activeKey.value == '2' ? 0 : val,
      }
      const entityBeans = []
      if (record) {
        // 申请加入队伍
        if (activeKey.value == '1') {
          selectedRowKeys.value = hasSelected(record, selectedRowKeys)
          params.entityBean = {
            id: userInfo.value.team.groupid, // 队伍id xiangmuid
            areaid: userInfo.value.areaid,
          }
          entityBeans.push({ cardno: record.albp3310, areaid: userInfo.value.areaid })
        } else {
          // 申请加入项目
          selectedRowKeys2.value = hasSelected(record, selectedRowKeys2)
          entityBeans.push({
            cardno: record.albp0005,
            albp0020: record.albp0020,
            areaid: record.albx0021,
            id: record.albx0057,
            albx0052: record.albx0052,
          })
        }
        params.entityBeans = entityBeans
        // console.log(params)
        Jion(params, val, bool)
      } else {
        if (selectedRowKeys.value.length > 0 || selectedRowKeys2.value.length) {
          Modal.confirm({
            title: val == 1 ? '是否确认批量同意加入' : '是否确认批量拒绝加入',
            cancelText: '取消',
            okText: '确认',
            onOk: () => {
              if (activeKey.value == '1') {
                params.entityBean = {
                  id: userInfo.value.team.groupid, // 队伍id xiangmuid
                  areaid: userInfo.value.areaid,
                }
                orgList.value.forEach((e) => {
                  entityBeans.push({ cardno: e.albp3310, areaid: userInfo.value.areaid })
                })
              } else {
                proList.value.forEach((e) => {
                  entityBeans.push({
                    cardno: e.albp0005,
                    albp0020: e.albp0020,
                    areaid: e.albx0021,
                    id: e.albx0057,
                    albx0052: e.albx0052,
                  })
                })
              }
              params.entityBeans = entityBeans
              // console.log('params同意拒绝', params)
              Jion(params, val, bool)
            },
          })
        } else {
          Modal.warning({
            title: '请勾选你需要批量同意的志愿者，点击志愿者名称左侧按钮即可勾选',
            okText: '关闭',
          })
        }
      }
    }
    const toVolInfo = (record) => {
      if (activeKey.value == '2') {
        apis.getcardno({ cardno: record.albp0005 }).then((res) => {
          if (res) {
            record.albp0005 = res.cardno
            LocalSetVolunteerInfo(record)
            router.push({ path: '/volunteerDetails' })
          }
        })
      } else {
        record.albp0005 = record.albp3310
        LocalSetVolunteerInfo(record)
        router.push({ path: '/volunteerDetails' })
      }
    }
    const searchVol = (obj) => {
      queryParam.albp0003 = obj.queryParam.albp0003
      queryParam.albp0005 = obj.queryParam.albp0005
      activeKey.value == '1' ? orgtable.value.refresh() : protable.value.refresh()
    }
    const Jion = (params, val, bool) => {
      if (activeKey.value == '1') {
        apis
          .agreeOrRefuseJoinTeamNew(params)
          .then((res) => {
            console.log(res, 'ggogoo')
            if (res.code == 0) {
              message.success(res.message)
            } else {
              message.warning(val == 1 ? '同意失败' : '拒绝失败')
            }
            selectedRowKeys.value = []
            orgList.value = []
            if (bool) {
              visible.value = false
            }
            orgtable.value.refresh(true)
          })
          .catch((e) => {
            message.warning(val == 1 ? '同意失败' : '拒绝失败')
          })
      } else {
        console.log(params, 'params')
        apis.agreeOrRefuseJoinProject(params).then((res) => {
          console.log(res, 'res')
          if (res) {
            message.success(res.message)
          } else {
            message.warning(val == 1 ? '同意失败' : '拒绝失败')
          }
          selectedRowKeys2.value = []
          orgList.value = []
          if (bool) {
            visible.value = false
          }
          protable.value.refresh(true)
        })
      }
    }
    watch(
      () => activeKey.value,
      () => {
        nextTick(() => {
          if (activeKey.value == '1') {
            selectedRowKeys.value = []
            orgtable.value.refresh()
          } else {
            selectedRowKeys2.value = []
            protable.value.refresh()
          }
        })
      }
    )
    return {
      orgtable,
      protable,
      columns,
      columns2,
      searchauditMember,
      selectedRowKeys,
      selectedRowKeys2,
      activeKey,
      orgList,
      visible,
      item,
      onCloseInfo,
      showDrawer,
      agree,
      onSelectChange,
      onSelectChange2,
      getProList,
      toVolInfo,
      searchVol,
      //-------
      applyToJoinTeamAgreeOrRefuse,
      applyToJoinProjectAgreeOrRefuse,
      batchAgreeOrRefuse,
    }
  },
})
</script>
<style lang="less" scoped>
.teamTabs :deep(.ant-tabs-nav div) {
  padding-left: 10px !important;
}
</style>
