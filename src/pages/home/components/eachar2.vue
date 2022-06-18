<template>
  <!-- 管理部门工作台eachar图 -->
  <div>
    <a-row :gutter="[0, 19]">
      <a-col :span="24" class="row1">
        <a-row class="row1_content">
          <a-col :md="17" :sm="24">
            <div ref="form">
              <a-select ref="select" v-model:value="selectValue" class="date_select">
                <a-select-option value="1">按天统计</a-select-option>
                <a-select-option value="2">按月统计</a-select-option>
                <a-select-option value="3">按年统计</a-select-option>
              </a-select>
              <div v-show="selectValue == 1" class="date_div">
                <a-date-picker
                  class="date"
                  v-model:value="dataList.day.startValue"
                  :disabled-date="disabledStartDate"
                  format="YYYY-MM-DD"
                  placeholder="开始日期"
                  @openChange="handleStartOpenChange"
                  @change="updateTime3"
                />
                <img class="img" src="@/assets/img/workBenchImg/date.png" alt="" />
                <a-date-picker
                  class="date"
                  v-model:value="dataList.day.endValue"
                  :disabled-date="disabledEndDate"
                  format="YYYY-MM-DD"
                  placeholder="结束日期"
                  :open="dataList.day.endOpen"
                  @openChange="handleEndOpenChange"
                />
              </div>
              <div v-show="selectValue == 2" class="date_div">
                <a-month-picker
                  class="date"
                  v-model:value="dataList.month.startValue"
                  :disabled-date="disabledStartMonth"
                  format="YYYY-MM"
                  placeholder="开始日期"
                  @openChange="handleStartOpenChange"
                  @change="updateTime4"
                />
                <img class="img" src="@/assets/img/workBenchImg/date.png" alt="" />
                <a-month-picker
                  class="date"
                  v-model:value="dataList.month.endValue"
                  :disabled-date="disabledEndMonth"
                  format="YYYY-MM"
                  placeholder="结束日期"
                  :open="dataList.month.endOpen"
                  @openChange="handleEndOpenChange"
                />
              </div>
              <div v-show="selectValue == 3" class="date_div">
                <a-date-picker
                  placeholder="开始日期"
                  mode="year"
                  format="YYYY"
                  v-model:value="dataList.year.startValue"
                  @openChange="handleStartOpenChange"
                  @panelChange="updateTime1"
                />
                <img class="img" src="@/assets/img/workBenchImg/date.png" alt="" />
                <a-date-picker
                  placeholder="结束日期"
                  mode="year"
                  format="YYYY"
                  v-model:value="dataList.year.endValue"
                  :open="dataList.year.endOpen"
                  @openChange="handleEndOpenChange"
                  @panelChange="updateTime2"
                />
              </div>
              <div class="inlin_b">
                <a-button
                  class="mr_8"
                  @click="refresh(props.active)"
                  :disabled="
                    (!(selectValue == '1' && dataList.day.startValue && dataList.day.endValue) &&
                      !(selectValue == '2' && dataList.month.startValue && dataList.month.endValue) &&
                      !(selectValue == '3' && dataList.year.startValue && dataList.year.endValue)) ||
                    loading3 == true
                  "
                  :loading="loading"
                  >查询</a-button
                >
                <a-button @click="reset" :loading="loading3" :disabled="loading == true">重置</a-button>
              </div>
            </div>
          </a-col>
          <a-col :md="7" :sm="24">
            <div class="download_div">
              <a-button @click="exportUplod" :disabled="loading == true || loading3 == true"> 下载图表 </a-button>
              <a-button class="ml_8" @click="exportUplo2" :loading="loading2" :disabled="loading == true || loading3 == true">
                导出excel表格
              </a-button>
              <a ref="download" download v-show="false" href="#"></a>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row style="height: 40px; line-height: 40px; padding-left: 10px; margin-bottom: 20px">
      <a-col :span="24" style="postition: relative">
        <span style="font-size: 16px; color: #000; font-weight: bold"
          >{{
            props.active == 'tab2' ? '新启动项目数' : props.active == 'tab3' ? '新增时长' : props.active == 'tab4' ? '新增志愿者' : '活跃志愿者'
          }}：<span style="color: #d92f2f">{{ param[props.active].num }}</span
          >&nbsp;{{ props.active == 'tab3' ? '小时' : '个' }}</span
        >
        <span style="position: absolute; right: 0">{单位：{{ props.active == 2 ? '小时' : '个' }} }</span>
      </a-col>
    </a-row>
    <a-spin :spinning="spinning">
      <div id="mcaWorkEachar" ref="myRef" :style="{ height: height }"></div>
    </a-spin>
  </div>
