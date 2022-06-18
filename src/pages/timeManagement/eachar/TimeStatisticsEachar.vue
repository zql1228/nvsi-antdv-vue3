<template>
  <!-- 队伍工作台eachar图 -->
  <div id="eacharHeight">
    <a-row :gutter="[0, 19]" id="echar-search">
      <a-col :md="20">
        <span style="padding-left:10px;">服务区域：</span>
        <macArea placeholder="请选择区域" v-model:value="queryParam.areaid" :allowClear="false" :showAll="false"></macArea>
        <a-select v-model:value="dateselected" style="margin:8px" @change="selectStatistics">
          <a-select-option style="width:100px" value="天">按天统计</a-select-option>
          <a-select-option style="width:100px" value="月">按月统计</a-select-option>
          <a-select-option style="width:100px" value="年">按年统计</a-select-option>
        </a-select>
        <span v-show="dateselected == '天'">
          <a-date-picker v-model:value="queryParam.startValue" :disabled-date="disabledStartDate" format="YYYY-MM-DD" placeholder="开始时间" :open="startOpen1" @openChange="(open) => handleStartOpenChange(open, 1)" />
          <img style="position:relative;top:-2px;" src="@/assets/img/workBenchImg/date.png" alt="" />
          <a-date-picker v-model:value="queryParam.endValue" :disabled-date="disabledEndDate" format="YYYY-MM-DD" :open="endOpen1" placeholder="结束时间" @openChange="(open) => handleEndOpenChange(open, 1)" />
        </span>
        <span v-show="dateselected == '月'">
          <a-month-picker style="position:relative;" @openChange="(open) => handleStartOpenChange(open, 2)" v-model:value="queryParam.startMonth" placeholder="开始时间" :open="startOpen2" :disabled-date="disabledStartMonth" />
          <img style="position:relative;top:-2px;" src="@/assets/img/workBenchImg/date.png" alt="" />
          <a-month-picker style="position:relative;" :open="endOpen2" v-model:value="queryParam.endMonth" @openChange="(open) => handleEndOpenChange(open, 2)" placeholder="结束时间" :disabled-date="disabledEndMonth" />
        </span>
        <span v-show="dateselected == '年'">
          <a-date-picker mode="year" v-model:value="queryParam.startYear" placeholder="开始时间" format="YYYY" :open="startOpen3" :disabled-date="disabledStartYear" @panelChange="(value) => changeYear(value, 1)" @openChange="(open) => handleStartOpenChange(open, 3)" />
          <img style="position:relative;top:-2px;" src="@/assets/img/workBenchImg/date.png" alt="" />
          <a-date-picker mode="year" placeholder="结束时间" v-model:value="queryParam.endYear" format="YYYY" :disabled-date="disabledEndYear" :open="endOpen3" @panelChange="(value) => changeYear(value, 2)" @openChange="(open) => handleEndOpenChange(open, 3)" />
        </span>
        <a-button style="margin:8px;" type="primary" @click.prevent="getSearch">查询</a-button>
        <a-button @click="reset.prevent">重置</a-button>
        <!-- <div style="display:inline-block;position: absolute;right: 0;top: 8px"></div> -->
      </a-col>
      <a-col style="padding-top:8px;width:200px">
        <a-button @click="downLoadEcharts" type="primary" :disabled="isdisabled">
          下载图表
        </a-button>
        <a-button style="margin-left:8px;" type="primary" :disabled="isdisabled" ghost @click="downLoad">
          导出表格
        </a-button>
      </a-col>
    </a-row>
    <a-row id="echar-tip">
      <a-col :offset="6" :span="3"><span id="stimeTip"></span></a-col>
      <a-col :span="3"><span id="etimeTip"></span></a-col>
    </a-row>
    <a-row id="echar-num" style="height:40px;line-height:40px;padding-left:10px;margin-bottom:20px;">
      <a-col :span="24" style="postition:relative;">
        <div style="font-size:16px;font-weight:bold;color:#000">
          查询合计：总服务时长<span style="color:#D92F2F;font-weight:bold">{{ timenum }}</span
          >小时（截止{{ today }}）
        </div>
      </a-col>
    </a-row>
    <a-spin :spinning="queryParam.spinning">
      <div id="echarts1" :ref="setRef" :style="{ height: echarsHeight }"></div>
    </a-spin>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import { redDate, loadEcharts, addDays } from '@/utils/publicMethods/common.js'
