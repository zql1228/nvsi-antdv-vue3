<template>
  <!-- 民政--项目查询 -->
  <div>
    <PageFormTableWrapper>
      <template #searchForm>
        <a-form
          ref="searchFormRef"
          :model="queryParam"
          :rules="rules"
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
              <a-form-item label="服务区域">
                <macArea placeholder="请选择区域" v-model:value="queryParam.areaid" :islevel="false" :isHave="false"></macArea>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="项目名称" name="albx0002">
                <a-input placeholder="请输入项目名称" v-model:value="queryParam.albx0002" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="项目编号" name="albx0013">
                <a-input placeholder="请输入项目编号" v-model:value="queryParam.albx0013" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="advanced">
              <a-form-item label="招募范围" name="albx0024">
                <a-select v-model:value="queryParam.albx0024" :options="optionsList.albx0024List"> </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="advanced">
              <a-form-item label="服务类别" name="albx0009">
                <a-select v-model:value="queryParam.albx0009">
                  <a-select-option v-for="item in optionsList.albx0009List" :key="item.codeid" :value="item.codeid">{{
                    item.codevalue
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="advanced">
              <a-form-item label="服务对象" name="albx0014">
                <a-select v-model:value="queryParam.albx0014">
                  <a-select-option v-for="item in optionsList.albx0014List" :key="item.codeid" :value="item.codeid">{{
                    item.codevalue
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="advanced">
              <a-form-item label="有无时长" name="albx0061">
                <a-select v-model:value="queryParam.albx0061" :options="optionsList.albx0061List"> </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="advanced">
              <a-form-item label="项目人数" name="person">
                <a-row class="my_input js-input-width" type="flex" style="flex-wrap: nowrap">
                  <a-col>
                    <a-input
                      v-model:value="queryParam.minPerson"
                      onkeyup="value=value.replace(/[^\d]/g,'')"
                      onafterpaste="value=value.replace(/[^\d]/g,'')"
                    />
                  </a-col>
                  <a-col>
                    <img style="position: relative; top: 6px" src="@/assets/img/workBenchImg/date.png" alt="" />
                  </a-col>
                  <a-col>
                    <a-input
                      v-model:value="queryParam.maxPerson"
                      onkeyup="value=value.replace(/[^\d]/g,'')"
                      onafterpaste="value=value.replace(/[^\d]/g,'')"
                    />
                  </a-col>
                </a-row>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="advanced">
              <a-form-item label="时长区间" name="time">
                <a-row class="my_input js-input-width" type="flex" style="flex-wrap: nowrap">
                  <a-col>
                    <a-input
                      style="display: inline-block"
                      v-model:value="queryParam.minTime"
                      onkeyup="value= value.match(/\d+(\.\d{0,2})?/) ? value.match(/\d+(\.\d{0,2})?/)[0] : ''"
                    />
                  </a-col>
                  <a-col>
                    <img style="position: relative; top: 6px" src="@/assets/img/workBenchImg/date.png" alt="" />
                  </a-col>
                  <a-col>
                    <a-input
                      style="display: inline-block"
                      v-model:value="queryParam.maxTime"
                      onkeyup="value= value.match(/\d+(\.\d{0,2})?/) ? value.match(/\d+(\.\d{0,2})?/)[0] : ''"
                    />
                  </a-col>
                </a-row>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="advanced">
              <a-form-item name="minDay" label="开始时间">
                <a-date-picker v-model:value="queryParam.minDay" style="width: 100%" placeholder="项目最早开始日期" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="advanced">
              <a-form-item name="maxDay" label="开始时间">
                <a-date-picker v-model:value="queryParam.maxDay" style="width: 100%" placeholder="项目最晚开始日期" />
              </a-form-item>
            </a-col>

            <a-col :md="(!advanced && 6) || 24" :sm="24">
              <a-form-item>
                <div style="white-space: nowrap">
                  <a-button type="primary" @click="refresh"> 查询 </a-button>
                  <a-button @click="resetForm" style="margin-left: 8px"> 重置 </a-button>
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
      </template>
      <template #table>
        <a-tabs type="card" v-model:activeKey="activeKey">
          <a-tab-pane key="1" tab="运行中">
            <ProjectQueryTable ref="table1" :queryParam="queryParam" activeKey="1">
              <template #action="{ record }">
                <a-space>
                  <a-popconfirm :title="'确定停用项目' + record.albx0002 + '吗?'" @confirm="handleAdd(record, 1)">
                    <a-button type="primary" size="small"> 停用 </a-button>
                  </a-popconfirm>
                  <a-button type="primary" ghost size="small" @click="handleEdit(record)"> 操作记录 </a-button>
                </a-space>
              </template>
            </ProjectQueryTable>
          </a-tab-pane>
          <a-tab-pane key="2" tab="已结项">
            <ProjectQueryTable ref="table2" :queryParam="queryParam" activeKey="2">
              <template #action="{ record }">
                <a-space>
                  <a-button type="primary" ghost size="small" @click="handleEdit(record)"> 操作记录 </a-button>
                </a-space>
              </template>
            </ProjectQueryTable>
          </a-tab-pane>
          <a-tab-pane key="3" tab="已停用">
            <ProjectQueryTable ref="table3" :queryParam="queryParam" activeKey="3">
              <template #action="{ record }">
                <a-space>
                  <a-popconfirm :title="'确定启用项目' + record.albx0002 + '吗?'" @confirm="handleAdd(record, 3)">
                    <a-button type="primary" size="small"> 启用 </a-button>
                  </a-popconfirm>
                  <a-button type="primary" ghost size="small" @click="handleEdit(record)"> 操作记录 </a-button>
                </a-space>
              </template>
            </ProjectQueryTable>
          </a-tab-pane>
        </a-tabs>
      </template>
    </PageFormTableWrapper>
    <QueryDrawerTable :visible="drawer.visible" :item="drawer.item" @child="onClose"></QueryDrawerTable>
    <QueryModelTable :visible="model.visible" :item="model.item" @child="onClose2"></QueryModelTable>
  </div>
</template>
<script>
import { defineComponent, reactive, ref, onMounted, watch, nextTick, toRefs } from 'vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import { ProjectQueryColumns } from './columns'
import { checktime2, sortCode } from '@/utils/publicMethods/common'
import { rpcPost } from '@/server/conf/index.js'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import moment from 'moment'
import QueryDrawerTable from './compontents/QueryDrawerTable' //操作记录
import QueryModelTable from './compontents/QueryModelTable' //人员表格弹窗
import { LocalSetProjectInfo } from '@/utils/localStorage.js'
import { nvsiAlbx0009, nvsiAlbx0014, nvsiAlbx0024 } from '@/utils/codevalue'
import ProjectQueryTable from './compontents/ProjectQueryTable'
import apis from '@/server/request'
export default defineComponent({
  components: { DownOutlined, UpOutlined, QueryDrawerTable, QueryModelTable, ProjectQueryTable },
  setup() {
    const activeKey = ref('1')
    const table1 = ref()
    const table2 = ref()
    const table3 = ref()
    const router = useRouter()
    const table = ref()
    const userInfo = ref(LocalGetUserInfo())
    const advanced = ref(false)
    const queryParam = reactive({
      areaid: [], //区域
      albx0002: '', // 项目名称
      albx0013: '', //项目编号
      albx0072: '', //项目状态
      albx0024: '', //招募范围
      albx0009: '', //服务类别
      albx0014: '', //服务对象
      albx0061: '', //有无时长
      albx0073: '', //停用/启用
      minPerson: '', //项目人数 最小
      maxPerson: '', //项目人数 最大
      minTime: '', //时长区间 时长最小
      maxTime: '', //时长区间 时长最大
      minDay: null, //最小日期
      maxDay: null, //最大日期
    })
    const optionsList = reactive({
      albx0072List: [
        { label: '不限', value: '' },
        { label: '待启动', value: '3' },
        { label: '运行中', value: '4' },
        { label: '已结项', value: '5' },
        { label: '补录', value: '6' },
        { label: '停用', value: '7' },
      ], //项目状态
      albx0024List: [], //招募范围
      albx0009List: [], //服务类别
      albx0014List: [], //服务对象
      albx0061List: [
        { label: '不限', value: '' },
        { label: '无时长', value: '0' },
        { label: '有时长', value: '1' },
      ], //时长
      albx0073List: [
        { label: '不限', value: '' },
        { label: '启用', value: '0' },
        { label: '停用', value: '1' },
      ], //停用启用
    })
    optionsList.albx0024List = JSON.parse(JSON.stringify(nvsiAlbx0024))
    optionsList.albx0024List.unshift({ label: '不限', value: '' })
    const searchFormRef = ref()

    onMounted(() => {
      getOptions()
    })

    const getOptions = async () => {
      //服务类别
      optionsList.albx0009List = await apis.getCodeValue('lbe05', 'getAllCodeFortis', { codeTypeName: 'lbe05', areaid: userInfo.value.areaid })
      optionsList.albx0009List = optionsList.albx0009List.data
      optionsList.albx0009List = sortCode(optionsList.albx0009List)
      optionsList.albx0009List = [{ codevalue: '不限', codeid: '' }, ...optionsList.albx0009List]

      //服务对象
      optionsList.albx0014List = await apis.getCodeValue('nvsi_albx0014', 'getAllCodeFortis', { codeTypeName: 'nvsi_albx0014' })
      optionsList.albx0014List = optionsList.albx0014List.data
      optionsList.albx0014List = [{ codevalue: '不限', codeid: '' }, ...optionsList.albx0014List]
    }

    const drawer = reactive({
      //操作记录弹窗参数
      visible: false,
      item: {},
    })

    const model = reactive({
      //人员弹窗参数
      visible: false,
      item: {},
    })

    const showExpand = () => {
      advanced.value = !advanced.value
      nextTick(() => {
        activeKey.value == 1 ? table1.value.getheight() : activeKey.value == 2 ? table2.value.getheight() : table3.value.getheight()
      })
    }

    watch(
      () => activeKey.value,
      (activeKey) => {
        nextTick(() => {
          activeKey == 1 ? table1.value.getheight() : activeKey == 2 ? table2.value.getheight() : table3.value.getheight()
        })
      }
    )

    //$refs.table.refresh(true)"
    const refresh = () => {
      //查询按钮
      searchFormRef.value
        .validate()
        .then(() => {
          activeKey.value == 1 ? table1.value.getList(true) : activeKey.value == 2 ? table2.value.getList(true) : table3.value.getList(true)
        })
        .catch((error) => {
          console.log(error)
        })
    }

    const resetForm = () => {
      //重置
      searchFormRef.value.resetFields()
      queryParam.minPerson = ''
      queryParam.maxPerson = ''
      queryParam.minTime = ''
      queryParam.maxTime = ''
      activeKey.value == 1 ? table1.value.getList(true) : activeKey.value == 2 ? table2.value.getList(true) : table3.value.getList(true)
    }

    const handleAdd = (record, activeKey) => {
      //停用启用按钮
      if (record.albx0073 == '21') {
        //如果是启用操作则需要查询当前项目所属队伍是否被停用 被停用队伍项目不能启用
        let bean1 = {
          id: record.albx0011,
          areaid: record.albx0021,
        }
        rpcPost('getTeamInfoFortis', { bean1 }).then((res) => {
          if (res && res.code === 0 && res.data) {
            if (res.data.albe0026 == 1) {
              handleAdd2(record, activeKey)
            } else {
              message.warning('该项目所属队伍未启用，无法启用!')
            }
          } else {
            message.warning(res.message)
          }
        })
      } else {
        handleAdd2(record, activeKey)
      }
    }

    const handleAdd2 = (record, activeKey) => {
      //停用
      let bean = {
        areaid: record.albx0021,
        type: record.albx0073 == '21' ? 2 : 1, //type 1停用 2启用 albx0073 21停用
        id: record.id,
        userFlag: userInfo.value.fullName,
      }
      rpcPost('deactivateOrEnalbeProjectFortis', { bean }).then((res) => {
        if (res && res.code === 0) {
          message.success('修改成功')
          if (activeKey == 1) {
            table1.value.getList('delete')
            table3.value ? table3.value.getList(false) : ''
          } else {
            table3.value.getList('delete')
            table1.value.getList(false)
          }
        } else {
          message.warning('修改失败')
        }
      })
    }

    const handleEdit = (record) => {
      //操作记录 按钮
      drawer.item = record
      drawer.visible = true
    }

    const heanViewVolInfo = (record) => {
      //查看人员详情
      model.item = record
      model.visible = true
    }

    const onClose = () => {
      //关闭操作记录弹窗
      drawer.visible = false
    }

    const onClose2 = () => {
      //关闭人员弹窗
      model.visible = false
    }

    const checkperson = async (rule, value) => {
      //人数区间校验
      if (queryParam.minPerson && queryParam.maxPerson && queryParam.maxPerson - queryParam.minPerson < 0) {
        return Promise.reject('最大人数不能小于最小人数')
      } else {
        return Promise.resolve()
      }
    }
    const checktime = async (rule, value) => {
      //人数区间校验
      if (queryParam.minTime && queryParam.maxTime && queryParam.maxTime - queryParam.minTime < 0) {
        return Promise.reject('最大时长不能小于最小时长')
      } else {
        return Promise.resolve()
      }
    }
    const checkmaxDay = async (rule, value) => {
      //项目结束时间校验
      if (
        queryParam.minDay &&
        queryParam.maxDay &&
        checktime2(moment(new Date(queryParam.maxDay)).format('YYYY-MM-DD'), moment(new Date(queryParam.minDay)).format('YYYY-MM-DD'))
      ) {
        return Promise.reject('项目最晚开始时间不能早于项目最早开始时间')
      } else {
        return Promise.resolve()
      }
    }

    const rules = reactive({
      person: [{ required: false, validator: checkperson }], //人数区间
      time: [{ required: false, validator: checktime }], //时长区间
      maxDay: [{ required: false, validator: checkmaxDay }], //项目结束时间
    })
    return {
      activeKey,
      table1,
      table2,
      table3,
      model,
      onClose2,
      drawer,
      table,
      rules,
      optionsList,
      searchFormRef,
      advanced,
      // 查询参数
      queryParam,
      ProjectQueryColumns,
      resetForm,
      showExpand,
      handleAdd,
      handleEdit,
      onClose,
      refresh,
      heanViewVolInfo,
    }
  },
})
</script>
<style scoped></style>
