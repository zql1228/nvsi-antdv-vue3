<template>
  <!-- 队伍统计 -->
  <PageFormTableWrapper>
    <template #searchForm>
      <div class="table-page-search-wrapper">
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
              <a-form-item label="队伍名称" name="albe0002">
                <a-input placeholder="请输入队伍名称" v-model:value="queryParam.albe0002" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="队伍编号" name="albe0041">
                <a-input placeholder="请输入队伍编号" v-model:value="queryParam.albe0041" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="advanced">
              <a-form-item label="服务类别" name="albe0017">
                <a-select v-model:value="queryParam.albe0017">
                  <a-select-option v-for="(item, index) in optionsList.albe0017List" :key="index" :value="item.codeid">{{
                    item.codevalue
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="advanced">
              <a-form-item label="队伍类型" name="albe0003">
                <a-select v-model:value="queryParam.albe0003" :options="optionsList.albe0003List" :disabled="selectType == 3"> </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="advanced">
              <a-form-item label="停用/启动" name="albe0026">
                <a-select v-model:value="queryParam.albe0026" :options="optionsList.albe0026List"> </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="advanced">
              <a-form-item label="有无时长" name="albe0069">
                <a-select v-model:value="queryParam.albe0069" :options="optionsList.albe0069List" :disabled="selectType == 4"> </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="advanced">
              <a-form-item label="队伍人数" name="albe0056">
                <a-row class="my_input js-input-width" type="flex" style="flex-wrap: nowrap">
                  <a-col>
                    <a-input
                      v-model:value="queryParam.albe0056Start"
                      onkeyup="value=value.replace(/[^\d]/g,'')"
                      onafterpaste="value=value.replace(/[^\d]/g,'')"
                      :disabled="selectType == 5"
                    />
                  </a-col>
                  <a-col>
                    <img style="position: relative; top: 6px" src="@/assets/img/workBenchImg/date.png" alt="" />
                  </a-col>
                  <a-col>
                    <a-input
                      v-model:value="queryParam.albe0056End"
                      onkeyup="value=value.replace(/[^\d]/g,'')"
                      onafterpaste="value=value.replace(/[^\d]/g,'')"
                      :disabled="selectType == 5"
                    />
                  </a-col>
                </a-row>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="advanced">
              <a-form-item label="时长区间" name="albe0069">
                <a-row class="my_input js-input-width" type="flex" style="flex-wrap: nowrap">
                  <a-col>
                    <a-input
                      style="display: inline-block"
                      v-model:value="queryParam.albe0069Start"
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
                      style="display: inline-block"
                      v-model:value="queryParam.albe0069End"
                      onkeyup="value=value.replace(/[^\d]/g,'')"
                      onafterpaste="value=value.replace(/[^\d]/g,'')"
                      :disabled="selectType == 4"
                    />
                  </a-col>
                </a-row>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="advanced">
              <a-form-item name="albe0046Start" label="注册时间">
                <a-date-picker
                  :disabled-date="disabledDate"
                  v-model:value="queryParam.albe0046Start"
                  style="width: 100%"
                  placeholder="最早注册日期"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-show="advanced">
              <a-form-item name="albe0046End" label="注册时间">
                <a-date-picker :disabled-date="disabledDate" v-model:value="queryParam.albe0046End" style="width: 100%" placeholder="最晚注册日期" />
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
      </div>
    </template>
    <template #table>
      <TeamStatisticsChart ref="teamEachar" :queryParam="queryParam" :advanced="advanced" @child="child"></TeamStatisticsChart>
    </template>
  </PageFormTableWrapper>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs, nextTick } from 'vue'
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import TeamStatisticsChart from './table/TeamStatisticsChart.vue'
import moment from 'moment'
import apis from '@/server/request'
import { redDate, checktime2 } from '@/utils/publicMethods/common'
import {
  nvsiAlbp0039, //服务类别
  nvsiAlbe0003, //队伍类型
} from '@/utils/codevalue'
export default defineComponent({
  components: {
    DownOutlined,
    UpOutlined,
    TeamStatisticsChart,
  },
  setup() {
    const userInfo = ref(LocalGetUserInfo())
    const advanced = ref(false)
    const queryParam = reactive({
      areaid: [], //服务区域
      albe0002: '', // 队伍名称
      albe0041: '', //队伍编号
      albe0017: '', //服务类别
      albe0003: '', //队伍类型
      albe0026: '', //停用/启用
      albe0069: '', //有无时长
      albe0056Start: '', //队伍人数 最小
      albe0056End: '', //队伍人数 最大
      albe0069Start: '', //时长区间 时长最小
      albe0069End: '', //时长区间 时长最大
      albe0046Start: null, //最小日期
      albe0046End: null, //最大日期
    })
    const optionsList = reactive({
      albe0017List: [],
      albe0003List: [],
      albe0026List: [
        { label: '不限', value: '' },
        { label: '启用', value: '0' },
        { label: '停用', value: '1' },
      ], //停用启用
      albe0069List: [
        { label: '不限', value: '' },
        { label: '无时长', value: '0' },
        { label: '有时长', value: '1' },
      ], //时长
    })
    // optionsList.albe0017List = JSON.parse(JSON.stringify(nvsiAlbp0039))
    // optionsList.albe0017List.unshift({ label: '不限', value: '' })
    optionsList.albe0003List = JSON.parse(JSON.stringify(nvsiAlbe0003))
    optionsList.albe0003List.unshift({ label: '不限', value: '' })
    const searchFormRef = ref()
    const teamEachar = ref()
    const selectType = ref('1') //统计图当前统计指标

    onMounted(() => {
      getServiceTypeListFortis()
    })

    const getServiceTypeListFortis = async () => {
      const res = await apis.getCodeValue('lbe05', 'getAllCodeFortis', { codeTypeName: 'lbe05', areaid: userInfo.value.areaid })
      if (res.code == 0) {
        optionsList.albe0017List = [{ codevalue: '不限', codeid: '' }, ...res.data]
      }
    }

    const disabledDate = (current) => {
      //时间不能选今天之前
      return current && current >= moment(moment(new Date()).format('YYYY-MM-DD')).endOf('day')
    }

    const refresh = () => {
      //查询按钮
      searchFormRef.value
        .validate()
        .then(() => {
          teamEachar.value.getData()
        })
        .catch((error) => {
          console.log(error)
        })
    }

    const resetForm = () => {
      //重置
      searchFormRef.value.resetFields()
      queryParam.albe0056Start = ''
      queryParam.albe0056End = ''
      queryParam.albe0069Start = ''
      queryParam.albe0069End = ''
      teamEachar.value.getData()
    }

    const showExpand = () => {
      advanced.value = !advanced.value
      nextTick(() => {
        teamEachar.value.showExpand()
      })
    }

    const child = (type) => {
      //统计图查询指标改变时调用的方法
      if (type == 2) {
        queryParam.albe0017 = ''
      } else if (type == 3) {
        queryParam.albe0003 = ''
      } else if (type == 4) {
        queryParam.albe0069 = ''
        queryParam.albe0069Start = ''
        queryParam.albe0069End = ''
      } else if (type == 5) {
        queryParam.albe0056Start = ''
        queryParam.albe0056End = ''
      }
      selectType.value = type
    }

    const checkperson = async (rule, value) => {
      //人数区间校验
      if (queryParam.albe0056Start && queryParam.albe0056End && queryParam.albe0056End - queryParam.albe0056Start < 0) {
        return Promise.reject('最大人数不能小于最小人数')
      } else {
        return Promise.resolve()
      }
    }
    const checktime = async (rule, value) => {
      //人数区间校验
      if (queryParam.albe0069Start && queryParam.albe0069End && queryParam.albe0069End - queryParam.albe0069Start < 0) {
        return Promise.reject('最大时长不能小于最小时长')
      } else {
        return Promise.resolve()
      }
    }
    const checkmaxDay = async (rule, value) => {
      //队伍注册时间校验
      if (
        queryParam.albe0046Start &&
        queryParam.albe0046End &&
        checktime2(moment(new Date(queryParam.albe0046End)).format('YYYY-MM-DD'), moment(new Date(queryParam.albe0046Start)).format('YYYY-MM-DD'))
      ) {
        return Promise.reject('最晚注册时间不能早于注册最早时间')
      } else {
        return Promise.resolve()
      }
    }

    const rules = reactive({
      albe0056: [{ required: false, validator: checkperson }], //人数区间
      albe0069: [{ required: false, validator: checktime }], //时长区间
      albe0046End: [{ required: false, validator: checkmaxDay }], //注册时间
    })

    return {
      optionsList,
      advanced,
      searchFormRef,
      selectType,
      teamEachar,
      showExpand,
      // 查询参数
      queryParam,
      resetForm,
      disabledDate,
      refresh,
      rules,
      child,
    }
  },
})
</script>

<style scoped lang="less"></style>
