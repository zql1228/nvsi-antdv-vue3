<template>
  <!-- 下载服务证明 -->
  <PageFormTableWrapper>
    <template #searchForm>
      <div class="table-page-search-wrapper">
        <a-form ref="searchFormRef" :model="queryParam">
          <a-row :gutter="24">
            <a-col :md="6" :sm="24">
              <a-form-item label="服务区域" name="proarea">
                <AreaDevNew ref="areaRef" placeholder="请选择服务区域" :showAll="true" :type="false" v-model:value="queryParam.proarea"></AreaDevNew>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="服务类别" name="albx0009">
                <a-select :labelInValue="true" v-model:value="queryParam.albx0009">
                  <a-select-option :value="type.codeid" v-for="(type, index) in serviceTypeList" :key="type.codeid">{{
                    type.codevalue
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :sm="24" :md="6">
              <a-form-item label="服务队伍" name="teamname">
                <a-input placeholder="请输入队伍名称" v-model:value="queryParam.teamname" />
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :sm="24" :md="6">
                <a-form-item label="服务项目" name="proname">
                  <a-input placeholder="请输入项目名称" v-model:value="queryParam.proname" />
                </a-form-item>
              </a-col>
              <a-col :sm="24" :md="6">
                <a-form-item label="开始日期" name="mintime">
                  <a-date-picker
                    style="width: 100%"
                    v-model:value="queryParam.mintime"
                    :disabledDate="disabledStartDate"
                    format="YYYY-MM-DD"
                    placeholder="开始日期"
                  />
                </a-form-item>
              </a-col>
              <a-col :sm="24" :md="6">
                <a-form-item label="结束日期" name="maxtime">
                  <a-date-picker
                    style="width: 100%"
                    v-model:value="queryParam.maxtime"
                    :disabled-date="disabledEndDate"
                    format="YYYY-MM-DD"
                    placeholder="结束日期"
                  />
                </a-form-item>
              </a-col>
              <a-col :offset="1" :sm="22"><span style="font-size: 14px">筛选加入日期在这个时间范围内的项目</span></a-col>
            </template>
            <a-col :md="(!advanced && 6) || 24" :sm="24">
              <a-form-item>
                <div style="white-space: nowrap">
                  <a-button type="primary" @click="searchForm(1)"> 查询 </a-button>
                  <a-button @click="searchForm(2)" style="margin-left: 8px"> 重置 </a-button>
                  <a @click="showExpand" style="margin-left: 8px; white-space: nowrap">
                    {{ advanced ? '收起筛选' : '展开筛选' }}
                    <UpOutlined v-if="advanced" />
                    <DownOutlined v-if="!advanced" />
                  </a>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </template>
    <template #table>
      <IATable
        serviceName="getVolunteerProject"
        :searchParameter="searchFunc"
        ref="proofTableRef"
        size="middle"
        :rowKey="(record) => record.id"
        :columns="columns"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
        <template #total-title="{ totalData: totals }">
          <a-row class="header-bar">
            <div class="header-title table-total">
              查询合计：共 <span>{{ totals.totals }}</span> 个。下方列表默认展示您所参与所有(拥有时长)的项目。
            </div>
          </a-row>
        </template>
        <template #total-action="{ tableData }">
          <a-button type="primary" :disabled="!tableData.length > 0" @click="Downloadproof"> 下载证明 </a-button>
        </template>
      </IATable>
    </template>
  </PageFormTableWrapper>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, onUnmounted } from 'vue'
import { VolJoinProjectTable } from './components/volunteerDetail/table'
import { LocalGetUserInfo, LocalGetVolunteerInfo } from '@/utils/localStorage.js'
import apis from '@/server/request'
import { rpcPost } from './../../server/conf/index.js'
import { message } from 'ant-design-vue'
import moment from 'moment'
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
export default defineComponent({
  components: { DownOutlined, UpOutlined },
  props: {
    volunteerInfo: {
      type: Object,
    },
  },
  setup(props) {
    const columns = reactive(VolJoinProjectTable.columns)
    const userInfo = ref(LocalGetUserInfo())
    const serviceTypeList = ref()
    const advanced = ref(false)
    const searchFormRef = ref()
    const proofTableRef = ref()
    const queryParam = reactive({
      teamname: '', // 队伍名称
      proname: '', //项目名称
      proarea: [], //服务区域
      albx0009: { value: '', label: '' }, // 服务类别
      maxtime: null, //结束时间
      mintime: null, //开始时间
    })
    const areaName = ref()
    const sRow = reactive({
      selectedRowKeys: [],
      selectedRows: [],
    })
    const count = ref(0)
    const loadInfo = ref(LocalGetVolunteerInfo())
    const areaRef = ref()

    const refresh = () => {
      proofTableRef.value.refresh()
    }
    onMounted(async () => {
      const bean = {
        codeTypeName: 'lbe05',
        areaid: userInfo.value.areaid,
      }
      const res = await apis.getCodeValue('lbe05', 'getAllCodeFortis', bean)
      if (res.code == 0) {
        serviceTypeList.value = res.data
      }

      if (count.value > 0) {
        proofTableRef.value.refresh()
      }
      count.value++
    })
    onUnmounted(() => {
      count.value = 0
    })
    const searchForm = (val) => {
      if (val == 2) {
        queryParam.teamname = '' // 队伍名称
        queryParam.proname = '' //项目名称
        queryParam.proarea = [] //服务区域
        queryParam.albx0009 = { value: '', label: '' } // 服务类别
        queryParam.maxtime = null //结束时间
        queryParam.mintime = null //开始时间
        areaRef.value.defaultInitArea([])
      }
      proofTableRef.value.refresh()
    }
    const showExpand = () => {
      advanced.value = !advanced.value
    }
    const disabledStartDate = (startValue) => {
      const endVal = queryParam.maxtime
      if (!startValue || !endVal) {
        return startValue.valueOf() > new Date().getTime()
      }
      return startValue.valueOf() > endVal.valueOf() || startValue.valueOf() > new Date().getTime()
    }
    const disabledEndDate = (endValue) => {
      const startValue = queryParam.mintime
      if (!endValue || !startValue) {
        return endValue.valueOf() > new Date().getTime()
      }
      return startValue.valueOf() > endValue.valueOf() || endValue.valueOf() > new Date().getTime()
    }
    //下载证明
    const Downloadproof = () => {
      if (sRow.selectedRowKeys.length > 0) {
        let bean = {
          volnum: loadInfo.value.albe0133, // 志愿者编号
          cardno: loadInfo.value.albp0005, // 身份证
          //"projectlist":[{"albx0002":"项目名称","albx0062":"队伍名称","albx0012":"区域名称","albx0083":"1.00"}], //最后一个是时长
          areaid: loadInfo.value.albp0020, //人员的服务区域
          albp0052: loadInfo.value.albp0003,
          isshow: true,
        }
        bean.projectlist = []
        sRow.selectedRows.forEach((e) => {
          bean.projectlist.push({ albx0002: e.albx0002, albx0062: e.albx0062, albx0012: e.areaid, albx0083: e.albx0083 })
        })

        apis
          .nvsi_getVolServicePDF2(bean)
          .then((res) => {
            if (res) {
              window.location = res
            }
          })
          .catch((e) => {
            message.warning(e.message)
          })
      } else {
        message.warning('请先勾选你需要下载服务证明的项目')
      }
    }
    const searchFunc = () => {
      return {
        cardno: loadInfo.value.albp0005,
        teamname: queryParam.teamname, // 队伍名称
        proname: queryParam.proname, //项目名称
        proarea: queryParam.proarea.length > 0 ? queryParam.proarea[queryParam.proarea.length - 1] : '', //服务区域
        albx0009: queryParam.albx0009.value, // 服务类别
        maxtime: queryParam.maxtime ? queryParam.maxtime.format('YYYY-MM-DD') : '', //结束时间
        mintime: queryParam.mintime ? queryParam.maxtime.format('YYYY-MM-DD') : '', //开始时间
        albx0061: true,
        flag: 1,
      }
    }
    const onSelectChange = (RowKeys, Rows) => {
      sRow.selectedRowKeys = RowKeys
      sRow.selectedRows = Rows
    }
    onMounted(() => {
      areaRef.value.defaultInitArea([])
    })
    return {
      ...toRefs(queryParam),
      areaRef,
      columns,
      advanced,
      searchFunc,
      queryParam,
      proofTableRef,
      searchForm,
      showExpand,
      disabledStartDate,
      disabledEndDate,
      Downloadproof,
      serviceTypeList,
      ...toRefs(sRow),
      onSelectChange,
      areaName,
      refresh,
    }
  },
})
</script>

<style scoped lang="less"></style>