import moment from 'moment'
import drawChart1 from './echarts'
import apis from '@/server/request'
import { forTips } from '../../membersManagement/components/tables/hasSelected'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { defineComponent, reactive, ref, toRefs, onMounted, watch, nextTick } from 'vue'
export default defineComponent({
  props: {
    obj: {
      type: Object,
      default: {},
    },
    active: {
      type: String,
      default: 'tab2',
    },
  },
  setup(props) {
    const userInfo = ref(LocalGetUserInfo())

    const queryParam = reactive({
      areaid: [],
      albx0021: userInfo.value.areaid,
      startValue: null, //开始日期
      endValue: null, //结束日期
      startMonth: null,
      endMonth: null,
      startYear: null,
      endYear: null,
      spinning: false,
    })
    const timeParam = reactive({
      volnum: 0,
      timenum: 0,
      pronum: 0,
      orgnum: 0,
      today: '',
    })
    const timedata = reactive({
      tab2: {},
      tab3: {},
      tab4: {},
      tab5: {},
    })
    const Opens = reactive({
      startOpen1: false,
      startOpen2: false,
      startOpen3: false,
      endOpen1: false,
      endOpen2: false,
      endOpen3: false,
    })
    const myRef = ref()
    const dateselected = ref('天') //年月日统计切换
    const setRef = (el) => {
      myRef.value = el
    }
    const echarsHeight = ref('550px')
    let dataSource = ref([])
    const isdisabled = ref(true)
    onMounted(() => {
      let lastDay = redDate(moment(new Date()).format('YYYY-MM-DD'), 1)
      timeParam.today = `${lastDay.slice(0, 4)}年${lastDay.slice(5, 7)}月${lastDay.slice(8, 10)}日`
      queryParam.endValue = moment(redDate(moment(new Date()).format('YYYY-MM-DD'), 0))
      queryParam.startValue = moment(redDate(moment(new Date()).format('YYYY-MM-DD'), 6))
      // const months = lastmonth(12, false, 0)
      // queryParam.endMonth = moment(months[1])
      // queryParam.startMonth = moment(months[0])
      // queryParam.endYear = moment(new Date())
      // queryParam.startYear = moment(new Date().getFullYear() - 10 + '-01-01')
    })
    const reset = () => {
      //重置按钮
      queryParam.endValue = moment(redDate(moment(new Date()).format('YYYY-MM-DD'), 0))
      queryParam.startValue = moment(redDate(moment(new Date()).format('YYYY-MM-DD'), 6))
      // const months = lastmonth(12, false, 0)
      // queryParam.endMonth = moment(months[1])
      // queryParam.startMonth = moment(months[0])
      // queryParam.endYear = moment(new Date())
      // queryParam.startYear = moment(new Date().getFullYear() - 10 + '-01-01')
      queryParam.albx0021 = userInfo.value.areaid
      queryParam.areaid = [userInfo.value.areaid]
      getSearch()
    }
    const getHeight = () => {
      echarsHeight.value = document.getElementById('eacharHeight').clientHeight - (document.getElementById('echar-search').clientHeight + document.getElementById('echar-num').clientHeight)
    }
    const getSum = () => {
      apis
        .StatisticsOnTimeLengthQueryFortisService({
          albx0021: queryParam.areaid[queryParam.areaid.length - 1],
        })
        .then((res) => {
     
          if (res) {
        
            timeParam.timenum = res.count_time * 1 ? (res.count_time * 1).toFixed(2) : '0'
          }
        })
    }
    const getSearch = () => {
      // 统计
      getSum()
      queryParam.spinning = true
      const params = {
        areaid: queryParam.areaid[queryParam.areaid.length - 1],
        type: props.active == 'tab2' ? '1' : props.active == 'tab3' ? '2' : props.active == 'tab4' ? '3' : '4', //1 服务时长 2活跃志愿者 3活跃项目  4.活跃队伍
        ttt: dateselected.value == '天' ? '1' : dateselected.value == '月' ? '2' : '3', // 天 月 年
      }
      if (dateselected.value == '天') {
        if (queryParam.startValue) {
          params.start = queryParam.startValue.format('YYYY-MM-DD') + ' 00:00:00'
        } else {
          forTips('stimeTip', '开始时间不能为空')
          return
        }
        if (queryParam.endValue) {
          params.end = queryParam.endValue.format('YYYY-MM-DD') + ' 00:00:00'
        } else {
          forTips('etimeTip', '结束时间不能为空')
          return
        }
      } else if (dateselected.value == '月') {
        if (queryParam.startMonth) {
          params.start = queryParam.startMonth.format('YYYY-MM') + '-01' + ' 00:00:00'
        } else {
          forTips('stimeTip', '开始时间不能为空')
          return
        }
        if (queryParam.endMonth) {
          params.end = queryParam.endMonth.format('YYYY-MM') + '-01' + ' 00:00:00'
        } else {
          forTips('etimeTip', '结束时间不能为空')
          return
        }
      } else {
        if (queryParam.startYear) {
          params.start = queryParam.startYear.format('YYYY') + '-01-01' + ' 00:00:00'
        } else {
          forTips('stimeTip', '开始时间不能为空')
          return
        }
        if (queryParam.endYear) {
          params.end = queryParam.endYear.format('YYYY') + '-01-01' + ' 00:00:00'
        } else {
          forTips('etimeTip', '结束时间不能为空')
          return
        }
      }
  
      apis.durationManagementTreeViewlistFortisService(params).then((res) => {
     
        if (res) {
          props.active == 'tab2' ? (timedata.tab2 = res) : props.active == 'tab3' ? (timedata.tab3 = res) : props.active == 'tab4' ? (timedata.tab4 = res) : (timedata.tab5 = res)
          const xarr = []
          const yarr = []
          const list = []
          let sum = 0
          res.forEach((el) => {
            if (props.active == 'tab2') {
              let num = parseFloat(el.number).toFixed(2)
              yarr.push(parseFloat(el.number).toFixed(2))
              sum += num * 1
            } else {
              yarr.push(Math.floor(el.number * 1))
              sum += Math.floor(el.number * 1)
            }
            list.push({
              time: dateselected.value == '天' ? el.time.slice(0, 10) : dateselected.value == '月' ? el.time.slice(0, 7) : el.time.slice(0, 4),
              number: props.active == 'tab2' ? parseFloat(el.number).toFixed(2) : Math.floor(el.number * 1),
            })
            if (dateselected.value == '天') {
              xarr.push(el.time.slice(0, 10))
            } else if (dateselected.value == '月') {
              xarr.push(el.time.slice(0, 7))
            } else {
              xarr.push(el.time.slice(0, 4))
            }
          })
          props.active == 'tab2' ? list.push({ time: '合计', number: parseFloat(sum).toFixed(2) }) : list.push({ time: '合计', number: parseInt(sum) })
          dataSource.value = list
          drawChart1('echarts1', xarr, yarr, props.active, dateselected.value)
       
          queryParam.spinning = false
          isdisabled.value = false
        } else {
    
        }
        queryParam.spinning = false
      })
    }
    const downLoad = () => {
      const params = {
        beans: dataSource.value,
        type: props.active == 'tab2' ? '服务时长数' : props.active == 'tab3' ? '活跃志愿者数' : props.active == 'tab4' ? '活跃项目数' : '活跃队伍数',
        ttt: dateselected.value, // 1天 2月 3年
        teamName: userInfo.value.fullName, //队伍名称
        selecttypevalue: props.active == 'tab2' ? '时长' : props.active == 'tab3' ? '志愿者人数' : props.active == 'tab4' ? '项目数' : '队伍数',
      }
      console.log(params, '导出excel')
      apis.drawExcelService(params).then((res) => {
        if (res) {
          window.location.href = res
        }
      })
    }
    const downLoadEcharts = () => {
      loadEcharts('echarts1')
    }
    const disabledStartDate = (startValue) => {
      if (!startValue || !queryParam.endValue) {
        return startValue.valueOf() > new Date().getTime()
      }
      let day = moment(redDate(queryParam.endValue.format('YYYY-MM-DD'), 29))
      return startValue.valueOf() > queryParam.endValue.valueOf() || startValue.valueOf() > new Date().getTime() || startValue.valueOf() < day.valueOf()
    }
    const disabledEndDate = (endValue) => {
      //按天选 结束时间选择范围 今天和之前并且与开始日期最大间隔30天
      if (!endValue || !queryParam.startValue) {
        return endValue.valueOf() > new Date().getTime()
      }
      return endValue.valueOf() > new Date().getTime() || queryParam.startValue.valueOf() > endValue.valueOf() || endValue.valueOf() > moment(new Date(addDays(queryParam.startValue.format('YYYY-MM-DD'), 29))).endOf('day')
    }
    const disabledStartMonth = (startMonth) => {
      if (!startMonth || !queryParam.endMonth) {
        return startMonth.valueOf() > new Date().getTime()
      }
      let month = moment(lastmonth(24, queryParam.endMonth.format('YYYY-MM-DD'), 0)[0])
      // let month = moment(queryParam.endMonth.format('YYYY') + '-12-01')
      return startMonth.valueOf() > queryParam.endMonth.valueOf() || startMonth.valueOf() > new Date().getTime() || startMonth.valueOf() < month.valueOf()
    }
    const disabledEndMonth = (endMonth) => {
      if (!endMonth || !queryParam.startMonth) {
        return endMonth.valueOf() > moment().endOf('day')
      }
      let month = moment(lastmonth(25, queryParam.startMonth.format('YYYY-MM-DD'), 1)[0])
      return endMonth.valueOf() < queryParam.startMonth.valueOf() || endMonth.valueOf() > moment().endOf('day') || endMonth.valueOf() > month.valueOf()
    }
    const disabledStartYear = (startYear) => {
      if (!startYear || !queryParam.endYear) {
        return startYear.valueOf() > new Date().getTime()
      }
      let year = moment(queryParam.endYear.format('YYYY') * 1 - 10 + '-01-01')
      return startYear.valueOf() > new Date().getTime() || startYear.valueOf() > queryParam.endYear.valueOf() || startYear.valueOf() < year.valueOf()
    }
    const disabledEndYear = (endYear) => {
      if (!endYear || !queryParam.startYear) {
        return endYear.valueOf() > new Date().getTime()
      }
      let year = moment(queryParam.startYear.format('YYYY') * 1 + 10 + '-01-01')
      return endYear.valueOf() < queryParam.startYear.valueOf() || endYear.valueOf() > year.valueOf() || endYear.valueOf() > new Date().getTime()
    }
    const handleStartOpenChange = (open, val) => {
      val == 1 ? (Opens.startOpen1 = open) : val == 2 ? (Opens.startOpen2 = open) : (Opens.startOpen3 = open)
      if (!open) {
        val == 1 ? (Opens.endOpen1 = true) : val == 2 ? (Opens.endOpen2 = true) : (Opens.endOpen3 = true)
      }
    }
    const handleEndOpenChange = (open, val) => {
      val == 1 ? (Opens.endOpen1 = open) : val == 2 ? (Opens.endOpen2 = open) : (Opens.endOpen3 = open)
    }
    const onAreaChange = (val) => {
      // 服务区域下拉选择
      if (val.length > 0) {
        queryParam.albx0021 = val[val.length - 1]
      } else {
        queryParam.albx0021 = userInfo.value.areaid
      }
    }
    const selectStatistics = (val) => {
      if (val == '天') {
        queryParam.startMonth = null
        queryParam.endMonth = null
        queryParam.startYear = null
        queryParam.endYear = null
      } else if (val == '月') {
        queryParam.starValue = null
        queryParam.endValue = null
        queryParam.startYear = null
        queryParam.endYear = null
      } else {
        queryParam.starValue = null
        queryParam.endValue = null
        queryParam.startMonth = null
        queryParam.endMonth = null
      }
    }
    const lastmonth = (num, day, bool) => {
      //某个月份day的前(bool=0)或后(bool=1)多少月num,
      let d = day ? new Date(day) : new Date()
      let result = []
      for (var i = 0; i < num; i++) {
        if (i != 0) {
          !bool ? d.setMonth(d.getMonth() - 1) : d.setMonth(d.getMonth() + 1)
        }
        var m = d.getMonth() + 1
        m = m < 10 ? '0' + m : m
        result.push(d.getFullYear() + '-' + m + '-01')
      }
      return [result[result.length - 1], result[0]]
    }
    const changeYear = (value, val) => {
      if (val == 1) {
        queryParam.startYear = value
        Opens.startOpen3 = false
      } else {
        queryParam.endYear = value
        Opens.endOpen3 = false
      }
    }
    const num = ref(1)
    watch(
      () => queryParam.areaid,
      () => {
        if (num.value == 1) {
          getSearch()
          num.value += 1
        }
      }
    )
    watch(
      () => props.active,
      () => {
        nextTick(() => {
          getSearch()
        })
      }
    )
    return {
      queryParam,
      isdisabled,
      ...toRefs(timeParam),
      ...toRefs(Opens),
      setRef,
      props,
      echarsHeight,
      getSearch,
      downLoad,
      downLoadEcharts,
      dateselected,
      reset,
      disabledStartDate,
      disabledEndDate,
      disabledStartMonth,
      disabledEndMonth,
      disabledStartYear,
      disabledEndYear,
      onAreaChange,
      changeYear,
      handleStartOpenChange,
      handleEndOpenChange,
      selectStatistics,
    }
  },
})
</script>
<style scoped></style>