</template>
<script>
import { message } from 'ant-design-vue'
import { redDate, loadEcharts, addDays, checktime2, redDateYear } from '@/utils/publicMethods/common.js'
import * as echarts from 'echarts'
import { rpcPost } from '@/server/conf/index.js'
import moment from 'moment'
import { LocalGetUserInfo } from '@/utils/localStorage.js'
import { defineComponent, reactive, ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
export default defineComponent({
  props: {
    active: {
      type: String,
      default: 'tab2',
    },
  },
  setup(props) {
    const selectValue = ref('1') //1日 2月 3年
    const height = ref() //eachar统计图高度
    const form = ref() //查询条件模块元素对象
    const dataList = reactive({
      //时间
      day: {
        startValue: moment(new Date(redDate(moment(new Date()).format('YYYY-MM-DD'), 6))),
        endValue: moment(new Date(moment(new Date()).format('YYYY-MM-DD'))),
        endOpen: false,
      },
      month: {
        startValue: null,
        endValue: null,
        endOpen: false,
      },
      year: {
        startValue: null,
        endValue: null,
        endOpen: false,
      },
    })
    const endOpen = ref(false)
    const userInfo = ref()
    const loading = ref(false)
    const loading3 = ref(false)
    const loading2 = ref(false)
    const spinning = ref(false)
    const myRef = ref()
    const myChart = ref()
    const param = reactive({
      tab2: {
        list: [], //后端返回的数据
        x: [], //x轴
        y: [], //y轴
        num: 0, //总数
      },
      tab3: {
        list: [],
        x: [],
        y: [],
        num: 0,
      },
      tab4: {
        list: [],
        x: [],
        y: [],
        num: 0,
      },
      tab5: {
        list: [],
        x: [],
        y: [],
        num: 0,
      },
    })
    const download = ref() //下载图表a标签
    const mcaWorkEachar = ref() //统计图父元素
    watch(
      () => props.active,
      (active) => {
        drawBar(active)
      }
    )

    const eacharHeight = () => {
      //计算eachar图形高度
      if (form.value && form.value.clientHeight) {
        height.value = 429 - 24 - form.value.clientHeight - 40 - 20 + 'px'
      }
    }

    const resetHandleDraw = (e) => {
      if (e.type == 'resize') {
        eacharHeight()
        drawBar(props.active)
      }
    }

    const mountedMsgEvent = () => {
      window.addEventListener('resize', resetHandleDraw, true)
    }
    onBeforeUnmount(() => {
      window.removeEventListener('resize', resetHandleDraw, true)
    })
    onMounted(() => {
      setTimeout(() => {
        eacharHeight()
        userInfo.value = LocalGetUserInfo()
        getData('tab2')
        getData('tab3')
        getData('tab4')
        getData('tab5')
        mountedMsgEvent()
      }, 2000)
    })

    const refresh = (active) => {
      //查询
      loading.value = true
      getData(active)
    }

    const reset = () => {
      //重置按钮
      selectValue.value = '1'
      dataList.day.startValue = moment(new Date(redDate(moment(new Date()).format('YYYY-MM-DD'), 6)))
      dataList.day.endValue = moment(new Date(moment(new Date()).format('YYYY-MM-DD')))
      loading3.value = true
      getData(props.active)
    }
    const getData = (active) => {
      // 查询统计图数据
      if (selectValue.value == 3) {
        //如果按年份查
        if (dataList.year.startValue > dataList.year.endValue) {
          //判断开始日期是否早于结束日期
          loading.value = false
          message.warning('开始日期不能比结束日期晚')
          return
        } else if (dataList.year.endValue.format('YYYY') > new Date().getFullYear()) {
          //不能查询当年之后的年份数据
          loading.value = false
          message.warning('查询年份不能超过今年')
          return
        } else if (dataList.year.endValue.format('YYYY') - dataList.year.startValue.format('YYYY') >= 12) {
          //最多同时查12年的数据
          loading.value = false
          message.warning('年份跨度最多12年')
          return
        }
      }
      spinning.value = true
      if (active == 'tab5') return getData2(active) //活跃志愿者调另一个接口
      let bean = {
        type: selectValue.value, //天1 月2 年3
        operate: active == 'tab2' ? 1 : active == 'tab3' ? 2 : 3, //props.active 1,2,3,4项目、时长、新增志愿者
        level: userInfo.value.areaLevel, //0,1,2,3全国省市区
        startTime:
          selectValue.value == 1
            ? dataList.day.startValue.format('YYYY-MM-DD')
            : selectValue.value == 2
            ? dataList.month.startValue.format('YYYY-MM')
            : dataList.year.startValue.format('YYYY'),
        endTime:
          selectValue.value == 1
            ? dataList.day.endValue.format('YYYY-MM-DD')
            : selectValue.value == 2
            ? dataList.month.endValue.format('YYYY-MM')
            : dataList.year.endValue.format('YYYY'),
        areaId: userInfo.value.areaLevel == '0' ? '000000000000000000' : userInfo.value.areaid,
      }
      rpcPost('managementDepartmentPictureFortis', { bean }).then((res) => {
        param[active].x = []
        param[active].y = []
        param[active].num = 0
        if (res && res.data) {
          res.data.forEach((element) => {
            let time = moment(new Date(element.new_time)).format('YYYY-MM-DD')
            let number = 0
            if (selectValue.value == 1) {
              number = active == 'tab2' ? element.day_project_count : active == 'tab3' ? element.day_time_count : element.day_person_count
            } else {
              number = active == 'tab2' ? element.month_project_count : active == 'tab3' ? element.month_time_count : element.month_person_count
            }
            if (!number) {
              number = 0
            }
            let obj = {
              time: time,
              number: number,
            }
            param[active].list.push(obj)
            param[active].x.push(time)
            param[active].num += parseInt(number)
            param[active].y.push(number)
          })
        }
        if (active == props.active) {
          drawBar(props.active)
        }
      })
    }
    const getData2 = (active) => {
      // 查询活跃志愿者
      let bean = {
        type: selectValue.value, //天1 月2 年3
        start:
          selectValue.value == 1
            ? dataList.day.startValue.format('YYYY-MM-DD')
            : selectValue.value == 2
            ? dataList.month.startValue.format('YYYY-MM-DD')
            : dataList.year.startValue.format('YYYY-MM-DD'),
        end:
          selectValue.value == 1
            ? dataList.day.endValue.format('YYYY-MM-DD')
            : selectValue.value == 2
            ? dataList.month.endValue.format('YYYY-MM-DD')
            : dataList.year.endValue.format('YYYY-MM-DD'),
        albx0021: userInfo.value.areaLevel == '0' ? '000000000000000000' : userInfo.value.areaid,
      }
      rpcPost('managePersonFortisService', { bean }).then((res) => {
        param[active].x = []
        param[active].y = []
        param[active].num = 0
        if (res && res.data) {
          res.data.forEach((element) => {
            let time = moment(new Date(element.time)).format('YYYY-MM-DD')
            let number = element.number
            if (!number) {
              number = 0
            }
            let obj = {
              time: time,
              number: number,
            }
            param[active].list.push(obj)
            param[active].x.push(time)
            param[active].num += parseInt(number)
            param[active].y.push(number)
          })
          if (active == props.active) {
            drawBar(props.active)
          }
        }
      })
    }
    const leftPx = () => {
      //根据返回数据的最大数量计算y轴左侧距离
      let arr = JSON.parse(JSON.stringify(param[props.active].y))
      arr.sort((a, b) => {
        return b - a
      })
      let left = arr.length == 0 ? 9 : (arr[0] + '').length < 3 ? 24 : (arr[0] + '').length * 9
      return parseInt(left * 1 + 9)
    }
    const drawBar = (active) => {
      nextTick(() => {
        loading3.value = false
        loading.value = false
        spinning.value = false
        if (myChart.value) {
          myChart.value.dispose() //销毁
        }
        if (!myRef.value) {
          return
        }
        myChart.value = echarts.init(myRef.value)
        let option = {
          tooltip: {},
          xAxis: {
            type: 'category',
            data: param[active].x,
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              show: true,
              color: '#8FA2AE',
              align: 'center',
              margin: selectValue.value == 1 ? 30 : selectValue.value == 2 ? 25 : 20,
              interval: 0,
              formatter: function (value) {
                value = selectValue.value == 1 ? value : selectValue.value == 2 ? moment(value).format('YYYY-MM') : moment(value).format('YYYY')
                return value
              },
              rotate: 60,
              fontSize: 9,
            },
          },
          grid: {
            top: 24,
            bottom: 70,
            left: leftPx(),
            right: 0,
          },
          yAxis: {
            type: 'value',
            axisLine: {
              show: true,
            },
          },
          series: [
            {
              name: active == 'tab2' ? '新启动项目' : active == 'tab3' ? '新增时长' : active == 'tab4' ? '新增志愿者' : '活跃志愿者', // 系列名称
              type: 'bar', // 系列图表类型 'bar'：柱状/条形图
              barWidth: 16, //柱子的粗细
              data: param[active].y, // 系列中的数据内容
              itemStyle: {
                color: '#50AEB6',
                // barBorderRadius: 8,
                borderRadius: 8,
              },
              tooltip: {
                backgroundColor: '#F6F6F6',
                borderWidth: 0,
                textStyle: {
                  color: '#000',
                  fontSize: '14px',
                },
                formatter: function (param) {
                  let unit = active == 'tab3' ? '小时' : '个'
                  return [
                    param.name + '<br />',
                    '<span style="display:inline-block;margin-right:5px;margin-bottom:2px;border-radius:6px;width:6px;height:6px;background-color:#50AEB6"></span>' +
                      param.seriesName +
                      ':&nbsp;&nbsp;' +
                      param.data +
                      '&nbsp;' +
                      unit,
                  ].join('')
                },
              },
            },
          ],
        }
        myChart.value.setOption(option)
      })
    }

    const disabledStartDate = (startValue) => {
      //按天选 开始时间选择范围 当天和之前的可以选
      if (!startValue || !dataList.day.endValue) {
        return startValue.valueOf() > moment(new Date(moment(new Date()).format('YYYY-MM-DD'))).endOf('day')
      }
      return (
        startValue.valueOf() > dataList.day.endValuee || startValue.valueOf() > moment(new Date(moment(new Date()).format('YYYY-MM-DD'))).endOf('day')
      )
    }
    const disabledEndDate = (endValue) => {
      //按天选 结束时间选择范围 今天和之前并且与开始日期最大间隔30天
      if (!endValue || !dataList.day.startValue) {
        return endValue.valueOf() > moment(new Date(moment(new Date()).format('YYYY-MM-DD'))).endOf('day')
      }
      return (
        dataList.day.startValue > endValue.valueOf() ||
        endValue.valueOf() > moment(new Date(moment(new Date()).format('YYYY-MM-DD'))).endOf('day') ||
        endValue.valueOf() > moment(new Date(addDays(moment(new Date(dataList.day.startValue)).format('YYYY-MM-DD'), 29))).endOf('day')
      )
    }

    const disabledStartMonth = (startValue) => {
      //按月选 开始时间选择范围 当月及之前的可以选
      if (!startValue || !dataList.month.endValue) {
        return startValue.valueOf() > moment(new Date(moment().endOf('day')))
      }
      return startValue.valueOf() > dataList.month.endValue || startValue.valueOf() > moment().endOf('day')
    }
    const disabledEndMonth = (endValue) => {
      //按月选 结束时间选择范围
      if (!endValue || !dataList.month.startValue) {
        return endValue.valueOf() > moment().endOf('day')
      }
      return (
        dataList.month.startValue > endValue.valueOf() ||
        endValue.valueOf() > moment().endOf('day') ||
        endValue.valueOf() > moment(new Date(redDateYear(moment(new Date(dataList.month.startValue)).format('YYYY-MM-DD'), 23))).endOf('day')
      )
    }
    const handleStartOpenChange = (open) => {
      if (!open) {
        selectValue.value == '1'
          ? (dataList.day.endOpen = true)
          : selectValue.value == '2'
          ? (dataList.month.endOpen = true)
          : (dataList.year.endOpen = true)
      }
    }
    const handleEndOpenChange = (open) => {
      selectValue.value == '1'
        ? (dataList.day.endOpen = open)
        : selectValue.value == '2'
        ? (dataList.month.endOpen = open)
        : (dataList.year.endOpen = open)
    }

    const updateTime1 = (val) => {
      //年份日期选择  开始日期年份值改变
      dataList.year.startValue = val
    }

    const updateTime2 = (val) => {
      //年份日期选择 结束日期年份值改变
      dataList.year.endValue = val
    }

    const updateTime3 = (val) => {
      //按天查 开始日期变化时,清空结束日期让用户重新选择结束日期
      dataList.day.startValue = val
      dataList.day.endValue = null
    }

    const updateTime4 = (val) => {
      //按月查 开始日期变化时,清空结束日期让用户重新选择结束日期
      dataList.month.startValue = val
      dataList.month.endValue = null
    }

    const exportUplod = () => {
      //下载图表按钮
      loadEcharts('mcaWorkEachar')
    }

    const exportUplo2 = () => {
      //导出excel表格
      let bean = {
        beans: JSON.parse(JSON.stringify(param[props.active].list)), //当前显示的图形数据
        type: props.active == 'tab2' ? '新启动项目数' : props.active == 'tab3' ? '新增时长' : props.active == 'tab4' ? '新增志愿者' : '活跃志愿者', //统计类型
        ttt: '天', //1天/2月/3年
        teamname: userInfo.value.fullName, //管理员名称
        selecttypevalue:
          props.active == 'tab2' ? '新启动项目数' : props.active == 'tab3' ? '新增时长' : props.active == 'tab4' ? '新增志愿者' : '活跃志愿者', //y轴系列名
      }
      bean.beans.push({ time: '合计', number: param[props.active].num })
      loading2.value = true
      rpcPost('drawExcelService', bean).then((res) => {
        if (res && res.code === 0 && res.data) {
          download.value.href = res.data
          download.value.click()
        } else {
          message.warning('导出失败')
        }
        loading2.value = false
      })
    }

    return {
      loading,
      loading3,
      loading2,
      spinning,
      mcaWorkEachar,
      param,
      selectValue,
      height,
      form,
      props,
      dataList,
      download,
      endOpen,
      userInfo,
      getData,
      refresh,
      reset,
      handleStartOpenChange,
      handleEndOpenChange,
      disabledStartDate,
      disabledEndDate,
      disabledStartMonth,
      disabledEndMonth,
      updateTime1,
      updateTime2,
      updateTime3,
      updateTime4,
      myRef,
      exportUplod,
      exportUplo2,
    }
  },
})
</script>
<style scoped>
.row1 {
  position: relative;
}
.row1_content {
  padding-left: 10px;
}
.date_select {
  width: 100px;
  margin: 8px 8px 8px 0;
}
.date_div {
  display: inline-block;
  position: relative;
  top: -1px;
  margin: 8px 8px 8px 0;
}
.date {
  position: relative;
  top: 1px;
}
.img {
  position: relative;
  top: -2px;
}
.inlin_b {
  display: inline-block;
}
.mr_8 {
  margin-right: 8px;
}
.download_div {
  display: inline-block;
  position: absolute;
  right: 0;
  top: 8px;
}
.ml_8 {
  margin-left: 8px;
}
.row2 {
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
  margin-bottom: 20px;
}
.position_r {
  position: relative;
}
.row2_left {
  font-size: 16px;
  color: #000;
  font-weight: bold;
}
.row2_right {
  position: absolute;
  right: 0;
}
</style>
