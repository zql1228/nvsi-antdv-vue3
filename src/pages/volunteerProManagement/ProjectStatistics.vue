<template>
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
            <a-form-item label="项目状态" name="albx0072">
              <a-select v-model:value="queryParam.albx0072" :options="optionsList.albx0072List" :disabled="selectType == 7" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="招募范围" name="albx0024">
              <a-select v-model:value="queryParam.albx0024" :options="optionsList.albx0024List" :disabled="selectType == 6"> </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24" v-show="advanced">
            <a-form-item label="服务类别" name="albx0009">
              <a-select v-model:value="queryParam.albx0009" :disabled="selectType == 3">
                <a-select-option v-for="item in optionsList.albx0009List" :key="item.codeid" :value="item.codeid">{{
                  item.codevalue
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24" v-show="advanced">
            <a-form-item label="服务对象" name="albx0014">
              <a-select v-model:value="queryParam.albx0014" :disabled="selectType == 5">
                <a-select-option v-for="item in optionsList.albx0014List" :key="item.codeid" :value="item.codeid">{{
                  item.codevalue
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24" v-show="advanced">
            <a-form-item label="有无时长" name="albx0061">
              <a-select v-model:value="queryParam.albx0061" :options="optionsList.albx0061List" :disabled="selectType == 2"> </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24" v-show="advanced">
            <a-form-item label="停用/启动" name="albx0073">
              <a-select v-model:value="queryParam.albx0073" :options="optionsList.albx0073List"> </a-select>
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
                    :disabled="selectType == 4"
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
                    :disabled="selectType == 4"
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
                    onkeyup="value=value.replace(/[^\d]/g,'')"
                    onafterpaste="value=value.replace(/[^\d]/g,'')"
                    :disabled="selectType == 2"
                  />
                </a-col>
                <a-col>
                  <img style="position: relative; top: 6px" src="@/assets/img/workBenchImg/date.png" alt="" />
                </a-col>
                <a-col>
                  <a-input
                    style="display: inline-block"
                    v-model:value="queryParam.maxTime"
                    onkeyup="value=value.replace(/[^\d]/g,'')"
                    onafterpaste="value=value.replace(/[^\d]/g,'')"
                    :disabled="selectType == 2"
                  />
                </a-col>
              </a-row>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24" v-show="advanced">
            <a-form-item name="minDay" label="开始时间">
              <a-date-picker
                v-model:value="queryParam.minDay"
                :disabled-date="disabledStartDate"
                style="width: 100%"
                placeholder="项目最早开始日期"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24" v-show="advanced">
            <a-form-item name="maxDay" label="开始时间">
              <a-date-picker v-model:value="queryParam.maxDay" :disabled-date="disabledEndDate" style="width: 100%" placeholder="项目最晚开始日期" />
            </a-form-item>
          </a-col>
          <a-col :md="(!advanced && 6) || 24" :sm="24">
            <a-form-item>
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
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </template>
    <template #table>
      <ProjectStatisticsEachar :queryParam="queryParam" :advanced="advanced" ref="ProjectStatisticsEachar" @child="child"></ProjectStatisticsEachar>
    </template>
  </PageFormTableWrapper>
</template>
<script>
import { defineComponent, reactive, ref, onMounted, watch, nextTick } from 'vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import ProjectStatisticsEachar from './ProjectStatisticsEachar.vue'
import { nvsiAlbx0009, nvsiAlbx0014, nvsiAlbx0024 } from '@/utils/codevalue'
import { checktime2, redDate, sortCode } from '@/utils/publicMethods/common'
import { rpcPost } from '@/server/conf/index.js'
import moment from 'moment'
import apis from '@/server/request'
export default defineComponent({
  components: { DownOutlined, UpOutlined, ProjectStatisticsEachar },
  setup() {
    const userInfo = ref(LocalGetUserInfo())
    const advanced = ref(false)
    const queryParam = reactive({
      areaid: [], //区域
      // albx0002: '', // 项目名称
      // albx0013: '', //项目编号
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
        { label: '无效', value: '7' },
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
    const ProjectStatisticsEachar = ref()
    const selectType = ref('1')

    onMounted(() => {
      getOptions()
    })

    const getOptions = async () => {
      optionsList.albx0009List = await apis.getCodeValue('lbe05', 'getAllCodeFortis', { codeTypeName: 'lbe05', areaid: userInfo.value.areaid })
      //服务类别
      optionsList.albx0009List = [{ codevalue: '不限', codeid: '' }, ...optionsList.albx0009List.data]
      //服务对象
      optionsList.albx0014List = await apis.getCodeValue('nvsi_albx0014', 'getAllCodeFortis', { codeTypeName: 'nvsi_albx0014' })
      optionsList.albx0014List = [{ codevalue: '不限', codeid: '' }, ...optionsList.albx0014List.data]
    }

    const refresh = () => {
      //查询按钮
      searchFormRef.value
        .validate()
        .then(() => {
          ProjectStatisticsEachar.value.getData()
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
      ProjectStatisticsEachar.value.getData()
    }

    const showExpand = () => {
      advanced.value = !advanced.value
      nextTick(() => {
        ProjectStatisticsEachar.value.showExpand()
      })
    }

    const child = (selectValue) => {
      //统计指标变化时调用
      if (selectValue == 2) {
        queryParam.albx0061 = ''
        queryParam.minTime = ''
        queryParam.maxTime = ''
      } else if (selectValue == 3) {
        queryParam.albx0009 = ''
      } else if (selectValue == 4) {
        queryParam.minPerson = ''
        queryParam.maxPerson = ''
      } else if (selectValue == 5) {
        queryParam.albx0014 = ''
      } else if (selectValue == 6) {
        queryParam.albx0024 = ''
      } else if (selectValue == 7) {
        queryParam.albx0072 = ''
      }
      selectType.value = selectValue
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

    const disabledStartDate = (startValue) => {
      //项目开始时间选择范围
      if (!startValue || !queryParam.maxDay) {
        return startValue.valueOf() > moment(new Date(redDate(moment(new Date()).format('YYYY-MM-DD'), 1))).endOf('day')
      }
      return (
        startValue.valueOf() > queryParam.maxDay ||
        startValue.valueOf() > moment(new Date(redDate(moment(new Date()).format('YYYY-MM-DD'), 1))).endOf('day')
      )
    }

    const disabledEndDate = (endValue) => {
      //项目结束时间选择范围
      if (!endValue || !queryParam.minDay) {
        return endValue.valueOf() > moment(new Date(redDate(moment(new Date()).format('YYYY-MM-DD'), 1))).endOf('day')
      }
      return (
        queryParam.minDay > endValue.valueOf() ||
        endValue.valueOf() > moment(new Date(redDate(moment(new Date()).format('YYYY-MM-DD'), 1))).endOf('day')
      )
    }

    return {
      optionsList,
      advanced,
      selectType,
      ProjectStatisticsEachar,
      rules,
      searchFormRef,
      // 查询参数
      queryParam,
      userInfo: {},
      resetForm,
      refresh,
      disabledStartDate,
      disabledEndDate,
      child,
      showExpand,
    }
  },
})
</script>
<style scoped></style>
